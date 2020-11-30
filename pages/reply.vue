<template>
	<main id="reply_page" class="page">
		<div class="wrap">
			<div class="header">
				<div class="col">日期</div>
				<div class="col">用户名</div>
				<div class="col">内容</div>
			</div>
			<template v-if="tableData !== {}">
				<div class="item" :class="{ read: item.child.length == 0 }" v-for="item in tableData" :key="item.main.id">
					<div class="col">{{ $tool.dateFormat(new Date(item.main.createdAt)) }}</div>
					<div class="col">{{ item.main.username }}</div>
					<div class="col">{{ item.main.content }}</div>
					<div class="col"><span @click="replyPopup(item)">回复</span></div>
				</div>
			</template>
			<div class="no_data" v-else>
				暂无数据
			</div>
			<el-dialog title="回复" :visible.sync="dialogVisible" width="30%" class="edit-popup" :modal="false">
				<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 10 }" placeholder="请输入内容" v-model="currentReply.content"> </el-input>
				<div class="btn">
					<el-button type="primary" size="mini" @click="handleReply">确定</el-button>
				</div>
			</el-dialog>
		</div>
	</main>
</template>

<script>
export default {
	transition: "slide",
	data() {
		return {
			tableData: {},
			dialogVisible: false,
			currentReply: {},
		};
	},
	created() {
		this.getList();
	},
	methods: {
		replyPopup(row) {
			if (row.child.length !== 0) {
				this.currentReply = row.child[0];
			} else {
				this.currentReply = {};
			}
			this.dialogVisible = true;
		},
		async getList() {
			let res = await this.$request.getLeaveMessageList();
			if (res.data.code === 8888) {
				this.tableData = res.data.leaveList;
			}
        },
        handleReply(){
            console.log(this.currentReply)
        }
	},
};
</script>

<style lang="scss">
#reply_page {
	.header,
	.item {
		display: flex;
		min-height: 30px;
		border-bottom: 1px solid #ebeef5;
		transition: all 0.2s;
		&.read {
			background: #f0f9eb;
		}
	}
	.item {
		line-height: 1.2;
		&:hover {
			background-color: #f5f7fa;
		}
	}
	.col {
		display: flex;
		align-items: center;
		padding: 14px 10px;
		color: #606266;
		&:nth-of-type(1) {
			width: 140px;
		}
		&:nth-of-type(2) {
			width: 140px;
		}
		&:nth-of-type(3) {
			width: calc(100% - 340px);
		}
		&:nth-of-type(4) {
			width: 60px;
			margin-left: auto;
			color: #409eff;
		}
		span {
			cursor: pointer;
			&:hover {
				opacity: 0.6;
				transition: all 0.2s;
			}
		}
	}
	.no_data {
		padding: 20px 10px 10px;
		text-align: center;
		font-size: 12px;
	}
	.el-dialog__body {
		padding-top: 10px;
		padding-bottom: 20px;
		.btn {
			text-align: right;
		}
		button {
			margin-top: 16px;
		}
	}
}
</style>
