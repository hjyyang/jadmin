const uaParser = require("ua-parser-js");
const koaRequest = require("koa2-request");

let request = {};

request.parser = async (ctx) => {
	let requestInfo = {
			os: "", //操作系统
			ip: "", //ip地址
			browser: "", //浏览器
			province: "", //省份
			city: "", //市
			lp: "", //着陆页 landing page
			vp: "", //受访页
		},
		info = uaParser(ctx.headers["user-agent"]);
	requestInfo.os = info.os.name;
	requestInfo.browser = info.browser.name;
	requestInfo.ip = ctx.ip;
	let res = await koaRequest("https://restapi.amap.com/v3/ip?ip=" + ctx.ip + "&key=19a63048ef1d9c39300e20a24507bbd4");
	let address = JSON.parse(res.body);
	requestInfo.province = Array.isArray(address.province) ? "" : address.province;
	requestInfo.city = Array.isArray(address.city) ? "" : address.city;
	return requestInfo;
};
module.exports = request;
