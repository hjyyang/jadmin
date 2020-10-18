<template>
	<div class="edit-page">
		<header>
			<div class="header-wrap">
				<div class="return_btn" @click="$router.go(-1)">
					<i class="iconfont icon-return"></i>
				</div>
				<div class="title">
					<input type="text" placeholder="输入标题..." />
				</div>
				<div class="message">文章自动保存到草稿</div>
				<el-dropdown class="cover_img_btn" trigger="click">
					<i class="el-icon-picture"></i>
					<el-dropdown-menu slot="dropdown" class="cover_img">
						<h4>添加文章封面</h4>
						<div class="pic">
							<img src="" />
							<button>点击这里添加图片</button>
						</div>
					</el-dropdown-menu>
				</el-dropdown>
				<div class="more_btn" @click="drawerVisible = true">
					<i class="iconfont icon-i-more"></i>
				</div>
			</div>
		</header>
		<main>
			<JEditor :hljs="hljs" :languages="languages"></JEditor>
		</main>

		<el-drawer :visible.sync="drawerVisible" direction="rtl" size="24%" class="edit_drawer">
			<el-button type="primary" class="publish_btn">{{ postData.status === 0 ? "确定并发布" : "修改" }}</el-button>
			<div class="category_wrap">
				<h4>分类</h4>
				<el-radio-group v-model="postData.category" size="small">
					<el-radio :label="item.cValue" v-for="(item, index) in postData.categoryList" :key="index">{{ item.cName }}</el-radio>
				</el-radio-group>
				<div class="new-wrap">
					<div class="new_input">
						<el-input ref="saveCategoryInput" placeholder="新增分类名"></el-input>
						<el-button type="primary" icon="el-icon-check"></el-button>
					</div>
				</div>
			</div>
			<div class="describe_wrap">
				<h4>描述</h4>
				<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="postData.describe"></el-input>
			</div>
			<div class="comment_status">
				<h4>评论</h4>
				<el-switch v-model="postData.comment" active-icon-class="el-icon-check"></el-switch>&nbsp;开启评论
			</div>
		</el-drawer>
	</div>
</template>

<script>
import JEditor from "vue-jeditor";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import "vue-jeditor/dist/src/css/style.css";
import "highlight.js/styles/monokai-sublime.css";
export default {
	layout: "edit",
	components: {
		JEditor: JEditor.jEditor,
	},
	data() {
		return {
			hljs: hljs,
			languages: {
				css,
				javascript,
			},
			drawerVisible: false,
			postData: {
				describe: "",
				comment: false,
				categoryList: [],
			},
		};
	},
	mounted() {},
};
</script>

<style lang="scss">
.post-edit-page {
	height: 100%;
	.j-editor,
	.edit-page {
		height: 100%;
	}
	main {
		height: calc(100% - 75px);
	}
	header {
		display: flex;
		padding: 4px 20px;
		box-sizing: border-box;
		height: 60px;
		margin-bottom: 15px;
		background-color: #ffffff;
	}
	.header-wrap {
		display: flex;
		align-items: center;
		width: 100%;
		color: #dddddd;
	}
	.return_btn {
		cursor: pointer;
		transition: all 0.2s;
		font-size: 30px;
		&:hover {
			color: rgba($color: #409eff, $alpha: 0.8);
		}
		i {
			font-size: inherit;
		}
	}
	.title {
		width: 50%;
		height: 30px;
		margin: 0 30px;
		input {
			width: 100%;
			height: 100%;
			outline: none;
			border: none;
			font-size: 20px;
			font-weight: bold;
		}
	}
	.message {
		margin-left: auto;
		font-size: 16px;
	}
	.cover_img_btn {
		cursor: pointer;
        outline: none;
		margin-left: 20px;
		transition: all 0.2s;
		&:hover {
			color: rgba($color: #409eff, $alpha: 0.8);
		}
		i {
			font-size: 26px;
		}
	}
	.more_btn {
		width: 40px;
		height: 40px;
		line-height: 40px;
		margin-left: 10px;
		text-align: center;
		cursor: pointer;
		transition: all 0.2s;
		&:hover {
			color: rgba($color: #409eff, $alpha: 0.8);
		}
		i {
			font-size: 20px;
		}
	}
	.cover_img {
		width: 310px;
		padding: 20px;
		text-align: center;
		h4 {
			margin-bottom: 10px;
			font-size: 18px;
			color: rgba(119, 127, 141, 0.8);
		}
		button {
			width: 100%;
			height: 96px;
			border: none;
			color: rgba(51, 51, 51, 0.4);
			background-color: hsla(0, 0%, 87.1%, 0.6);
			outline: none;
			font-size: 16px;
			cursor: pointer;
			transition: all 0.3s;
		}
	}
	.edit_drawer {
		outline: none;
		header {
			position: relative;
			padding: 12px 20px;
			background: #fff;
			border-bottom: 1px solid #e0e0e0;
			margin-bottom: 10px;
		}
		.el-drawer {
			overflow-y: auto;
			outline: none;
		}
		.el-drawer__body {
			padding: 0px 20px 20px;
			> div {
				border-bottom: 1px solid #ebeef5;
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
		.describe_wrap {
			padding-top: 30px;
			padding-bottom: 20px;
		}
		.comment_status {
			padding-top: 30px;
		}
	}
}
</style>
