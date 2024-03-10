import dotenv from "dotenv";
import multer from "multer";
dotenv.config();
import { v2 as cloudinaryV2 } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";

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
