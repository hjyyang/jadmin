<template>
	<main class="page">
		<section class="media">
			<div class="media_main">
				<div class="upload_container">
					<el-upload
						class="upload"
						drag
						ref="upload"
						action="/j_api/file/upload"
						:headers="uploadHeaders"
						:file-list="fileList"
						list-type="picture"
						multiple
						:before-upload="beforeAvatarUpload"
						:on-remove="deleteFile"
						:on-success="uploadSuccess"
						name="gallery"
						:http-request="uploadFile"
					>
						<i class="el-icon-upload"></i>
						<div class="el-upload__text">
							将文件拖到这里，或者
							<em>点击上传</em>
						</div>
						<div class="el-upload__tip" slot="tip">上传文件大小不能超过20MB</div>
						<div slot="file" slot-scope="{ file }" class="file_item" @click="fileDetail(file)" :name="file.name">
							<img :src="file.url" v-if="fileType(file.name) == 'image'" />
							<i class="el-icon-video-camera file_icon" v-else-if="fileType(file.name) == 'video'"></i>
							<i class="el-icon-document file_icon" v-else></i>
							<label class="el-upload-list__item-status-label" v-show="file.status == 'success'">
								<i class="el-icon-upload-success el-icon-check"></i>
							</label>
							<i class="el-icon-close" @click.stop="beforeRemove(file)"></i>
							<!-- <i class="el-icon-close-tip">press delete to remove</i> -->
						</div>
					</el-upload>
				</div>
			</div>
		</section>
		<el-dialog title="详情" :visible.sync="dialogVisible" width="50%" class="image_detail">
			<div class="container">
				<div class="rahmen">
					<img :src="currentFile.url" v-if="fileType(currentFile.suffix) == 'image'" />
					<template v-else-if="fileType(currentFile.suffix) == 'video'">
						<video :src="currentFile.url" controls width="100%"></video>
					</template>
				</div>
				<div class="detail">
					<div class="row">
						<label>文件名:</label>
						<div>
							<span v-show="!editStatus">{{ currentFile.name }}</span>
							<el-input v-show="editStatus" v-model="currentFile.name" size="mini"></el-input>
						</div>
					</div>
					<div class="row">
						<label>文件路径:</label>
						<div @click="$Events.copyCentent($event)">{{ currentFile.url }}</div>
					</div>
					<div class="row">
						<label>文件大小:</label>
						<div>{{ currentFile.size }}</div>
					</div>
					<div class="row">
						<label>文件类型:</label>
						<div>{{ fileType(currentFile.suffix) }}</div>
					</div>
					<div class="row">
						<label>文件格式:</label>
						<div>{{ currentFile.suffix }}</div>
					</div>
					<div class="row">
						<el-button type="primary" size="mini" :loading="saveStatus" @click="rename">{{
							!editStatus ? "修改" : currentFile.name === oldName ? "修改" : "保存"
						}}</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
	</main>
</template>

<script>
export default {
	transition: "slide",
	data() {
		return {
			formData: null,
			fileList: [],
			//element的file-list属性是只读读，如果改变它读值，在同时上传多个文件时会报错
			uploadHeaders: {},
			timer: null,
			dialogVisible: false,
			currentFile: {
				name: "",
				url: "",
				suffix: "",
				size: 0,
			},
			currentIndex: 0,
			editStatus: false, //文件详情编辑状态
			oldName: "",
			saveStatus: false,
		};
	},
	mounted() {
		this.uploadHeaders.authorization = "Bearer " + this.$store.state.authUser.token;
		this.formData = new FormData();
		this.getFileList();
	},
	methods: {
		beforeRemove(file) {
			this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning",
			})
				.then(() => {
					this.deleteFile(file);
				})
				.catch(() => {});
		},
		async deleteFile(file) {
			let res = await this.$request.deteleFile({
				url: file.url,
			});
			if (res.data.code === 8888) {
				this.fileList.splice(this.fileList.indexOf(file), 1);
				this.$message({
					type: "success",
					message: "删除成功!",
				});
			}
		},
		beforeAvatarUpload(file) {
			const isLt20M = file.size / 1024 / 1024 < 3;
			if (!isLt20M) {
				this.$message.error("上传文件大小不能超过 20MB!");
			}
			return isLt20M;
		},
		//自定义上传事件
		uploadFile(file) {
			if (file.data) {
				Object.keys(file.data).forEach((key) => {
					this.formData.append(key, file.data[key]);
				});
			}
			this.formData.append(file.filename, file.file, file.file.name);
			let self = this;
			window.clearTimeout(this.timer);
			this.timer = setTimeout(async () => {
				try {
					let res = await self.$request.uploadFile(self.formData, {
						onUploadProgress(e) {
							//上传进度
							if (e.total > 0) {
								e.percent = (e.loaded / e.total) * 100;
							}
							file.onProgress(e);
						},
					});
					self.formData = new FormData();
					if (res.data.code == 8888) {
						//上传成功
						file.onSuccess(res.data);
						// self.fileList = self.fileList.concat(res.data.filesList);
					}
				} catch (error) {
					//上传失败
					file.onError(error);
				}
			}, 50);
		},
		//上传成功回调事件
		uploadSuccess(res, file, fList) {
			let i = res.filesList.length - 1,
				number = fList.length - res.filesList.length;
			for (i; i > -1; i--) {
				fList[number + i].name = res.filesList[i].name;
				fList[number + i].url = res.filesList[i].url;
				fList[number + i].status = "success";
			}
			this.fileList = fList;
		},
		//判断文件类型
		fileType(value) {
			if (!value) return false;
			let img = /(png|jpg|gif|jpeg|svg)$/i,
				video = /(mp3|mp4|avi|ogv)$/i;
			if (!value) {
				throw "File format error";
			}
			if (img.test(value)) {
				//是否是图片类型
				return "image";
			} else if (video.test(value)) {
				//是否是视频类型
				return "video";
			} else {
				return "document";
			}
		},
		//查看文件详情
		fileDetail(file) {
			this.currentIndex = this.fileList.indexOf(file);
			this.currentFile = Object.assign(this.currentFile, file);
			this.currentFile.suffix = this.postfix(this.currentFile.url).suffix;
			this.currentFile.name = this.postfix(this.currentFile.url).name;
			this.dialogVisible = true;
		},
		//获取文件列表
		async getFileList() {
			let res = await this.$request.findFile();
			if (res.data.code === 8888) {
				this.fileList = res.data.filesList;
			}
		},
		//修改文件名
		async rename() {
			if (!this.editStatus) {
				//点击修改文件名
				this.editStatus = true;
				this.oldName = this.currentFile.name;
			} else {
				//点击保存
				if (this.currentFile.name !== this.oldName) {
					let oldUrl = this.currentFile.url,
						newUrl = oldUrl.split("/");
					newUrl[newUrl.length - 1] = this.currentFile.name + "." + this.currentFile.suffix;
					newUrl = newUrl.join("/");
					this.saveStatus = true;
					try {
						let res = await this.$request.updateFile({
							url: oldUrl,
							newUrl: newUrl,
						});
						console.log(res.data);
						if (res.data.code === 8888) {
							this.fileList[this.currentIndex].url = this.currentFile.url = res.data.url;
							this.fileList[this.currentIndex].name = this.postfix(res.data.url).fullName;
							this.currentFile.name = this.postfix(res.data.url).name;
						} else {
							this.$message.error("文件地址有误");
						}
						this.saveStatus = false;
						this.editStatus = false;
					} catch (error) {
						this.editStatus = false;
						throw error;
					}
				} else {
					this.editStatus = false;
				}
			}
		},
		//根据获取文件后缀与文件名
		postfix(url) {
			let directoryArr = [],
				fileObj = {};
			if (url.indexOf("/") != -1) {
				directoryArr = url.split("/");
			} else if (url.indexOf("\\") != -1) {
				directoryArr = url.split("\\");
			} else {
				return url;
			}
			fileObj.fullName = directoryArr[directoryArr.length - 1];
			fileObj.name = fileObj.fullName.split(".")[0];
			fileObj.suffix = fileObj.fullName.split(".")[1];
			return fileObj;
		},
	},
};
</script>

