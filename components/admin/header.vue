<template>
	<header id="admin_header" :style="open ? 'width: calc(100% - 64px);' : ''">
		<div class="wrap">
			<div class="header_trigger" @click="sideHide">
				<i class="el-icon-s-fold"></i>
			</div>
			<div class="user">
				<el-dropdown @command="handleCommand">
					<el-avatar :size="'medium'" :src="avatar" icon="el-icon-s-custom"></el-avatar>
					<el-dropdown-menu slot="dropdown" class="app_dropdown">
						<el-dropdown-item icon="el-icon-user" command="/aboutMe">我的资料</el-dropdown-item>
						<el-dropdown-item icon="el-icon-switch-button" command="/logout">注销</el-dropdown-item>
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
				this.$store.dispatch("logout");
				this.$message({
					type: "success",
					message: "已退出!"
				});
				this.$router.push({
					path: "/"
				})
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
		margin-left: auto;
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
}
</style>