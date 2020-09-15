import Vue from "vue";
import {
  Avatar,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Collapse,
  CollapseItem,
  Input,
  InputNumber,
  Switch,
  Button,
  Message,
  Radio,
  RadioGroup,
  RadioButton,
  Popconfirm,
  Form,
  FormItem,
  Upload,
  MessageBox,
  Dialog,
  Tag,
  Pagination,
  ColorPicker,
  Select,
  Option,
  ButtonGroup,
  DatePicker
} from "element-ui";
import lang from "element-ui/lib/locale/lang/zh-CN";
import locale from "element-ui/lib/locale";

locale.use(lang);

Vue.use(Avatar);
Vue.component(DropdownMenu.name, DropdownMenu);
Vue.component(Dropdown.name, Dropdown);
Vue.component(DropdownItem.name, DropdownItem);
Vue.use(Menu);
Vue.use(Submenu);
Vue.use(MenuItem);
Vue.use(MenuItemGroup);
Vue.use(Collapse);
Vue.use(CollapseItem);
Vue.use(Input);
Vue.use(InputNumber);
Vue.use(Switch);
Vue.use(Button);
Vue.prototype.$message = Message;
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Popconfirm);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Upload);
Vue.use(Dialog);
Vue.use(Tag);
Vue.use(Pagination);
Vue.use(ColorPicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(ButtonGroup);
Vue.use(DatePicker);
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
