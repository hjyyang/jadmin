<template>
	<main id="admin-page" class="page">
		<div class="row line-data">
			<div class="card active" @click="showLine($event,0)">
				<div class="icon">
					<i class="el-icon-s-custom"></i>
				</div>
				<div class="text">
					<div class="title">访问量</div>
					<div class="number">1</div>
				</div>
			</div>
			<div class="card" @click="showLine($event,1)">
				<div class="icon">
					<i class="el-icon-chat-line-round"></i>
				</div>
				<div class="text">
					<div class="title">留言数</div>
					<div class="number">1</div>
				</div>
			</div>
			<div class="card" @click="showLine($event,2)">
				<div class="icon">
					<i class="iconfont icon-pinglun"></i>
				</div>
				<div class="text">
					<div class="title">评论数</div>
					<div class="number">1</div>
				</div>
			</div>
			<div class="card" @click="showLine($event,3)">
				<div class="icon">
					<i class="iconfont icon-xinzeng"></i>
				</div>
				<div class="text">
					<div class="title">新增用户</div>
					<div class="number">1</div>
				</div>
			</div>
		</div>
		<div class="card linear-wrap">
			<div class="info">
				<nuxt-link to class="col more">
					<i class="iconfont icon-right"></i>
				</nuxt-link>
			</div>
			<div class="linear-list">
				<div class="echarts line" style></div>
			</div>
		</div>
		<div class="j_row top10-page">
			<div class="card">
				<div class="header">
					<h4>Top10 受访页面</h4>
					<nuxt-link to class="col more">
						<i class="iconfont icon-right"></i>
					</nuxt-link>
				</div>
				<table>
					<thead>
						<tr>
							<td>受访页面</td>
							<td>浏览量(PV)</td>
							<td>占比</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<nuxt-link to>www.baidu.com</nuxt-link>
							</td>
							<td>20</td>
							<td>
								<div style="width:90%;">90%</div>
							</td>
						</tr>
						<tr>
							<td>
								<nuxt-link to>www.taobao.com</nuxt-link>
							</td>
							<td>10</td>
							<td>
								<div style="width:50%;">50%</div>
							</td>
						</tr>
						<tr>
							<td>
								<nuxt-link to>www.jindon.com</nuxt-link>
							</td>
							<td>10</td>
							<td>
								<div style="width:20%;">20%</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="card">
				<div class="header">
					<h4>Top10 入口页面</h4>
					<nuxt-link to class="col more">
						<i class="iconfont icon-right"></i>
					</nuxt-link>
				</div>
				<table>
					<thead>
						<tr>
							<td>入口页面</td>
							<td>浏览量(PV)</td>
							<td>占比</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<nuxt-link to>www.baidu.com</nuxt-link>
							</td>
							<td>20</td>
							<td>
								<div style="width:90%;">90%</div>
							</td>
						</tr>
						<tr>
							<td>
								<nuxt-link to>www.taobao.com</nuxt-link>
							</td>
							<td>10</td>
							<td>
								<div style="width:50%;">50%</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="j_row top10-page">
			<div class="card">
				<div class="header">
					<h4>Top10 搜索词</h4>
					<nuxt-link to class="col more">
						<i class="iconfont icon-right"></i>
					</nuxt-link>
				</div>
				<table>
					<thead>
						<tr>
							<td>搜索词</td>
							<td>浏览量(PV)</td>
							<td>占比</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td>
								<nuxt-link to>webpack</nuxt-link>
							</td>
							<td>20</td>
							<td>
								<div style="width:90%;">90%</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
			<div class="card">
				<div class="header">
					<h4>浏览器占比</h4>
					<nuxt-link to class="col more">
						<i class="iconfont icon-right"></i>
					</nuxt-link>
				</div>
				<div class="pie-wrap">
					<div class="pie"></div>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import echarts from "echarts/lib/echarts";
