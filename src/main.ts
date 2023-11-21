import { createApp } from 'vue'
import './style.css'
import './assets/global.scss'
import App from './App.vue'

import { Upload, Modal, Button, Pagination,ConfigProvider, Tooltip} from 'ant-design-vue';
const app = createApp(App)
app.use(Upload).use(Modal).use(Button).use(Pagination).use(ConfigProvider).use(Tooltip).mount('#app')

