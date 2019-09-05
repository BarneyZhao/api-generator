import Vue from 'vue';
import 'normalize.css';
import './style.less';

import {
  Input,
  Button,
  Form,
  FormItem,
  Radio,
  RadioGroup,
  RadioButton,
  Notification,
  MessageBox,
  Loading,
} from 'element-ui';

Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);
Vue.use(Loading.directive);

Vue.prototype.$notify = Notification;
Vue.prototype.$confirm = MessageBox.confirm;
