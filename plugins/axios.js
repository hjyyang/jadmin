import { MessageBox } from "element-ui";

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

  axios.onResponse(response => {
    if (process.browser) {
      //判断是否为客户端（必须）
    }
  });

  axios.onError(error => {
    const code = parseInt(error.response && error.response.status);
    if (code === 400) {
      app.redirect("/400");
    }
    if (code === 401) {
      MessageBox.confirm("无权限访问", "提示", {
        confirmButtonText: "去登录",
        cancelButtonText: "去首页",
        type: "warning"
      })
        .then(() => {
          app.redirect("/login");
        })
        .catch(() => {
          app.redirect("/");
        });
    }
  });
}
