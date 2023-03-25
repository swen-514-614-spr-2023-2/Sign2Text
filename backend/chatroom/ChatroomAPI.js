const express = require('express');

const app = express();
const http = require('http');
const server = http.Server(app);

const chatroomService = new ChatroomService();


const cors = require('cors');
app.use(cors());


const io = require('socket.io')(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
      }
});



io.on('connection',(socket)=>{
    console.log("A user connected");

    socket.on('disconnect',(socket)=>{
        console.log('User disconnected');
    });

    socket.on('chat message',(msg)=>{
        chatroomService.sendMessage(msg);
        io.emit(`room#${msg['roomId']}`, msg);
    });

    //msg should contain user, and room number
    socket.on('enter room',(msg)=>{
        chatroomService.enterChatroom(msg['roomId'],msg['user']);
    });

});



//need an api method that image service will call to send text message.

//create new room
app.post('/chatroom',(req,res)=>{
    
});

//delete chatroom
app.delete('/chatroom',(req,res)=>{

});


app.get('/',(req,res)=>{
    res.send('Hello World');
});





server.listen(3000,()=>{
    console.log("Listening on port 3000");
});