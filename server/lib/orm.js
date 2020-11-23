const Sequelize = require("sequelize");
const config = require("./dbConfig");

let sequelize = new Sequelize(config.database, config.username, config.password, {
	host: config.host,
	dialect: "mysql",
	pool: {
		max: 5,
		min: 0,
		idle: 30000,
	},
	timezone: "+08:00",
});

let dataTables = {};
dataTables.mySequelize = sequelize;

let User = sequelize.define(
	"users",
	{
		//user是表名，会在后面自动加上s（users）
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: Sequelize.STRING,
		password: Sequelize.STRING,
		email: {
			type: Sequelize.STRING,
		},
		createdAt: {
			type: Sequelize.DATE,
			defaultValue: Sequelize.NOW,
		},
		role: Sequelize.TINYINT(10),
		authEmail: {
			type: Sequelize.TINYINT,
			defaultValue: 0,
		},
		sex: {
			type: Sequelize.STRING,
			defaultValue: "no_gender",
		},
		face: Sequelize.STRING,
		qq: Sequelize.STRING,
	},
	{
		timestamps: false,
		freezeTableName: true,
		//Sequelize默认为每个模型定义了字段id(主键),createdAt和updatedAt,
		//timestamps 为 false,因此不会创建 `createdAt` 和 `updatedAt` 字段.
		// freezeTableName: true
		//Sequelize默认情况下,表名自动复数,通过使用 freezeTableName:true 参数可以为特定模型停止此行为
	}
);

dataTables.User = User;

let Document = sequelize.define(
	"documents",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		group: {
			type: Sequelize.STRING,
			allowNull: false,
		},
		path: Sequelize.STRING,
		method: Sequelize.STRING,
		describe: Sequelize.STRING,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);

dataTables.Document = Document;

let Parameter = sequelize.define(
	"parameters",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		requireds: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
		},
		value: Sequelize.STRING,
		type: Sequelize.STRING,
		name: {
			type: Sequelize.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.Parameter = Parameter;

let DomRelationships = sequelize.define(
	"dom_relationships",
	{
		object_id: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			primaryKey: true,
		},
		term_taxonomy_id: {
			type: Sequelize.INTEGER,
			defaultValue: 0,
			primaryKey: true,
		},
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.DomRelationships = DomRelationships;
Document.hasOne(DomRelationships, { foreignKey: "object_id" });
Parameter.hasOne(DomRelationships, { foreignKey: "term_taxonomy_id" });
Document.belongsToMany(Parameter, {
	through: {
		model: DomRelationships,
		unique: false,
	},
	foreignKey: "object_id",
	constraints: false,
});
Parameter.belongsToMany(Document, {
	through: {
		model: DomRelationships,
		unique: false,
	},
	foreignKey: "term_taxonomy_id",
	constraints: false,
});

let Posts = sequelize.define(
	"posts",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		title: Sequelize.STRING,
		describe: Sequelize.STRING,
		comment: Sequelize.BOOLEAN,
		cover_image: Sequelize.STRING,
		cid: Sequelize.INTEGER,
		publish_state: {
			type: Sequelize.BOOLEAN,
			allowNull: false,
			defaultValue: 0,
		},
		content: Sequelize.TEXT,
		createdAt: Sequelize.DATE,
		updatedAt: Sequelize.DATE,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.Posts = Posts;

let Categorys = sequelize.define(
	"categorys",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: Sequelize.STRING,
		cover_image: Sequelize.STRING,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.Categorys = Categorys;

Posts.belongsTo(Categorys, { foreignKey: "cid" });

let Statistics = sequelize.define(
	"statistics",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uid: Sequelize.INTEGER,
		type: Sequelize.INTEGER,
		name: Sequelize.STRING,
		createdAt: Sequelize.DATE,
		browser: Sequelize.STRING,
		ip: Sequelize.STRING,
		os: Sequelize.STRING,
		province: Sequelize.STRING,
		city: Sequelize.STRING,
		lp: Sequelize.STRING,
		duration: Sequelize.INTEGER,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.Statistics = Statistics;

let Comments = sequelize.define(
	"comments",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uid: Sequelize.INTEGER,
		pid: Sequelize.INTEGER,
		cid: Sequelize.INTEGER,
		createdAt: Sequelize.DATE,
		browser: Sequelize.STRING,
		ip: Sequelize.STRING,
		os: Sequelize.STRING,
		province: Sequelize.STRING,
		city: Sequelize.STRING,
		content: Sequelize.STRING,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.Comments = Comments;

let LeaveMessage = sequelize.define(
	"leave_message",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		uid: Sequelize.INTEGER,
		username: Sequelize.STRING,
		leaveId: Sequelize.INTEGER,
		createdAt: Sequelize.DATE,
		browser: Sequelize.STRING,
		ip: Sequelize.STRING,
		os: Sequelize.STRING,
		province: Sequelize.STRING,
		city: Sequelize.STRING,
		content: Sequelize.STRING,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.LeaveMessage = LeaveMessage;

let Notifications = sequelize.define(
	"notifications",
	{
		id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		message: Sequelize.STRING,
		type: Sequelize.INTEGER,
		object_id: Sequelize.INTEGER,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.Notifications = Notifications;

let NotificationTermUser = sequelize.define(
	"notification_term_user",
	{
		note_id: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		uid: {
			type: Sequelize.INTEGER,
			primaryKey: true,
		},
		status: Sequelize.BOOLEAN,
	},
	{
		timestamps: false,
		freezeTableName: true,
	}
);
dataTables.NotificationTermUser = NotificationTermUser;
Notifications.hasOne(NotificationTermUser, { as: "read", foreignKey: "note_id" });
NotificationTermUser.hasOne(Notifications, { as: "read", foreignKey: "note_id" });

module.exports = dataTables;
