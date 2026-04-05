import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import { getMessages, sendMessage, sendImageMessage } from '../controllers/chatController.js';
import { protect } from '../middleware/authMiddleware.js';

import fs from 'fs';
import path from 'path';

const router = express.Router();

let upload;

if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'twoverse/chat',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    },
  });
  upload = multer({ storage: storage });
} else {
  const storage = multer.diskStorage({
    destination(req, file, cb) {
      if (!fs.existsSync('uploads')) fs.mkdirSync('uploads');
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    }
  });
  upload = multer({ storage });
}

router.route('/')
  .get(protect, getMessages)
  .post(protect, sendMessage);

router.post('/image', protect, upload.single('image'), sendImageMessage);

export default router;
