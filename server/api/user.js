const Router = require("koa-router");
const User = require("../lib/orm").User;
//引入校验器校验请求参数
const validator = require("validator");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
  prefix: "/j_api/user"
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

module.exports = router;
