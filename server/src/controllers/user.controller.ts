import { Request, Response } from 'express';
import User from '../models/user.model';
// import { UserDocument } from '../models/user.model';

export const getUserProfile = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.user._id).select('fullName email profilePic');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    console.error('Get Profile Error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const updateProfilePicture = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    // Uploaded to Cloudinary already by middleware
    const imageUrl = req.body.profilePicUrl;
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: imageUrl },
      { new: true, runValidators: true }
    ).select('profilePic');

    res.status(200).json({
      message: 'Profile picture updated',
      profilePic: updatedUser?.profilePic,
    });
  } catch (err) {
    console.error('Update Pic Error:', err);
    res.status(500).json({ message: 'Profile update failed' });
  }
};


export const getMe = async (req: Request, res: Response) => {
  const user = await User.findById(req.user._id).select("-password");
  res.status(200).json({ user });
};
