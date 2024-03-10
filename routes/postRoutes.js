import express from "express";
import dotenv from "dotenv";
import upload from "../cloudinaryConfig.mjs";
import Post from "../models/Post.js";
import jwt from "jsonwebtoken";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cloudinary from "cloudinary";
import cloudinaryConfig from "../cloudinaryConfig.mjs";

cloudinary.config(cloudinaryConfig);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config();
const postRouter = express.Router();

const deleteFile = async (url) => {
  try {
    const publicId = extractPublicId(url);
    const result = await cloudinary.uploader.destroy(publicId);

    console.log("File deleted successfully:", result);
  } catch (error) {
    console.error("Error deleting file:", error);
  }
};

const extractPublicId = (url) => {
  const parts = url.split("/");
  const publicIdWithExtension = parts[parts.length - 1];
  const publicId = publicIdWithExtension.split(".")[0];
  return publicId;
};

postRouter.post("/create-post", upload.single("file"), (req, res) => {
  const fileUrl = req.file.path;
  const newPath = fileUrl;
  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) throw err;
    const { title, summary, content } = req.body;
    const postDoc = await Post.create({
      title,
      summary,
      content,
      cover: newPath,
      author: info.id,
    });
    res.json(postDoc);
  });
});

postRouter.get("/get-posts", async (req, res) => {
  res.json(
    await Post.find()
      .populate("author", ["username"])
      .sort({ createdAt: -1 })
      .limit(20)
  );
});

postRouter.get("/get-post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = await Post.findById(id).populate("author", ["username"]);
  res.json(postDoc);
});

postRouter.put("/update-post", upload.single("file"), (req, res) => {
  let newPath = null;
  if (req.file) {
    const fileUrl = req.file.path;
    const newPath = fileUrl;
  }

  const { token } = req.cookies;
  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, info) => {
    if (err) {
      res.json("ok");
      throw err;
    }
    const { id, title, summary, content } = req.body;
    const postDoc = await Post.findById(id);
    const isAuthor = JSON.stringify(postDoc.author) === JSON.stringify(info.id);
    if (!isAuthor) {
      return res.status(400).json("you are not the author");
    }
    const updates = {
      title,
      summary,
      content,
      cover: newPath ? newPath : postDoc.cover,
    };
    const updatedPost = await Post.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).send({ error: "Post not found" });
    }
    res.json(updatedPost);
  });
});

postRouter.delete("/delete-post/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { cover } = req.body;
    const deletedPost = await Post.findByIdAndDelete(postId);
    deleteFile(cover);
    if (!deletedPost) {
      return res.status(404).send({ error: "Post not found" });
    }
    res.status(200).json("Post Deleted Successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

export default postRouter;
