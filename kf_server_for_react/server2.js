const express = require("express");
const http = require("http");
const { Kafka } = require("kafkajs");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
// app.use(cors());
const server = http.createServer(app);

const io = socketio(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const kafka = new Kafka({
  clientId: "my-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: "test-consumer-group" });

async function run() {
  await producer.connect();
  await consumer.connect();
  await consumer.subscribe({
    topic: "quickstart-events6",
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
      io.emit("message", message.value.toString());
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket.IO connection established");

    socket.on("message", async (message) => {
      console.log(`Received message from client: ${message}`);

      await producer.send({
        topic: "quickstart-events6",
        messages: [{ value: message.toString() }],
      });
    });
  });
}

run().catch(console.error);

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
