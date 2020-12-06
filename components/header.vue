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
								<li :class="{current: showTab==0}" @click="handleTab(0)">通知</li>
								<li :class="{current: showTab==1}" @click="handleTab(1)">回复</li>
							</ul>
						</div>
						<div class="main">
							<transition :name="transitionName">
								<div class="item" v-show="showTab==0">
									<div class="row">
										<div class="icon message">
											<i class="el-icon-chat-dot-square"></i>
										</div>
										<div class="content">
											<div class="info">有人回复你了</div>
											<div class="time">2019-05-08 14:33:18</div>
										</div>
									</div>
									<div class="more">加载更多</div>
								</div>
							</transition>
							<transition :name="transitionName">
								<div class="item" v-show="showTab==1">
									<div class="row">
										<div class="icon message">
											<i class="el-icon-chat-dot-square"></i>
										</div>
										<div class="content">
											<div class="info">有人回复你了</div>
											<div class="time">2019-05-08 14:33:18</div>
										</div>
									</div>
								</div>
							</transition>
						</div>
						<div class="clear">
							<i class="el-icon-delete-solid"></i> 清空
						</div>
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
		};
	},
	props: {
		open: {
			type: Boolean,
			default: false,
		},
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
	},
};
</script>

<style lang="scss">
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
		max-height: 290px;
		overflow-y: scroll;
	}
	.item {
		width: 50%;
	}
	.row {
		display: flex;
		align-items: center;
		padding: 10px;
		border-bottom: 1px solid #e4e4e4;
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
		&.warning {
			line-height: normal;
			background: none;
			color: rgb(243, 23, 23);
			i {
				margin-left: -2px;
				font-size: 34px;
			}
		}
	}
	.content {
		color: #515a6e;
		.info {
			margin-bottom: 4px;
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
	}
	.clear {
		height: 40px;
		line-height: 40px;
		text-align: center;
		color: #515a6e;
		transition: all 0.3s;
		cursor: pointer;
		&:hover {
			color: #57a3f3;
		}
	}
}
</style>