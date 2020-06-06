const Sequelize = require("sequelize");
const config = require("./dbConfig");

let sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      idle: 30000
    },
    timezone: "+08:00"
  }
);

let dataTables = {};
dataTables.mySequelize = sequelize;

let User = sequelize.define(
  "user",
  {
    //user是表名，会在后面自动加上s（users）
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: Sequelize.STRING,
    password: Sequelize.STRING,
    email: {
      type: Sequelize.STRING
    },
    createdAt: {
      type: Sequelize.DATE,
      defaultValue: Sequelize.NOW
    },
    role: Sequelize.TINYINT(10)
  },
  {
    timestamps: false,
    freezeTableName: true
    //Sequelize默认为每个模型定义了字段id(主键),createdAt和updatedAt,
    //timestamps 为 false,因此不会创建 `createdAt` 和 `updatedAt` 字段.
    // freezeTableName: true
    //Sequelize默认情况下,表名自动复数,通过使用 freezeTableName:true 参数可以为特定模型停止此行为
  }
);

dataTables.User = User;

module.exports = dataTables;