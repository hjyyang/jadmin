const Router = require("koa-router");
const User = require("../lib/orm").User;
const redis = require("../lib/redis");
//引入md5加密
const md5 = require("md5-node");
//引入校验器校验请求参数
const validator = require("validator");
//引入jsonwebtoken发放令牌
const jsonwebtoken = require("jsonwebtoken");
const tokenOp = require("../common/token");

const router = new Router({
  prefix: "/no_auth/user"
});

//用户注册
let uName = [], //用户名数组，用于处理并发
  pattern = new RegExp(
    "[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]"
  ), //匹配特殊字符的正则
  timer = null;
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
    }) ||
    pattern.test(u_name)
  ) {
    //校验参数是否为空、邮箱格式是否正确密码长度是否在指定范围内
    return (ctx.body = {
      code: 8002,
      message: "Wrong parameter"
    });
  }

  //设定延时在限定时间内如无注册请求则清除用户名数组
  clearTimeout(timer);
  timer = setTimeout(() => {
    uName = [];
  }, 5000);

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
    message: "Successful"
  };
});

//用户登录
router.post("/login", async ctx => {
  let { u_name, u_pw } = ctx.request.body;
  u_name = u_name ? u_name + "" : ""; //将参数转换为字符串类型以便校验器校验
  u_pw = u_pw ? u_pw + "" : "";

  if (
    validator.isEmpty(u_name) ||
    validator.isEmpty(u_pw) ||
    !validator.isLength(u_pw, {
      min: 6,
      max: 32
    }) ||
    pattern.test(u_name)
  ) {
    return (ctx.body = {
      code: 8002,
      message: "Wrong parameter"
    });
  }
  let dbRes = await User.findOne({
    where: {
      name: u_name,
      password: md5(u_pw)
    },
    raw: true
  });

  if (dbRes === null) {
    return (ctx.body = {
      code: 8001,
      message: "Incorrect user name or password"
    });
  }
  //生成认证令牌
  let token = jsonwebtoken.sign(
    {
      u_id: dbRes.id,
      u_name: dbRes.name,
      u_email: dbRes.email,
      u_role: dbRes.role,
      created: dbRes.createdAt
    },
    tokenOp.secret,
    { expiresIn: tokenOp.validTime + "" }
  );

  try {
    if (ctx.cookies) {
      //判断cookies是否存在，是则将token加入到cookies中
      ctx.cookies.set("authUser", JSON.stringify(token), {
        maxAge: tokenOp.validTime,
        overwrite: true
      });

      //删除redis中的id
      await redis.srem("infoChangeUser", dbRes.id);
    }
  } catch (err) {
    console.log(err);
  }

  return (ctx.body = {
    code: 8888,
    message: "successful",
    token: token
  });
});

module.exports = router;
