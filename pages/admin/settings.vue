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
					<div class="item" v-show="currentTab==1">
						<h4>基本设置</h4>
						<div class="col">
							<div class="row"></div>
						</div>
					</div>
				</transition>
				<transition name="fade" mode="out-in">
					<div class="item" v-show="currentTab==2">
						<h4>菜单设置</h4>
						<div class="col">
							<div class="row"></div>
						</div>
					</div>
				</transition>
				<transition name="fade" mode="out-in">
					<div class="item" v-show="currentTab==0">
						<h4>样式设置</h4>
						<div class="col">
							<div class="row">
								<span>字体</span>
								<el-select v-model="fontValue" placeholder="请选择" size="small">
									<el-option v-for="(item,key,index) in fonts" :key="index" :label="item" :value="key"></el-option>
								</el-select>
							</div>
							<div class="row">
								<span>背景色</span>
								<el-color-picker v-model="bgcolor"></el-color-picker>
							</div>
							<div class="row">
								<span>字体颜色</span>
								<el-color-picker v-model="color"></el-color-picker>
							</div>
							<div class="row">
								<span>active 字体颜色</span>
								<el-color-picker v-model="activeColor"></el-color-picker>
							</div>
						</div>
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
				{
					title: "菜单设置",
					synopsis: "网站导航菜单设置",
				},
			],
			bgcolor: "#409EFF",
			color: "#000000",
			fonts: {
				STHeiti: "华文黑体",
				STKaiti: "华文楷体",
				STSong: "华文宋体",
				STFangsong: "华文仿宋",
				LiHeiProMedium: "俪黑Pro",
				LiSongProLight: "俪宋Pro",
				BiauKai: "标楷体",
				AppleLiGothicMedium: "苹果俪中黑",
				AppleLiSungLight: "苹果俪細宋",
				PMingLiU: "新细明体",
				MingLiU: "细明体",
				SimHei: "黑体",
				SimSun: "宋体",
				NSimSun: "新宋体",
				FangSong: "仿宋",
				KaiTi: "楷体",
				LiSu: "隶书",
				YouYuan: "幼圆",
				STXihei: "华文细黑",
				STKaiti: "华文楷体",
				STSong: "华文宋体",
				STZhongsong: "华文中宋",
				STFangsong: "华文仿宋",
				FZShuTi: "方正舒体",
				FZYaoti: "方正姚体",
				STCaiyun: "华文彩云",
				STHupo: "华文琥珀",
				STLiti: "华文隶书",
				STXingkai: "华文行楷",
				STXinwei: "华文新魏",
			},
			fontValue: "STXinwei",
			activeColor: "",
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
		margin-bottom: 15px;
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
	.row {
		margin-bottom: 15px;
		span {
			display: block;
			margin-bottom: 6px;
		}
		&:last-of-type {
			margin-bottom: 0;
		}
	}
}
</style>