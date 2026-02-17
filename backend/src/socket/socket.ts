import { Server, Socket } from "socket.io";

export const initSocket = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);

    // -------------------- YouTube Sync --------------------
    socket.on(
      "youtube:sync",
      (payload: {
        roomId: string;
        action: "play" | "pause" | "load";
        time?: number;
        videoId?: string;
      }) => {
        const { roomId } = payload;

        // Debug log (optional)
        console.log("youtube:sync relay:", payload);

        // Just relay the payload to others in the room
        socket.to(roomId).emit("youtube:sync", payload);
      }
    );

    // -------------------- Chat Typing --------------------
    socket.on("chat:typing", (roomId: string) => {
      socket.to(roomId).emit("chat:typing", {
        socketId: socket.id,
      });
    });

    socket.on("chat:stop-typing", (roomId: string) => {
      socket.to(roomId).emit("chat:stop-typing", {
        socketId: socket.id,
      });
    });

    // -------------------- Chat Messages --------------------
    socket.on(
      "chat:message",
      (payload: { roomId: string; message: string; sender: string }) => {
        const { roomId, message, sender } = payload;

        io.to(roomId).emit("chat:new-message", {
          sender,
          message,
          timestamp: new Date().toISOString(),
        });
      }
    );

    // -------------------- Room Join / Leave --------------------
    socket.on("room:join", (roomId: string) => {
      socket.join(roomId);
      console.log(`Socket ${socket.id} joined room ${roomId}`);

      socket.to(roomId).emit("room:user-joined", {
        socketId: socket.id,
      });
    });

    socket.on("room:leave", (roomId: string) => {
      socket.leave(roomId);
      console.log(`Socket ${socket.id} left room ${roomId}`);

      socket.to(roomId).emit("room:user-left", {
        socketId: socket.id,
      });
    });

    // -------------------- WebRTC Ready Handshake --------------------
    socket.on("webrtc:ready", (payload: { roomId: string }) => {
      const { roomId } = payload;

      socket.to(roomId).emit("webrtc:ready", {
        from: socket.id,
      });
    });

    // -------------------- WebRTC Signaling --------------------
    socket.on("webrtc:offer", (payload: { roomId: string; offer: any }) => {
      const { roomId, offer } = payload;

      socket.to(roomId).emit("webrtc:offer", {
        offer,
        from: socket.id,
      });
    });

    socket.on("webrtc:answer", (payload: { roomId: string; answer: any }) => {
      const { roomId, answer } = payload;

      socket.to(roomId).emit("webrtc:answer", {
        answer,
        from: socket.id,
      });
    });

    socket.on(
      "webrtc:ice-candidate",
      (payload: { roomId: string; candidate: any }) => {
        const { roomId, candidate } = payload;

        socket.to(roomId).emit("webrtc:ice-candidate", {
          candidate,
          from: socket.id,
        });
      }
    );

    // -------------------- Disconnect --------------------
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
