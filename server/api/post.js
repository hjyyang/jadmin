const Router = require("koa-router");
const { Posts, Categorys, mySequelize } = require("../lib/orm");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/post",
});

router.post("/list", async (ctx) => {
	let { title, time, page, cid } = ctx.request.body,
		whereObj = {};
	if (!page || isNaN(parseInt(page)) || (!!time && !Array.isArray(time))) {
		return (ctx.body = {
			result: false,
			message: "请输入正确的字段或值！",
		});
	}
	if (title) {
		whereObj.title = {
			[Op.like]: "%" + title + "%",
		};
	}
	if (time) {
		whereObj.createdAt = {
			[Op.between]: time,
		};
	}
	let res = await Posts.findAndCountAll({
		order: [
			//倒序排列createdAt数据
			["createdAt", "DESC"],
		],
		where: whereObj,
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
	});
	return (ctx.body = {
		code: 8888,
		message: "successful",
		postList: res,
	});
});

module.exports = router;
