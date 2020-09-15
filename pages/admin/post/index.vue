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
			<nuxt-link to="/admin/post/edit" class="add">
				<i class="el-icon-circle-plus"></i>添加
			</nuxt-link>
			<div class="list">
				<div class="item" v-for="(item,index) in listData" :key="index">
					<div class="col category"></div>
					<div class="col text">
						<div class="title">this is test title</div>
						<div class="describe">this is test describe</div>
					</div>
					<div class="col date">
						<div class="title">更新时间</div>
						<div class="describe">2016-07-28 14:00:00</div>
					</div>
					<div class="col publish">
						<div class="title">发布</div>
						<div class="describe">
							<el-switch v-model="publish"></el-switch>
						</div>
					</div>
					<div class="col edit">
						<nuxt-link to="/admin/post/edit">编辑</nuxt-link>
					</div>
					<div class="col more">
						<el-dropdown @command="handleCommand">
							<span class="el-dropdown-link">
								更多
								<i class="el-icon-arrow-down el-icon--right"></i>
							</span>
							<el-dropdown-menu slot="dropdown">
								<el-dropdown-item command="edit">编辑</el-dropdown-item>
								<el-dropdown-item command="delete">删除</el-dropdown-item>
							</el-dropdown-menu>
						</el-dropdown>
					</div>
				</div>
			</div>
			<div class="paged" v-if="listData.length>10">
				<el-pagination
					@current-change="currentChange"
					background
					layout="prev, pager, next"
					:total="listData.length"
					:page-size="2"
				></el-pagination>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	layout: "admin",
	transition: "slide",
	data() {
		return {
			search: "",
			listData: [1, 2, 3, 4, 5],
			publish: false,
			searchDate: "",
		};
	},
	methods: {
		handleCommand(command) {
			if (command == "delete") {
				this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
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
			}
		},
		currentChange(page) {
			console.log(page);
		},
	},
};
</script>

<style lang="scss" scoped>
@import "~/assets/style/variable.scss";
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
	color: #808695;
	padding: 12px 0;
	border-bottom: 1px solid #e8eaec;
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
</style>