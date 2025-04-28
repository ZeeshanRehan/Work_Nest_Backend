import express from "express";
import jwt from "jsonwebtoken";
import Group from "../models/Group.js";
import User from "../models/User.js";
import Entry from "../models/Entry.js";

const router = express.Router();

// Create Group
router.post("/create", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  const { name } = req.body;

  if (!token) return res.status(401).json({ msg: "No token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const inviteCode = Math.random().toString(36).substring(2, 8); // short unique code

    const newGroup = await Group.create({
      name,
      inviteCode,
      createdBy: userId,
      members: [userId],
      metrics: [] // empty for now
    });

    res.status(201).json(newGroup);
  } catch (err) {
    res.status(500).json({ msg: "Server error", err });
  }
});

// Get groups for logged-in user
router.get("/my-groups", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const groups = await Group.find({ members: userId }).sort({ createdAt: -1 });
      res.json(groups);
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });
  
  // Join a group using invite code
router.post("/join/:code", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
  
      const group = await Group.findOne({ inviteCode: req.params.code });
  
      if (!group) return res.status(404).json({ msg: "Group not found" });
  
      // Already a member?
      if (group.members.includes(userId)) {
        return res.status(400).json({ msg: "You're already in this group" });
      }
  
      group.members.push(userId);
      await group.save();
  
      res.json(group);
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });

  router.get("/:id", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const group = await Group.findById(req.params.id).populate("members", "email");
      if (!group) return res.status(404).json({ msg: "Group not found" });
  
      res.json(group);
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });

  // Add a new metric to a group
  router.post("/:id/metrics", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const { name, type } = req.body;
  
    console.log("🔥 HIT METRICS ROUTE");
    console.log("name:", name);
    console.log("type:", type);
    console.log("group ID:", req.params.id);
  
    if (!token) return res.status(401).json({ msg: "No token" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const group = await Group.findById(req.params.id);
      console.log("group found:", group);
  
      if (!group) return res.status(404).json({ msg: "Group not found" });
  
      const alreadyExists = group.metrics.some((m) => m.name === name);
      if (alreadyExists) {
        return res.status(400).json({ msg: "Metric already exists" });
      }
  
      group.metrics.push({ name, type });
      await group.save();
  
      res.json(group);
    } catch (err) {
      console.error("❌ SERVER ERROR IN METRICS ROUTE:", err); // ADD THIS
      res.status(500).json({ msg: "Server error", err });
    }
  });

  router.post("/:id/entry", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    const { values } = req.body;
  
    if (!token) return res.status(401).json({ msg: "No token" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      const groupId = req.params.id;
      const date = req.query.date || new Date().toISOString().split("T")[0]; // ✅ Respect the date from frontend
let entry = await Entry.findOne({ group: groupId, user: userId, date });

  
if (!entry) {
  entry = new Entry({ group: groupId, user: userId, date, values }); // ✅ Use date here too
} else {
  entry.values = values;
}

  
      await entry.save();
      res.json(entry);
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });

  // Get all entries for group for today
  router.get("/:id/entries", async (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ msg: "No token" });
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const groupId = req.params.id;
  
      const date = req.query.date || new Date().toISOString().split("T")[0]; // 👈 here’s the change
  
      const entries = await Entry.find({ group: groupId, date })
        .populate("user", "email");
  
      res.json(entries);
    } catch (err) {
      res.status(500).json({ msg: "Server error", err });
    }
  });
  

  
  
  

export default router;
