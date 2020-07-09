<template>
  <main id="document_page" class="page">
    <div class="wrap">
      <h1>Api 文档</h1>
      <div
        class="list"
        v-delegation="{
          nodeClass: 'edit_btn',
          handle: showEdit
        }"
      >
        <div
          class="list-wrap"
          v-delegation="{
            nodeClass: 'edit_content',
            handle: copyCentent
          }"
        >
          <el-collapse accordion v-model="activeItem" @change="changeOpen">
            <el-collapse-item
              class="dom_item"
              v-for="(item1, index1) in listData"
              :key="index1"
              :name="index1 + 1"
            >
              <template slot="title">
                <span class="title">{{ item1.title }}</span>
                <i
                  class="header-icon el-icon-circle-plus"
                  slot="reference"
                  @click.stop="addItem(index1)"
                  v-if="isAdmin"
                  v-show="activeItem == index1 + 1"
                ></i>
              </template>
              <el-collapse accordion @change="handleChange">
                <el-collapse-item
                  :class="[
                    item2.method,
                    'api_item',
                    editState ? 'editing' : ''
                  ]"
                  v-for="(item2, index2) in item1.list"
                  :key="index2"
                >
                  <template slot="title">
                    <div class="method">{{ item2.method }}</div>
                    <span class="title">{{ item2.path }}</span>
                    <el-popconfirm
                      title="确定删除吗？"
                      confirmButtonType="danger"
                      @onConfirm="removeItem(index1, index2)"
                    >
                      <i
                        class="header-icon el-icon-remove"
                        slot="reference"
                        @click.stop
                      ></i>
                    </el-popconfirm>
                  </template>
                  <div class="edit_wrap" v-if="isAdmin">
                    <el-button
                      class="edit_btn"
                      :type="item2.method == 'Get' ? 'primary' : 'success'"
                      size="mini"
                      >编辑</el-button
                    >
                  </div>
                  <div class="j_row">
                    <div class="method_wrap j_col_8">
                      <h4 class="sub_title">Method</h4>
                      <div class="content edit_content">{{ item2.method }}</div>
                      <el-radio-group v-model="item2.method" class="edit">
                        <el-radio
                          v-for="(val, key, i) in method"
                          :key="i"
                          :label="key"
                          >{{ key }}</el-radio
                        >
                      </el-radio-group>
                    </div>
                    <div class="path_wrap j_col_8">
                      <h4 class="sub_title">Path</h4>
                      <div class="content edit_content">{{ item2.path }}</div>
                      <el-input
                        class="edit"
                        size="mini"
                        v-model="item2.title"
                      ></el-input>
                    </div>
                  </div>
                  <div class="describe">
                    <h4 class="sub_title">Describe</h4>
                    <div class="content edit_content">{{ item2.describe }}</div>
                    <el-input
                      class="edit"
                      size="mini"
                      v-model="item2.describe"
                    ></el-input>
                  </div>
                  <div class="parameters">
                    <h4 class="sub_title">Parameters</h4>
                    <div
                      class="p_item"
                      v-for="(item3, index3) in item2.parameters"
                      :key="index3"
                    >
                      <div class="name">
                        <div class="edit_content">
                          {{ item3.name }}
                          <span
                            style="color: red;"
                            class="required"
                            v-if="item3.required"
                            >*</span
                          >:
                        </div>
                        <el-input
                          class="edit"
                          size="mini"
                          v-model="item3.name"
                        ></el-input>
                      </div>
                      <div class="detail">
                        <template v-for="(val, key, i) in item3">
                          <div
                            class="p_row"
                            :key="i"
                            v-if="key != 'name' && key != 'required'"
                          >
                            <div class="key">{{ key }}:</div>
                            <div class="value edit_content">{{ val }}</div>
                            <el-input
                              class="edit"
                              size="mini"
                              v-model="item3[key]"
                            ></el-input>
                          </div>
                          <div
                            class="p_row"
                            :key="i"
                            v-else-if="key == 'required'"
                          >
                            <div class="key">{{ key }}:</div>
                            <div class="value edit_content">{{ val }}</div>
                            <el-switch
                              class="edit"
                              v-model="item3[key]"
                            ></el-switch>
                          </div>
                        </template>
                      </div>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </el-collapse-item>
          </el-collapse>
        </div>
      </div>
    </div>
  </main>
</template>

