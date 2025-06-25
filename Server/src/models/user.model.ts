import mongoose, { Document, Schema } from "mongoose";

// 👇 This is just for type-checking
export interface UserDocument extends Document {
  fullName: string;
  email: string;
  password: string;
  profilePic?: string;
  _id: mongoose.Types.ObjectId; // 👈 ADD THIS LINE!
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      unique: true,
      minlength: 3,
      maxlength: 20,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 1024,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /.+\@.+\..+/,
    },
    profilePic: {
      type: String,
      default: "https://cdn-icons-png.flaticon.com/512/3177/3177440.png",
    },
  },
  { timestamps: true }
);

const User = mongoose.model<UserDocument>("User", userSchema);
export default User;
