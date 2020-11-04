const Router = require("koa-router");
const { LeaveMessage, mySequelize } = require("../lib/orm");
const requestInfo = require("../common/requestInfo");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/leave",
});
//留言，用户在留言板留言，不允许其他用户回复，只允许管理员与原留言者回复
/**
 * 添加留言
 * @param  {[string]} content     留言内容
 * @param  {[number]} uid         用户id
 * @param  {[number]} leaveId     留言id，如有则是回复留言
 */
router.post("/add", async (ctx) => {
	let { content, uid, leaveId } = ctx.request.body;
	if (!uid || isNaN(parseInt(uid)) || (leaveId && isNaN(parseInt(leaveId))) || !content) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
			content: content,
			uid: uid,
			leaveId: leaveId,
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

/**
 * 查询留言列表
 */
router.get("/list", async (ctx) => {
	let option = {
		attributes: [
			["id", "id"],
			["content", "content"],
			["createdAt", "createdAt"],
			["leaveId", "leaveId"],
			["uid", "uid"],
			["browser", "browser"],
			["os", "os"],
			["province", "province"],
			["city", "city"],
		],
		raw: true,
	};
	try {
		let res = await LeaveMessage.findAll(option),
			list = {};
		if (res.length < 1) {
			return (ctx.body = {
				code: 8007,
				message: "not found",
			});
		}
		for (let i in res) {
			if (!res[i].leaveId) {
				//不存在留言id，直接留言
				list[res[i].id] = {
					main: res[i],
					child: [],
				};
			} else {
				//存在留言id，回复留言
				if (list[res[i].leaveId]) {
					//列表外层存在，一级回复
					list[res[i].leaveId].child.push(res[i]);
				} else {
					//二级回复，遍历列表查找对应的父级留言
					for (let key in list) {
						if (list.hasOwnProperty(key)) {
							let item = list[key];
							for (let j in item.child) {
								if (item.child[j].id == res[i].leaveId) {
									item.child.push(res[i]);
									break;
								}
							}
						}
					}
				}
			}
		}
		return (ctx.body = {
			code: 8888,
			message: "successful",
			leaveList: list,
		});
	} catch (error) {
		console.log(error);
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});
module.exports = router;
