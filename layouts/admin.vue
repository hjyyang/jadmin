<template>
	<div id="admin_layout">
		<Side :open="sideOPen" />
		<div class="main" :style="sideOPen ? 'padding-left: 64px;' :''">
			<Header @sideChange="sideChange" :open="sideOPen" />
			<nuxt />
		</div>
	</div>
</template>
<script>
import Header from "../components/admin/header";
import Side from "../components/admin/side";
export default {
	components: {
		Header,
		Side
	},
	data() {
		return {
			pageName:
				this.$route.path.split("/")[
					this.$route.path.split("/").length - 1
				] + "_page",
			sideOPen: false
		};
	},
	mounted() {
		//挂载时修改body的class
		this.addBodyClass();
		//新增窗口大小响应监听
		this.resize(true);
		//默认执行一次窗口大小判断
		this.handleEvent();
	},
	beforeDestroy() {
		//销毁前去除body的class
		this.removeBodyClass();
		//去除窗口大小响应监听
		this.resize(false);
	},
	methods: {
		addBodyClass() {
			document.body.classList.add(this.pageName);
		},
		removeBodyClass() {
			document.body.classList.remove(this.pageName);
		},
		sideChange() {
			//侧边导航菜单收起打开
			this.sideOPen = !this.sideOPen;
		},
		resize(state) {
			if (state) {
				window.addEventListener("resize", this, false);
			} else {
				window.removeEventListener("resize", this, false);
			}
		},
		handleEvent() {
			//定制函数handleEvent是当addEventListener的第二个参数为一个对象时，默认执行的方法，
			//这样可以做到改变this的指向，又能删除监听事件
			//修改侧边导航打开关闭状态
			if (window.innerWidth <= 1024) {
				this.sideOPen = true;
			} else {
				this.sideOPen = false;
			}
		}
	},
	watch: {
		$route: {
			handler: function(to, from) {
				//监听路由变化修改body的class
				this.removeBodyClass();
				this.pageName =
					to.path.split("/")[to.path.split("/").length - 1] + "_page";
				this.addBodyClass();
			},
			// 深度观察监听
			deep: true
		}
	}
};
</script>
<style lang="scss">
#admin_layout {
	height: 100%;
	background-color: #f7f7f7;
	main.page {
		height: 100%;
		padding: 15px 15px 0;
		overflow-y: auto;
		> .wrap {
			padding: 20px;
			margin-bottom: 15px;
			background-color: #fff;
			box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.1);
		}
	}
	.main {
		height: 100%;
		padding-top: 65px;
		padding-left: 180px;
		transition: all 0.3s;
	}
}
</style>