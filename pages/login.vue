<template>
	<main class="signin">
		<div class="signin_container">
			<div class="signin_head">
				<i class="iconfont icon-user1"></i>
			</div>
			<div class="signin_main" @keyup.enter="submitForm('loginForm')">
				<el-form :model="loginForm" :rules="loginRules" ref="loginForm">
					<el-form-item prop="userName">
						<el-input v-model="loginForm.userName" placeholder="用户名"></el-input>
					</el-form-item>
					<el-form-item prop="pass">
						<el-input
							type="password"
							v-model="loginForm.pass"
							show-password
							placeholder="密码"
							autocomplete="off"
						></el-input>
					</el-form-item>
					<el-form-item>
						<el-button @click="submitForm('loginForm')" type="primary">登入</el-button>
					</el-form-item>
				</el-form>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	layout: "member",
	// middleware: "no_auth",
	data() {
		var validatePass = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入密码"));
			} else {
				callback();
			}
		};
		var validateUserName = (rule, value, callback) => {
			if (value === "") {
				callback(new Error("请输入用户名"));
			} else {
				callback();
			}
		};
		return {
			loginForm: {
				userName: "",
				pass: "",
			},
			loginRules: {
				pass: [{ validator: validatePass, trigger: "blur" }],
				userName: [{ validator: validateUserName, trigger: "blur" }],
			},
			fromPath: "/",
		};
	},
	mounted() {
		if (this.$route.query.is_redirect) {
			if (!!this.$store.state.authUser) {
				//用户信息改变
				this.$message.error("用户登录信息已过期");
			}
		}
		if (!!this.$route.query.redirect) {
			this.$message.error("用户未登录");
		}
	},
	methods: {
		submitForm(formName) {
			this.$refs[formName].validate((valid) => {
				if (valid) {
					this.login();
				} else {
					console.log("error submit!!");
					return false;
				}
			});
		},
		async login() {
			try {
				await this.$store.dispatch("login", {
					username: this.loginForm.userName,
					password: this.loginForm.pass,
				});
				if (!this.$store.state.authUser) {
					this.$message.error("账号或密码错误!");
					return false;
				}
				this.$message({
					type: "success",
					message: "登录成功!",
				});
				// console.log(this.fromPath);
				this.$router.push(this.fromPath);
			} catch (e) {
				throw e;
			}
		},
	},
	beforeRouteEnter(to, from, next) {
		//进入当前页面的路由事件
		//to: Route: 即将要进入的目标 路由对象
		//from: Route: 当前导航正要离开的路由
		//next: Function 必须调用 next 方法，否则钩子就不会被 resolved。具体解释看官网
		next((vm) => {
			vm.fromPath = vm.$route.query.redirect || from.fullPath;
		});
	},
};
</script>
<style lang="scss" scoped>
.signin {
	display: flex;
	align-items: center;
	min-height: calc(100vh);
	.signin_container {
		max-width: 360px;
		width: 100%;
		margin: 0 auto;
		padding-bottom: 8px;
		box-sizing: border-box;
		overflow: hidden;
	}
	.signin_head {
		padding: 0px 24px 20px;
		box-sizing: border-box;
		text-align: center;
		i {
			font-size: 100px;
			color: #a1a1a1;
		}
	}
	.signin_main {
		padding: 0px 24px;
		box-sizing: border-box;
	}
	button {
		width: 100%;
		margin-top: 20px;
		background: var(--btn);
		border-color: var(--btn);
		transition: all 0.3s;
		&:hover,
		&:focus {
			background: none;
			border-color: var(--btn);
			color: var(--btn);
		}
	}
	.el-input__inner:focus {
		border-color: var(--border);
	}
}
</style>