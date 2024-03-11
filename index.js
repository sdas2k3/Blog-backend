import express from "express";
import cors from "cors";
import mongoose, { mongo } from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";

dotenv.config();
const app = express();
mongoose
  .connect(process.env.MONGO_URI)
  .then(console.log("Connected with database"))
  .catch((err) => {
    console.log(err);
  });

// MiddleWare
app.use( 
  cors({  
    origin: "*",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"], 
  })  
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use("/api1/auth", authRouter);
app.use("/api1/user", userRouter);
app.use("/api1/post", postRouter);

app.get("/", (req, res) => {
  res.send("Hello World!!!");
});

app.get("/test", (req, res) => {
  res.send("Testing123....");
});

app.listen(process.env.PORT || 8000, () => {
  console.log("Server is running");
});
