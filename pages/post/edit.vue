<template>
	<div class="edit-page">
		<header>
			<div class="header-wrap">
				<nuxt-link class="return_btn" to="/post">
					<i class="iconfont icon-return"></i>
				</nuxt-link>
				<div class="title">
					<input type="text" @input="contentChange" v-model="postData.title" placeholder="输入标题..." />
				</div>
				<div class="message">{{ saveState ? "保存中..." : "文章自动保存为草稿" }}</div>
				<el-dropdown class="cover_img_btn">
					<i class="el-icon-picture"></i>
					<el-dropdown-menu slot="dropdown" class="cover_img">
						<h4 v-show="!postData.coverImage">添加文章封面</h4>
						<div class="pic" @click="addCover">
							<img :src="postData.coverImage" v-if="postData.coverImage" />
							<button v-else>点击这里添加图片</button>
						</div>
					</el-dropdown-menu>
				</el-dropdown>
				<div class="more_btn" @click="drawerVisible = true">
					<i class="iconfont icon-i-more"></i>
				</div>
			</div>
		</header>
		<main>
			<JEditor :hljs="hljs" :languages="languages" v-model="postData.content" @input="contentChange"></JEditor>
		</main>
		<MediaPopup :dialogVisible.sync="mediaVisible" :on-select="fileSelect" />
		<el-drawer :visible.sync="drawerVisible" direction="rtl" size="24%" class="edit_drawer">
			<el-button type="primary" class="publish_btn" @click="handlePublish(true)" :loading="saveState">{{
				saveState ? "保存中..." : btnState === 0 ? "发布" : btnState === 1 ? "修改" : "取消发布"
			}}</el-button>
			<div class="category_wrap">
				<h4>分类</h4>
				<el-radio-group v-model="postData.cid" size="small" @change="contentChange">
					<el-radio :label="item.cid" v-for="(item, index) in categoryList" :key="index">{{ item.name }}</el-radio>
				</el-radio-group>
			</div>
			<div class="describe_wrap">
				<h4>描述</h4>
				<el-input type="textarea" :rows="4" placeholder="请输入内容" @input="contentChange" v-model="postData.describe"></el-input>
			</div>
			<div class="comment_status">
				<h4>评论</h4>
				<el-switch v-model="postData.comment" active-icon-class="el-icon-check" @change="contentChange"></el-switch>&nbsp;开启评论
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
import media from "~/components/media";
export default {
	layout: "edit",
	components: {
		JEditor: JEditor.jEditor,
		MediaPopup: media,
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
				title: "",
				publish_state: false,
			},
			oldData: {},
			btnState: 0, //发布或修改按钮的状态：0:发布，1:修改，2取消发布
			timer: null,
			isLock: true,
			categoryList: [],
			pathId: 0,
			saveState: false,
			mediaVisible: false,
		};
	},
	methods: {
		//获取post数据
		async getData(pid) {
			let res = await this.$request.getPost({
				pid,
			});
			if (res.data.code === 8888) {
				this.postData = res.data.post;
				Object.assign(this.oldData, res.data.post);
				this.isBtnState();
			} else {
				this.$router.push({
					query: {},
				});
				this.$message({
					type: "info",
					message: "未找到该文章",
				});
			}
		},
		//post内容（数据）改变时
		contentChange() {
			if (this.isLock) return false;
			this.handleUpdate();
		},
		//判断是否需要更新
		async handleUpdate() {
			let old = this.oldData,
				news = this.postData;
			if (
				old.content != news.content ||
				old.title != news.title ||
				old.coverImage != news.coverImage ||
				old.describe != news.describe ||
				old.comment != news.comment ||
				old.cid != news.cid
			) {
				//post内容更新
				this.btnState = 1;
				if (this.timer) {
					clearTimeout(this.timer);
				}
				this.timer = setTimeout(() => {
					//延时两秒后自动保存
					this.handlePublish(false);
				}, 2000);
			} else {
				//post内容未更新
				this.isBtnState();
			}
		},
		//修改按钮状态
		isBtnState() {
			if (this.postData.publish_state) {
				//文章已发布
				this.btnState = 2;
			} else {
				//文章未发布
				this.btnState = 0;
			}
		},
		//发布（修改）判断
		handlePublish(isClick) {
			//判断是修改或是发布
			if (this.timer) {
				clearTimeout(this.timer);
			}
			if (isClick) {
				//点击按钮触发
				this.postData.publish_state = this.btnState == 0 ? true : this.btnState == 1 ? this.postData.publish_state : false;
			}
			this.saveState = true;
			if (this.pathId) {
				//url上存在id，即非新增post，修改post
				this.postUpdate({
					pid: this.pathId,
					title: this.postData.title,
					content: this.postData.content,
					describe: this.postData.describe,
					cid: this.postData.cid,
					publish_state: this.postData.publish_state,
					coverImage: this.postData.coverImage,
					comment: this.postData.comment,
				});
			} else {
				//未存在id，新增post
				this.addPost({
					title: this.postData.title,
					content: this.postData.content,
					describe: this.postData.describe,
					cid: this.postData.cid,
					publish_state: this.postData.publish_state,
					coverImage: this.postData.coverImage,
					comment: this.postData.comment,
				});
			}
		},
		//更新post
		async postUpdate(option) {
			await this.$request.updatePost(option);
			this.saveState = false;
			this.isBtnState();
		},
		//添加post
		async addPost(option) {
			let res = await this.$request.addPost(option);
			if (res.data.code === 8888) {
				this.$router.push({
					path: "/post/edit",
					query: { pid: res.data.pid },
				});
				this.pathId = res.data.pid;
			}
			this.saveState = false;
			this.isBtnState();
		},
		//获取分类列表
		async getCategory() {
			let res = await this.$request.getCategoryList();
			if (res.data.code === 8888) {
				this.categoryList = res.data.categoryList;
			}
		},
		//添加海报图
		addCover() {
			this.mediaVisible = true;
		},
		//选择文件
		fileSelect(file) {
			this.postData.coverImage = file.url;
			this.mediaVisible = false;
			this.contentChange();
		},
	},
	async created() {
		this.pathId = this.$route.query.pid;
		this.getCategory();
		if (this.pathId && !isNaN(parseInt(this.pathId))) {
			await this.getData(this.pathId);
			this.isLock = false;
		} else {
			this.isLock = false;
		}
	},
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
		color: #707070;
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
			outline: none;
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
		.pic {
			cursor: pointer;
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
