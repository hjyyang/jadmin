const cookieparser = process.server ? require("cookieparser") : undefined;

export const state = () => ({
  authUser: null,
  beforeRedirectPath: null
});

export const mutations = {
  SET_USER(state, user) {
    state.authUser = user;
  },
  SET_PATH(state, path) {
    state.beforeRedirectPath = path;
  }
};

export const actions = {
  // nuxtServerInit是由Nuxt.js在服务器渲染每个页面之前调用的
  nuxtServerInit({ commit }, { req }) {
    let auth = null;
    if (req.headers.cookie) {
      const parsed = cookieparser.parse(req.headers.cookie); //解析cookie获取用户信息
      if (!parsed.authUser) return false;
      auth = new Buffer(parsed.authUser.split(".")[1], "base64").toString();
      try {
        auth = JSON.parse(auth);
        auth.token = parsed.authUser;
        // console.log(auth);
        commit("SET_USER", auth);
      } catch (err) {
        // 未找到有效的cookie
        console.log(err);
      }
    }
  },
  async login({ commit }, { username, password, email }) {
    try {
      const { data } = await this.$request.login({
        data: {
          u_name: username,
          u_pw: password,
          u_email: email
        }
      });
      if (data.code == 8888) {
        commit("SET_USER", data);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        throw new Error("Bad credentials");
      }
      throw error;
    }
  },

  async logout({ commit }) {
    let { data } = await this.$request.logout();
    if (data.code == 8888) {
      commit("SET_USER", null);
    }
  }
};
