import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import groupRoutes from "./routes/group.js";
import authRoutes from "./routes/auth.js";
import chatRoutes from "./routes/chat.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/group", groupRoutes);
app.get("/", (req, res) => {
  res.send("Bhaichara backend is running 👊");
});
app.use("/api/chat", chatRoutes);

// DB connection + Start server
console.log("trying to connect to db");
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("connected to db");
    app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
  })
  .catch((err) => console.error("DB connection failed", err));