<style lang="scss">
.media {
	box-sizing: border-box;
	.el-upload-dragger {
		max-width: 100%;
	}
	.el-upload {
		width: 100%;
		padding: 40px 20px;
		box-sizing: border-box;
		border: 1px solid #eeeeee;
		background: #ffffff;
		border-radius: 6px;
		transition: all 0.2s ease-in-out;
		&:hover {
			box-shadow: 0 0px 7px rgba(0, 0, 0, 0.1);
		}
		.el-upload-dragger {
			margin: 0 auto;
		}
	}
	.el-upload-list {
		display: flex;
		flex-wrap: wrap;
		padding-top: 10px;
		margin-left: -20px;
		li {
			position: relative;
			width: calc(12.5% - 20px);
			height: auto;
			margin-left: 20px;
			margin-top: 20px;
			padding: 0px;
			cursor: pointer;
			&::before {
				content: "";
				display: block;
				padding-top: 100%;
			}
			&:hover {
				.file_item::before {
					opacity: 1;
				}
				i.el-icon-close {
					color: #ffffff;
				}
			}
		}
		img {
			position: absolute;
			left: 0;
			right: 0;
			bottom: 0;
			top: 0;
			float: none;
			width: auto;
			height: auto;
			margin: auto;
		}
		label,
		i.el-icon-close {
			z-index: 3;
		}
		.file_item {
			position: absolute;
			left: 0;
			top: 0;
			width: 100%;
			height: 100%;
			&::before {
				content: attr(name);
				position: absolute;
				z-index: 2;
				left: 0;
				top: 0;
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 100%;
				background-color: rgba($color: #000000, $alpha: 0.6);
				transition: all 0.3s;
				opacity: 0;
				color: #ffffff;
				font-size: 16px;
			}
			i.file_icon {
				position: absolute;
				left: 0;
				right: 0;
				bottom: 0;
				top: 0;
				float: none;
				width: 40px;
				height: 40px;
				font-size: 40px;
				margin: auto;
			}
		}
	}
	@media (max-width: 1024px) {
		.el-upload-list {
			li {
				width: calc(20% - 20px);
			}
		}
	}
	@media (max-width: 540px) {
		padding: 30px 10px;
		.el-upload-list {
			margin-left: -10px;
			li {
				width: calc(25% - 10px);
				margin-left: 10px;
				margin-top: 10px;
			}
		}
	}
}
.image_detail {
	.el-dialog__header {
		padding: 20px;
		border-bottom: 1px dashed #dfe6ec;
		background-color: #f4f9ff;
		font-weight: bold;
	}
	.el-dialog__body {
		padding: 0px;
	}
	.container {
		display: flex;
	}
	.rahmen {
		display: flex;
		align-items: center;
		width: 70%;
		padding: 30px 20px;
	}
	.detail {
		width: 30%;
		padding: 30px 15px;
		border-left: 1px dashed #dfe6ec;
		background-color: #f4f9ff;
		.row {
			margin-bottom: 16px;
			&:last-of-type {
				margin-top: 100px;
			}
			div {
				line-height: 1.5;
			}
		}
		label {
			display: block;
			margin-bottom: 6px;
			font-weight: bold;
		}
		button {
			display: block;
			margin: 0 auto;
		}
	}
}
</style>
