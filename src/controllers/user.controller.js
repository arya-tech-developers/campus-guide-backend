import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespose.js";
import jwt from "jsonwebtoken";
import { options } from "../constants.js";


const generateRefreshAndAccessTokens = asyncHandler(async (userId) => {
    const user = await User.findById(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    
   
    return { accessToken, refreshToken }

})


const registerUser = async (req, res) => {
    try {
        // collect data from user
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;
        const college = req.body.college;
        const branch = req.body.branch;
        const semester = req.body.semester;

        // console.log(req,name, email, password, college, branch, semester) 
        // validate collected data
        if ([name, email, password, college, branch, semester].some((feild) => feild?.trim() === "")) {
            throw new ApiError(400, "All feilds required! ");
        }
        // check if user already exsists

        const existedUser = await User.findOne({ email: email }); // return null if not find
        if (existedUser) throw new ApiError(400, "User already exsists!");

        //save data in database
        const user = await User.create({
            name,
            email,
            password,
            college,
            branch,
            semester,

        })

        const registeredUser = await User.findById(user._id).select("-password -refreshToken -__v");
        if (registeredUser) {
            res.status(201).json(new ApiResponse(201, registeredUser, "User created Successfully!"));
        }
    } catch (error) {
        console.log(error.statusCode, error.message);
        res.status(400).json(new ApiResponse(error.statusCode, {}, error.message))
    }
    // return response to user
}

const loginUser = async (req, res) => {
    try {
        // get user email
        const email = req.body.email;
        const password = req.body.password;
        // check if user exsits
        const user = await User.findOne({ email: email })
        // if user exsists ==> check password for user
        // if user doen not exsist show user not find response to user
        if (!user) {
            throw new ApiError(401, "User does not exsits !")
        }
        const isUserValidated = await user.isPasswordCorrect(password);

        // if password match show unsuccesfull login msg to user
        if (!isUserValidated) {
            throw new ApiError(400, "email and password combination not correct !");
        }
        // if password match with user password send response with acces token and refresh token
        const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(user._id);
        const loggedInUser = await User.findById(user._id).select("-password -refreshToken -refreshtoken -__v");


        res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(new ApiResponse(200, loggedInUser, "User login Succesfull !"));

    }
    catch (error) {
        res.status(error.statusCode).json(new ApiResponse(error.statusCode, {}, error.message));
    }
}

const logoutUser = async (req, res) => {
    //user ._id access 
    // await User.findByIdAndUpdate(req.user._id,{$set:{refreshToken:undefined}},{ new:true })

    try {
        const user = await User.findById(req.user._id);
        user.refreshToken = undefined
        await user.save({ validateBeforeSave: false })

        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json(new ApiResponse(200, {}, "User logout successfully! "))

        // query database for user
        // remove refresh token from database
        // remove cookies
    } catch (error) {
        res.status(500).json(new ApiResponse(500, {}, "Interval Server Error!"))
    }
}


const refreshAccessToken = asyncHandler(async (req, res, next) => {
    try {
        // get incoming token
        const incomingrefreshToken = req.cookies?.refreshToken || req.header("Authorization").replace("Bearer ", "")
    
        // check if token is present
        if (!incomingrefreshToken) {
            throw new ApiError(400, "Invalid refresh token ");
        }
       
        // decode incoming token
        const decodedToken = jwt.verify(
            incomingrefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        // check if token is not tempered
        if (!decodedToken) {
            throw new ApiError(400, "Invalid refresh token");
        }
        // check if playload is present
        // query user from database
        const user = await User.findById(decodedToken?._id)
        if (!user) {
            throw new ApiError(400, "Invalid refresh token");
        }
        // check both tokens are same
        console.log(" ",decodedToken)
        if (user?.refreshToken !== incomingrefreshToken) {
            throw new ApiError(400, "Refresh token expired!");
        }
        // if both tokens are same generate new tokens 
        const { accessToken, refreshToken } = await generateRefreshAndAccessTokens(user?._id)

        // send new tokens as a response
        res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken",refreshToken,options).json(new ApiResponse(200,{},"Session refreshed succesfully!"))
    } catch (error) {
        throw new ApiError(500,error.message);
    }
})

export { registerUser, loginUser, logoutUser, refreshAccessToken };