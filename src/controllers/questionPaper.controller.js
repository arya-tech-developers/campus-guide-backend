import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js"
import { QuestionPaper } from "../models/questionPaper.model.js";
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
    
        console.log(subject,
                subjectCode,
                paperYear,
                semester,
                branch,
                course,
                questionPaperLocalPath,
                user
        );
    
        if([subject,subjectCode,paperYear,semester,course,branch,questionPaperLocalPath].some((feild)=>feild?.trim()==="")){
            throw new ApiError(400,"All feilds are required!");
        }   
    
        const isQuestionPaperAvaliable = await QuestionPaper.findOne({
            $or:[{subject},{paperYear},{semester},{branch},{course}]
        })
    
        if(isQuestionPaperAvaliable){
            throw new ApiError(400,"Question Paper Already Avaliable! ");
        }
        
        // console.log(await QuestionPaper.create({
        //     url:questionPaperLocalPath,
        //     subject,
        //     subjectCode,
        //     paperYear,
        //     semester,
        //     branch,
        //     course,
    
        // }));
    } catch (error) {
        throw new ApiError(500,"Internal Server Error!");
    }

})

export { uploadQuestionPaper };





