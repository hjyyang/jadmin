const Koa = require("koa");
const consola = require("consola");
const { Nuxt, Builder } = require("nuxt");

//------------引入bodyParser  -----------------
const bodyParser = require("koa-bodyparser");

//------------跨域处理  -----------------
const cors = require("koa2-cors");

//------------引入路由鉴权方法-----------------
const tokenOp = require("./common/token");

//------------引入接口 start-----------------
const user = require("./api/user");
const notAuth = require("./api/notAuth");
const document = require("./api/document");
const file = require("./api/file");
const simple = require("./api/simple");
const post = require("./api/post");
const data = require("./api/data");
const comment = require("./api/comment");
const leaveMessage = require("./api/leaveMessage");
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

	const { host = process.env.HOST || "127.0.0.1", port = process.env.PORT || 3000 } = nuxt.options.server;

	await nuxt.ready();
	// Build in development
	if (config.dev) {
		const builder = new Builder(nuxt);
		await builder.build();
	}

	app.use(
		cors({
			origin: function (ctx) {
				//设置允许来自指定域名请求
				if (ctx.url === "/test") {
					return "*"; // 允许来自所有域名请求
				}
				return "http://localhost:8081"; //只允许http://localhost:8081这个域名的请求
			},
			maxAge: 5, //指定本次预检请求的有效期，单位为秒。
			credentials: true, //是否允许发送Cookie
			allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], //设置所允许的HTTP请求方法
			allowHeaders: ["Content-Type", "Authorization", "Accept"], //设置服务器支持的所有头信息字段
			exposeHeaders: ["WWW-Authenticate", "Server-Authorization"], //设置获取其他自定义字段
		})
	);

	//在调用接口与返回结果之前执行路由鉴权判断
	// app.use(async (ctx, next) => {
	// 	await tokenOp.handle(ctx, next);
	// });

	//------------使用接口url start-----------------
	app.use(user.routes()).use(user.allowedMethods());
	app.use(notAuth.routes()).use(notAuth.allowedMethods());
	app.use(document.routes()).use(document.allowedMethods());
	app.use(file.routes()).use(file.allowedMethods());
	app.use(simple.routes()).use(simple.allowedMethods());
	app.use(post.routes()).use(post.allowedMethods());
	app.use(data.routes()).use(data.allowedMethods());
	app.use(comment.routes()).use(comment.allowedMethods());
	app.use(leaveMessage.routes()).use(leaveMessage.allowedMethods());
	//------------使用接口url end-----------------

	app.use((ctx) => {
		ctx.status = 200;
		ctx.respond = false; // Bypass Koa's built-in response handling
		ctx.req.ctx = ctx; // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
		nuxt.render(ctx.req, ctx.res);
	});

	app.listen(port, host);
	consola.ready({
		message: `Server listening on http://${host}:${port}`,
		badge: true,
	});
}

start();
