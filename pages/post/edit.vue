<template>
  <div class="edit-page">
    <header>
      <div class="header-wrap">
        <div class="return_btn">
          <i class="iconfont icon-24"></i>
        </div>
        <div class="title"></div>
        <div class="message"></div>
        <div class="cover_img_btn">
          <i class="el-icon-picture"></i>
        </div>
        <div class="publish"></div>
      </div>
    </header>
    <main>
      <JEditor :hljs="hljs" :languages="languages"></JEditor>
    </main>
  </div>
</template>

<script>
import JEditor from "vue-jeditor";
import hljs from "highlight.js/lib/core";
import javascript from "highlight.js/lib/languages/javascript";
import css from "highlight.js/lib/languages/css";
import "vue-jeditor/dist/src/css/style.css";
import "highlight.js/styles/monokai-sublime.css";
export default {
  layout: "edit",
  components: {
    JEditor: JEditor.jEditor
  },
  data() {
    return {
      hljs: hljs,
      languages: {
        css,
        javascript
      }
    };
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.edit-page,
.j-editor {
  height: 100%;
}
main {
  height: calc(100% - 75px);
}
header {
  display: flex;
  align-items: center;
  padding: 4px 20px;
  box-sizing: border-box;
  height: 60px;
  margin-bottom: 15px;
  background-color: #ffffff;
  font-size: 20px;
}
.header-wrap {
  display: flex;
}
.return_btn {
  i {
    font-size: inherit;
  }
}
</style>
