import express from "express";
import http from "http";
import { Server } from "socket.io";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import cors from "cors";

import userRouter from "./routes/userRoute.js";
import messageRouter from "./routes/messageRoute.js";


const app = express();

const option = {
  origin:process.env.chattuclient ,
  credentials: true,
};
app.use(cors(option));
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.socketclient ,
    credentials: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(bodyParser.json());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/messages", messageRouter);

// implementing socket io

export const getReceiverId = (recieverId) => {
  return socketuserMap[recieverId];
};

const socketuserMap = {};
io.on("connection", (socket) => {
  // console.log("user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId !== undefined) {
    socketuserMap[userId] = socket.id;
  }
  

  io.emit("getOnlineUser", Object.keys(socketuserMap));

  socket.on("disconnect", () => {
    // console.log("user disconneted", socket.id);
    delete socketuserMap[userId];
    io.emit("getOnlineUser", Object.keys(socketuserMap));
  });
});

export { app, server, io };
