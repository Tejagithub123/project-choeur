// socket.js  //aziz
const { Server } = require("socket.io");

const io = new Server({
  cors: {
    origin: "http://localhost:3001",
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("setSocketId", (userId) => {
    userSocketMap[userId] = socket.id;
    console.log(`User with ID ${userId} connected with socketId: ${socket.id}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");

    const userId = Object.keys(userSocketMap).find(
      (key) => userSocketMap[key] === socket.id
    );
    if (userId) {
      delete userSocketMap[userId];
      console.log(`User with ID ${userId} disconnected`);
    }
  });
});

module.exports = { io, userSocketMap };
