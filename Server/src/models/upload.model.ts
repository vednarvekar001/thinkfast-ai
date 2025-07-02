import mongoose, {Schema, Document} from "mongoose";


export interface uploadDocument extends Document {
    filename: String,
    filetype: String,
    uploadedBy: mongoose.Schema.Types.ObjectId,
    createdAt: Date
}


const uploadSchema = new Schema({
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
    cloudinaryUrl: {
        type: String,
        required: true,
    },
    extractedText: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
},
{ timestamps: true },
);

const Upload = mongoose.model<uploadDocument>('Upload', uploadSchema)
export default Upload;