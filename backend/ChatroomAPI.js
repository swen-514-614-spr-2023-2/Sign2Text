const express = require("express");

const app = express();
const http = require("http");
const server = http.Server(app);
const bodyParser = require("body-parser");
const { Kafka } = require("kafkajs");

const ChatroomService = require("./ChatroomService");

const chatroomService = new ChatroomService();
const dbConnection = new DatabaseConnection();

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["54.165.42.186:9092"],
});
const admin = kafka.admin();
const producer = kafka.producer();
const consumer = kafka.consumer({groupId: 'test-consumer-group'});

const cors = require("cors");
const DatabaseConnection = require("./Database");
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
  
  
try {
    producer
    .connect()
    .then(() => {
      console.log("connected to Kafka")

      producer.send({
        topic: body.roomId.toString(),
        messages: [{ value: body.text.toString() }]
      });
    })

  /** use this when directly connecting to the browser clients with socket.io
   
  if(chatroomService.sendMessage(body)){
    io.emit(`room#${body["roomId"]}`, body);
  }
  */
  res.setHeader('Referrer-Policy', 'origin-when-cross-origin');
  res.status(200).send({ roomId: body.roomId });

} catch(error){
  console.log(error);
}
  
});

//create new room
/**
 * Create a new room
 * body format: {name: #}
 */
app.post("/chatroom", (req, res) => {
  // use async/await to handle Kafka promise
  console.log("Recieved request to create chatroom");
  const body = req.body;
  console.log(body);
  
  const topicName = req.body.name;
  const chRoomId = chatroomService.createChatroom(body["name"]);

  // Connect to Kafka
  admin
    .connect()
    .then(() => {
      console.log("Connected to Kafka");
      // Create a new topic
      return admin.createTopics({
        topics: [{ topic: chRoomId.toString() }],
      });
    })
    .then(() => {
      console.log(`Created topic ${chRoomId.toString()}`);
      // Return the topic and broker details
      const brokers = kafka.brokers
        .map((broker) => `${broker.host}:${broker.port}`)
        .join(",");
        dbConnection.createNewRoomInDB(String(chRoomId),body['name'],{});
      // res.status(200).send({ topic: topicName, brokers: brokers })
    })
    .catch((err) => {
      console.error(`Error creating topic: ${err}`);
      // res.status(500).send({ error: 'Error creating topic' })
    });
  
  res.setHeader('Referrer-Policy', 'origin-when-cross-origin');
  res.status(200).send({ roomId: chRoomId });
});

//delete chatroom
app.delete("/chatroom", (req, res) => {
  console.log("Recieved request to delete chatroom");
  const body = req.body;
  console.log(`Body: ${body}`);

  res.setHeader('Referrer-Policy', 'origin-when-cross-origin');
  if (chatroomService.deleteChatroom(body["roomId"])) {
    //get all messages from kafka and store to db
    consumer.connect()
    .then(()=>{
        consumer.subscribe({topics : [body['roomId']], fromBeginning: true})
        .then(()=>{
          consumer.run({
            eachMessage: async ({topic, partition, message}) =>{
              //store to db
              dbConnection.storeMessageInMessageTable(message.value.toString(), message.timestamp);
            }
          })
        }).catch(err => console.log(err));
    })
    res.status(200).end();
  } else res.status(409).end();
});

app.get("/chatroom", (req, res) => {
  const allRooms = chatroomService.getAllChatrooms();
  console.log(`In chatroom API: ${allRooms}`);
  res.setHeader('Referrer-Policy', 'origin-when-cross-origin');
  res.status(200).send(allRooms);
});

/**
 * body format: {roomId: #, user: {id: #}}
 */
app.put("/chatroom/users", (req, res) => {
  console.log("Recieved request to add user to chatroom");
  const body = req.body;

  res.setHeader('Referrer-Policy', 'origin-when-cross-origin');
  if (chatroomService.enterChatroom(body["roomId"], body["user"])) {
    res.status(200).end();
  } else res.status(409).end();
});

app.get("/", (req, res) => {
  console.log("Hello request on /");
  res.status(200).end();
});

server.listen(80, () => {
  console.log("Listening on port 80");
});
