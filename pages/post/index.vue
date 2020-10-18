<template>
	<main id="post_page" class="page">
		<div class="wrap total">
			<ul>
				<li>
					<div class="title">全部</div>
					<div class="number">10</div>
				</li>
				<li>
					<div class="title">发布</div>
					<div class="number">23</div>
				</li>
				<li>
					<div class="title">草稿</div>
					<div class="number">1</div>
				</li>
			</ul>
		</div>
		<div class="wrap">
			<div class="header">
				<h4>文章列表</h4>
				<el-date-picker
					v-model="searchDate"
					size="small"
					type="daterange"
					range-separator="至"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
				></el-date-picker>
				<div class="search">
					<el-input placeholder="请输入..." size="small" suffix-icon="el-icon-search" v-model="search"></el-input>
				</div>
			</div>
			<nuxt-link to="/post/edit" class="add"> <i class="el-icon-circle-plus"></i>添加 </nuxt-link>
			<transition-group name="list" tag="div">
				<div v-for="(item, index) in listData" :key="item.pid" class="item">
					<div class="col category"></div>
					<div class="col text">
						<div class="title">{{ item.title }}</div>
						<div class="describe">{{ item.describe }}</div>
					</div>
					<div class="col date">
						<div class="title">更新时间</div>
						<div class="describe">{{ item.updateTime }}</div>
					</div>
					<div class="col publish">
						<div class="title">发布</div>
						<div class="describe">
							<el-switch v-model="item.publish"></el-switch>
						</div>
					</div>
					<div class="col edit">
						<nuxt-link :to="'/post/edit?pid=' + item.pid">编辑</nuxt-link>
					</div>
					<div class="col more">
						<el-dropdown @command="handleCommand" @visible-change="currentEditIndex = index">
							<span class="el-dropdown-link">
								更多
								<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">快捷编辑</el-dropdown-item>
								<el-dropdown-item command="delete">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</transition-group>
			<div class="paged" v-if="listData.length >= 10">
				<el-pagination
					@current-change="currentChange"
					background
					layout="prev, pager, next"
					:total="listData.length"
					:page-size="2"
				></el-pagination>
			</div>
		</div>
		<el-dialog title="快捷编辑" :visible.sync="dialogVisible" width="30%" class="edit-popup">
			<div class="category_wrap">
				<h4>分类</h4>
				<el-radio-group v-model="listData.category" size="small">
					<el-radio :label="item.name" v-for="item in categoryList" :key="item.cid">{{ item.name }}</el-radio>
				</el-radio-group>
			</div>
			<div class="describe_wrap">
				<h4>描述</h4>
				<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="currentEdit.describe"></el-input>
			</div>
			<div class="comment_status">
				<h4>评论</h4>
				<el-switch v-model="currentEdit.comment" active-icon-class="el-icon-check"></el-switch>&nbsp;开启评论
			</div>
			<div class="modal_footer">
				<el-button size="mini" @click="dialogVisible = false">取消</el-button>
				<el-button type="primary" size="mini">确定</el-button>
			</div>
		</el-dialog>
	</main>
</template>

<script>
export default {
	transition: "slide",
	data() {
		return {
			search: "",
			listData: [
				{
					pid: 1,
					title: "this is munber one title",
					category: "css",
					describe: "hahahah",
					comment: false,
					updateTime: "2016-07-28 14:00:00",
					publish: false,
				},
				{
					pid: 2,
					title: "this is munber two title",
					category: "javascript",
					describe: "xixixixixi",
					comment: true,
					updateTime: "2017-07-28 14:00:00",
					publish: true,
				},
			],
			categoryList: [
				{
					cid: 1,
					name: "css",
				},
				{
					cid: 2,
					name: "javascript",
				},
			],
			searchDate: "",
			dialogVisible: false,
			currentEditIndex: 0,
			currentEdit: {},
		};
	},
	methods: {
		handleCommand(command) {
			if (command == "delete") {
				this.$confirm("确定删除该文章？, 是否继续?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						this.$message({
							type: "success",
							message: "删除成功!",
						});
					})
					.catch(() => {
						this.$message({
							type: "info",
							message: "已取消删除",
						});
					});
			} else if (command == "edit") {
				this.currentEdit = this.listData[this.currentEditIndex];
				this.dialogVisible = true;
			}
		},
		currentChange(page) {},
	},
};
</script>

