const Router = require("koa-router");

const router = new Router({
  prefix: "/j_api/user"
});

router.get("/login", async ctx => {
  ctx.body = {};
});

module.exports = router;
