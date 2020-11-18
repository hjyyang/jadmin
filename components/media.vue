<template>
	<el-dialog title="Image" :visible.sync="visible" width="50%" id="mediaPopup">
		<div class="wrap">
			<div class="file_list">
				<ul>
					<li>
						<el-upload
							action="/j_api/file/upload"
							class="uploader"
							:file-list="fileList"
							:headers="uploadHeaders"
							:on-success="uploadSuccess"
							:show-file-list="false"
							list-type="picture-card"
						>
							<i class="el-icon-plus"></i>
						</el-upload>
					</li>
					<li v-for="(item, index) in fileList" :key="index" @click="selectFile(item)">
						<img :src="item.url" />
						<div class="remove_icon">
							<i class="el-icon-close" @click="handleRemove(item)"></i>
						</div>
					</li>
				</ul>
			</div>
		</div>
	</el-dialog>
</template>

<script>
export default {
	data() {
		return {
			visible: false,
			uploadHeaders: {},
			fileList: [],
		};
	},
	props: {
		dialogVisible: {
			type: Boolean,
			default: false,
		},
		"on-select": Function,
	},
	watch: {
		dialogVisible(val) {
			this.visible = val;
		},
		visible(val) {
			this.$emit("update:dialogVisible", val);
		},
	},
	mounted() {
		this.getFileList();
		this.uploadHeaders.authorization = "Bearer " + this.$store.state.authUser.token;
		this.visible = this.dialogVisible;
	},
	methods: {
		async handleRemove(item) {
			let res = await this.$request.deteleFile({
				url: item.url,
			});
			if (res.data.code === 8888) {
				this.fileList.splice(this.fileList.indexOf(item), 1);
				this.$message({
					type: "success",
					message: "删除成功!",
				});
			}
		},
		uploadSuccess(res) {
			if (res.code === 8888) {
				for (let i in res.filesList) {
					this.fileList.unshift(res.filesList[i]);
				}
			}
		},
		async getFileList() {
			let res = await this.$request.findFile({ type: "image" });
			if (res.data.code === 8888) {
				this.fileList = res.data.filesList;
			}
		},
		selectFile(item) {
			if (!this.onSelect) return false;
			this.onSelect(item);
		},
	},
};
</script>

<style lang="scss">
#mediaPopup {
	.uploader {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		.el-upload {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 100%;
			line-height: 1.2;
		}
	}
	.file_list {
		margin-left: -10px;
		ul {
			display: flex;
			flex-wrap: wrap;
		}
		li {
			position: relative;
			width: calc(16.666666% - 10px);
			margin-left: 10px;
			margin-bottom: 10px;
			border: 1px solid #c0ccda;
			border-radius: 6px;
			overflow: hidden;
			cursor: pointer;
			&::before {
				content: "";
				display: block;
				padding-top: 100%;
			}
			&:nth-of-type(1) {
				border: none;
			}
			&:hover {
				.remove_icon {
					opacity: 1;
				}
			}
		}
		.remove_icon {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			font-size: 20px;
			transition: opacity 0.3s;
			opacity: 0;
			i {
				display: block;
				width: 20px;
				height: 20px;
				line-height: 20px;
				margin-left: auto;
				color: rgb(192, 192, 192);
				font-size: 14px;
				text-align: center;
				transition: all 0.3s;
				&:hover {
					color: #838181;
				}
			}
		}
		img {
			position: absolute;
			left: 0;
			top: 0;
			bottom: 0;
			right: 0;
			margin: auto;
		}
	}
}
</style>