<style lang="scss">
@import "~/assets/style/variable.scss";
#post_page {
	.wrap {
		margin-bottom: 16px;
		&.total {
			ul {
				display: flex;
			}
			li {
				flex: 1;
				padding: 10px;
				text-align: center;
				cursor: pointer;
				transition: all 0.3s;
				&:hover {
					color: #57a3f3;
				}
			}
			.number {
				padding-top: 2px;
				font-size: 26px;
			}
		}
	}
	.header {
		display: flex;
		align-items: center;
		padding-bottom: 6px;
		border-bottom: 1px solid #e8eaec;
		margin-bottom: 10px;
		.el-date-editor {
			margin-left: auto;
		}
		.search {
			max-width: 200px;
			margin-left: 14px;
		}
	}
	a.add {
		display: block;
		width: 100%;
		height: 36px;
		line-height: 36px;
		border-radius: 4px;
		border: 1px dashed #dcdee2;
		margin-bottom: 10px;
		text-align: center;
		color: #000000;
		transition: all 0.3s;
		i {
			margin-right: 4px;
		}
		&:hover {
			color: #57a3f3;
			background-color: #fff;
			border-color: #57a3f3;
		}
	}
	.item {
		display: flex;
		align-items: center;
		width: 100%;
		color: #808695;
		padding: 12px 10px;
		border-bottom: 1px solid #e8eaec;
		background-color: #fff;
		transition: background-color 0.3s;
		&:hover {
			background-color: #ecf8ff;
		}
		&.list-move {
			transition: transform 1s;
		}
		.col {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
			margin-left: 20px;
			&.text {
				width: 46%;
				margin-right: auto;
			}
			&.more {
				position: relative;
				margin-left: 20px;
				&::before {
					content: "";
					position: absolute;
					left: -20px;
					top: 50%;
					transform: translateY(-50%);
					width: 1px;
					height: 14px;
					background-color: #e8eaec;
				}
				i {
					margin-left: -4px;
					font-size: 12px;
					transform: scale(0.8);
				}
			}
			&.publish {
				text-align: center;
				.describe {
					margin: 0 auto;
				}
			}
			&.edit {
				margin-right: 10px;
			}
			&.category {
				width: 40px;
				height: 40px;
				margin-left: 0;
				background-color: #e8eaec;
				border-radius: 6px;
			}
		}
		.title {
			width: 100%;
			margin-bottom: 5px;
			@include elps-wrap(1);
		}
		.describe {
			@include elps-wrap(1);
		}
		a {
			padding: 10px;
			color: #808695;
			&:hover {
				color: #57a3f3;
			}
		}
		.el-dropdown {
			cursor: pointer;
			transition: all 0.3s;
			&:hover {
				color: #57a3f3;
			}
		}
	}
	.el-dialog {
		border-radius: 5px;
	}
	.el-dialog__body {
		padding: 20px 0px;
		border-top: 1px solid #ebeef5;
		> div {
			&:last-of-type {
				border-bottom: none;
			}
		}
	}
	.publish_btn {
		width: 100%;
		margin-bottom: 30px;
	}
	h4 {
		margin-bottom: 20px;
		font-size: 16px;
		color: #909090;
	}
	.el-radio {
		margin-bottom: 12px;
	}
	.new-wrap {
		margin: 10px 0px 30px;
	}
	a.new {
		font-size: 14px;
		color: #007fff;
		text-decoration: underline !important;
		cursor: pointer;
		&:hover {
			opacity: 0.8;
		}
	}
	.new_input {
		display: flex;
		input {
			border-top-right-radius: 0px;
			border-bottom-right-radius: 0px;
			border-right: 0px;
		}
		button {
			border-top-left-radius: 0px;
			border-bottom-left-radius: 0px;
		}
	}
	.category_wrap {
		padding: 0 20px 20px;
	}
	.describe_wrap {
		padding: 0px 20px 20px;
	}
	.comment_status {
		padding: 0px 20px 20px;
	}
	.modal_footer {
		display: flex;
		justify-content: flex-end;
		border-top: 1px solid #ebeef5;
		padding: 20px 20px 0;
	}
}
</style>
