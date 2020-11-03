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

/**
 * 查询评论列表
 * @param  {[number]} pid          文章id
 */
router.get("/list", async (ctx) => {
	let { pid } = ctx.request.query;
	if (!pid || isNaN(parseInt(pid))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
		where: {
			pid: pid,
		},
		attributes: [
			["id", "id"],
			["content", "content"],
			["createdAt", "createdAt"],
			["pid", "pid"],
			["cid", "cid"],
			["uid", "uid"],
			["browser", "browser"],
			["os", "os"],
			["province", "province"],
			["city", "city"],
		],
		raw: true,
	};
	try {
		let res = await Comments.findAll(option),
			list = {};
		if (res.length < 1) {
			return (ctx.body = {
				code: 8007,
				message: "not found",
			});
		}
		for (let i in res) {
			if (!res[i].cid) {
				//不存在评论id，直接评论文章
				list[res[i].id] = {
					main: res[i],
					child: [],
				};
			} else {
				//存在评论id，回复评论
				if (list[res[i].cid]) {
					//列表外层存在，一级回复
					list[res[i].cid].child.push(res[i]);
				} else {
					//二级回复，遍历列表查找对应的父级评论
					for (let key in list) {
						if (list.hasOwnProperty(key)) {
							let item = list[key];
							for (let j in item.child) {
								if (item.child[j].id == res[i].cid) {
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
			commentList: list,
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
