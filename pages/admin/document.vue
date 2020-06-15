<template>
	<main id="document_page" class="page">
		<div class="wrap">
			<nuxt-link to="/">home</nuxt-link>
			<nuxt-link to="/admin/document">test</nuxt-link>
			<div style="height: 1000px"></div>
		</div>
	</main>
</template>

<script>
export default {
	layout: "admin",
	data() {
		return {
			test: ""
		};
	},
	methods: {}
};
</script>

<style></style>
