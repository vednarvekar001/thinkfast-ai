import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
import { Response } from 'express';

const generateToken = (userId: string, res: Response) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET as string, 
        {expiresIn: "7d"});
    
    res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === '!development', // Use secure cookies in production
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return token;
}

export default generateToken;