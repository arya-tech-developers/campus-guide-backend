import mongoose from "mongoose";
import { User } from "./user.model.js";


const questionPaperSchema = await mongoose.Schema({
    publicUrl: {
        type: String,   //from cloudinary
        // requried:true,
        default:"/"
    },
    localUrl:{
        type: String
    },
    format: {
        type: String,
    },
    subject: {
        type: String,
    },
    subjectCode: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    paperYear: {
        type: Date,
        required: true
    },
    course: {
        type: String,
        required: true,
        trim: true,
        // required:true,
        default: "b.tech",
        lowercase: true
    },
    branch: {
        type: String,
        required: true,
        trim: true,
        enum: ["cse", "me", "ece", "ee", "ce"],
        lowercase: true
    },
    semester: {
        type: Number,
        required: true,
        index: true,
        enum: [1, 2, 3, 4, 5, 6, 7, 8]
    },
    isVerified:{
        type:Boolean,
        default:false,
        index:true
    },
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, { timestamps: true })



export const QuestionPaper = await mongoose.model("QuestionPaper", questionPaperSchema);