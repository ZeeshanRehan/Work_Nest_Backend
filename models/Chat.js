import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
}, { timestamps: true }); // ✅ automatically adds createdAt

export default mongoose.model("Chat", chatSchema);
