import { Request, Response } from 'express';
import dotenv from 'dotenv'
dotenv.config();
// DO NOT config cloudinary again here
import cloudinary from '../config/cloudinary'; // just import
import { v2 } from 'cloudinary';
import streamifier from 'streamifier';
import Tesseract from 'tesseract.js';
import pdfParse from 'pdf-parse';
import Upload from '../models/upload.model';
import Chat from '../models/chat.model';
import { UserDocument } from '../models/user.model';

v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});


interface AuthRequest extends Request {
  file?: Express.Multer.File;
  user?: UserDocument;
}

// -------------------------------
// 📸 PROFILE PICTURE UPLOAD
// -------------------------------
export const handleProfileUpload = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file)return res.status(400).json({ message: 'No file uploaded' });

    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized' });

    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'thinkfast/profile_pics',
          resource_type: 'image',
        },
        (err, result) => {
          if (err || !result) return reject(err);
          resolve(result as { secure_url: string });
        }
      );
      streamifier.createReadStream(req.file!.buffer).pipe(stream);
    });

    res.status(200).json({
      message: 'Profile uploaded successfully',
      profilePic: result.secure_url,
    });
  } catch (err) {
    console.error('❌ Profile Upload Error:', err);
    res.status(500).json({ message: 'Profile picture upload failed' });
  }
};

// -------------------------------
// 🧠 CHAT FILE UPLOAD (image/pdf)
// -------------------------------
export const handleChatUpload = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
    if (!req.user?._id) return res.status(401).json({ message: 'Unauthorized' });

    const { mimetype, originalname, buffer } = req.file;
    const isImage = mimetype.startsWith('image/');
    const isPdf = mimetype === 'application/pdf';

    if (!isImage && !isPdf) {
      return res.status(400).json({ message: 'Only images or PDFs are allowed' });
    }

    // Upload to Cloudinary
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: 'thinkfast/chat_uploads',
          resource_type: 'auto',
        },
        (err, result) => {
          if (err || !result) return reject(err);
          resolve(result as { secure_url: string });
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });

    // Extract text
    let extractedText = '';
    if (isImage) {
      const ocr = await Tesseract.recognize(buffer, 'eng');
      extractedText = ocr.data.text.trim();
    } else {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text.trim();
    }

    if (!extractedText || extractedText.length < 5) {
      extractedText = 'No readable text extracted from file.';
    }

    // Save to DB
    const [upload, chat] = await Promise.all([
      Upload.create({
        filename: originalname,
        filetype: mimetype,
        fileUrl: result.secure_url,
        uploadedBy: req.user._id,
      }),
      Chat.create({
        user: req.user._id,
        messages: [
          {
            role: 'user',
            content: extractedText,
          },
        ],
      }),
    ]);

    res.status(200).json({
      message: 'Upload successful',
      fileUrl: result.secure_url,
      extractedText,
      uploadId: upload._id,
      chatId: chat._id,
    });
  } catch (err) {
    console.error('❌ Chat Upload Error:', err);
    res.status(500).json({ message: 'Chat file upload failed' });
  }
};

