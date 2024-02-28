import { createApp } from 'vue'
import App from './App.vue'
import Vant from 'vant'
import router from './router'
import 'vant/lib/index.css'

// App.config.productionTip = false

import VueSocketIO from 'vue-socket.io'
import SocketIO from 'socket.io-client'

const SOCKETIO = new VueSocketIO({
    debug: true, // true开启
    connection: SocketIO('ws://localhost:1919'), // 里面写socket服务器地址
    // 使用vuex
    // vuex: {
    //   store,
    //   // 定义vuex函数的时候，用来区分普通函数还是socket函数。
    //   actionPrefix: 'SOCKET_',
    //   mutationPrefix: 'SOCKET_'
    // },
    options: {
      autoConnect: open // 关闭自动连接，一般是在用户登录过后才进行手动连接
    }
  })
  
 
const app = createApp(App)
app.use(Vant)
app.use(router)
app.use(SOCKETIO)
// app.use(new VueSocketio({
//     debug:true,
//     connection:'http://localhost:1919'
// }))
app.mount('#app')
