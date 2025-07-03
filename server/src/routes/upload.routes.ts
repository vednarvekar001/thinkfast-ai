import express from 'express'
import { handleChatUpload, handleProfileUpload } from '../controllers/upload.controller'
import { Router } from 'express'
import checkAuth from '../middlewares/auth.middleware'
import chatUpload from '../middlewares/uploadChat.middleware'
import profileUpload from '../middlewares/uploadProfile.middleware'


const router = Router()

router.post('/profile', checkAuth, profileUpload.single('file'), handleProfileUpload);

router.post('/chat', checkAuth, chatUpload.single('file'), handleChatUpload);

export default router;