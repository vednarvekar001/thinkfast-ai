import multer from 'multer';
// import { Request } from 'express';

const storage = multer.memoryStorage();

const chatUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB
  fileFilter: (req, file, cb) => {
    const isImage = file.mimetype.startsWith('image/');
    const isPdf = file.mimetype === 'application/pdf';

    if (!isImage && !isPdf) {
      return cb(new Error('Only image or PDF files are allowed (max 25MB)!'));
    }
    cb(null, true);
  },
});
export default chatUpload; // field name from frontend


