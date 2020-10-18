const Router = require("koa-router");
const fileMethod = require("../common/files").fileMethod;
const upload = require("../common/files").upload;
const cpUpload = upload.fields([
	{ name: "file", maxCount: 1 },
	{ name: "gallery", maxCount: 8 },
]);

const router = new Router({
	prefix: "/j_api/file",
});

//上传文件
router.post("/upload", cpUpload, async (ctx) => {
	let files = ctx.request.files.gallery || ctx.request.files.file,
		filesList = [],
		url = null;
	if (!Array.isArray(files)) {
		//判断类型是否为数组
		return (ctx.body = {
			code: 8002,
			message: "Wrong parameter",
		});
	}
	for (let i in files) {
		url = files[i].path.replace(/\\/g, "/").replace("static", "");
		filesList.push({
			name: files[i].filename,
			url: url,
			size: files[i].size,
		});
	}
	ctx.body = {
		code: 8888,
		message: "successful",
		filesList: filesList,
	};
});

//删除文件
router.get("/delete", async (ctx) => {
	let { url } = ctx.request.query;
	if (!url) {
		return (ctx.body = {
			code: 8002,
			message: "Wrong parameter",
		});
	}
	let res = await fileMethod.delete(url);
	if (res) {
		ctx.body = {
			code: 8888,
			message: "successful",
		};
	} else {
		ctx.body = {
			code: 8004,
			message: "unknown error",
		};
	}
});

//修改文件名
router.get("/update", async (ctx) => {
	let { url, newUrl } = ctx.request.query;
	if (!url || !newUrl) {
		return (ctx.body = {
			code: 8002,
			message: "Wrong parameter",
		});
	}
	let res = await fileMethod.rename(url, newUrl);
	if (res) {
		ctx.body = {
			code: 8888,
			message: "successful",
			url: res,
		};
	} else {
		ctx.body = {
			code: 8005,
			message: "failure",
		};
	}
});

//查找文件列表
router.get("/find", async (ctx) => {
	let list = await fileMethod.getAll();
	ctx.body = {
		code: 8888,
		message: "successful",
		filesList: list,
	};
});
module.exports = router;
