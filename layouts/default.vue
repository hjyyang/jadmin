<template>
	<div id="default_layout">
		<nuxt />
	</div>
</template>

<script>
export default {
	data() {
		return {
			pageName: this.$route.name + "-page"
		};
	},
	methods: {
		addBodyClass() {
			document.body.classList.add(this.pageName);
			document.body.classList.add("client");
		},
		removeBodyClass() {
			document.body.classList.remove(this.pageName);
			document.body.classList.remove("client");
		}
	},
	mounted() {
		//挂载时修改body的class
		this.addBodyClass();
	},
	beforeDestroy() {
		//销毁前去除body的class
		this.removeBodyClass();
	},
	watch: {
		$route: {
			handler: function(to, from) {
				//监听路由变化修改body的class
				this.removeBodyClass();
				this.pageName = to.name + "-page";
				this.addBodyClass();
			},
			// 深度观察监听
			deep: true
		}
	}
};
</script>