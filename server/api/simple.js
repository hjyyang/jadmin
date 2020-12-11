const Router = require("koa-router");
const User = require("../lib/orm").User;
//引入校验器校验请求参数
const validator = require("validator");

const router = new Router({
	prefix: "/j_api/simple",
});

//用户退出
router.get("/user_logout", async (ctx) => {
	ctx.cookies.set("authUser", "", {
		maxAge: 0,
		overwrite: true,
	});
	ctx.body = {
		code: 8888,
		message: "successful",
	};
});

//获取用户信息
router.get("/user_info", async (ctx) => {
	let { uid } = ctx.request.query;
	uid = uid + "";
	if (!validator.isInt(uid) || validator.isEmpty(uid)) {
		return (ctx.body = {
			code: 8002,
			message: "Wrong parameter",
		});
	}

	let res = await User.findOne({
		attributes: [
			["id", "u_id"],
			["name", "u_name"],
			["email", "u_email"],
			["createdAt", "createdAt"],
			["role", "u_role"],
			["authEmail", "authEmail"],
			["sex", "u_sex"],
			["face", "u_face"],
		],
		where: {
			id: uid,
		},
	});
	ctx.body = {
		code: 8888,
		message: "successful",
		info: res,
	};
});

module.exports = router;
