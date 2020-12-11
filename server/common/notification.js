const { Notifications, NotificationTermUser, mySequelize } = require("../lib/orm");
class Notification {
	/**
	 * 添加通知
	 * @param  {[string]} message     通知内容
	 * @param  {[number]} type        通知类型：1:留言回复,2:评论回复,3系统通知
	 * @param  {[number]} pid         对应的文章id或留言id,根据type确定，type为3时为null
	 * @param  {[number]} uid         接收该通知的用户id
	 */
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
						uid: option.uid ? option.uid : 888,
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
	/**
	 * 查询通知
	 * @param  {[number]} uid         接收该通知的用户id
	 * @param  {[number]} page        分页数
	 */
	async find(option) {
		let options = {
			attributes: ["id", "message", "type", ["object_id", "note"], "createdAt"],
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
	/**
	 * 更新通知状态
	 * @param  {[number]}  uid         接收该通知的用户id
	 * @param  {[number]}  noteId      通知id
	 * @param  {[boolean]} all         是否已读全部，字段存在时 noteId 无效
	 */
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
