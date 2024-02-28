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
            player: true,
            over: false,
            lastX: null,
            lastY: null,
            wins: [],
            blackWin: [],
            whiteWin: [],
            computerWin: [],
            count: 0,
            tip: "You Turn",
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
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 11; j++) {
                    for (let k = 0; k < 5; k++) {
                        this.wins[i][j + k][this.count] = true;
                    }
                    this.count++;
                }
            }
        },
        vertical() {

            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 11; j++) {
                    for (let k = 0; k < 5; k++) {
                        this.wins[j + k][i][this.count] = true;
                    }
                    this.count++;
                }
            }
        },
        slash() {

            for (let i = 0; i < 11; i++) {
                for (let j = 0; j < 11; j++) {
                    for (let k = 0; k < 5; k++) {
                        this.wins[i + k][j + k][this.count] = true;
                    }
                    this.count++;
                }
            }
        },
        reverse() {

            for (let i = 0; i < 11; i++) {
                for (let j = 14; j > 3; j--) {
                    for (let k = 0; k < 5; k++) {
                        this.wins[i + k][j - k][this.count] = true;
                    }
                    this.count++;
                }
            }
        },
        init() {
            for (let i = 0; i < this.count; i++) {
                this.blackWin[i] = 0;
                this.whiteWin[i] = 0;
                this.computerWin[i] = 0;
            }
        },
        drawChessBoard() {
            for (let i = 0; i < 15; i++) {
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
            let grd = this.ctx.createRadialGradient(
                25 + x * 40,
                15 + y * 40,
                15,
                20 + x * 40,
                20 + y * 40,
                35
            );
            if (this.player) {
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

            let x = Math.floor(event.offsetX / 40);
            let y = Math.floor(event.offsetY / 40);

            if (this.chessBoard[x][y] == 0) {
                this.drawChess(x, y);
                if (this.player) {
                    this.chessBoard[x][y] = 1;
                    for (let k = 0; k < this.count; k++) {
                        if (this.wins[x][y][k]) {
                            this.blackWin[k]++;
                            if (this.blackWin[k] == 5) {
                                window.alert("You Win!");
                                this.tip = "You Win!";
                                this.over = true;
                            }
                        }
                    }
                }
                if (!this.over) {
                    this.player = !this.player
                    this.computer()
                }
            }

            this.lastX = x;
            this.lastY = y;
        },
        computer() {
            let myScore = [];
            let computerScore = [];
            let max = 0;
            let x = 0;
            let y = 0;
            for (let i = 0; i < 15; i++) {
                myScore[i] = [];
                computerScore[i] = [];
                for (let j = 0; j < 15; j++) {
                    myScore[i][j] = 0;
                    computerScore[i][j] = 0;
                }
            }
            for (let i = 0; i < 15; i++) {
                for (let j = 0; j < 15; j++) {
                    if (this.chessBoard[i][j] == 0) {
                        for (let k = 0; k < this.count; k++) {
                            if (this.wins[i][j][k]) {
                                if (this.blackWin[k] == 1) {
                                    myScore[i][j] += 200;
                                }
                                else if (this.blackWin[k] == 2) {
                                    myScore[i][j] += 400;
                                }
                                else if (this.blackWin[k] == 3) {
                                    myScore[i][j] += 1000;
                                }
                                else if (this.blackWin[k] == 4) {
                                    myScore[i][j] += 4000;
                                }

                                if (this.computerWin[k] == 1) {
                                    computerScore[i][j] += 300;
                                }
                                else if (this.computerWin[k] == 2) {
                                    computerScore[i][j] += 500;
                                }
                                else if (this.computerWin[k] == 3) {
                                    computerScore[i][j] += 2000;
                                }
                                else if (this.computerWin[k] == 4) {
                                    computerScore[i][j] += 8000;
                                }
                            }
                        }
                        if (myScore[i][j] > max) {
                            max = myScore[i][j];
                            x = i;
                            y = j;
                        }
                        else if (myScore[i][j] == max) {
                            if (computerScore[i][j] > computerScore[x][y]) {
                                x = i;
                                y = j;
                            }
                        }

                        if (computerScore[i][j] > max) {
                            max = computerScore[i][j];
                            x = i;
                            y = j;
                        }
                        else if (computerScore[i][j] == max) {
                            if (myScore[i][j] > myScore[x][y]) {
                                x = i;
                                y = j;
                            }
                        }
                    }
                }
            }
            this.drawChess(x, y);

            this.chessBoard[x][y] = 2;
            for (let k = 0; k < this.count; k++) {
                if (this.wins[x][y][k]) {
                    this.computerWin[k]++;
                    if (this.computerWin[k] == 5) {
                        window.alert("Computer Win!");
                        this.tip = "Computer Win!";
                        this.over = true;
                    }
                }
            }

            if (!this.over) {
                this.player = !this.player;
            }
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
            this.tip = "You Turn";
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