// const asyncHandler = (requestHandler) =>(req,res,next)=>{
//     Promise.resolve(requestHandler(request,res,next)).reject((err)=>next(err))
// }

import { ApiResponse } from "./ApiResponse.js";


const asyncHandler = (requestHandler) => 
    async (req, res, next) => {
        try {
            return await requestHandler(req, res, next);
        } catch (error) {
            res.status(500).json(new ApiResponse(error.statusCode||500, {}, error.message));

        }

    }


export { asyncHandler };