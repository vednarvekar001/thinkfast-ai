import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response, NextFunction } from 'express';
import User from '../models/user.model';
import { JwtPayload } from 'jsonwebtoken';

dotenv.config();

const checkAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // ✅ Use cookie only (if you're using cookie-based auth)
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'Unauthorized: No token provided' });
    return;
  }

  try {
    // ✅ Decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    const user = await User.findById(decoded.userId);
    if (!user) {
      res.status(401).json({ message: 'Unauthorized: User not found' });
      return;
    }

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default checkAuth;
