import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model'; // adjust path if needed

dotenv.config();

const checkAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'Unauthorized access, Please login' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string };

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'User not found' });
      return;
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token, Please login again' });
  }
};


export default checkAuth;
