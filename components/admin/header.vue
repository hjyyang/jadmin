<template>
	<header id="admin_header" :style="open ? 'width: calc(100% - 64px);' : ''">
		<div class="wrap">
			<div class="header_trigger" @click="sideHide">
				<i class="el-icon-s-fold"></i>
			</div>
			<div class="message">
				<i class="el-icon-message-solid"></i>
			</div>
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
			avatar: ""
		};
	},
	props: {
		open: {
			type: Boolean,
			default: false
		}
	},
	methods: {
		sideHide() {
			this.$emit("sideChange");
		},
		handleCommand(command){
			if(command == "/logout"){
                this.$confirm("确定退出登录吗?", "提示", {
				confirmButtonText: "确定",
				cancelButtonText: "取消",
				type: "warning"
			})
				.then(() => {
					this.$store.dispatch("logout");
                    this.$message({
                        type: "success",
                        message: "已退出!"
                    });
                    this.$router.push({
                        path: "/"
                    })
				})
				.catch(() => {});
			}else{
				this.$router.push({
					path: command
				})
			}
		}
	}
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
		transition: all 0.3s;
		&:hover {
			background: rgba(246, 202, 157, 0.05);
		}
	}
	.message {
		width: 36px;
		height: 36px;
		line-height: 36px;
		margin-left: auto;
		text-align: center;
		font-size: 20px;
		color: #ffffff;
	}
}
</style>