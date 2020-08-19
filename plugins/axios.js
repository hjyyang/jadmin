export default function(app) {
  let axios = app.$axios;

  axios.onRequest(config => {
    // console.log('请求拦截')
    if (app.store && app.store.state.authUser) {
      config.headers.authorization = "Bearer " + app.store.state.authUser.token;
    }
    if (process.browser) {
      //判断是否为客户端（必须）
    }
  });

  axios.onResponse(res => {});

  axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      app.redirect("/400");
    }
    if (code === 401) {
      app.redirect("/login?is_redirect=true");
    }
  });
}
