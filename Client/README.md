# web

## Project setup 
## install node js, Vue/cli
```
yarn install
yarn add vue-socket.io
yarn add socket.io
yarn add vue-native-websocket
yarn add vue-router
yarn add vant
yarn add js-cookie
yarn add axios
```

node_modules/vue-socket.io/dist/vue-socketio.js
change:
{t.prototype.$socket=this.io,t.prototype.$vueSocketIo=this,t.mixin(n),i.info("Vue-Socket.io plugin enabled")}
To:
{t.config.globalProperties.$socket=this.io,t.config.globalProperties.$vueSocketIo=this,t.mixin(n),i.info("Vue-Socket.io plugin enabled")}

### Compiles and hot-reloads for development
```
yarn serve
```

