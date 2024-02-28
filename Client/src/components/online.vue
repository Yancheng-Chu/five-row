<template>
  <div>{{ msg }}</div>
  <div>{{ msg2 }}</div>
  <div>{{ msg3 }}</div>
  <div style="height: 100vh; width: 100%; text-align: center">
    <div class="title">five-to-a-row</div>

    <div style="margin-top: 30px">{{ tip }}</div>
    <div style="position: absolute; display: inline-block">
      <button v-on:click="restore">Restore</button>
      <button :disabled="enter" style="margin-left: 408px" v-on:click="chess(1)">Black</button>
      <button :disabled="enter" style="margin-left: 10px" v-on:click="chess(2)">White</button>
    </div>

    <canvas id="board" width="600" height="600"></canvas>
  </div>
</template>
       
<script>
import axios from "axios";
import Cookies from "js-cookie";
export default {
  name: "five-to-a-row",
  data() {
    return {
      enter: true,
      cookie: '',
      ctx: null,
      chessBoard: [],
      player: true,
      over: true,
      lastX: null,
      lastY: null,
      wins: [],
      blackWin: [],
      whiteWin: [],
      count: 0,
      tip: "",
      id: null,
      msg: "Please Choose Color",
      chosen: false,
      turn: false,
      msg2: '',
      room: null,
      msg3: '',
      token: [],
      total: false,
      color: ''
    };
  },
  sockets: {
    newM(data) {
      this.msg2 = data.msg;
      this.enter = false

    },

    res() {

      this.enter = false
      this.restore()
    },
    message(data) {
      this.msg2 = data[1]
      this.chosen = true

    },
    updated(data) {
      if (data) {

        this.token = data



      }

    },
    drawU(data) {
      this.player = data.player;
      this.chessBoard = data.board;
      this.blackWin = data.black;
      this.whiteWin = data.white;
      this.lastX = data.lastX;
      this.lastY = data.lastY;
      this.over = data.over;
      this.drawChess(data.lastX, data.lastY, data.player);
      if (data.over) {
        this.tip = data.results;

      } else {
        this.tip = data.player ? "White Turn" : "Black Turn";
      }

    },

  },
  mounted() {


    this.cookie = JSON.parse(Cookies.get('token'))


    this.id = Cookies.get('id')

    this.room = this.cookie.rooms


    let container = document.getElementById("board");
    container.addEventListener("click", this.handleClick);
    this.ctx = container.getContext("2d");
    this.drawChessBoard();

    for (let i = 0; i < 15; i++) {
      this.chessBoard[i] = [];
      this.wins[i] = [];
      for (let j = 0; j < 15; j++) {
        this.chessBoard[i][j] = 0;
        this.wins[i][j] = [];
      }
    }
    this.horizon();
    this.vertical();
    this.slash();
    this.reverse();
    this.init();

    if (Cookies.get('room') == this.$route.params.room) {


      this.room = this.$route.params.room
      axios
        .post("http://localhost:1919/chess/room", {
          rooms: this.cookie.rooms,
        })
        .then((res) => {

          if (res.status == 200) {
            this.id = res.data._id;
            if (res.data.board.length != 0) {
              this.lastX = res.data.lastX;
              this.lastY = res.data.lastY;
              this.board = res.data.board;
              this.chessBoard = res.data.board;
              this.blackWin = res.data.black;
              this.whiteWin = res.data.white;
              this.player = res.data.player;
              this.over = res.data.over;
              this.tip = res.data.results;
              this.token = res.data.token;
              this.total = res.data.total;
              this.chosen = res.data.chosen;

              if (this.tip == 'Black Win!' || this.tip == 'White Win!') {
                this.over = false
                for (let i = 0; i < 15; i++) {
                  for (let j = 0; j < 15; j++) {
                    if (this.board[i][j] == 1) {
                      this.player = true;
                      this.drawChess(i, j, this.player);
                    } else if (this.board[i][j] == 2) {
                      this.player = false;
                      this.drawChess(i, j, this.player);
                    }
                  }
                }
                this.over = true
              } else {

                for (let i = 0; i < 15; i++) {
                  for (let j = 0; j < 15; j++) {
                    if (this.board[i][j] == 1) {
                      this.player = true;
                      this.drawChess(i, j, this.player);
                    } else if (this.board[i][j] == 2) {
                      this.player = false;
                      this.drawChess(i, j, this.player);
                    }
                  }
                }
              }

              this.player = res.data.player;
            }

            if (res.data.users.length == 2) {
              this.enter = false
            }
            this.total = res.data.total;
            this.chosen = res.data.chosen;

            this.tip = res.data.results;

            for (let i of res.data.token) {

              if (i.id == this.cookie.id && i.cheese != '') {

                this.total = true
                this.color = i.cheese
                this.msg = 'You are ' + this.color
                if (this.tip == 'Black Turn' && this.color == 'Black') {
                  this.player = true
                  this.over = false
                } else if (this.tip == 'White Turn' && this.color == 'White') {
                  this.player = false
                  this.over = false
                }
                else {
                  this.over = true
                }
                return
              } else {
                this.chosen = false
                this.total = false
                this.msg = "Please Choose Color"
              }
              // if (i.id != this.coookie.id && i.cheese != '') {
              //   this.msg2 = 'Your opponent chose ' + i.cheese
              // }
            }

          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  },
  watch: {
    msg2(to, from) {
      if (to != from) {
        this.enter = false
      }
    },
    over() {
      // if (this.over) {
      //   if (!this.player) {
      //     this.tip = "White Win!";
      //     window.alert("White Win!");
      //   } else {
      //     this.tip = "Black Win!";
      //     window.alert("Black Win!");
      //   }
      //   // this.tip = !this.player ?  "White Turn" : "Black Turn";
      // }
    },
    $route(to) {
      if (to.params.room != this.cookie.rooms) {
        window.alert("You Are Not Allowed");
        this.$router.push({
          name: "online",
          params: { room: this.cookie.rooms },
        });
      }
    },
  },
  computed: {},
  methods: {
    chess(e) {
      if (!this.total) {
        if (!this.chosen) {
          if (e == 1) {
            this.chosen = true;
            this.msg = "You are Black";
            this.over = false;
            let m = 'Your opponent chose Black'

            this.cookie.cheese = 'Black'

            this.token.push(this.cookie)

            Cookies.set('token', JSON.stringify(this.cookie))
            this.$socket.emit('sendMessage', this.room, m)
          } else {
            this.chosen = true;
            this.msg = "You are White";
            let m = 'Your opponent chose White'

            this.cookie.cheese = 'White'
            Cookies.set('token', JSON.stringify(this.cookie))
            this.token.push(this.cookie)
            this.$socket.emit('sendMessage', this.room, m)
          }
          this.$socket.emit('chosen', this.id, this.chosen)
        }
        if (this.chosen) {
          if (this.msg2 == 'Your opponent chose Black') {
            if (e == 2) {
              this.msg = "You are White";
              let m = 'Your opponent chose White'

              this.cookie.cheese = 'White'
              Cookies.set('token', JSON.stringify(this.cookie))
              this.token.push(this.cookie)
              this.$socket.emit('sendMessage', this.room, m)
            } else {
              this.msg = ('You can only choose White')
            }
          } else if (this.msg2 == 'Your opponent chose White') {
            if (e == 1) {
              this.msg = "You are Black";
              let m = 'Your opponent chose Black'
              this.over = false;

              this.cookie.cheese = 'White'
              Cookies.set('token', JSON.stringify(this.cookie))
              this.token.push(this.cookie)
              this.$socket.emit('sendMessage', this.room, m)
            } else {
              this.msg = ('You can only choose Black')
            }
          }
        }


        let t = []

        for (let i of this.token) {
          t.push(i)
        }


        let req = {
          _id: this.id,
          board: this.board,
          player: this.player,
          black: this.black,
          white: this.white,
          lastX: this.lastX,
          lastY: this.lastY,
          over: this.over,
          results: this.tip,
          token: t
        };

        this.$socket.emit('updateData', req._id, req.token)
      } else {
        this.msg = 'You are already Chosen ' + this.color
        this.$socket.emit('total', this.id, this.total)
      }
    },
    horizon() {
      for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[i][j + k][this.count] = true;
          }
          this.count++;
        }
      }
    },
    vertical() {

      for (var i = 0; i < 15; i++) {
        for (var j = 0; j < 11; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[j + k][i][this.count] = true;
          }
          this.count++;
        }
      }
    },
    slash() {

      for (var i = 0; i < 11; i++) {
        for (var j = 0; j < 11; j++) {
          for (var k = 0; k < 5; k++) {
            this.wins[i + k][j + k][this.count] = true;
          }
          this.count++;
        }
      }
    },
    reverse() {

      for (var i = 0; i < 11; i++) {
        for (var j = 14; j > 3; j--) {
          for (var k = 0; k < 5; k++) {
            this.wins[i + k][j - k][this.count] = true;
          }
          this.count++;
        }
      }
    },
    init() {
      for (var i = 0; i < this.count; i++) {
        this.blackWin[i] = 0;
        this.whiteWin[i] = 0;
      }
    },
    drawChessBoard() {
      for (var i = 0; i < 15; i++) {
        this.ctx.moveTo(20 + i * 40, 20);
        this.ctx.lineTo(20 + i * 40, 580);
        this.ctx.stroke();
        this.ctx.moveTo(20, 20 + i * 40);
        this.ctx.lineTo(580, 20 + i * 40);
        this.ctx.stroke();
      }
    },
    drawChess(x, y, player) {
      this.ctx.beginPath();
      this.ctx.arc(20 + x * 40, 20 + y * 40, 15, 0, 2 * Math.PI);
      this.ctx.closePath();
      var grd = this.ctx.createRadialGradient(
        25 + x * 40,
        15 + y * 40,
        15,
        20 + x * 40,
        20 + y * 40,
        35
      );
      if (!this.over) {
        if (player) {
          grd.addColorStop(0, "#000000");
          grd.addColorStop(1, "#ffffff");
        } else {
          grd.addColorStop(0, "#ffffff");
          grd.addColorStop(1, "#000000");
        }
        this.player = !this.player;
        this.ctx.fillStyle = grd;
        this.ctx.fill();
      }

    },

    handleClick(event) {
      if (this.over) {
        return;
      } else {
        var x = Math.floor(event.offsetX / 40);
        var y = Math.floor(event.offsetY / 40);

        let req = {
          _id: this.id,
          board: {},
          player: true,
          black: {},
          white: {},
          lastX: x,
          lastY: y,
          over: false,
          results: "",
        };

        if (this.chessBoard[x][y] == 0) {
          this.drawChess(x, y, this.player);

          if (this.player) {
            this.chessBoard[x][y] = 2;
            for (let k = 0; k < this.count; k++) {
              if (this.wins[x][y][k]) {
                this.whiteWin[k]++;

              }
            }
          } else {
            this.chessBoard[x][y] = 1;
            for (let k = 0; k < this.count; k++) {
              if (this.wins[x][y][k]) {
                this.blackWin[k]++;

              }
            }
          }

          for (let k = 0; k < this.count; k++) {
            if (this.blackWin[k] == 5) {
              this.over = true;
              req.over = true;
              req.results = "Black Win!";
              this.tip = "Black Win!";
              this.$socket.emit("uuu", this.id, req);

            }

            if (this.whiteWin[k] == 5) {
              this.over = true;
              req.over = true;
              req.results = "White Win!";
              this.tip = "White Win!";
              this.$socket.emit("uuu", this.id, req);

            }
          }

          let draw = {
            lastX: x,
            lastY: y,
            player: !this.player,
            results: this.player ? "White Turn" : "Black Turn",
            board: this.chessBoard,
            white: this.whiteWin,
            black: this.blackWin,
            over: this.over,

          };
          if (this.over) {
            draw.results = this.tip;
          }
          this.$socket.emit("draw", draw);

          if (this.over) {
            req.results = this.tip;
            req.black = this.blackWin;
            req.white = this.whiteWin;
            req.board = this.chessBoard;
            req.player = !this.player;
            req.over = this.over;
          } else {
            req.black = this.blackWin;
            req.white = this.whiteWin;
            req.board = this.chessBoard;
            req.player = !this.player;
            req.results = !this.player ? "White Turn" : "Black Turn";
            req.over = this.over;
          }

          this.tip = req.results;



          this.$socket.emit("uuu", req._id, req.board, req.player, req.black, req.white, req.lastX, req.lastY,
            req.over, req.results);

          this.over = true
        }
      }
    },
    restore() {
      if (this.lastX != null || this.lastY != null) {
        this.ctx.clearRect(0, 0, 600, 600);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 0, 0, 0);
        this.ctx.fill();

        for (let i = 0; i < 15; i++) {
          this.chessBoard[i] = [];
          for (let j = 0; j < 15; j++) {
            this.chessBoard[i][j] = 0;
          }
        }
        for (let i = 0; i < this.count; i++) {
          this.blackWin[i] = 0;
          this.whiteWin[i] = 0;
        }

        this.drawChessBoard();
        this.over = true;
        this.player = true;
        this.chosen = false;
        this.total = false;

        this.msg = 'Please Choose Color'

        axios
          .post("http://localhost:1919/chess/upload", {
            _id: this.id,
            over: this.over,
            player: this.player,
            board: this.chessBoard,
            black: this.blackWin,
            white: this.whiteWin,
            results: "Black Turn",
            total: this.total,
            chosen: this.chosen
          })
          .then((res) => {
            if (res.status == 200) {
              this.tip = "Black Turn";
              this.lastX = null;
              this.lastY = null;
              this.cookie.cheese = ''
              Cookies.set('token', JSON.stringify(this.cookie))
              let restore = true;
              this.$socket.emit("restores", restore);
              this.enter = false
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }

      this.cookie.cheese = ''

      let c = []
      c.push(this.cookie)
      this.token = c


      axios
        .post("http://localhost:1919/chess/upload", {
          _id: this.id,
          over: true,
          player: true,
          results: "Black Turn",
          total: false,
          chosen: false,
          token: this.token
        })
        .then((res) => {

          if (res.status == 200) {
            this.tip = "Black Turn";
            this.msg = "Please Choose Color"
            this.lastX = null;
            this.lastY = null;

            Cookies.set('token', JSON.stringify(this.cookie))

          }
        })
        .catch((err) => {
          console.log(err);
        });

    },
  },
};
</script>
       
<style>
canvas {
  margin-top: 30px;
  box-shadow: -2px -2px 2px #f0f0f0, 5px 5px 5px #9d9d9d;
}

.title {
  font-size: 32px;
  font-weight: 800;
}
</style>