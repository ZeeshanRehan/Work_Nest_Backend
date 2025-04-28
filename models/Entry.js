import mongoose from "mongoose";

const entrySchema = new mongoose.Schema({
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: String, required: true }, // we'll use 'YYYY-MM-DD'
  values: {
    type: Map,
    of: mongoose.Schema.Types.Mixed, // handles numbers, booleans, strings
  }
}, { timestamps: true });

export default mongoose.model("Entry", entrySchema);
