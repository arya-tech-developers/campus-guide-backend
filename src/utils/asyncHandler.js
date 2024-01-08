const asyncHandler = (requestHandler) =>(req,res,next)=>{
    Promise.resolve(requestHandler(request,res,next)).reject((err)=>next(err))
}


export {asyncHandler};