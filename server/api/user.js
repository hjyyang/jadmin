const Router = require("koa-router");
const User = require("../lib/orm").User;
const redis = require("../lib/redis");
//引入校验器校验请求参数
const validator = require("validator");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
  prefix: "/j_api/user"
});

//用户退出
router.get("/logout", async ctx => {
  ctx.cookies.set("authUser", "", {
    maxAge: 0,
    overwrite: true
  });
  ctx.body = {
    code: 8888,
    message: "successful"
  };
});

//用户列表
router.get("/list", async ctx => {
  let { page } = ctx.request.query;
  page = page ? page + "" : "";

  if (!validator.isInt(page) && validator.isEmpty(page)) {
    return (ctx.body = {
      code: 8002,
      message: "Wrong parameter"
    });
  }
  let offset = page - 1;
  let dbRes = await User.findAndCountAll({
    //查询并计数所有
    attributes: [
      ["id", "u_id"],
      ["name", "u_name"],
      ["email", "u_email"],
      ["createdAt", "createdAt"],
      ["role", "u_role"],
      ["authEmail", "authEmail"],
      ["sex", "u_sex"],
      ["face", "u_face"]
    ],
    offset: offset * 10,
    limit: 10,
    raw: true
  });

  ctx.body = {
    code: 8888,
    message: "successful",
    u_list: dbRes.rows,
    count: dbRes.count
  };
});

//修改用户信息
router.post("/update", async ctx => {
  //   let {} = ctx.request.body;
  let res = await redis.get("test");
  ctx.body = res;
});

module.exports = router;
