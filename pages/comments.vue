<template>
	<div class="comments">
		<a href="http://localhost:8080/j_api/data/visit?uid=12&type=1&name=test&duration=60" target="_blank">test</a>
		<button @click="test">test2</button>
	</div>
</template>

<script>
export default {
	methods: {
		async test() {
			let res = await this.$axios({
				method: "get",
				url: "http://localhost:8080/j_api/data/visit?uid=12&type=1&name=test&duration=60",
			});
		},
	},
	async asyncData(app) {
		console.log(app.from);
	},
};
</script>

<style></style>
