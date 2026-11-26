import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'ant-design-vue/dist/reset.css'
import './styles/global.less'

import App from './App.vue'
import router from './router'
import { connectMqtt, registerMqttHandlers } from './services/mqtt'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

connectMqtt()
registerMqttHandlers()
