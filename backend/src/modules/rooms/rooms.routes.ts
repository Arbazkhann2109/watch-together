import { Router, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import Room from "../../models/Room";
import { authMiddleware } from "../../middleware/auth";

const router = Router();

// Create room (protected)
router.post("/create", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;

    const roomId = uuidv4();

    const room = await Room.create({
      roomId,
      host: userId,
      participants: [userId],
      isActive: true
    });

    return res.status(201).json({
      roomId: room.roomId
    });
  } catch (err) {
    console.error("Create room error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});

// Join room (protected)
router.post("/join/:roomId", authMiddleware, async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const { roomId } = req.params;

    const room = await Room.findOne({ roomId });

    if (!room || !room.isActive) {
      return res.status(404).json({ message: "Room not found or inactive" });
    }

    // Add user if not already in participants
    if (!room.participants.some(p => p.toString() === userId)) {
      room.participants.push(userId);
      await room.save();
    }

    return res.json({ message: "Joined room successfully" });
  } catch (err) {
    console.error("Join room error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});


export default router;