import line from "echarts/lib/chart/line";
import pie from "echarts/lib/chart/pie";
import tooltip from "echarts/lib/component/tooltip";
import legend from "echarts/lib/component/legend";
export default {
	layout: "admin",
	data() {
		return {
			lineOption: {
				grid: {
					top: 40,
					right: 40,
					left: 70,
				},
				xAxis: {
					type: "category",
					data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
					axisLine: {
						lineStyle: {
							color: "#CFD0D1",
						},
					},
					axisTick: { show: false },
					axisLabel: {
						color: "#767C86",
					},
				},
				yAxis: {
					type: "value",
					axisLine: {
						lineStyle: {
							color: "#CFD0D1",
						},
					},
					axisTick: { show: false },
					axisLabel: {
						color: "#767C86",
					},
				},
				series: [
					{
						name: "访问量",
						data: [820, 932, 901, 934, 1290, 1330, 1320],
						type: "line",
						smooth: true,
						lineStyle: {
							color: "#4E84DD",
						},
						itemStyle: {
							color: "#4E84DD",
							borderWidth: 4,
						},
					},
					{
						name: "留言数",
						data: [],
						type: "line",
						smooth: true,
						lineStyle: {
							color: "rgb(92, 219, 211)",
						},
						itemStyle: {
							color: "rgb(92, 219, 211)",
							borderWidth: 4,
						},
					},
					{
						name: "评论数",
						data: [],
						type: "line",
						smooth: true,
						lineStyle: {
							color: "rgb(255, 156, 110)",
						},
						itemStyle: {
							color: "rgb(255, 156, 110)",
							borderWidth: 4,
						},
					},
					{
						name: "新增用户",
						data: [],
						type: "line",
						smooth: true,
						lineStyle: {
							color: "rgb(149, 222, 100)",
						},
						itemStyle: {
							color: "rgb(149, 222, 100)",
							borderWidth: 4,
						},
					},
				],
				tooltip: {
					trigger: "item",
					formatter: "{a}<br/>{b} : {c} ",
				},
			},
			pieOption: {
				tooltip: {
					trigger: "item",
					formatter: "{a} <br/>{b} : {c} ({d}%)",
				},
				legend: {
					orient: "vertical",
					left: "left",
					data: ["Chrome", "Safari", "Opera", "Firefox", "IE"],
				},
				series: [
					{
						name: "访问来源",
						type: "pie",
						radius: "80%",
						center: ["50%", "60%"],
						data: [
							{ value: 635, name: "Chrome" },
							{ value: 310, name: "Safari" },
							{ value: 234, name: "Opera" },
							{ value: 135, name: "Firefox" },
							{ value: 148, name: "IE" },
						],
						itemStyle: {
							emphasis: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: "rgba(0, 0, 0, 0.5)",
							},
						},
					},
				],
			},
		};
	},
	mounted() {
		this.lineTable();
		this.browser();
	},
	methods: {
		//线性表
		lineTable() {
			let line = echarts.init(document.getElementsByClassName("line")[0]);
			line.setOption(this.lineOption);
		},
		browser() {
			let pie = echarts.init(document.getElementsByClassName("pie")[0]);
			pie.setOption(this.pieOption);
		},
		showLine(el, index) {
			let target = el.target,
				data = [
					[820, 932, 901, 934, 1290, 1330, 1320],
					[120, 450, 32, 920, 1110, 1330, 1320],
					[120, 450, 32, 20, 780, 231, 90],
					[120, 450, 32, 920, 780, 231, 0],
				];
			if (target.classList.value.indexOf("active") == -1) {
				target.classList.add("active");
				this.lineOption.series[index].data = data[index];
			} else {
				target.classList.remove("active");
				this.lineOption.series[index].data = [];
			}
			this.lineTable();
		},
	},
};
</script>

<style lang="scss" scoped>
#admin-page {
	.line-data {
		display: flex;
		.card {
			position: relative;
			flex: 1;
			display: flex;
			align-items: center;
			justify-content: center;
			margin: 0 10px;
			padding: 20px 10px;
			text-align: center;
			cursor: pointer;
			&:hover,
			&.active {
				box-shadow: 0 1px 6px rgba(0, 0, 0, 0.2);
			}
			&::after {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
			}
		}
	}
	.top10-page {
		display: flex;
		margin: 15px 0px 0;
		.card {
			flex: 1;
			margin: 0 10px;
			padding: 20px 20px 10px;
		}
		.header {
			display: flex;
			margin-bottom: 15px;
		}
	}
}
.icon {
	margin-right: 10px;
	i {
		font-size: 30px;
		transition: all 0.3s;
		&.el-icon-s-custom {
			color: #2d8cf0;
		}
		&.el-icon-chat-line-round {
			color: rgb(92, 219, 211);
		}
		&.icon-pinglun {
			color: rgb(255, 156, 110);
		}
		&.icon-xinzeng {
			color: rgb(149, 222, 100);
		}
	}
}
.col.more {
	display: flex;
	margin-left: auto;
	margin-right: 0;
	align-items: center;
	justify-content: center;
	width: 20px;
	height: 20px;
	border-radius: 50%;
	background-color: #cccaca;
	i {
		font-size: 12px;
		color: #ffffff;
	}
	&:hover {
		background-color: #2d8cf0;
	}
}
.linear-wrap {
	margin: 15px 10px 0;
	.info {
		display: flex;
		padding: 20px 30px 0;
	}
	.col {
		display: flex;
		align-items: center;
		margin-right: 30px;
		color: #7c7c7c;
		&.pv {
			.chunk {
				background-color: #2d8cf0;
			}
		}
		&.leave {
			.chunk {
				background-color: rgb(92, 219, 211);
			}
		}
		&.comment {
			.chunk {
				background-color: rgb(255, 156, 110);
			}
		}
		&.newly {
			.chunk {
				background-color: rgb(149, 222, 100);
			}
		}
	}
	.chunk {
		width: 24px;
		height: 10px;
		margin-right: 4px;
		border-radius: 4px;
	}
}
.linear-list {
	position: relative;
	&::before {
		content: "";
		display: block;
		padding-top: 30%;
	}
}
.line {
	position: absolute;
	left: 0px;
	top: 0px;
	width: 100%;
	height: 100%;
}
table {
	width: 100%;
	font-size: 12px;
	thead {
		color: #787a7d;
	}
	td {
		width: 20%;
		padding-bottom: 6px;
		&:nth-of-type(1) {
			width: 60%;
		}
		&:nth-of-type(2) {
			text-align: right;
		}
		&:nth-of-type(3) {
			padding-left: 15px;
			div {
				background-color: #dcebfe;
			}
		}
	}
}
.pie-wrap {
	position: relative;
	&::before {
		content: "";
		display: block;
		padding-top: 31%;
	}
	.pie {
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
	}
}
</style>
