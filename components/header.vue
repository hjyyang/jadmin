<template>
	<header id="admin_header" :style="open ? 'width: calc(100% - 64px);' : ''">
		<div class="wrap">
			<div class="header_trigger" @click="sideHide">
				<i class="el-icon-s-fold"></i>
			</div>
			<el-dropdown trigger="click">
				<div class="message">
					<i class="el-icon-message-solid"></i>
				</div>
				<el-dropdown-menu slot="dropdown" class="app_notifications">
					<div class="notifications">
						<div class="header">
							<ul>
								<li :class="{ current: showTab == 0 }" @click="handleTab(0)">通知</li>
								<li :class="{ current: showTab == 1 }" @click="handleTab(1)">回复</li>
							</ul>
						</div>
						<div class="main">
							<transition :name="transitionName">
								<div class="item" v-show="showTab == 0">
									<template v-for="item in notificationList">
										<div class="row" :key="item.id" :class="{ read: !item.read.status }">
											<nuxt-link
												:to="item.sort === noteSort.user ? '/users?_ea=' + item.id : item.sort === noteSort.warn ? '' : ''"
												target="_blank"
											>
												<div class="icon" :class="{ warn: item.sort === noteSort.warn }">
													<i class="el-icon-s-custom" v-if="item.sort === noteSort.user"></i>
													<i class="el-icon-warning" v-else-if="item.sort === noteSort.warn"></i>
												</div>
												<div class="content">
													<div class="info">{{ item.message }}</div>
													<div class="time">{{ $tool.dateFormat(new Date(item.createdAt)) }}</div>
												</div>
											</nuxt-link>
										</div>
									</template>
									<div class="more" :class="{ noMore: noMore1 }" v-if="notificationList.length > 0" @click="handleMore(noMore1)">
										<i class="el-icon-loading" v-show="loading"></i> {{ noMore1 ? "没有更多数据了。。。" : "加载更多" }}
									</div>
								</div>
							</transition>
							<transition :name="transitionName">
								<div class="item" v-show="showTab == 1">
									<template v-for="item in replys">
										<div class="row" :key="item.id">
											<nuxt-link to="">
												<div class="icon message">
													<i class="el-icon-chat-dot-square"></i>
												</div>
												<div class="content">
													<div class="info">{{ item.message }}</div>
													<div class="time">{{ $tool.dateFormat(new Date(item.createdAt)) }}</div>
												</div>
											</nuxt-link>
										</div>
									</template>
									<div class="more" :class="{ noMore: noMore2 }" v-if="replys.length > 0" @click="handleMore(noMore2)">
										<i class="el-icon-loading" v-show="loading"></i> {{ noMore2 ? "没有更多数据了。。。" : "加载更多" }}
									</div>
									<div class="no_data"></div>
								</div>
							</transition>
						</div>
						<div class="clear"><i class="el-icon-check"></i> 全部标记为已读</div>
					</div>
				</el-dropdown-menu>
			</el-dropdown>
			<div class="user">
				<el-dropdown @command="handleCommand">
					<el-avatar class="face" :size="36" :src="avatar" @error="true">
						<i class="el-icon-s-custom"></i>
					</el-avatar>
					<el-dropdown-menu slot="dropdown" class="app_dropdown">
						<el-dropdown-item icon="el-icon-user" command="/about-me">我的</el-dropdown-item>
						<el-dropdown-item icon="el-icon-switch-button" command="/logout">退出</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</div>
		</div>
	</header>
</template>

<script>
export default {
	data() {
		return {
			avatar: "",
			showTab: 0,
			transitionName: "",
			notificationList: [],
			replys: [],
			page: 1,
			noMore1: false,
			noMore2: false,
			loading: false,
			noteSort: {
				user: 1,
				warn: 2,
			},
		};
	},
	props: {
		open: {
			type: Boolean,
			default: false,
		},
		user: {
			type: Object,
			default: () => {},
		},
	},
	created() {
		this.getNotification();
	},
	methods: {
		sideHide() {
			this.$emit("sideChange");
		},
		handleCommand(command) {
			if (command == "/logout") {
				this.$confirm("确定退出登录吗?", "提示", {
					confirmButtonText: "确定",
					cancelButtonText: "取消",
					type: "warning",
				})
					.then(() => {
						this.$store.dispatch("logout");
						this.$message({
							type: "success",
							message: "已退出!",
						});
						this.$router.push({
							path: "/login",
						});
					})
					.catch(() => {});
			} else {
				this.$router.push({
					path: command,
				});
			}
		},
		handleTab(index) {
			if (this.showTab > index) {
				this.transitionName = "tab-slide-left";
			} else {
				this.transitionName = "tab-slide-right";
			}
			this.showTab = index;
		},
		async getNotification() {
			let res = await this.$request.findNotification({
				page: this.page,
				uid: this.user.u_id,
			});
			if (res.data.code === 8888) {
				console.log(res.data.list);
				let data = res.data.list,
					notes = 0,
					replys = 0;
				data.forEach((item) => {
					if (item.type === 3) {
						notes++;
						this.notificationList.push(item);
					} else {
						replys++;
						this.replys.push(item);
					}
				});
				if (notes === 0) {
					this.noMore1 = true;
				}
				if (replys === 0) {
					this.noMore2 = true;
				}
			}
		},
		async handleMore(lock) {
			if (lock) return false;
			this.loading = true;
			this.page++;
			await this.getNotification();
			this.loading = false;
		},
	},
};
</script>

