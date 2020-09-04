import Vue from "vue";
let axios = null;
class Events {
  copyCentent(e) {
    try {
      let ev = e || window.event,
        target = ev.target || ev.srcElement || ev;
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
  eventAgent(e, option) {
    let ev = e || window.event,
      target = ev.target || ev.srcElement || ev,
      classArr = target.classList.value.split(" ");
    while (classArr.indexOf(option.elClass) == -1) {
      if (classArr.indexOf(option.target) != -1) {
        option.handle(target);
        break;
      }

      target = target.parentNode; //往上级节点移动
      classArr = target.classList.value.split(" ");
    }
  }
}
export default function(app, inject) {
  axios = app.$axios;
  inject("Events", new Events());
}
