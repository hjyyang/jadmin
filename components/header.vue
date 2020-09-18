<template>
	<div class="header">
		<div class="header-wrap">
			<div class="header-main">
				<div class="logo">
					<img src="~/static/logo.png" alt />
				</div>
				<div class="menu">
					<div class="menu-wrap">
						<ul>
							<li></li>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	mounted() {},
	methods: {},
};
</script>

<style lang="scss" scoped>
.header {
	width: 100%;
	min-height: 40px;
	.header-wrap {
		position: fixed;
		left: 0;
		top: 0;
		width: 100%;
		padding: 5px 40px;
		background-color: #ffffff;
	}
	.header-main {
        max-width: 1080px;
        margin: 0 auto;
	}
	.logo {
		max-width: 30px;
	}
}
</style>