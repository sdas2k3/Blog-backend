import express from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();
const userRouter = express.Router();

userRouter.get("/profile", (req, res) => {
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, (err, info) => {
    if (err) {
      res.json(null);
      throw err;
    }
    res.json(info);
  });
});

export default userRouter;
 