class Api {
  constructor(url, method) {
    let self = this;
    return function(data, option) {
      let parameter = {
        url: method ? url : url + self.addQuery(data),
        method: method || "get",
        data
      };
      Object.assign(parameter, option);
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
  //获取用户列表
  userList: new Api("/j_api/user/list"),
  //修改用户信息
  updateUser: new Api("/j_api/user/update", "post"),
  //用户注销
  logout: new Api("/j_api/simple/user_logout"),
  //获取用户信息
  userInfo: new Api("/j_api/simple/user_info"),

  /**********************************文档接口************************************/
  //获取文档列表
  getDomList: new Api("/j_api/domc/list"),
  //新增文档
  addDomList: new Api("/j_api/domc/add_api", "post"),
  //删除文档
  removeDomList: new Api("/j_api/domc/remove_api"),
  //修改文档
  updateDomList: new Api("/j_api/domc/update_api", "post"),

  /**********************************文件接口************************************/
  //上传文件
  uploadFile: new Api("/j_api/file/upload", "post"),
  //查找文件列表
  findFile: new Api("/j_api/file/find"),
  //删除文件
  deteleFile: new Api("/j_api/file/delete"),
  //修改文件名
  updateFile: new Api("/j_api/file/update")

  /**********************************普通用户可访问接口************************************/
};
let axios = null;
export default function(app, inject) {
  axios = app.$axios;
  inject("request", request);
}
