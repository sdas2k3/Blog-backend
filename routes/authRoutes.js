import express from "express";
import bcrypt from "bcrypt";
import User from "../models/User.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(200).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }
    jwt.sign(
      { username, id: user._id },
      process.env.JWT_SECRET,
      {},
      (err, token) => {
        if (err) throw err;
        res.cookie("token", token).json({
          id: user._id,
          username,
        });
      }
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

authRouter.post("/logout", (req, res) => {
  res.cookie("token", "").json("ok");
});

export default authRouter;
