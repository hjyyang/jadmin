const Koa = require("koa");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

//------------引入bodyParser  -----------------
const bodyParser = require("koa-bodyparser");

//------------引入路由鉴权方法-----------------
const tokenOp = require("./common/token");

//------------引入接口 start-----------------
const user = require("./api/user");
const notAuth = require("./api/notAuth");
const document = require("./api/document");
//------------引入接口 end-------------------

const app = new Koa();

//---------使用 bodyParser 处理http请求--------------
app.use(bodyParser());

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = app.env !== "production";

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config);

  const {
    host = process.env.HOST || "127.0.0.1",
    port = process.env.PORT || 3000
  } = nuxt.options.server;

  await nuxt.ready();
  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  //在调用接口与返回结果之前执行路由鉴权判断
  app.use(async (ctx, next) => {
    await tokenOp.handle(ctx, next);
  });

  //------------使用接口url start-----------------
  app.use(user.routes()).use(user.allowedMethods());
  app.use(notAuth.routes()).use(notAuth.allowedMethods());
  app.use(document.routes()).use(document.allowedMethods());
  //------------使用接口url end-----------------

  app.use(ctx => {
    ctx.status = 200;
    ctx.respond = false; // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res);
  });

  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}

start();
