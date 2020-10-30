const Router = require("koa-router");
const { Statistics, mySequelize } = require("../lib/orm");
const parser = require("ua-parser-js");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/data",
});

/**
 * 收集用户访问数据
 * @param  {[number]}  type             访问类型（页面，评论，按钮）
 * @param  {[number]}  uid              用户id
 * @param  {[string]}  name             访问具体名称，如访问首页，评论了哪一篇文章
 */
router.get("/visit", async (ctx) => {
	let { uid, type, name } = ctx.request.query;
	if (!type || isNaN(parseInt(type))) {
		return (ctx.body = {
			result: false,
			message: "请输入正确的字段或值！",
		});
	}
	let info = parser(ctx.headers["user-agent"]);
	let option = {
		uid: uid,
		type: type,
		name: name ? name : "",
		browser: info.browser.name,
		os: info.os.name,
		ip: ctx.ip,
	};
	try {
		await Statistics.create(option);
		return (ctx.body = {
			code: 8888,
			message: "successful",
		});
	} catch (error) {
		console.log(error);
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

/**
 * 查询用户访问数据
 * @param  {[Array]}  time              搜索的时间范围
 */
router.post("/list", async (ctx) => {
	let { time } = ctx.request.body;
	let option = {
		order: [
			//倒序排列createdAt数据
			["createdAt", "DESC"],
		],
		where: {
			createdAt: {
				[Op.between]: time ? time : [new Date() - 5184000000, new Date()],
			},
		},
		attributes: ["uid", "os", "name", "type", "browser", "ip", "createdAt"],
		raw: true,
	};
	try {
		let res = await Statistics.findAll(option);
		statFun(res);
		return (ctx.body = {
			code: 8888,
			message: "successful",
			list: res,
		});
	} catch (error) {
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

function statFun(data) {
	let stat = {
		recent7: {
			pv: 0,
		},
	};
	for (let i in data) {
		if (new Date().getMonth() === data[i].createdAt.getMonth() && data[i].createdAt.getDate() >= new Date().getDate() - 6) {
			stat.recent7.pv++;
		}
	}
}
module.exports = router;
