const express = require("express");
const { chats } = require("./data/data");

const app = express();
const dotenv = require("dotenv");
const connDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const { errorHandler, notFound } = require("./middleware/errorMiddleware");
const messageRoutes = require("./routes/messageroute");
const cors = require("cors");
dotenv.config();
connDB();
app.use(cors());
app.use(express.json());
app.use("/api/user", userRoutes);
app.use("/api/message", messageRoutes);
app.get("/", (req, res) => {
  res.send("Api is running");
});

app.get("/api/chats", (req, res) => {
  res.send(chats);
});

app.use("/api/chat", chatRoutes);

app.get("/api/chat/:id", (req, res) => {
  console.log(req.params.id);

  const singleChat = chats.find((c) => {
    return c._id === req.params.id;
  });
  res.send(singleChat);
});

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log("running on 5000");
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});
// A room created for user

io.on("connection", (socket) => {
  console.log("Connected to socket.io");
  socket.on("joinchat", (room) => {
    socket.join(room);
    console.log("User Joined Room: " + room);
  });
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    console.log(userData._id);
    socket.emit("connected");
  });
});
