import mongoose from "mongoose";

const uploadSchema = new mongoose.Schema({
    filename: {
        type: String,
        required: true,
    },
    filetype: {
        type: String,
        required: true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})