<template>
	<main class="page admin-settings">
		<div class="side">
			<div class="side-wrap">
				<div class="title">
					<i class="el-icon-s-tools"></i>
					网站设置
				</div>
				<ul @click="changeTab" class="config">
					<li
						:class="['item',currentTab==index?'current':'']"
						v-for="(item,index) in configGroup"
						:key="index"
						:data-index="index"
					>
						<div>{{ item.title }}</div>
						<span>{{ item.synopsis }}</span>
					</li>
				</ul>
			</div>
		</div>
		<div class="content">
			<div class="content-wrap">
				<transition name="fade" mode="out-in">
					<div class="item" v-show="currentTab==0">
						<h4>基本设置</h4>
						<div class="col">
							<div class="row">

                            </div>
						</div>
					</div>
				</transition>
				<transition name="fade" mode="out-in">
					<div class="item" v-show="currentTab==1">
						<h4>样式设置</h4>
					</div>
				</transition>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	layout: "admin",
	transition: "slide",
	data() {
		return {
			currentTab: 0,
			configGroup: [
				{
					title: "基本设置",
					synopsis: "网站信息设置",
				},
				{
					title: "样式设置",
					synopsis: "网站样式设置",
				},
			],
		};
	},
	methods: {
		changeTab(e) {
			let self = this;
			this.$Events.eventAgent(e, {
				elClass: "config",
				target: "item",
				handle: function (e) {
					if (e.dataset.index == self.currentTab) return false;
					self.currentTab = e.dataset.index;
				},
			});
		},
	},
};
</script>

<style lang="scss" scoped>
.page {
	display: flex;
}
.side {
	width: 25%;
	.side-wrap {
		padding: 10px 0 10px;
		border-radius: 5px;
		background-color: #ffffff;
	}
	.title {
		font-size: 18px;
		padding: 10px 20px;
		margin-bottom: 10px;
		border-bottom: 1px solid #e8eaec;
		i {
			font-size: 16px;
		}
	}
	li {
		padding: 10px 20px;
		transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;
		cursor: pointer;
		div {
			font-size: 14px;
		}
		span {
			display: block;
			margin-top: -2px;
			font-size: 12px;
			color: #808695;
		}
		&.current {
			color: #2d8cf0;
			background-color: #f0faff;
			span {
				color: #2d8cf0;
			}
		}
	}
}
.content {
	width: 75%;
	padding-left: 20px;
	.content-wrap {
		position: relative;
	}
	h4 {
		font-size: 18px;
		color: #515a6e;
	}
	.item {
		position: absolute;
		width: 100%;
		padding: 20px;
		margin-bottom: 20px;
		border-radius: 5px;
		background-color: #ffffff;
	}
	.col {
		width: 50%;
	}
}
</style>