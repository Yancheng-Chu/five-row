const express = require("express");
const { room } = require("../models/chess");
const router = express.Router();


router.get("/", async (req, res) => {
  res.send("User Success")
});

router.get("/getUser", async (req, res) => {

});

router.post("/create", async (req, res) => {
  const { users } = req.body
  var rooms = Math.floor(new Date % 100 * Math.random(1, 10) * 100)
  const result = await room.create({ rooms: rooms, users: users })
  res.send(result)
});

router.post("/enter", async (req, res) => {
  const { rooms } = req.body
  const result = await room.findOne({
    rooms
  })
  res.send(result)
});


router.post('/room', async (req, res) => {
  const { rooms } = req.body;

  const result = await room.findOne({ rooms })
  res.send(result)

})

router.post("/upload", async (req, res) => {
  const { _id, board, player, black, white, lastX, lastY, over, results, chosen, total, token } = req.body;
  const result = await room.findByIdAndUpdate(_id, {
    board, player, black, white, lastX, lastY, over, results, chosen, total, token
  })

  res.send(result)
});



module.exports = router;