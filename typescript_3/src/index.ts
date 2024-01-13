import dotenv from "dotenv";
import mongoose from "mongoose";

// import socketIre("socket.io");

dotenv.config({ path: "./config.env" });

import app from "./app";

mongoose.set("strictQuery", false);

mongoose
  .connect(process.env.DATABASE, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connection Successfull...");
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server Running on Port : ${port}`);
});

const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket:any) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_product", (data:any) => {
    socket.join(data);
  });

  socket.on("send_product_id", (data:any) => {
    const roomSize = io.sockets.adapter.rooms.get(data.product)?.size || 0;
    io.in(data.product).emit("receive_user_count", roomSize);
  });

  socket.on("disconnecting", () => {
    const rooms = Array.from(socket.rooms);

    let roomSize = io.sockets.adapter.rooms.get(rooms[1])?.size || 0;

    roomSize = roomSize - 1;
    io.to(rooms[1]).emit("receive_user_count", roomSize);
  });
});

module.exports = app;