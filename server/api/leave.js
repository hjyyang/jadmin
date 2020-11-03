const Router = require("koa-router");
const { LeaveMessage, mySequelize } = require("../lib/orm");
const requestInfo = require("../common/requestInfo");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/leave",
});

/**
 * 添加留言
 * @param  {[string]} content     留言内容
 * @param  {[number]} uid         用户id
 * @param  {[number]} pid         留言id，如有则是回复留言
 */
router.post("/add", async (ctx) => {
	let { content, uid, pid } = ctx.request.body;
	if (!uid || isNaN(parseInt(uid)) || (pid && isNaN(parseInt(pid))) || !content) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
			content: content,
			uid: uid,
			pid: pid,
		},
		info = {};
	info = await requestInfo.parser(ctx);
	option.browser = info.browser;
	option.os = info.os;
	option.ip = info.ip;
	option.province = info.province;
	option.city = info.city;
	try {
		let res = await LeaveMessage.create(option);
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
 * 删除留言
 * @param  {[number]} id          留言id
 * @param  {[number]} uid         用户id
 */
router.get("/detele", async (ctx) => {
	let { uid, id } = ctx.request.query;
	if (!id || isNaN(parseInt(id)) || !uid || isNaN(parseInt(uid))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
		where: {
			id: id,
			uid: uid,
		},
	};
	try {
		let res = await LeaveMessage.destroy(option);
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
