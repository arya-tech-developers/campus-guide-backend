import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
        // get cookie from request
        // check if cookie exsists

        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("bearer ", "")
        if (!token) {
            throw new ApiError(400,"Unauthorised access !");
        }

        // check if cookie is correct
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            console.log(decodedToken);
            throw new ApiError(400, "User session expired !")
        }

        // decode cookie and get userid
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
        if(!user) {
            throw new ApiError(400,"User session expired !")
        }

        // insert user object in req object
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(error.statusCode,error.message)
    }

})

export default verifyJWT;