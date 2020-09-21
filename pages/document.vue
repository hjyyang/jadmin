<template>
	<main id="document_page" class="page">
		<div class="wrap">
			<h1>Api 文档</h1>
			<div class="list" ref="do_list">
				<div class="list-wrap" @input="isChangeEv">
					<el-collapse accordion v-model="activeItem" @change="changeOpen">
						<el-collapse-item
							class="dom_item"
							v-for="(item1, key1, index1) in listData"
							:key="index1"
							:name="index1 + 1"
						>
							<template slot="title">
								<span class="title">{{ key1 }}</span>
								<i
									class="header-icon el-icon-circle-plus"
									slot="reference"
									@click.stop="addItem(key1)"
									v-if="isAdmin"
									v-show="activeItem == index1 + 1"
								></i>
							</template>
							<el-collapse accordion @change="handleChange">
								<el-collapse-item
									:class="[
										item2.method,
										'api_item',
										editState ? 'editing' : ''
									]"
									:edit-state="editState ? 'editing' : ''"
									v-for="(item2, index2) in item1"
									:key="index2"
								>
									<template slot="title">
										<div class="method">{{ item2.method }}</div>
										<span class="title">{{ item2.path }}</span>
										<el-popconfirm
											title="确定删除吗？"
											confirmButtonType="danger"
											@onConfirm="removeItem(key1, index2,item2.id)"
											v-if="isAdmin"
										>
											<i class="header-icon el-icon-remove" slot="reference" @click.stop></i>
										</el-popconfirm>
									</template>
									<div class="edit_wrap" v-if="isAdmin">
										<el-button
											class="edit_btn"
											:type="item2.method == 'Get' ? 'primary' : 'success'"
											size="mini"
											:data-key="key1"
											:data-index="index2"
										>{{ isChange ? "保存":"编辑" }}</el-button>
									</div>
									<div class="j_row">
										<div class="method_wrap j_col_8">
											<h4 class="sub_title">Method</h4>
											<div class="content edit_content">{{ item2.method }}</div>
											<el-radio-group v-model="item2.method" class="edit">
												<el-radio v-for="(val, key, i) in method" :key="i" :label="key">{{ key }}</el-radio>
											</el-radio-group>
										</div>
										<div class="path_wrap j_col_8">
											<h4 class="sub_title">Path</h4>
											<div class="content edit_content">{{ item2.path }}</div>
											<el-input class="edit" size="mini" v-model="item2.path"></el-input>
										</div>
									</div>
									<div class="describe">
										<h4 class="sub_title">Describe</h4>
										<div class="content edit_content">{{ item2.describe }}</div>
										<el-input class="edit" size="mini" v-model="item2.describe"></el-input>
									</div>
									<div class="parameters">
										<div class="par_head">
											<h4 class="sub_title">Parameters</h4>
											<i
												class="header-icon el-icon-circle-plus add_par"
												:data-key="key1"
												:data-index="index2"
												slot="reference"
											></i>
										</div>
										<div class="p_item" v-for="(item3, index3) in item2.parameters" :key="index3">
											<div class="name">
												<div class="edit_content">
													{{ item3.name }}
													<span style="color: red;" class="required" v-if="item3.requireds">*</span>:
												</div>
												<div class="input_wrap">
													<el-input class="edit" size="mini" v-model="item3.name"></el-input>
													<i
														class="header-icon el-icon-remove remove_par"
														:data-key="key1"
														:data-index="index2"
														:data-selfIndex="index3"
													></i>
												</div>
											</div>
											<div class="detail">
												<template v-for="(val, key3, i) in item3">
													<template v-if="key3!='dom_relationships' && key3!='id'">
														<div class="p_row" :key="i" v-if="key3 != 'name' && key3 != 'requireds'">
															<div class="key">{{ key3 }}:</div>
															<div class="value edit_content">{{ val }}</div>
															<el-input class="edit" size="mini" v-model="item3[key3]"></el-input>
														</div>
														<div class="p_row" :key="i" v-else-if="key3 == 'requireds'">
															<div class="key">{{ key3 }}:</div>
															<div class="value edit_content">{{ val }}</div>
															<el-switch class="edit" v-model="item3[key3]" @change="isChangeEv"></el-switch>
														</div>
													</template>
												</template>
											</div>
										</div>
									</div>
								</el-collapse-item>
							</el-collapse>
						</el-collapse-item>
					</el-collapse>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	transition: "slide",
	head: {
		title: "jadmin-document",
	},
	data() {
		return {
			activeItem: null,
			listData: {}, //列表数据
			method: {
				//请求方法
				Get: 1,
				Post: 2,
			},
			editState: false, //编辑框是否显示
			isAdmin: this.$store.state.authUser.u_role > 1, //判断是否为超级管理员
			isChange: false, //是否有改变列表数据
			listDataStr: "", //列表数据序列化字符串
		};
	},
	methods: {
		async showEdit(e) {
			//点击编辑按钮后显示所有的编辑框并隐藏内容
			if (this.editState && this.isChange) {
				//已打开编辑且改变api内容，保存修改api
				let key = e.dataset.key,
					index = e.dataset.index;
				if (!key || !index) return false;
				let apiItem = this.listData[key][index];
				let res = await this.$request.updateDomList({
					aid: apiItem.id,
					path: apiItem.path,
					method: apiItem.method,
					describe: apiItem.describe,
					title: apiItem.title,
					parameters: apiItem.parameters,
				});
				if (res.data.code == 8888) {
					this.$message({
						message: "已修改",
						type: "success",
					});
					this.listDataStr = JSON.stringify(this.listData);
					this.editState = !this.editState;
					this.isChangeEv();
				} else {
					this.$message.error("修改失败");
				}
			} else {
				//打开编辑api
				this.listDataStr = JSON.stringify(this.listData);
				this.editState = !this.editState;
			}
		},
		handleChange(val) {
			//关闭折叠面板后清除属性
			this.editState = false;
		},
		async removeItem(key, index, id) {
			//删除api
			console.log(key, index, id);
			let res = await this.$request.removeDomList({
				rid: id,
			});
			if (res.data.code == 8888) {
				//删除成功
				if (key == undefined || index == undefined) return false;
				this.listData[key].splice(index, 1);
				this.listDataStr = JSON.stringify(this.listData);
				this.$message({
					message: "已删除",
					type: "success",
				});
			} else {
				this.$message.error("删除失败");
			}
		},
		async addItem(key) {
			//添加接口item
			let api = {
				title: key,
				describe: "",
				method: "Get",
				path: "/no_auth",
				parameters: [],
			};
			let res = await this.$request.addDomList({
				title: key,
				describe: "",
				method: "Get",
				path: "/no_auth",
			});
			if (res.data.code == 8888) {
				this.listDataStr = JSON.stringify(this.listData);
				api.id = res.data.id;
				this.listData[key].unshift(api);
			}
		},
		changeOpen(index) {
			if (!index) {
				//下拉收起时改变隐藏状态
				this.activeItem = null;
			}
		},
		async getData() {
			let res = await this.$request.getDomList(),
				data = res.data;
			if (data.code == 8888) {
				console.log(data.d_list);
				this.listData = data.d_list;
			}
		},
		isChangeEv() {
			//判断是否有修改
			setTimeout(() => {
				if (this.listDataStr == JSON.stringify(this.listData)) {
					this.isChange = false;
				} else {
					this.isChange = true;
				}
			}, 200);
		},
		clickListener(e) {
			//页面点击事件监听do_list
			let ev = e || window.event,
				target = ev.target || ev.srcElement,
				classArr = target.classList.value.split(" ");
			while (classArr.indexOf("list") == -1) {
				if (classArr.indexOf("add_par") != -1) {
					//添加参数
					this.parHandle(target, true);
				} else if (classArr.indexOf("remove_par") != -1) {
					//删除参数
					this.parHandle(target, false);
				} else if (classArr.indexOf("edit_btn") != -1) {
					//打开编辑框
					this.showEdit(target);
				} else if (classArr.indexOf("edit_content") != -1) {
					//复制内容
					this.$Events.copyCentent(e);
				}

				target = target.parentNode; //往上级节点移动
				classArr = target.classList.value.split(" ");
			}
		},
		parHandle(e, lock) {
			//添加删除参数
			let key = e.dataset.key,
				index = e.dataset.index,
				parArr = this.listData[key][index].parameters,
				arg = {
					requireds: false,
					value: "",
					type: "String",
					name: "",
				};
			if (lock) {
				//添加参数
				parArr.unshift(arg);
			} else {
				//删除参数
				let parIndex = e.dataset.selfindex;
				parArr.splice(parIndex, 1);
			}
			this.isChangeEv();
		},
	},
	mounted() {
		this.getData();
		this.$refs.do_list.addEventListener("click", this.clickListener, false);
	},
	beforeDestroy() {
		this.$refs.do_list.removeEventListener(
			"click",
			this.clickListener,
			false
		);
	},
};
</script>

