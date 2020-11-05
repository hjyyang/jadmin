const Router = require("koa-router");
const { Posts, Categorys, mySequelize } = require("../lib/orm");
const validator = require("validator");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/post",
});

/**
 * 获取post列表
 * @param  {[string]} title     筛选条件，post标题
 * @param  {[Array]}  time      筛选条件，post创建时间范围
 * @param  {[number]} page      筛选条件，列表当前分页，一页10条(必须)
 * @param  {[number]} cid       筛选条件，分类id
 * @param  {[number]} count     筛选条件，添加统计字段
 * @param  {[number]} limit     一页多少条数据
 * @param  {[number]} isPublish 筛选条件,筛选发布状态,1为发布，2而未发布（草稿）
 */
router.post("/list", async (ctx) => {
	let { title, time, page, cid, count, limit, isPublish } = ctx.request.body;
	if (
		!page ||
		isNaN(parseInt(page)) ||
		(!!time && !Array.isArray(time)) ||
		(!!title && typeof title !== "string") ||
		(!!cid && isNaN(parseInt(cid))) ||
		(count && !validator.isBoolean(count + "")) ||
		(limit && isNaN(parseInt(limit))) ||
		(!!isPublish && isNaN(parseInt(isPublish)))
	) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
		order: [
			//倒序排列createdAt数据
			["createdAt", "DESC"],
		],
		where: {},
		attributes: [
			["id", "pid"],
			["title", "title"],
			["describe", "describe"],
			["createdAt", "createdTime"],
			["updatedAt", "updateTime"],
			["publish_state", "publish_state"],
			["cid", "cid"],
			["comment", "comment"],
		],
		offset: limit ? limit * (page - 1) : 10 * (page - 1),
		limit: limit ? limit : 10,
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
	if (isPublish) {
		if (isPublish == 1) {
			//发布
			option.where.publish_state = true;
		} else {
			option.where.publish_state = false;
		}
	}
	try {
		let res = await Posts.findAll(option);
		if (!!count) {
			let publish = null,
				published = 0,
				unpublished = 0;
			publish = await Posts.findAll({
				attributes: ["publish_state", [sequelize.fn("COUNT", sequelize.col("publish_state")), "count"]],
				group: "publish_state",
				raw: true,
			});
			publish.forEach((item) => {
				if (item.publish_state) {
					published = item.count;
				} else {
					unpublished = item.count;
				}
			});
			return (ctx.body = {
				code: 8888,
				message: "successful",
				postList: res,
				published,
				unpublished,
			});
		}
		return (ctx.body = {
			code: 8888,
			message: "successful",
			postList: res,
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
 * 获取单一post详情
 * @param  {[number]} pid     唯一条件，post的id（必须）
 */
router.get("/find", async (ctx) => {
	let { pid } = ctx.request.query;
	if (!pid || isNaN(parseInt(pid))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
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
	try {
		let res = await Posts.findOne(option);
		return (ctx.body = {
			code: 8888,
			message: "successful",
			post: res,
		});
	} catch (error) {
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

/**
 * 添加单一post
 * @param  {[string]}  title           post标题
 * @param  {[string]}  content         post内容
 * @param  {[string]}  describe        post描述
 * @param  {[number]}  cid             分类id
 * @param  {[boolean]} publish_state   post发布状态,0||1
 * @param  {[string]}  cover_image     post封面图
 */
router.post("/add", async (ctx) => {
	let { content, cid, title, describe, publish_state, cover_image } = ctx.request.body;
	if ((!!publish_state && isNaN(parseInt(publish_state))) || (!!cid && isNaN(parseInt(cid)))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {};
	if (!!content) option.content = content;
	if (!!cid) option.cid = cid;
	if (!!title) option.title = title;
	if (!!publish_state) option.publish_state = publish_state;
	if (!!describe) option.describe = describe;
	if (!!cover_image) option.cover_image = cover_image;
	try {
		let res = await Posts.create(option);
		return (ctx.body = {
			code: 8888,
			message: "successful",
			pid: res.dataValues.id,
		});
	} catch (error) {
		// console.log(error);
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

/**
 * 更新单一post
 * @param  {[number]}  pid             post的id(必须)
 * @param  {[string]}  title           post标题
 * @param  {[string]}  content         post内容
 * @param  {[string]}  describe        post描述
 * @param  {[number]}  cid             分类id
 * @param  {[boolean]} publish_state   post发布状态,0||1
 * @param  {[string]}  cover_image     post封面图
 */
router.post("/update", async (ctx) => {
	let { pid, content, cid, title, describe, publish_state, cover_image } = ctx.request.body;
	if (!pid || isNaN(parseInt(pid))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
			title: title,
			content: content,
			cid: cid,
			describe: describe,
			publish_state: publish_state,
			cover_image: cover_image,
		},
		where = {
			where: { id: pid },
		};
	try {
		await Posts.update(option, where);
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

/**
 * 删除一条或多条post
 * @param  {[number||Array[number]]} pid             post的id(必须)
 */
router.get("/detele", async (ctx) => {
	let { pid } = ctx.request.query;
	if (!pid || (pid && isNaN(parseInt(pid))) || (pid && Array.isArray(pid))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let deteleArr = [];
	if (Array.isArray(pid)) {
		deteleArr = pid;
	} else {
		deteleArr.push(pid);
	}
	try {
		let res = await mySequelize.queryInterface.bulkDelete("posts", {
			id: {
				[Op.in]: deteleArr,
			},
		});
		if (res[0].affectedRows === 0) {
			return (ctx.body = {
				code: 8007,
				message: "not found",
			});
		}
		return (ctx.body = {
			code: 8888,
			message: "successful",
		});
	} catch (error) {
		// console.log(error);
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

/**
 * 添加单一category
 * @param  {[string]}  name             category的名字(必须)
 */
router.get("/category/add", async (ctx) => {
	let { name } = ctx.request.query;
	if (!name) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
		where: {
			name: name,
		},
		defaults: {
			name: name,
		},
	};
	try {
		let res = await Categorys.findOrCreate(option);
		if (res[1]) {
			return (ctx.body = {
				code: 8888,
				message: "successful",
				cid: res[0].dataValues.id,
			});
		} else {
			return (ctx.body = {
				code: 8005,
				message: "This classification already exists",
			});
		}
	} catch (error) {
		console.log(error);
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

/**
 * 更新单一category
 * @param  {[number]}  cid              category的id(必须)
 * @param  {[string]}  name             category的名字(必须)
 */
router.get("/category/update", async (ctx) => {
	let { cid, name } = ctx.request.query;
	if (!cid || (cid && isNaN(parseInt(cid))) || !name) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let option = {
			name: name,
		},
		where = {
			where: { id: cid },
		};
	try {
		await Categorys.update(option, where);
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

/**
 * 删除一条或多条category
 * @param  {[number||Array[number]]} cid      category的id(必须)
 */
router.post("/category/detele", async (ctx) => {
	let { cid } = ctx.request.body;
	if (!cid || (cid && isNaN(parseInt(cid)))) {
		return (ctx.body = {
			code: 8002,
			message: "Please enter the correct field or value!",
		});
	}
	let deteleArr = [];
	if (Array.isArray(cid)) {
		deteleArr = cid;
	} else {
		deteleArr.push(cid);
	}
	try {
		let res = await mySequelize.queryInterface.bulkDelete("categorys", {
			id: {
				[Op.in]: deteleArr,
			},
		});
		if (res[0].affectedRows === 0) {
			return (ctx.body = {
				code: 8007,
				message: "not found",
			});
		}
		return (ctx.body = {
			code: 8888,
			message: "successful",
		});
	} catch (error) {
		// console.log(error);
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

/**
 * 获取category列表
 */
router.get("/category/list", async (ctx) => {
	let option = {
		attributes: [
			["id", "cid"],
			["name", "name"],
			["cover_image", "coverImage"],
		],
		raw: true,
	};
	try {
		let res = await Categorys.findAll(option);
		return (ctx.body = {
			code: 8888,
			message: "successful",
			categoryList: res,
		});
	} catch (error) {
		return (ctx.body = {
			code: 8003,
			message: "Server error",
		});
	}
});

module.exports = router;
