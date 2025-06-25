import multer from 'multer';
// import { Request } from 'express';

const storage = multer.memoryStorage();

const chatUpload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed with a limit of 25mb!'));
    }
    cb(null, true);
  },
});

export default chatUpload.single('askUpload'); // field name from frontend


