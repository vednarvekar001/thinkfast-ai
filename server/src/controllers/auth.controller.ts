import generateToken from '../config/jwt'
// import User from '../models/user.model'
import User, { UserDocument } from '../models/user.model';
import Chat from '../models/chat.model';
import bcrypt from 'bcrypt'
import { Request, Response } from 'express';


export const register = async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      res.status(400).json({ message: 'All fields are required' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ message: 'Password must be at least 6 characters long' });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser: UserDocument = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id.toString(), res);
      await newUser.save();

      // ✅ FIXED chat creation logic
      const existingChats = await Chat.find({ user: newUser._id });
      if (existingChats.length === 0) {
        await Chat.create({ user: newUser._id, messages: [] });
      }

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        message: 'User created successfully',
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error during register:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
        if(!email || !password) {
            res.status(400).json({ message: 'Email and password are required' });
            return; 
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: 'User does not exist. Please Register' });
            return; 
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
           res.status(400).json({ message: 'Invalid Credentials' });
           return;
        }

        const token = generateToken(user._id.toString(), res);

        res.status(200).json({
            _id: user._id,
            token,
            fullName: user.fullName,
            email: user.email,
            message: 'Login successful',
        });

    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export const logout = async (req: Request, res: Response) => {
    try {
        res.cookie("jwt", "", { maxAge: 0});
        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error);
        res.status(500).json({ message: 'Internal server error' });
        
    }
}
