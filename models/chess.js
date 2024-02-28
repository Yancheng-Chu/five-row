const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    rooms: {
        type: String
    },
    board: {
        type: Array
    },
    player: {
        type: Boolean,
        default: false
    },
    lastX: {
        type: Number
    },
    lastY: {
        type: Number
    },
    black: {
        type: Array
    },
    white: {
        type: Array
    },
    token: {
        type: Array
    },
    over: {
        type: Boolean,
        default: false
    },
    results: {
        type: String,
        default: 'Black Turn'
    },
    isBlack: {
        type: Array,
    },
    isWhite: {
        type: Array
    },
    users: {
        type: Array
    },
    total: {
        type: Boolean
    },
    chosen: {
        type: Boolean
    },
    msg2: {
        type: String
    }
})

const room = mongoose.model("Rooms", roomSchema)


module.exports = {
    room
}