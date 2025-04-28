import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("Connected to DB ✅");

    await mongoose.connection.collection("groups").drop();
    console.log("🧹 'groups' collection dropped!");

    process.exit();
  })
  .catch((err) => {
    console.error("❌ Error dropping collection:", err);
    process.exit(1);
  });
