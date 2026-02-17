import { io } from "socket.io-client";
import axios from "axios";

const API_URL = "http://localhost:4000";

// 1️⃣ Login to get JWT
async function start() {
  const res = await axios.post<{ token: string }>(`${API_URL}/api/auth/login`, {
  email: "test@example.com",
  password: "123456"
});

const token = res.data.token;


  // 2️⃣ Connect socket with JWT
  const socket = io(API_URL, {
    auth: {
      token
    }
  });

  const roomId = "test-room-123";

  socket.on("connect", () => {
    console.log("Authenticated socket connected:", socket.id);

    socket.emit("room:join", roomId);

    setTimeout(() => {
      socket.emit("chat:message", {
        roomId,
        message: "Hello from authenticated socket!",
        sender: socket.id
      });
    }, 1000);
  });

  socket.on("chat:new-message", (data) => {
    console.log("New chat message:", data);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });
}

start();
