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
} from 'element-ui';

Vue.use(Input);
Vue.use(Button);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(RadioButton);


Vue.prototype.$notify = Notification;