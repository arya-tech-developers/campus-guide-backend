import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { QuestionPaper } from "../models/questionPaper.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { fileUpload } from "../utils/fileUpload.js";
import fs from "fs";


const uploadQuestionPaper = asyncHandler(async (req, res, next) => {

    try {
        const subject = req.body.subject;
        const subjectCode = req.body.subjectCode;
        const paperYear = req.body.paperYear;
        const semester = req.body.semester;
        const course = req.body.course;
        const branch = req.body.branch;
        const questionPaperLocalPath = req.file?.path;
        const user = req.user;

        if ([subject, subjectCode, paperYear, semester, course, branch, questionPaperLocalPath].some((feild) => feild?.trim() === "")) {
            throw new ApiError(400, "All feilds are required!");
        }

        const isQuestionPaperAvaliable = await QuestionPaper.findOne({
            $and: [{ subject }, { paperYear }, { semester }, { branch }, { course }]
        })
        if (isQuestionPaperAvaliable) {
            fs.unlinkSync(questionPaperLocalPath);
            throw new ApiError(400, "Question Paper Already Avaliable! ");
        }

        const questionPaper = await QuestionPaper.create({
            localUrl: questionPaperLocalPath,
            subject,
            subjectCode,
            paperYear,
            semester,
            branch,
            course,
            uploadedBy: user
        });

        res.status(200).json(new ApiResponse(201, {}, "Question Paper Uploaded Successfully!"));

    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }

})
const listUnverifiedQuestionPaper = asyncHandler(async (req, res, next) => {
    const unverifiedQuestionPaperList = await QuestionPaper.find({ isVerified: false })
    if (!unverifiedQuestionPaperList) {
        throw new ApiError(500, "cannot load unverified question papers ")
    }

    res.status(200).json(new ApiResponse(200, unverifiedQuestionPaperList, "unverified question paper list loaded succesfully!"))
}
)


const verifyQuestionPaper = asyncHandler(async (req, res, next) => {
    try {
        // get questionid and verificationState from request

        const questionPaperId = req.body?.questionPaperId;
        const isVerified = req.body?.isVerified;
        console.log(questionPaperId, isVerified) // for testing of data

        // query question paper from database
        const questionPaper = await QuestionPaper.findById(questionPaperId);
        if (!questionPaper) {
            throw new ApiError(400, "Question paper not exsists!");
        }

        /* if isVerified === true  
            1. upload questionPaper to cloudinary
            2. update public url and format in Question Paper database   */

        if (isVerified) {
            const cloudinaryResponse = await fileUpload(questionPaper.localUrl)
            if (!cloudinaryResponse) {
                throw new ApiError(500, "Something went wrong while uploading resource to cloud!")
            }
            questionPaper.publicUrl = cloudinaryResponse.url;
            questionPaper.localUrl = "/"
            questionPaper.isVerified = true
            questionPaper.save();
            res.status(200).json(new ApiResponse(200, {}, "Question paper verified successfully!"))
        }
        else {
            const deletedQuestionPaper = await QuestionPaper.deleteOne({ _id: questionPaper._id })
            if (!deletedQuestionPaper.acknowledged) {
                throw new ApiError(500, "Question Paper cannot be deleted!");
            }
            res.status(200).json(new ApiResponse(200, {}, "Question Paper deleted Succesfully! "));
        }
    } catch (error) {
        throw new ApiError(error.statusCode || 500, error.message);
    }

})




export { uploadQuestionPaper, listUnverifiedQuestionPaper, verifyQuestionPaper };





