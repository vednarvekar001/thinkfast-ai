import { Router } from 'express';
import { getUserProfile, updateProfilePicture } from '../controllers/user.controller';
import checkAuth from '../middlewares/auth.middleware';
import profileUpload from '../middlewares/uploadProfile.middleware';

const router = Router();

// View profile info
router.get('/settings', checkAuth, getUserProfile);

// Update profile picture
router.put('/settings/profile-pic', checkAuth, profileUpload.single('profilePic'), updateProfilePicture);

export default router;
