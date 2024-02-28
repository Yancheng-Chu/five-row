<template>
  <div style="height: 100vh; width: 100%; text-align: center">
    <div class="title">five-to-a-row</div>

    <div style="margin-top: 30px">{{ tip }}</div>
    <button style="position: absolute; top: 15; left: 30" v-on:click="restore">
      Restore
    </button>

    <canvas id="board" width="600" height="600"></canvas>
  </div>
</template>
   
<script>
export default {
  name: "five-to-a-row",
  data() {
    return {
      ctx: null,
      chessBoard: [],
      player: false,
      over: false,
      lastX: null,
      lastY: null,
      wins: [],
      blackWin: [],
      whiteWin: [],
      computerWin: [],
      count: 0,
      tip: "Black Turn",
    };
  },
  mounted() {
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
  },
  watch: {
    player() {
      if (!this.over) {
        this.tip = !this.player ? "Black Turn" : "White Turn";
      }
    },
  },
  computed: {},
  methods: {
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
        this.computerWin[i] = 0;
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
    drawChess(x, y) {
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
      if (!this.player) {
        grd.addColorStop(0, "#000000");
        grd.addColorStop(1, "#ffffff");
      } else {
        grd.addColorStop(0, "#ffffff");
        grd.addColorStop(1, "#000000");
      }

      this.ctx.fillStyle = grd;
      this.ctx.fill();
    },

    handleClick(event) {
      if (this.over) {
        return;
      }
      var x = Math.floor(event.offsetX / 40);
      var y = Math.floor(event.offsetY / 40);

      if (this.chessBoard[x][y] == 0) {
        this.drawChess(x, y);
        this.player = !this.player;
        if (this.player) {
          this.chessBoard[x][y] = 1;
          for (let k = 0; k < this.count; k++) {
            if (this.wins[x][y][k]) {
              this.blackWin[k]++;
              if (this.blackWin[k] == 5) {
                window.alert("Black Win!");
                this.tip = "Black Win!";
                this.over = true;
              }
            }
          }
        } else {
          this.chessBoard[x][y] = 2;
          for (let k = 0; k < this.count; k++) {
            if (this.wins[x][y][k]) {
              this.whiteWin[k]++;
              if (this.whiteWin[k] == 5) {
                window.alert("White Win!");
                this.tip = "White Win!";
                this.over = true;
              }
            }
          }
        }
      }

      this.lastX = x;
      this.lastY = y;
    },
    restore() {
      if (this.lastX && this.lastY) {
        this.ctx.clearRect(0, 0, 600, 600);
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 0, 0, 0);
        this.ctx.fill();
      }
      for (let i = 0; i < 15; i++) {
        this.chessBoard[i] = [];
        for (let j = 0; j < 15; j++) {
          this.chessBoard[i][j] = 0;
        }
      }
      for (let i = 0; i < this.count; i++) {
        this.blackWin[i] = 0;
        this.whiteWin[i] = 0;
        this.computerWin[i] = 0;
      }

      this.drawChessBoard();
      this.over = false;
      this.player = false;
      this.tip = "Black Turn";
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