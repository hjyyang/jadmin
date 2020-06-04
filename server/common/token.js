const jwt = require("koa-jwt");
const jsonwebtoken = require("jsonwebtoken");

let tokenOp = {
  secret: "my secret is hjy8908581", //路由鉴权密钥
  validTime: 60000 * 60 * 24, //cookie与令牌有效时间(毫秒)
  refreshTime: 60 * 60 * 23, //刷新令牌时间（秒）
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

tokenOp.handle = (ctx, next) => {
  if (ctx.url.match(/^\/j_api/)) {
    //需要鉴权的路由
    let authorization = ctx.headers.authorization,
      token;

    if (ctx.headers) {
      if (!authorization) {
        ctx.status = 401;
        return (ctx.body = "Bad permissions");
      }
      token = authorization.split(" ")[1];
      try {
        let decoded = jsonwebtoken.verify(token, tokenOp.secret),
          refresh = tokenOp.refreshFc(decoded);
        if (refresh) {
          //在刷新时间范围内请求则刷新令牌
          try {
            let newToken = jsonwebtoken.sign(
              {
                id: decoded.id,
                userName: decoded.userName,
                email: decoded.email,
                role: decoded.role
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

module.exports = tokenOp;