<script>
export default {
  layout: "admin",
  head: {
    title: "jadmin-document"
  },
  data() {
    return {
      activeItem: null,
      listData: [
        {
          title: "用户接口",
          list: [
            {
              path: "/j_api/user/list",
              describe: "获取用户信息数据列表接口",
              method: "Get",
              parameters: [
                {
                  name: "page",
                  required: true,
                  value: "非0整数",
                  type: "String"
                }
              ]
            },
            {
              path: "/signin",
              describe: "用户注册接口",
              method: "Post",
              parameters: [
                {
                  name: "u_name",
                  required: false,
                  value: "非空无特殊字符",
                  type: "String"
                },
                {
                  name: "u_pw",
                  required: false,
                  value: "非空无特殊字符,长度在6～32位之间",
                  type: "String"
                }
              ]
            }
          ]
        },
        {
          title: "文章接口",
          list: []
        }
      ],
      method: {
        Get: 1,
        Post: 2
      },
      editState: false,
      isAdmin: true
    };
  },
  mounted() {},
  methods: {
    showEdit(e) {
      //点击编辑按钮后显示所有的编辑框并隐藏内容
      let parent = e.offsetParent;
      if (!parent.getAttribute("edit-state")) {
        parent.setAttribute("edit-state", "editing");
        // parent.classList.add("editing");
        this.editState = true;
      } else {
        parent.setAttribute("edit-state", "");
        parent.classList.remove("editing");
        this.editState = false;
      }
    },
    handleChange(val) {
      //关闭折叠面板后清除属性
      if (!val) {
        let items = document.getElementsByClassName("api_item");
        for (let i = 0; i < items.length; i++) {
          items[i].setAttribute("edit-state", "");
        }
      }
    },
    copyCentent(e) {
      //点击复制所点内容
      let selection = window.getSelection();
      selection.removeAllRanges();
      let range = document.createRange();
      range.selectNodeContents(e);
      selection.addRange(range);
      document.execCommand("copy");
      this.$message({
        message: "已复制",
        type: "success"
      });
    },
    removeItem(pIndex, index) {
      console.log(pIndex, index);
      if (pIndex == undefined || index == undefined) return false;
      this.listData[pIndex].list.splice(index, 1);
    },
    addItem(index) {
      //添加接口item
      let api = {
        title: "",
        describe: "",
        method: "Get",
        parameters: []
      };
      this.listData[index].list.unshift(api);
    },
    changeOpen(index) {
      if (!index) {
        //下拉收起时改变隐藏状态
        this.activeItem = null;
      }
    }
  }
};
</script>

<style lang="scss">
#document_page {
  h1 {
    margin-bottom: 30px;
  }
  .dom_item {
    > .el-collapse-item__wrap {
      border-bottom: none;
      > .el-collapse-item__content {
        padding-bottom: 0;
      }
    }
    > div {
      > .el-collapse-item__header {
        font-size: 16px;
      }
    }
  }
  .api_item {
    position: relative;
    border-bottom: none;
    .method {
      min-width: 80px;
      height: 32px;
      line-height: 20px;
      margin-right: 20px;
      padding: 6px 15px;
      font-size: 14px;
      color: #ffffff;
      text-align: center;
      border-radius: 3px;
      text-shadow: 0 1px 0 rgba(0, 0, 0, 0.1);
    }
    &.Post {
      color: #49cc90;
      .method {
        background: #49cc90;
      }
      .name {
        color: #49cc90;
      }
      .detail {
        background-color: rgba(73, 204, 144, 0.1);
      }
      input {
        // border-color: #49cc90;
      }
      .el-radio__input.is-checked {
        .el-radio__inner {
          background: #13ce66;
          border-color: #13ce66;
        }
        + .el-radio__label {
          color: #13ce66;
          border-color: #13ce66;
        }
      }
      .el-switch.is-checked .el-switch__core {
        background: #13ce66;
        border-color: #13ce66;
      }
    }
    &.Get {
      color: #61affe;
      .method {
        background: #61affe;
      }
      .name {
        color: #61affe;
      }
      .detail {
        background-color: rgba(97, 175, 254, 0.1);
      }
    }
    .el-collapse-item__header {
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 16px;
      color: inherit;
    }
    &.editing {
      .edit_content {
        display: none;
      }
      .edit {
        display: block;
      }
    }
    .edit_content {
      height: 28px;
      line-height: 28px;
      font-size: 14px;
      cursor: pointer;
      // font-weight: bold;
    }
  }
  span.button,
  .header-icon {
    width: 30px;
    height: 30px;
    line-height: 30px;
    margin-left: auto;
    text-align: center;
    font-size: 20px;
  }
  span.title {
    margin-right: auto;
  }
  .el-collapse-item__arrow {
    margin-left: 30px;
  }
  h4.sub_title {
    margin: 10px 0 10px;
    font-size: 15px;
  }
  .p_item {
    display: flex;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .name {
      width: 16%;
      padding: 5px 10px 5px 0;
      font-size: 14px;
      font-weight: bold;
    }
  }
  .j_row {
    .j_col_8 {
      width: 48%;
      &:nth-of-type(2n) {
        margin-left: auto;
      }
    }
  }

  .edit {
    display: none;
  }
  .edit_wrap {
    button {
      display: block;
      margin-left: auto;
      margin-right: 40px;
    }
  }
  .detail {
    width: 84%;
    padding: 10px 20px;
    border-radius: 4px;
    background: #41444e;
    // color: #ffffff;
  }
  .p_row {
    display: flex;
    min-height: 28px;
    margin-bottom: 10px;
    &:last-of-type {
      margin-bottom: 0;
    }
    .key {
      width: 10%;
      font-weight: 600;
    }
    .value {
      width: calc(90% - 40px);
    }
  }
}
</style>
