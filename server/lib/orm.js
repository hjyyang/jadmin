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
    role: Sequelize.TINYINT(10),
    authEmail: {
      type: Sequelize.TINYINT,
      defaultValue: 0
    },
    sex: {
      type: Sequelize.STRING,
      defaultValue: "no_gender"
    },
    face: Sequelize.STRING
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

let Document = sequelize.define(
  "document",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    group: {
      type: Sequelize.STRING,
      allowNull: false
    },
    path: Sequelize.STRING,
    method: Sequelize.STRING,
    describe: Sequelize.STRING
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);

dataTables.Document = Document;

let Parameter = sequelize.define(
  "parameters",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    required: {
      type: Sequelize.TINYINT,
      allowNull: false
    },
    value: Sequelize.STRING,
    type: Sequelize.STRING,
    name: {
      type: Sequelize.STRING,
      allowNull: false
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);
dataTables.Parameter = Parameter;

let DomRelationships = sequelize.define(
  "dom_relationships",
  {
    object_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      primaryKey: true
    },
    term_taxonomy_id: {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      primaryKey: true
    }
  },
  {
    timestamps: false,
    freezeTableName: true
  }
);
dataTables.DomRelationships = DomRelationships;
Document.hasOne(DomRelationships, { foreignKey: "object_id" });
Parameter.hasOne(DomRelationships, { foreignKey: "term_taxonomy_id" });
Document.belongsToMany(Parameter, {
  through: {
    model: DomRelationships,
    unique: false
  },
  foreignKey: "object_id",
  constraints: false
});
Parameter.belongsToMany(Document, {
  through: {
    model: DomRelationships,
    unique: false
  },
  foreignKey: "term_taxonomy_id",
  constraints: false
});

module.exports = dataTables;
