require('dotenv').config();

var express = require('express');
var path = require('path');
var mongoose = require('mongoose');
const app = express();
const cors = require('cors'); 
const session = require('express-session');
const userRouter = require('./routes/usersRouter');
const chatRouter = require('./routes/chatRouter');
const initializePassport = require('./passport-config');
const passport = require('passport');
const http = require('http');
const { Server } = require('socket.io');
const User = require('./models/user');
const Chat = require('./models/chat');
const Message = require('./models/message');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
      origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
  }
});

module.exports.io = io;


mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));

initializePassport(passport);

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(cors({
  origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', userRouter);
app.use('/messages', chatRouter);

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  console.log('a user connected');
  const id = socket.handshake.query.id;

  socket.join(id);

  socket.on("private message", async ({ content, from, to }) => {
    const message = new Message({
      userId: from,
      message: content,
    })

    await message.save();

    const chat = await Chat.findOne({users: { $all: [from, to] }})
    if (chat) {
      chat.messages.push(message);
      await chat.save();
    } else {
      const newChat = new Chat({
        users: [from, to],
        messages: [message]
      });
      await newChat.save();
    }

    io.to(to).emit("receive-message", {
      content,
      from,
      to,
    });
  });
});



server.listen(4000, () => {
  console.log('listening on *:4000');
});


module.exports = app;
