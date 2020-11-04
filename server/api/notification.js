const Router = require("koa-router");
const { Notifications, NotificationTermUser, mySequelize } = require("../lib/orm");

const router = new Router({
	prefix: "/j_api/notification",
});

/**
 * 添加通知
 * @param  {[string]} message     通知内容
 * @param  {[number]} type        通知类型：1:留言回复,2:评论回复,3系统通知
 * @param  {[number]} pid         对应的文章id或留言id,根据type确定，type为3时为null
 * @param  {[number]} uid         接收该通知的用户id
 */
router.post("/add", async (ctx) => {
	let { message, type, pid, uid } = ctx.request.body;
	if (!type || isNaN(parseInt(type)) || (pid && isNaN(parseInt(pid))) || !message || !uid || isNaN(parseInt(uid))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
		message,
		type,
		object_id: pid,
	};
	await mySequelize.transaction(async (t) => {
		try {
			let res = await Notifications.create(option, {
				transaction: t,
			});
			await NotificationTermUser.create(
				{
					uid,
					note_id: res.dataValues.id,
				},
				{
					transaction: t,
				}
			);
			return (ctx.body = {
				code: 8888,
				message: "successful",
			});
		} catch (error) {
			return (ctx.body = {
				code: 8003,
				message: "Server error",
			});
		}
	});
});

/**
 * 查询通知
 * @param  {[number]} uid         接收该通知的用户id
 * @param  {[number]} page        分页数
 */
router.get("/find", async (ctx) => {
	let { uid, page } = ctx.request.query;
	if (!uid || isNaN(parseInt(uid)) || !page || isNaN(parseInt(page))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
		attributes: ["id", "message", "type", "object_id"],
		offset: 10 * (page - 1),
		limit: 10,
		include: {
			model: NotificationTermUser,
			as: "read",
			attributes: ["status"],
			where: {
				uid,
			},
		},
	};
	try {
		let res = await Notifications.findAll(option);
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

/**
 * 更新通知状态
 * @param  {[number]}  uid         接收该通知的用户id
 * @param  {[number]}  noteId      通知id
 * @param  {[boolean]} all         是否已读全部，字段存在时 noteId 无效
 */
router.get("/update", async (ctx) => {
	let { uid, noteId, all } = ctx.request.query;
	if (!uid || isNaN(parseInt(uid)) || !noteId || isNaN(parseInt(noteId))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
			status: 1,
		},
		whereOp = {
			where: { uid },
		};
	if (!all) {
		whereOp.where.note_id = noteId;
	}
	try {
		await NotificationTermUser.update(option, whereOp);
		return (ctx.body = {
			code: 8888,
			message: "successful",
		});
	} catch (error) {
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});
module.exports = router;
