import { useState,useEffect } from "react";


const example = () => {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState("");
  
    useEffect(() => {
      const socket = new WebSocket("ws://localhost:3001");
      socket.addEventListener("message", (event) => {
        console.log(`Received message from server: ${event.data}`);
        setMessages((prevMessages) => [...prevMessages, String(event.data)]);
      });
  
      return () => {
        socket.close();
      };
    }, []);
  
    const handleSubmit = (event) => {
      event.preventDefault();
  
      if (inputValue.trim()) {
        console.log(`Sending message to server: ${inputValue}`);
  
        const socket = new WebSocket("ws://localhost:3001");
        socket.addEventListener("open", () => {
          socket.send(inputValue);
          setInputValue("");
          socket.close();
        });
      }
    };
  
    return (
      <div className="App">
        <div className="producer">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter message"
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </div>
        <div className="consumer">
          <h2>Messages:</h2>
          <ul>
            {messages.map((message, index) => (
              <li key={index}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    );}
 
export default example;


import { Box, Button, Grid, List, ListItem, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { io } from 'socket.io-client';

interface ChatboxProps {
  roomid: string | undefined;
  height: number;
}
import React, { useEffect, useState } from 'react';
import { Kafka } from 'kafkajs';
import io from 'socket.io-client';

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092']
});

const Chat = () => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3001'); // replace with your server's URL
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected');
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    newSocket.on('chat message', (message) => {
      console.log('Received message:', message);
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      if (newSocket) {
        newSocket.close();
      }
    };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = event.target.elements.message.value;
    sendMessage(message);
    event.target.reset();
  };

  const sendMessage = async (message) => {
    const producer = kafka.producer();
    await producer.connect();
    await producer.send({
      topic: 'chat-messages',
      messages: [{ value: message }]
    });
    await producer.disconnect();
  };

  return (
    <div>
      <h1>Chat</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" name="message" />
        <button type="submit">Send</button>
      </form>
      <ul>
        {messages.map((message, index) => (
          <li key={index}>{message}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
