import dotenv from "dotenv";
import multer from "multer";
import cloudinary from "cloudinary"
dotenv.config();
import { CloudinaryStorage } from "multer-storage-cloudinary";

const { v2: cloudinaryV2 } = cloudinary;

cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryV2,
  params: {
    folder: "uploads",
    allowed_formats: ["jpg", "jpeg", "png", "gif"],
  },
});

const upload = multer({ storage: storage });

export default upload;
