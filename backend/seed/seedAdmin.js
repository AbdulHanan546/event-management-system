import dotenv from "dotenv";
dotenv.config();
import { connectDB } from "../config/db.js";
import  User  from "../models/User.js";
import bcrypt from "bcryptjs";

const run = async () => {
  await connectDB();
  const email = process.env.SEED_ADMIN_EMAIL || "admin@codecilex.com";
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@123456";
  const name = process.env.SEED_ADMIN_NAME || "CodeCelix Admin";
  let user = await User.findOne({ email });
  if (!user) {
    const hashed = await bcrypt.hash(password, 10);
    user = await User.create({ name, email, password: hashed, role: "admin" });
    console.log("✅ Admin created:", email);
  } else {
    console.log("ℹ️ Admin already exists:", email);
  }
  process.exit(0);
};

run();