<style lang="scss">
#document_page {
	h1 {
		margin-bottom: 30px;
	}
	.dom_item {
		> .el-collapse-item__wrap {
			border-bottom: none;
			> .el-collapse-item__content {
				padding-bottom: 0;
			}
		}
		> div {
			> .el-collapse-item__header {
				font-size: 16px;
			}
		}
	}
	.api_item {
		position: relative;
		border-bottom: none;
		.method {
			min-width: 80px;
			height: 32px;
			line-height: 20px;
			margin-right: 20px;
			padding: 6px 15px;
			font-size: 14px;
			color: #ffffff;
			text-align: center;
			border-radius: 3px;
			text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
		}
		&.Post {
			color: #49cc90;
			.method {
				background: #49cc90;
			}
			.name {
				color: #49cc90;
			}
			.detail {
				background-color: rgba(73, 204, 144, 0.1);
			}
			input {
				// border-color: #49cc90;
			}
			.el-radio__input.is-checked {
				.el-radio__inner {
					background: #13ce66;
					border-color: #13ce66;
				}
				+ .el-radio__label {
					color: #13ce66;
					border-color: #13ce66;
				}
			}
			.el-switch.is-checked .el-switch__core {
				background: #13ce66;
				border-color: #13ce66;
			}
		}
		&.Get {
			color: #61affe;
			.method {
				background: #61affe;
			}
			.name {
				color: #61affe;
			}
			.detail {
				background-color: rgba(97, 175, 254, 0.1);
			}
		}
		.el-collapse-item__header {
			display: flex;
			align-items: center;
			font-weight: bold;
			font-size: 16px;
			color: inherit;
		}
		&.editing {
			.edit_content {
				display: none;
			}
			.edit,
			.add_par {
				display: block;
			}
			.input_wrap {
				display: flex;
			}
		}
		.edit_content {
			height: 28px;
			line-height: 28px;
			font-size: 14px;
			cursor: pointer;
			// font-weight: bold;
		}
	}
	span.button,
	.header-icon {
		width: 30px;
		height: 30px;
		line-height: 30px;
		margin-left: auto;
		text-align: center;
		font-size: 20px;
	}
	span.title {
		margin-right: auto;
	}
	.el-collapse-item__arrow {
		margin-left: 30px;
	}
	.par_head {
		display: flex;
		align-items: center;
		.header-icon {
			display: none;
			margin-right: 50px;
			cursor: pointer;
		}
	}
	h4.sub_title {
		margin: 10px 0 10px;
		font-size: 15px;
	}
	.p_item {
		display: flex;
		margin-bottom: 10px;
		&:last-of-type {
			margin-bottom: 0;
		}
		.name {
			width: 16%;
			padding: 5px 10px 5px 0;
			font-size: 14px;
			font-weight: bold;
		}
	}
	.input_wrap {
		display: none;
		.remove_par {
			margin-left: 10px;
			cursor: pointer;
		}
	}
	.j_row {
		.j_col_8 {
			width: 48%;
			&:nth-of-type(2n) {
				margin-left: auto;
			}
		}
	}
	.edit {
		display: none;
	}
	.edit_wrap {
		button {
			display: block;
			margin-left: auto;
			margin-right: 40px;
		}
	}
	.detail {
		width: 84%;
		padding: 10px 20px;
		border-radius: 4px;
		background: #41444e;
		// color: #ffffff;
	}
	.p_row {
		display: flex;
		min-height: 28px;
		margin-bottom: 10px;
		&:last-of-type {
			margin-bottom: 0;
		}
		.key {
			width: 10%;
			font-weight: 600;
		}
		.value {
			width: calc(90% - 40px);
		}
	}
}
</style>
