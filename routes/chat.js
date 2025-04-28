import express from "express";
import jwt from "jsonwebtoken";
import Chat from "../models/Chat.js";

const router = express.Router();

// Send message
router.post("/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { message } = req.body;

  if (!token) return res.status(401).json({ msg: "No token" });
  if (!message || message.trim() === "") return res.status(400).json({ msg: "Empty message" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const groupId = req.params.id;

    const chat = await Chat.create({
      group: groupId,
      user: userId,
      message,
    });

    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// Get messages for group
router.get("/:id", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const groupId = req.params.id;

    const chats = await Chat.find({ group: groupId })
      .populate("user", "email")
      .sort({ createdAt: 1 }); // oldest to newest

    res.json(chats);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

export default router;
