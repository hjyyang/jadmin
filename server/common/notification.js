const { Notifications, NotificationTermUser, mySequelize } = require("../lib/orm");
class Notification {
	async add(option) {
		let options = {
			message: option.message,
			type: option.type,
			object_id: option.pid,
		};
		return await mySequelize.transaction(async (t) => {
			try {
				let res = await Notifications.create(options, {
					transaction: t,
				});
				await NotificationTermUser.create(
					{
						uid: option.uid,
						note_id: res.dataValues.id,
					},
					{
						transaction: t,
					}
				);
				return true;
			} catch (error) {
				throw error;
			}
		});
	}
	async find(option) {
		let options = {
			attributes: ["id", "message", "type", "object_id"],
			offset: 10 * (option.page - 1),
			limit: 10,
			include: {
				model: NotificationTermUser,
				as: "read",
				attributes: ["status"],
				where: {
					uid: option.uid,
				},
			},
		};
		try {
			return await Notifications.findAll(options);
		} catch (error) {
			throw error;
		}
	}
	async update(option) {
		let options = {
				status: 1,
			},
			whereOp = {
				where: { uid: option.uid },
			};
		if (!option.all) {
			whereOp.where.note_id = option.noteId;
		}
		try {
			await NotificationTermUser.update(options, whereOp);
			return true;
		} catch (error) {
			throw error;
		}
	}
}

module.exports = new Notification();
