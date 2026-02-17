import http from "http";
import dotenv from "dotenv";
import { app } from "./app";
import { Server } from "socket.io";
import { connectDB } from "./config/db";
import { initSocket } from "./socket/socket";
import jwt from "jsonwebtoken";

dotenv.config();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// 🔐 Socket.IO JWT authentication
io.use((socket, next) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: No token"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as any;
    (socket as any).user = { id: decoded.userId };

    next();
  } catch (err) {
    next(new Error("Authentication error: Invalid token"));
  }
});

initSocket(io);

const PORT = process.env.PORT || 4000;

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
  });
});
