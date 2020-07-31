class Api {
  constructor(url, method) {
    let self = this;
    return function(data) {
      let parameter = {
        url: method ? url : url + self.addQuery(data),
        method: method || "get",
        data
      };
      return axios(parameter);
    };
  }
  addQuery(data) {
    let query = "";
    if (!data) return "";
    Object.keys(data).map(key => {
      query += `&${key}=${data[key]}`;
    });
    if (query) {
      query = "?" + query.slice(1);
    }
    return query;
  }
}
const request = {
  /**********************************用户接口************************************/
  //用户登录
  login: new Api("/no_auth/user/login", "post"),
  //用户注册"
  signin: new Api("/no_auth/user/signin", "post"),
  //用户注销
  logout: new Api("/no_auth/user/logout"),
  /**********************************文档接口************************************/
  //获取文档列表
  getDomList: new Api("/j_api/domc/list"),
  //新增文档api
  addDomList: new Api("/j_api/domc/add_api", "post"),
  //删除文档api
  removeDomList: new Api("/j_api/domc/remove_api"),
  //修改文档api
  updateDomList: new Api("/j_api/domc/update_api", "post")
};
let axios = null;
export default function({ $axios }, inject) {
  axios = $axios;
  inject("request", request);
}
