<template>
	<nav id="admin_side" :class="open ? 'isClose': ''">
		<div class="logo">
			<nuxt-link to="/">
				<img src="~/static/logo.png" alt />
			</nuxt-link>
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
				<el-menu-item index="/admin">
					<i class="el-icon-s-data"></i>
					<span>数据</span>
				</el-menu-item>
				<el-submenu index="/admin/post">
					<template slot="title">
						<i class="el-icon-edit-outline"></i>
						<span>文章</span>
					</template>
					<el-menu-item index="/admin/post">
						<i class="el-icon-tickets"></i>
						<span>列表</span>
					</el-menu-item>
					<el-menu-item index="/admin/post/edit">
						<i class="el-icon-circle-plus"></i>
						<span>新增</span>
					</el-menu-item>
					<el-menu-item index="/admin/class">
						<i class="el-icon-menu"></i>
						<span>分类</span>
					</el-menu-item>
				</el-submenu>
				<el-menu-item index="/admin/media">
					<i class="el-icon-picture"></i>
					<span>媒体</span>
				</el-menu-item>
				<el-menu-item index="/admin/document">
					<i class="el-icon-document"></i>
					<span>文档</span>
				</el-menu-item>
				<el-menu-item index="/admin/users">
					<i class="el-icon-s-custom"></i>
					<span>用户</span>
				</el-menu-item>
				<el-menu-item index="/admin/comments">
					<i class="el-icon-s-comment"></i>
					<span>评论</span>
				</el-menu-item>
				<el-menu-item index="/admin/settings">
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
			default: false
		}
	},
	methods: {}
};
</script>

<style lang="scss" scoped>
#admin_side {
	position: fixed;
	top: 0;
	left: 0;
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