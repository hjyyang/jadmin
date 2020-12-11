const Router = require("koa-router");
const User = require("../lib/orm").User;
const redis = require("../lib/redis");
//引入md5加密
const md5 = require("md5-node");
//引入校验器校验请求参数
const validator = require("validator");
//------------引入路由鉴权方法-----------------
const tokenOp = require("../common/token");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
	prefix: "/j_api/user",
});

//用户列表
router.get("/list", async (ctx) => {
	let { page } = ctx.request.query;
	page = page ? page + "" : "";

	if (!validator.isInt(page) || validator.isEmpty(page)) {
		return (ctx.body = {
			code: 8002,
			message: "Wrong parameter",
		});
	}
	let option = {
		attributes: [
			["id", "uid"],
			["name", "name"],
			["email", "email"],
			["createdAt", "createdAt"],
			["role", "role"],
			["authEmail", "authEmail"],
			["sex", "sex"],
			["face", "face"],
			["qq", "qq"],
		],
		offset: (page - 1) * 10,
		limit: 10,
		raw: true,
	};
	let dbRes = await User.findAndCountAll(option);

	ctx.body = {
		code: 8888,
		message: "successful",
		list: dbRes.rows,
		count: dbRes.count,
	};
});

//修改用户信息
router.post("/update", async (ctx) => {
	let { uid, role, name, password, email, sex, face } = ctx.request.body,
		changeObj = {
			role,
			name,
			email,
			sex,
			face,
		};
	//判断用户id是否存在且是否为整数
	if (!uid || !validator.isInt(uid + "")) {
		return (ctx.body = {
			code: 8002,
			message: "Wrong parameter",
		});
	}

	//获取header中用户信息
	let userInfo = tokenOp.format(ctx);

	//判断是否是超级管理员与用户本人修改信息
	if (userInfo.u_role != 2 && uid != userInfo.u_id) {
		return (ctx.body = {
			code: 8006,
			message: "Bad permissions",
		});
	}

	//检查密码长度是否在6到32位之间
	if (
		password &&
		!validator.isLength(password + "", {
			min: 6,
			max: 32,
		})
	) {
		return (ctx.body = {
			code: 8002,
			message: "Wrong parameter",
		});
	}

	//修改用户权限
	if (role && validator.isInt(role + "")) {
		//非超级管理员返回错误权限
		if (userInfo.u_role !== 2) {
			return (ctx.body = {
				code: 8006,
				message: "Bad permissions",
			});
		}
	}
	if (password) {
		changeObj.password = md5(password);
	}
	let res = await User.update(changeObj, {
		where: {
			id: uid,
		},
	});
	if (!res[0]) {
		//不存在或者无修改
		return (ctx.body = {
			code: 8888,
			message: "Nonexistent or unchanged",
		});
	}
	if (role || password) {
		//修改权限或密码将该用户存储到redis中
		let isExist = await redis.sismember("infoChangeUser", uid);
		if (!isExist) {
			//redis不存在该用户id,将该用户id存储到redis中
			await redis.sadd("infoChangeUser", uid);
		}
	}
	ctx.body = {
		code: 8888,
		message: "successful",
	};
});

module.exports = router;
