import * as http from 'http';
import express from 'express';
import socketIO, { Server, Socket } from "socket.io";
import bodyParser from 'body-parser'; // Import body-parser
import cors from 'cors';
import { addUser, removeUser, getUser, users } from './Controller/users';
import router from './Routes/router';
import { Message } from './Interfaces/message';
import { createMessage } from './Controller/message';



const app = express();
const server = http.createServer(app);
const io = new Server(server);


app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// app.use(router)


app.get("/", (req, res) => {
  res.send("Hello world from socket server!");
});

io.on("connection", (socket: Socket) => {
  console.log(`a user is connected`);

  socket.on("addUser", (userId: string) => {
    addUser(userId, socket.id);
    io.emit("getUsers", users);
  });

  const messages: Record<string, Message[]> = {};

  socket.on("sendMessage", ({ id, senderId, receiverId, text, images }: Message) => {
    const message = createMessage({ id, senderId, receiverId, text, images });

    const user = getUser(receiverId);

    if (user && user.socketId) { 
    if (!messages[receiverId]) {
      messages[receiverId] = [message];
    } else {
      messages[receiverId].push(message);
    }

    io.to(user.socketId).emit("getMessage", message);
  }
  });


  socket.on("messageSeen", ({ senderId, receiverId, messageId }: { senderId: string; receiverId: string; messageId: string }) => {
    const user = getUser(senderId);
  
    if (user && user.socketId) {
      if (messages[senderId]) {
        const message = messages[senderId].find(
          (message) =>
            message.receiverId === receiverId && message.id === messageId
        );
  
        if (message) {
          message.seen = true;
  
          io.to(user.socketId).emit("messageSeen", {
            senderId,
            receiverId,
            messageId,
          });
        }
      }
    }
  });
  

  socket.on("updateLastMessage", ({ lastMessage, lastMessagesId }: { lastMessage: string; lastMessagesId: string }) => {
    io.emit("getLastMessage", {
      lastMessage,
      lastMessagesId,
    });
  });

  socket.on("disconnect", () => {
    console.log(`a user disconnected!`);
    removeUser(socket.id);
    io.emit("getUsers", users);
  });
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
  

   

// server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));
