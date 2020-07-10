const request = {
  login: params => {
    params.url = "/no_auth/user/login";
    params.method = "post";
    return axios(params);
  },
  signin: params => {
    params.url = "/no_auth/user/signin";
    params.method = "post";
    return axios(params);
  }
};
let axios = null;
export default function({ $axios }, inject) {
  axios = $axios;
  inject("request", request);
}
