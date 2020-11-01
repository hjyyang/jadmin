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
		console.log(error);
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

function statFun(data) {
	let stat = {
			recent7: [],
		},
		currentDay = new Date().getDate(),
		currentMonth = new Date().getMonth() + 1,
		oneToSeven = [],
		allMonth = [],
		thirtyOne = [1, 3, 5, 7, 8, 10, 12],
		thirty = [4, 6, 9, 11],
		uv = [], //访客数
		pv = 0;
	let dayMap = currentDay,
		month = currentMonth;
	for (let d = 0; d < 7; d++) {
		if (dayMap > 1) {
			//非1号直接添加当月日期
			oneToSeven.push(dayMap);
			if (!allMonth.includes(month)) allMonth.push(month);
			dayMap--;
		} else {
			//1号，将1号日期加入后改变月份与日期
			oneToSeven.push(dayMap);
			if (!allMonth.includes(month)) allMonth.push(month);
			if (currentMonth != 0) {
				//当前月份不是1月
				if (thirtyOne.includes(currentMonth - 1)) {
					//上一个月份是31天
					dayMap = 31;
					month--;
				} else if (thirty.includes(currentMonth - 1)) {
					//上一个月份是30天
					dayMap = 30;
					month--;
				} else {
					//二月份
					month--;
					if (isleap()) {
						dayMap = 29;
					} else {
						dayMap = 28;
					}
				}
			} else {
				//当前月份是1月
				dayMap = 31;
				month = 12;
			}
		}
	}
	for (let i in data) {
		let time = data[i].createdAt;
		if (allMonth.includes(time.getMonth() + 1) && oneToSeven.includes(time.getDate())) {
			//在7天范围内
			stat.recent7.push(data[i]);
			if (data[i].type == 1) {
				pv++;
			}
			if (data[i].ip !== null && !uv.includes(data[i].ip)) {
				//页面
				uv.push(data[i].ip);
			}
		}
	}
	console.log(pv, uv);
}
function isleap() {
	//判断今年是否是闰年
	var the_year = new Date().getFullYear();
	var isleap = (the_year % 4 == 0 && the_year % 100 != 0) || (the_year % 400 == 0 && the_year % 3200 != 0) || the_year % 172800 == 0;
	return isleap;
}
module.exports = router;
