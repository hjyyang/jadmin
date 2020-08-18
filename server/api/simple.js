const Router = require("koa-router");

const router = new Router({
  prefix: "/j_api/simple"
});

router.get("/user/info", async ctx => {
  ctx.body = "";
});

module.exports = router;