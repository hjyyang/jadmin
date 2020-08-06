import Vue from "vue";
let axios = null;
class Events {
  copyCentent(e) {
    try {
      let ev = e || window.event,
        target = ev.target || ev.srcElement;
      let selection = window.getSelection();
      selection.removeAllRanges();
      let range = document.createRange();
      range.selectNodeContents(target);
      selection.addRange(range);
      document.execCommand("copy");
      Vue.prototype.$message({
        message: "已复制",
        type: "success"
      });
    } catch (error) {
      throw error;
    }
    return true;
  }
}
export default function(app, inject) {
  axios = app.$axios;
  inject("Events", new Events());
}
