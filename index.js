const express = require('express');
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const { Server } = require("socket.io")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());


var server = require('http').createServer(app)

const { room } = require("./models/chess");

const port = 1919;
const chess = require("./routes/chess");


const url = "mongodb+srv://char:aa123456@cluster0.6dxh1s5.mongodb.net/web?retryWrites=true&w=majority"

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log("Connected Successfully")
  })
  .catch((err) => {
    console.log("Connected Failed", err)
  })


app.use("/chess", chess);




const io = new Server(server, {
  cors: {
    origin: '*'
  }
});


io.on("connection", async (socket) => {

  console.log("New " + socket.id);

  socket.on('login', (data) => {
    console.log('login', 'Welcome' + data + 'Connect')
  })



  const rooms = {}

  socket.on('disconnect', function () {
    console.log(`User disconnected: ${socket.id}`);

    for (const roomss in rooms) {
      const index = rooms[roomss].indexOf(socket.id);
      if (index !== -1) {
        rooms[roomss].splice(index, 1);

        socket.broadcast.to(roomss).emit('userLeft', socket.id);

        if (rooms[roomss].length === 0) {
          delete rooms[roomss];
        }
      }
    }
  });


  socket.on('joinRoom', async (roomss, users, _id) => {
    try {
      const result = await room.findByIdAndUpdate(_id,
        {
          users
        });


    } catch (err) {
      console.error('Error updating data:', err);
      socket.emit('dataUpdateError', err);
    }
    socket.join(roomss)
    if (!rooms[roomss]) {
      rooms[roomss] = []
    }
    rooms[roomss].push(socket.id)
    socket.broadcast.to(roomss).emit('newM', { msg: 'Someone Entered' })

  })



  socket.on('sendMessage', async (rooms, message) => {

    socket.broadcast.to(rooms).emit('message', socket.id, message);

  });


  socket.on('updateData', async (_id, token) => {

    try {
      const result = await room.findByIdAndUpdate(_id,
        {
          token
        });

      socket.broadcast.emit('updated', token)
    } catch (err) {
      console.error('Error updating data:', err);

      socket.emit('dataUpdateError', err);
    }
  });

  socket.on('uuu', async (_id, board, player, black, white, lastX, lastY, over, results) => {

    try {
      const result = await room.findByIdAndUpdate(_id,
        {
          board, player, black, white, lastX, lastY, over, results
        });

    } catch (err) {
      console.error('Error updating data:', err);

      socket.emit('dataUpdateError', err);
    }
  });

  socket.on('total', async (_id, total) => {

    try {
      const result = await room.findByIdAndUpdate(_id,
        {
          total
        });

    } catch (err) {
      console.error('Error updating data:', err);

      socket.emit('dataUpdateError', err);
    }
  });

  socket.on('chosen', async (_id, chosen) => {

    try {
      const result = await room.findByIdAndUpdate(_id,
        {
          chosen
        });

    } catch (err) {
      console.error('Error updating data:', err);

      socket.emit('dataUpdateError', err);
    }
  });

  socket.on('draw', async (req) => {
    const { player, lastX, lastY, results, over, board, white, black, restore } = req;

    socket.broadcast.emit('drawU', req);

  });

  socket.on('restores', async (restore) => {

    socket.broadcast.emit('res', restore);


  });

});



server.listen(port, function () {
  console.log("Runnning on " + port);
});





















