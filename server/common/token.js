const jsonwebtoken = require("jsonwebtoken");
const redis = require("../lib/redis");

let tokenOp = {
  secret: "my secret is hjy8908581", //路由鉴权密钥
  validTime: 60000 * 60 * 24, //cookie与令牌有效时间(毫秒)
  refreshTime: 60 * 60 * 20, //刷新令牌时间（秒）
  handle: null
};
//设置令牌过期时间2小时，刷新时间是1小时，在临过期前一小时有操作则更新令牌

let refreshFc = decoded => {
  let refreshTokenTime = tokenOp.refreshTime + decoded.iat,
    currentTime = Date.parse(new Date()) / 1000;
  if (currentTime > refreshTokenTime) {
    return true;
  } else {
    return false;
  }
};

tokenOp.refreshFc = refreshFc;

tokenOp.handle = async (ctx, next) => {
  if (ctx.url.match(/^\/j_api/)) {
    //需要鉴权的路由
    let authorization = ctx.headers.authorization,
      token,
      role = 0;

    if (ctx.headers) {
      if (!authorization) {
        ctx.status = 401;
        return (ctx.body = "Bad permissions");
      }
      token = authorization.split(" ")[1]
        ? authorization.split(" ")[1]
        : authorization;
      try {
        //1. 先认证token是否通过
        role = JSON.parse(new Buffer.from(token.split(".")[1], "base64"))
          .u_role; //获取token中用户的权限等级
        let decoded = jsonwebtoken.verify(token, tokenOp.secret),
          refresh = tokenOp.refreshFc(decoded);

        //2. token验证正确后判断访问的用户是否在redis中已修改用户信息的用户列表
        let isExist = await redis.sismember("infoChangeUser", decoded.u_id);
        //该访问用户修改了重要信息，响应错误权限，让用户重新登录
        if (isExist) {
          throw Error;
        }

        //3. 如果是普通用户访问其无权限访问的接口时则抛出错误，响应错误权限
        if (role == 0 && !ctx.url.match(/\/simple/)) {
          throw Error;
        }

        //4. 在刷新时间范围内则刷新令牌
        if (refresh) {
          try {
            let newToken = jsonwebtoken.sign(
              {
                u_id: decoded.u_id,
                u_name: decoded.u_name,
                u_email: decoded.u_email,
                u_role: decoded.u_role,
                created: decoded.created
              },
              tokenOp.secret,
              {
                expiresIn: tokenOp.validTime + ""
              }
            );
            ctx.cookies.set("authUser", JSON.stringify(newToken), {
              maxAge: tokenOp.validTime,
              overwrite: true
            });
          } catch (err) {
            console.log(err);
          }
        }
      } catch (err) {
        ctx.status = 401;
        return (ctx.body = "Bad permissions");
      }
    }
    return next();
  } else {
    //不需要鉴权的路由去往下一个中间件
    return next();
  }
};

tokenOp.format = (ctx, next) => {
  let authorization = ctx.headers.authorization,
    token,
    userInfo = {};
  try {
    token = authorization.split(" ")[1]
      ? authorization.split(" ")[1]
      : authorization;
    userInfo = JSON.parse(new Buffer.from(token.split(".")[1], "base64")); //获取token中用户的权限等级
    return userInfo;
  } catch (error) {
    return false;
  }
};

module.exports = tokenOp;
