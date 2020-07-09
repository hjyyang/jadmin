const Router = require("koa-router");
const {
  Document,
  Parameter,
  DomRelationships,
  mySequelize
} = require("../lib/orm");

const sequelize = require("sequelize");
const Op = sequelize.Op;

const router = new Router({
  prefix: "/j_api/domc"
});

//删除文档api方法----------------------------------
const remove_api = async (rid, t) => {
  await Document.destroy({
    //删除文档表api行数据
    where: {
      id: rid
    },
    transaction: t
  });
  await removePar(rid, t);
};

//添加api对应参数方法------------------------------
const addPar = async (parameters, api_id, t) => {
  try {
    let res = await Document.findOne({
      where: {
        id: api_id
      },
      transaction: t
    });
    if (res === null) return false;
    let resid = await Parameter.bulkCreate(parameters, {
        transaction: t
      }),
      resArr = []; //创建参数后的返回的数组
    let parId = [];
    for (let i in resid) {
      resArr.push(resid[i].dataValues);
      parId.push({
        object_id: api_id,
        term_taxonomy_id: resid[i].dataValues.id
      });
    }
    await DomRelationships.bulkCreate(parId, {
      transaction: t
    });
    return resArr;
  } catch (error) {
    return false;
  }
};

//删除api对应参数方法------------------------------
const removePar = async (rid, t) => {
  let res = await DomRelationships.findAll({
    //查找文档关系表对应的参数id
    where: {
      object_id: rid
    },
    transaction: t,
    raw: true
  });
  if (res.length > 0) {
    let tremArr = [];
    for (let i in res) {
      tremArr.push(res[i].term_taxonomy_id);
    }
    await mySequelize.queryInterface.bulkDelete(
      //删除参数表对应数据
      "Parameters",
      {
        id: {
          [Op.in]: tremArr
        }
      },
      {
        transaction: t
      }
    );
  }
  await DomRelationships.destroy({
    //删除文档关系表行数据
    where: {
      object_id: rid
    },
    transaction: t
  });
};

//获取文档api列表----------------------------------
router.get("/list", async ctx => {
  let res = await Document.findAll({
    attributes: ["id", ["group", "title"], "path", "method", "describe"],
    include: [
      {
        model: Parameter,
        attributes: ["id", "required", "value", "name", "type"]
      }
    ]
  });
  return (ctx.body = {
    code: 8888,
    message: "successful",
    d_list: res
  });
});

//添加文档api--------------------------------------
router.post("/add_api", async ctx => {
  let { method, path, describe, title } = ctx.request.body;
  if (!title) {
    return (ctx.body = {
      code: 8002,
      message: "Wrong parameter"
    });
  }
  let res = await Document.create({
    method: method,
    path: path,
    describe: describe,
    group: title
  });
  return (ctx.body = {
    code: 8888,
    message: "successful",
    id: res.dataValues.id
  });
});

//添加api对应参数----------------------------------
router.post("/add_par", async ctx => {
  let { parameters, id } = ctx.request.body;
  if (
    !parameters ||
    !Array.isArray(parameters) ||
    !id ||
    !Number.isInteger(parseInt(id))
  ) {
    //判断字段是否存在且类型正确
    return false;
  }
  await mySequelize.transaction(async t => {
    //开启事务处理参数表与关系表
    let res = await addPar(parameters, id, t);
    if (res) {
      return (ctx.body = {
        code: 8888,
        message: "successful",
        parameters: res
      });
    } else {
      return (ctx.body = {
        code: 8002,
        message: "Wrong parameter"
      });
    }
  });
});

//删除文档api--------------------------------------
router.get("/remove_api", async ctx => {
  let { rid } = ctx.request.query;
  //rid：api的唯一id
  if (!Number.isInteger(parseInt(rid))) {
    return (ctx.body = {
      code: 8002,
      message: "Wrong parameter"
    });
  }
  await mySequelize.transaction(async t => {
    await remove_api(rid, t);
  });
  return (ctx.body = {
    code: 8888,
    message: "successful"
  });
});

//修改文档api-------------------------------------
router.post("/update_api", async ctx => {
  let { aid, path, method, describe, title, parameters } = ctx.request.body;
  if (!Number.isInteger(parseInt(aid))) {
    return (ctx.body = {
      code: 8002,
      message: "Wrong parameter"
    });
  }
  await mySequelize.transaction(async t => {
    try {
      await Document.update(
        {
          path: path,
          method: method,
          describe: describe,
          group: title
        },
        {
          where: {
            id: aid
          },
          transaction: t
        }
      );
      if (parameters && Array.isArray(parameters)) {
        await removePar(aid, t); //先删除对应的参数表、关系表数据
        await addPar(parameters, aid, t);
      }
    } catch (error) {
      return (ctx.body = {
        code: 8003,
        message: "Server error"
      });
    }
  });
  return (ctx.body = {
    code: 8888,
    message: "successful"
  });
});

module.exports = router;
