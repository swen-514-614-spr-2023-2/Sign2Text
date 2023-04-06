const express = require("express");

const app = express();
const http = require("http");
const server = http.Server(app);
const bodyParser = require("body-parser");

const ChatroomService = require("./ChatroomService");

const chatroomService = new ChatroomService();

const cors = require("cors");
app.use(cors());
app.use(bodyParser.json()); // for parsing application/json

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("disconnect", (socket) => {
    console.log("User disconnected");
  });

  socket.on("chat message", (msg) => {
    console.log(msg);
    if (chatroomService.sendMessage(msg)) {
      io.emit(`room#${msg["roomId"]}`, msg);
    }
  });
});

//need an api method that image service will call to send text message.
app.post("/prediction", (req, res) => {
  console.log("Recieved new prediction");
  const body = req.body;
  console.log(body);
  if(chatroomService.sendMessage(body)){
    io.emit(`room#${body["roomId"]}`, body);
  }
});

//create new room
/**
 * Create a new room
 * body format: {name: #}
 */
app.post("/chatroom", (req, res) => {
  console.log("Recieved request to create chatroom");
  const body = req.body;
  console.log(body);
  const chRoomId = chatroomService.createChatroom(body["name"]);
  res.status(200).send({ roomId: chRoomId });
});

//delete chatroom
app.delete("/chatroom", (req, res) => {
  console.log("Recieved request to delete chatroom");
  const body = req.body;
  console.log(`Body: ${body}`);
  if (chatroomService.deleteChatroom(body["roomId"])) {
    res.status(200).end();
  } else res.status(409).end();
});

app.get("/chatroom", (req, res) => {
  const allRooms = chatroomService.getAllChatrooms();
  console.log(`In chatroom API: ${allRooms}`);
  res.status(200).send(allRooms);
});

/**
 * body format: {roomId: #, user: {id: #}}
 */
app.put("/chatroom/users", (req, res) => {
  console.log("Recieved request to add user to chatroom");
  const body = req.body;
  if (chatroomService.enterChatroom(body["roomId"], body["user"])) {
    res.status(200).end();
  } else res.status(409).end();
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

server.listen(3000, () => {
  console.log("Listening on port 3000");
});