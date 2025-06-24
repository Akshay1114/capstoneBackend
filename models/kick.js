import mongoose from "mongoose";

const kickSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true },
  time: { type: String, required: true },
  count: { type: Number, required: true },
}, { timestamps: true });

export const Kick = mongoose.model("Kick", kickSchema);
