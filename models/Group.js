import mongoose from "mongoose";

const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  inviteCode: { type: String, required: true, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  metrics: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true }, // "number", "boolean", "text"
    }
  ]
}, { timestamps: true });

export default mongoose.model("Group", groupSchema);
