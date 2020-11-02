const Router = require("koa-router");
const { Comments, mySequelize } = require("../lib/orm");
const requestInfo = require("../common/requestInfo");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/comment",
});

/**
 * 添加评论
 * @param  {[string]} content     评论内容
 * @param  {[number]} uid         用户id
 * @param  {[number]} pid         评论文章id
 * @param  {[number]} cid         评论其评论的id，如无则是直接评论文章，有则是回复评论
 */
router.post("/add", async (ctx) => {
	let { content, uid, pid, cid } = ctx.request.body;
	if (!uid || isNaN(parseInt(uid)) || !pid || isNaN(parseInt(pid)) || (cid && isNaN(parseInt(cid))) || !content) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
			content: content,
			uid: uid,
			pid: pid,
			cid: cid,
		},
		info = {};
	info = await requestInfo.parser(ctx);
	option.browser = info.browser;
	option.os = info.os;
	option.ip = info.ip;
	option.province = info.province;
	option.city = info.city;
	try {
		let res = await Comments.create(option);
		return (ctx.body = {
			code: 8888,
			message: "successful",
			id: res.dataValues.id,
		});
	} catch (error) {
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

/**
 * 删除评论
 * @param  {[number]} id          评论id
 */
router.get("/detele", async (ctx) => {
	let { id } = ctx.request.query;
	if (!id || isNaN(parseInt(id))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
		where: {
			id: id,
		},
	};
	try {
		let res = await Comments.destroy(option);
		if (res) {
			return (ctx.body = {
				code: 8888,
				message: "successful",
			});
		} else {
			return (ctx.body = {
				code: 8007,
				message: "not found",
			});
		}
	} catch (error) {
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});
module.exports = router;
