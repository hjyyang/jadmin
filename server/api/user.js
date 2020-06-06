const Router = require("koa-router");
const User = require("../lib/orm").User;
//引入md5加密
const md5 = require("md5-node");
//引入校验器校验请求参数
const validator = require("validator");
//引入jsonwebtoken发放令牌
const jsonwebtoken = require("jsonwebtoken");
const tokenOp = require("../common/token");

const router = new Router({
  prefix: "/j_api/user"
});

router.post("/login", async ctx => {
  let { u_name, u_pw } = ctx.request.body;
  console.log(u_name, u_pw);
  ctx.body = "123";
});

//注册接口
let uName = []; //用户名数组，用于处理并发
router.post("/signin", async ctx => {
  let { u_name, u_pw, u_email } = ctx.request.body; //解构获取传参
  u_name = u_name ? u_name + "" : ""; //将参数转换为字符串类型以便校验器校验
  u_pw = u_pw ? u_pw + "" : "";
  u_email = u_email ? u_email + "" : "";

  if (
    validator.isEmpty(u_name) ||
    validator.isEmpty(u_pw) ||
    validator.isEmpty(u_email) ||
    !validator.isEmail(u_email) ||
    !validator.isLength(u_pw, {
      min: 6,
      max: 16
    })
  ) {
    //校验参数是否为空、邮箱格式是否正确密码长度是否在指定范围内
    return (ctx.body = {
      code: 8002,
      message: "Wrong parameter"
    });
  }

  if (uName.indexOf(u_name) !== -1) {
    //当用户数组中存在了用户名时，即并发执行时
    return (ctx.body = {
      code: 8001,
      message: "User already exists"
    });
  } else {
    //否则将该用户名加入到用户数组中
    uName.push(u_name);
  }

  let dbRes = await User.findOrCreate({
    where: {
      name: u_name
    },
    defaults: {
      password: md5(u_pw),
      email: u_email
    },
    raw: true
  });
  if (!dbRes[1]) {
    return (ctx.body = {
      code: 8001,
      message: "User already exists"
    });
  }
  ctx.body = {
    code: 8888,
    message: "Successful registration"
  };
});

module.exports = router;
