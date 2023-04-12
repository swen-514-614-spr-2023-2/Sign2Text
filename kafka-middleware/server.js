const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { Kafka } = require("kafkajs");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

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
    topic: "quickstart-events5",
    fromBeginning: true,
  });
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log(`Received message: ${message.value.toString()}`);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message.value.toString());
        }
      });
    },
  });

  wss.on("connection", (ws) => {
    console.log("WebSocket connection established");

    ws.on("message", async (message) => {
      console.log(`Received message from client: ${message}`);

      await producer.send({
        topic: "quickstart-events5",
        messages: [{ value: message.toString() }],
      });
    });
  });
}

run().catch(console.error);

server.listen(3001, () => {
  console.log("Server listening on port 3001");
});