const express = require("express");
const http = require("http");
const { Kafka } = require("kafkajs");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
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

  io.on("connection", (socket) => {
    console.log("Socket.IO connection established");

    socket.on("subscribe", async (topic) => {
      console.log(`Subscribing to Kafka topic: ${topic}`);
      await consumer.subscribe({
        topic: topic,
        fromBeginning: true,
      });
    });

    socket.on("message", async ({ topic, message }) => {
      console.log(`Received message from client: ${message}`);
      console.log(`Sending message to Kafka topic: ${topic}`);

      await producer.send({
        topic: topic,
        messages: [{ value: message.toString() }],
      });
    });
  });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(
        `Received message from Kafka topic ${topic}: ${message.value.toString()}`
      );
      io.emit("message", { topic: topic, message: message.value.toString() });
    },
  });
}

run().catch(console.error);

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});
