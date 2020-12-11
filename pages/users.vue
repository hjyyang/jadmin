<template>
	<main class="page admin-users">
		<div class="wrap">
			<div class="item" v-for="(item, index) in userList" :key="item.uid">
				<div class="row">
					<div class="face">
						<el-avatar :size="36" :src="item.face" @error="true">
							<i class="el-icon-s-custom"></i>
						</el-avatar>
					</div>
					<div class="name">{{ item.name }}</div>
				</div>
				<div class="row">
					<div>
						ID:
						<span>{{ item.uid }}</span>
					</div>
					<el-button class="copy" size="mini" @click="copyHandle($event)"> <i class="el-icon-document-copy"></i>复制 </el-button>
				</div>
				<div class="row">邮箱地址：{{ item.email }}</div>
				<div class="row">QQ： {{ item.qq }}</div>
				<div class="row">
					<el-tag :type="item.authEmail ? 'success' : 'danger'" size="small">{{ item.authEmail ? "已认证邮箱" : "未认证邮箱" }}</el-tag>
					<el-tag :type="item.role == 0 ? '' : 'warning'" size="small">{{ item.role == 0 ? "普通用户" : "管理员" }}</el-tag>
					<el-button size="mini" @click="openHandle(index)" v-if="myRole == 2 && myId != item.uid">
						<i class="el-icon-more"></i>
					</el-button>
				</div>
				<transition name="fade" mode="out-in" v-if="myRole == 2 && myId != item.uid">
					<div class="row handle" v-show="showItemHandle == index">
						<el-popconfirm
							confirmButtonText="确定"
							cancelButtonText="取消"
							title="确定将该用户设置为普通用户吗？"
							@onConfirm="changeRole(item.uid, 0, index)"
						>
							<el-button :disabled="item.role == 0" size="mini" slot="reference" type="primary">普通用户</el-button>
						</el-popconfirm>
						<el-popconfirm
							confirmButtonText="确定"
							cancelButtonText="取消"
							title="确定将该用户设置为管理员吗？"
							@onConfirm="changeRole(item.uid, 1, index)"
						>
							<el-button :disabled="item.role == 1" size="mini" slot="reference" type="primary">管理员</el-button>
						</el-popconfirm>
					</div>
				</transition>
			</div>
			<div class="paged" v-if="userList.length > 10">
				<el-pagination
					@current-change="currentChange"
					background
					layout="prev, pager, next"
					:total="userList.length"
					:page-size="2"
				></el-pagination>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	transition: "slide",
	data() {
		return {
			showItemHandle: null,
			userList: [],
			myRole: 1,
			myId: null,
		};
	},
	created() {
		this.getUserList(1);
	},
	mounted() {
		this.myRole = this.$store.state.authUser.role;
		this.myId = this.$store.state.authUser.id;
	},
	methods: {
		copyHandle(e) {
			this.$Events.copyCentent(e.path[1].querySelector("span"));
		},
		openHandle(index) {
			if (this.showItemHandle == index) {
				this.showItemHandle = null;
			} else {
				this.showItemHandle = index;
			}
		},
		async getUserList(page) {
			let res = await this.$request.userList({
				page: page,
			});
			console.log(res.data);
			if (res.data.code == 8888) {
				this.userList = res.data.list;
			}
		},
		currentChange(page) {
			this.getUserList(page);
		},
		async changeRole(uid, role, index) {
			let res = await this.$request.updateUser({
				uid: uid,
				role: role,
			});
			console.log(res.data);
			if (res.data.code === 8888) {
				this.userList[index].role = role;
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.admin-users {
	ul {
		padding: 0;
	}
	.item {
		padding: 10px 0;
		border-bottom: 1px solid #e8eaec;
	}
	.row {
		display: flex;
		align-items: center;
		margin-bottom: 6px;
		&.handle {
			padding-top: 4px;
			button {
				position: relative;
				margin-right: 30px;
				&::before {
					content: "";
					position: absolute;
					top: 50%;
					right: -16px;
					width: 1px;
					height: 14px;
					margin-top: -7px;
					background-color: #e8eaec;
				}
			}
			span:last-of-type {
				button::before {
					display: none;
				}
			}
		}
	}
	.face {
		width: 36px;
		height: 36px;
		border-radius: 50%;
		margin-right: 10px;
		overflow: hidden;
		.el-avatar {
			font-size: 18px;
		}
	}
	.name {
		font-size: 16px;
	}
	button {
		position: relative;
		height: 24px;
		line-height: 10px;
		&.copy {
			margin-left: 10px;
			i {
				margin-right: 6px;
			}
		}
		&::after {
			content: "";
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}
	}
	.el-tag {
		margin-right: 10px;
	}
}
</style>
