import multer from 'multer';
// import { Request } from 'express';

const storage = multer.memoryStorage();

const profileUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed with a limit of 2mb!'));
    }
    cb(null, true);
  },
});

export default profileUpload; // field name from frontend
