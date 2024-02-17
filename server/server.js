import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import cors from 'cors';
import {Server} from "socket.io";
import path from "path";

dotenv.config();
connectDB();
const app = express();
app.use(express.json());
app.use(cors());

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/user", userRoutes);

app.use("/api/v1/chats", chatRoutes);

app.use("/api/v1/message", messageRoutes);


// ----------------------------------- Deployment -----------------------------------

const __dirname1 = path.resolve();
if(process.env.NODE_ENV === 'production'){
  app.use(express.static(path.join(__dirname1, "../client/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname1, "../client/build/index.html"))
  })
}
else{
  app.get("/", (req, res) => {
    res.send("API is running successfully");
  })
}


// ----------------------------------- End Deployemnt -------------------------------


const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, () => {
  console.log(`server started on port ${PORT}`);
});

const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.CLIENT_URL
  }
})

io.on("connection", (socket) => {
  console.log("connected to socket io");

  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected")
  })

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User Joined Room", room);
  })

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));

  socket.on("new message", (newMessageRecieved) => {
    const chats = newMessageRecieved.chat;
    
    if(!chats.users) return console.log("chat.users not defined")

    chats.users.forEach((user) => {
      if(user._id === newMessageRecieved.sender._id) return;
      socket.in(user._id).emit("message recieved", newMessageRecieved);
    })
  })

  socket.off("setup", () => {
    console.log("User Disconnected");
    socket.leave(userData._id);
  })
})
