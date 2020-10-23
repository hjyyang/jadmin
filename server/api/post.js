const Router = require("koa-router");
const { Posts, Categorys, mySequelize } = require("../lib/orm");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/post",
});

router.get("/list", async (ctx) => {
	let { title, time, page, cid } = ctx.request.query;
	if (
		!page ||
		isNaN(parseInt(page)) ||
		(!!time && !Array.isArray(time)) ||
		(!!title && typeof title !== "string") ||
		(!!cid && isNaN(parseInt(cid)))
	) {
		return (ctx.body = {
			result: false,
			message: "请输入正确的字段或值！",
		});
	}
	let option = {
		order: [
			//倒序排列createdAt数据
			["createdAt", "DESC"],
		],
		where: {},
		attributes: [
			["id", "id"],
			["title", "title"],
			["describe", "describe"],
			["createdAt", "createdAt"],
			["updatedAt", "last_modified_date"],
			["publish_state", "publish_state"],
			["cid", "cid"],
			["like", "like"],
			["pv", "pv"],
		],
		offset: 10 * (page - 1),
		limit: 10,
	};
	if (title) {
		option.where.title = {
			[Op.like]: "%" + title + "%",
		};
	}
	if (time) {
		option.where.createdAt = {
			[Op.between]: time,
		};
	}
	if (cid) {
		option.include = [
			{
				model: Categorys,
				where: {
					id: cid,
				},
			},
		];
	}
	let res = await Posts.findAndCountAll(option);
	return (ctx.body = {
		code: 8888,
		message: "successful",
		postList: res,
	});
});

router.get("/find", async (ctx) => {
	let { pid } = ctx.request.query;
	if (!pid || isNaN(parseInt(pid))) {
		return (ctx.body = {
			result: false,
			message: "请输入正确的字段或值！",
		});
	}
	let option = {
		where: {
			id: pid,
		},
		attributes: [
			["id", "id"],
			["title", "title"],
			["describe", "describe"],
			["createdAt", "createdAt"],
			["updatedAt", "last_modified_date"],
			["publish_state", "publish_state"],
			["cid", "cid"],
			["content", "content"],
		],
	};
	let res = await Posts.findOne(option);
	return (ctx.body = {
		code: 8888,
		message: "successful",
		post: res,
	});
});


router.post("/add", async (ctx) => {
	let { content, cid, title, describe, publish_state } = ctx.request.body;
	return (ctx.body = {
		code: 8888,
		message: "successful",
	});
});

router.post("/update", async (ctx) => {
    let { pid, content, cid, title, describe, publish_state } = ctx.request.body;
    
	return (ctx.body = {
		code: 8888,
		message: "successful",
	});
});

router.get("/detele", async (ctx) => {
	let { pid } = ctx.request.query;
	return (ctx.body = {
		code: 8888,
		message: "successful",
	});
});

module.exports = router;
