const request = {
  login: (params = {}) => {
    //用户登录
    params.url = "/no_auth/user/login";
    params.method = "post";
    return axios(params);
  },
  signin: (params = {}) => {
    //用户注册
    params.url = "/no_auth/user/signin";
    params.method = "post";
    return axios(params);
  },
  logout: (params = {}) => {
    //用户注销
    params.url = "/no_auth/user/logout";
    params.method = "get";
    return axios(params);
  },
  //获取文档列表
  getDomList: (params = {}) => {
    params.url = "/j_api/domc/list";
    params.method = "get";
    return axios(params);
  }
};
let axios = null;
export default function({ $axios }, inject) {
  axios = $axios;
  inject("request", request);
}
