import mongoose, { Schema, Document, Types } from "mongoose";

export interface IRoom extends Document {
  roomId: string;          // public invite id
  host: Types.ObjectId;   // user who created the room
  participants: Types.ObjectId[];
  createdAt: Date;
  isActive: boolean;
}

const RoomSchema = new Schema<IRoom>(
  {
    roomId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    host: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

const Room = mongoose.model<IRoom>("Room", RoomSchema);

export default Room;
