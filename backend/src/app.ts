import express from "express";
import cors from "cors";
import helmet from "helmet";
import authRoutes from "./modules/auth/auth.routes";
import { authMiddleware } from "./middleware/auth";
import roomsRoutes from "./modules/rooms/rooms.routes";




export const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/api/protected/test", authMiddleware, (req, res) => {
  res.json({ message: "You are authenticated" });
});

app.use("/api/rooms", roomsRoutes);



app.get("/health", (_, res) => {
  res.json({ status: "ok" });
});
