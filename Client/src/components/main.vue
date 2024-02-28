<template>
  <div class="title">five-to-a-row</div>

  <div v-show="isOnline">
    <button class="button" v-on:click="back">
      Back
    </button>
    <button class="button" v-on:click="create">
      Create
    </button>
    <div style="display: flex; justify-content: center; align-items: center;margin-top: 60px;">
      <van-cell-group inset>
        <van-field v-model="name" label="Name" placeholder="Please Enter Name" style="font-size:40px;" />
      </van-cell-group>
    </div>

    <div style="display: flex; justify-content: center; align-items: center;margin-top: 60px;">
      <van-cell-group inset>
        <van-field v-model="room" label="Room" type="digital" placeholder="Please Enter Room" style="font-size:40px;" />
      </van-cell-group>
    </div>


    <van-button @click="enter" round block style="font-size: 18px; height: 32px;">
      Enter
    </van-button>
  </div>
  <div v-show="!isOnline">
    <div>{{ msg }}</div>

    <button class="button" v-on:click="local">
      Local
    </button>
    <button class="button" v-on:click="online">
      Online
    </button>
    <button class="button" v-on:click="computer">
      Computer
    </button>
  </div>
</template>

<script>
import axios from "axios"
import Cookies from 'js-cookie'
export default {
  name: "five-to-a-row",
  data() {
    return {
      room: '',
      isOnline: false,
      msg: '',
      name: '',
    }
  },
  mounted() {
    this.$socket.emit('login', this.$socket.id)
  },
  sockets: {

    newM(data) {
      this.msg = data.msg
    },

  },
  created() {
    Cookies.remove('room')
  },
  methods: {

    local() {
      this.$router.push('/local');
    },
    online() {
      this.isOnline = true
    },
    computer() {
      this.$router.push('/test');
    },
    create() {
      if (this.name == '') {
        alert('Please Enter Name')
      } else {
        let users = []
        users.push(this.name)
        axios.post("http://localhost:1919/chess/create", {
          users: users
        }).then(res => {
          if (res.status == 200) {
            let rooms = res.data.rooms
            let token = {
              id: this.name,
              rooms: rooms,
              cheese: ''
            }
            Cookies.set('token', JSON.stringify(token))
            Cookies.set('room', rooms)
            Cookies.set('id', res.data._id)
            this.$socket.emit('joinRoom', res.data.rooms)
            this.$router.push({ name: 'online', params: { room: token.rooms } });
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    enter() {
      if (this.name == '') {
        alert('Please Enter Name')
      } else {
        axios.post("http://localhost:1919/chess/enter", {
          rooms: this.room,
          // user: u
        }).then(res => {
          if (res.status == 200) {
            if (res.data != '') {
              if (res.data.users.length <= 1) {
                if (res.data.users.indexOf(this.name) == -1) {
                  let user = res.data.users
                  user.push(this.name)
                  Cookies.set('id', res.data._id)
                  this.$socket.emit('joinRoom', this.room, user, res.data._id)

                  let token = {
                    id: this.name,
                    rooms: this.room,
                    cheese: ''
                  }
                  Cookies.set('token', JSON.stringify(token))
                  Cookies.set('room', this.room)
                  Cookies.set('id', res.data._id)
                  this.$socket.emit('joinRoom', this.room)
                  this.$router.push({ name: 'online', params: { room: this.room } });

                } else {
                  let token = {
                    id: this.name,
                    rooms: this.room,
                    cheese: ''
                  }
                  Cookies.set('token', JSON.stringify(token))
                  Cookies.set('room', this.room)
                  Cookies.set('id', res.data._id)
                  this.$socket.emit('joinRoom', res.data.rooms)
                  this.$router.push({ name: 'online', params: { room: this.room } });
                }
              } else {
                if (res.data.users.indexOf(this.name) == -1) {
                  alert('FULL, If you are player, Please Enter correct name')
                } else {
                  let token = {
                    id: this.name,
                    rooms: this.room,
                    cheese: ''
                  }
                  Cookies.set('token', JSON.stringify(token))
                  Cookies.set('room', this.room)
                  Cookies.set('id', res.data._id)
                  this.$socket.emit('joinRoom', res.data.room)
                  this.$router.push({ name: 'online', params: { room: this.room } });
                }

              }

            } else {
              window.alert("No Such Room!");
            }
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    back() {
      this.isOnline = false
    }
  },
}
</script>
 
<style>
.button {
  display: block;
  margin: auto;
  margin-top: 60px;
  font-size: 32px;
}

.title {
  text-align: center;
  font-size: 32px;
  font-weight: 800;
}
</style>