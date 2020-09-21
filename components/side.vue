<template>
	<nav id="admin_side" :class="open ? 'isClose': ''">
		<div class="logo">
			<a href="/">
				<img src="~/static/logo.png" alt />
			</a>
		</div>
		<div class="j_ment">
			<el-menu
				:default-active="$route.path"
				class="el-menu-vertical-demo"
				:router="true"
				background-color="#1d1e23"
				text-color="hsla(0,0%,100%,.7)"
				active-text-color="#fff"
				:collapse="open"
			>
				<el-menu-item index="/">
					<i class="el-icon-s-data"></i>
					<span>数据</span>
				</el-menu-item>
				<el-menu-item index="/post">
					<i class="el-icon-edit-outline"></i>
					<span>文章</span>
				</el-menu-item>
				<el-menu-item index="/media">
					<i class="el-icon-picture"></i>
					<span>媒体</span>
				</el-menu-item>
				<el-menu-item index="/document">
					<i class="el-icon-document"></i>
					<span>文档</span>
				</el-menu-item>
				<el-menu-item index="/users">
					<i class="el-icon-s-custom"></i>
					<span>用户</span>
				</el-menu-item>
				<el-menu-item index="/comments">
					<i class="el-icon-s-comment"></i>
					<span>评论</span>
				</el-menu-item>
				<el-menu-item index="/settings">
					<i class="el-icon-s-tools"></i>
					<span>设置</span>
				</el-menu-item>
			</el-menu>
		</div>
	</nav>
</template>

<script>
export default {
	data() {
		return {};
	},
	props: {
		open: {
			type: Boolean,
			default: false,
		},
	},
	methods: {},
};
</script>

<style lang="scss" scoped>
#admin_side {
	position: fixed;
	top: 0;
	left: 0;
	z-index: 2;
	width: 180px;
	height: 100%;
	background: #1d1e23;
	transition: all 0.3s;
	&.isClose {
		width: 64px;
	}
}
.logo {
	display: flex;
	align-items: center;
	height: 65px;
	a {
		width: 40px;
		height: 40px;
		margin: 0 auto;
	}
}
.j_ment {
	height: calc(100% - 65px);
	overflow-y: auto;
}
.el-menu {
	border: none;
}
.el-submenu .el-menu-item {
	min-width: 180px;
}
</style>