export default function({ $axios }, inject) {
  axios = $axios;
  inject("request", request);
}