<style lang="scss">
@import "../assets/style/variable.scss";
#admin_header {
	position: fixed;
	width: calc(100% - 180px);
	right: 0;
	top: 0;
	z-index: 1500;
	display: flex;
	align-items: center;
	height: 65px;
	box-shadow: 0 1px 1px rgba(0, 0, 0, 0.08);
	background: linear-gradient(90deg, #1d1e23, #3f4045);
	color: #f6ca9d;
	transition: all 0.3s;
	.wrap {
		display: flex;
		align-items: center;
		width: 100%;
	}
	.user {
		margin-left: 20px;
		margin-right: 20px;
	}
	.header_trigger {
		width: 64px;
		height: 64px;
		line-height: 64px;
		text-align: center;
		cursor: pointer;
		font-size: 20px;
		margin-right: auto;
		transition: all 0.3s;
		&:hover {
			background: rgba(246, 202, 157, 0.05);
		}
	}
	.message {
		width: 64px;
		height: 64px;
		line-height: 64px;
		text-align: center;
		font-size: 20px;
		color: #ffffff;
		cursor: pointer;
		transition: all 0.3s;
		outline: none;
		&:hover {
			background: rgba(246, 202, 157, 0.05);
		}
	}
}
.app_notifications.el-dropdown-menu {
	padding-bottom: 0;
}
.notifications {
	width: 260px;
	overflow-x: hidden;
	.header {
		border-bottom: 1px solid #e4e4e4;
		color: #515a6e;
		ul {
			display: flex;
		}
		li {
			position: relative;
			flex: 1;
			padding: 0px 0 10px;
			text-align: center;
			transition: all 0.3s;
			cursor: pointer;
			&.current {
				color: #57a3f3;
				&::before {
					opacity: 1;
				}
			}
			&::before {
				content: "";
				position: absolute;
				bottom: -1px;
				left: 50%;
				transform: translateX(-50%);
				width: 50%;
				height: 2px;
				background-color: #57a3f3;
				opacity: 0;
			}
		}
	}
	.main {
		display: flex;
		width: 200%;
		max-height: 360px;
		overflow-y: scroll;
	}
	.item {
		width: 260px;
	}
	.row {
		border-bottom: 1px solid #e4e4e4;
		&.read {
			background-color: rgba($color: #57a3f3, $alpha: 0.16);
		}
		a {
			display: flex;
			align-items: center;
			padding: 10px;
		}
	}
	.icon {
		width: 32px;
		height: 32px;
		line-height: 32px;
		border-radius: 50%;
		margin-right: 10px;
		text-align: center;
		background-color: rgb(51, 145, 229);
		color: #ffffff;
		&.warn {
			line-height: normal;
			background: none;
			color: rgb(226, 64, 64);
			i {
				margin-left: -2px;
				font-size: 34px;
			}
		}
	}
	.content {
		width: calc(100% - 32px);
		color: #515a6e;
		.info {
			margin-bottom: 4px;
			@include elps-wrap(1);
		}
		.time {
			font-size: 12px;
			color: #808695;
		}
	}
	.more {
		height: 32px;
		line-height: 30px;
		text-align: center;
		border-bottom: 1px solid #e4e4e4;
		color: #57a3f3;
		cursor: pointer;
		font-size: 12px;
		transition: all 0.3s;
		&:hover {
			color: #8abef5;
		}
		&.noMore {
			color: #b8b5b5;
			cursor: default;
		}
	}
	.clear {
		height: 40px;
		line-height: 40px;
		text-align: center;
		font-size: 12px;
		color: #515a6e;
		transition: all 0.3s;
		cursor: pointer;
		&:hover {
			color: #57a3f3;
		}
	}
}
</style>
