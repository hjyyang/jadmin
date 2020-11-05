<template>
	<main id="post_page" class="page">
		<div class="wrap total">
			<ul>
				<li @click="handlePublish(1)" :class="{ active: currentPublish == 1 }">
					<div class="title">全部</div>
					<div class="number">{{ count.total }}</div>
				</li>
				<li @click="handlePublish(2)" :class="{ active: currentPublish == 2 }">
					<div class="title">发布</div>
					<div class="number">{{ count.published }}</div>
				</li>
				<li @click="handlePublish(3)" :class="{ active: currentPublish == 3 }">
					<div class="title">草稿</div>
					<div class="number">{{ count.unpublished }}</div>
				</li>
			</ul>
		</div>
		<div class="wrap tool">
			<el-date-picker
				v-model="searchDate"
				size="small"
				type="daterange"
				range-separator="至"
				start-placeholder="开始日期"
				end-placeholder="结束日期"
			></el-date-picker>
			<div class="search">
				<el-input placeholder="标题" size="small" suffix-icon="el-icon-search" clearable v-model="search"></el-input>
			</div>
			<el-select v-model="currentCategory" size="small" clearable placeholder="分类">
				<el-option v-for="item in categoryList" :key="item.cid" :label="item.name" :value="item.cid"> </el-option>
			</el-select>
			<el-button @click="handleSearch" type="primary" icon="el-icon-search" size="small" circle></el-button>
		</div>
		<div class="wrap">
			<div class="header">
				<h4>文章列表</h4>
			</div>
			<nuxt-link to="/post/edit" class="add"> <i class="el-icon-circle-plus"></i>添加 </nuxt-link>
			<transition-group name="list" tag="div" v-if="listData.length > 0">
				<div v-for="(item, index) in listData" :key="item.pid" class="item list-item">
					<div class="col category">
						<img :src="categoryObj[item.cid].coverImage ? categoryObj[item.cid].coverImage : require('~/static/image/unknown.jpg')" />
					</div>
					<div class="col text">
						<div class="title">{{ item.title }}</div>
						<div class="describe">{{ item.describe }}</div>
					</div>
					<div class="col date">
						<div class="title">创建时间</div>
						<div class="describe">{{ dateFormat(new Date(item.createdTime)) }}</div>
					</div>
					<div class="col publish">
						<div class="title">发布</div>
						<div class="describe">
							<el-switch v-model="item.publish_state"></el-switch>
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
			<div class="paged" v-if="count.total >= 10">
				<el-pagination
					@current-change="currentChange"
					background
					layout="prev, pager, next"
					:total="count.total"
					:page-size="10"
				></el-pagination>
			</div>
		</div>
		<el-dialog title="快捷编辑" :visible.sync="dialogVisible" width="30%" class="edit-popup">
			<div class="category_wrap">
				<h4>分类</h4>
				<el-radio-group v-model="currentEdit.cid" size="small">
					<el-radio :label="item.cid" v-for="item in categoryList" :key="item.cid">{{ item.name }}</el-radio>
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
			listData: [],
			categoryList: [],
			currentCategory: null,
			searchDate: [],
			dialogVisible: false,
			currentEditIndex: 0,
			currentEdit: {},
			currentPage: 1,
			count: {
				total: 0,
				published: 0,
				unpublished: 0,
			},
			categoryObj: {},
			currentPublish: 1,
			isPublish: 0,
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
					.then(async () => {
						let res = await this.$request.detelePost({
							pid: this.listData[this.currentEditIndex].pid,
						});
						if (res.data.code === 8888) {
							this.$message({
								type: "success",
								message: "删除成功!",
							});
						}
					})
					.catch((error) => {
						console.log(error);
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
		async currentChange(page) {
			await this.getData(page);
		},
		async getData(page, lock) {
			let option = {
					page: page ? page : this.currentPage,
					count: lock,
				},
				res = null,
				data = {};
			if (this.searchDate && this.searchDate.length > 0) option.time = this.searchDate;
			if (this.search) option.title = this.search;
			if (this.search) option.title = this.search;
			if (this.isPublish) option.isPublish = this.isPublish;
			res = await this.$request.getPostList(option);
			this.listData = res.data.postList;
			if (lock) {
				this.count.total = res.data.published + res.data.unpublished;
				this.count.published = res.data.published;
				this.count.unpublished = res.data.unpublished;
			}
		},
		async getCategory() {
			let res = await this.$request.getCategoryList();
			if (res.data.code === 8888) {
				this.categoryList = res.data.categoryList;
				for (let i in this.categoryList) {
					this.categoryObj[this.categoryList[i].cid] = this.categoryList[i];
				}
			}
		},
		dateFormat(date, fmt = "YYYY-mm-dd HH:MM") {
			let ret;
			const opt = {
				"Y+": date.getFullYear().toString(), // 年
				"m+": (date.getMonth() + 1).toString(), // 月
				"d+": date.getDate().toString(), // 日
				"H+": date.getHours().toString(), // 时
				"M+": date.getMinutes().toString(), // 分
				"S+": date.getSeconds().toString(), // 秒
				// 有其他格式化字符需求可以继续添加，必须转化成字符串
			};
			for (let k in opt) {
				ret = new RegExp("(" + k + ")").exec(fmt);
				if (ret) {
					fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
				}
			}
			return fmt;
		},
		async handleSearch() {
			await this.getData();
		},
		async handlePublish(lock) {
			this.currentPublish = lock;
			if (lock === 1) {
				this.isPublish = 0;
			} else if (lock === 2) {
				this.isPublish = 1;
			} else if (lock === 3) {
				this.isPublish = 2;
			}
			await this.getData();
		},
	},
	async created() {
		await this.getCategory();
		this.getData(this.currentPage, true);
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
				&.active {
					color: #57a3f3;
				}
			}
			.number {
				padding-top: 2px;
				font-size: 26px;
			}
		}
		&.tool {
			display: flex;
			align-items: center;
			.el-date-editor {
				margin-right: 14px;
			}
			.search {
				max-width: 200px;
				margin-right: 14px;
			}
			button {
				margin-left: auto;
			}
		}
	}
	.header {
		display: flex;
		align-items: center;
		padding-bottom: 6px;
		border-bottom: 1px solid #e8eaec;
		margin-bottom: 10px;
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
				overflow: hidden;
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
