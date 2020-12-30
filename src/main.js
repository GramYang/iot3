import Vue from 'vue'
import App from './App.vue'
import router from '@/router/index'
import store from '@/store/index'
import http from '@/util/http'
import '@/icons'
import {Message,MessageBox,Loading,Button,Row,Upload,Form,FormItem,Input,Select,Option, Table,
  TableColumn,Tag,Pagination,Dropdown,DropdownMenu,DropdownItem,Container,Aside,Header,Main,
Menu,Submenu,MenuItem,MenuItemGroup} from 'element-ui'

Vue.config.productionTip = false

Vue.use(Loading.directive)
Vue.use(Button)
Vue.use(Row)
Vue.use(Upload)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Select)
Vue.use(Option)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Tag)
Vue.use(Pagination)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)
Vue.use(Container)
Vue.use(Aside)
Vue.use(Header)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$message = Message

Vue.prototype.$http=http

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
