// const asyncHandler = (requestHandler) =>(req,res,next)=>{
//     Promise.resolve(requestHandler(request,res,next)).reject((err)=>next(err))
// }


const asyncHandler = async (requestHandler)=>{
    try{
        await requestHandler(req,res,next);
    }catch(error){
        res.status(error.code).json({
            succes:false,
            message:error.message
        })
    }
}

export {asyncHandler};