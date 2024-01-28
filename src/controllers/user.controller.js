import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiRespose.js";

const registerUser = async (req, res) => {
    try {
        // collect data from user
        const { name, email, password, college, branch, semester } = req.body;

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

        const registeredUser = await User.findById(user._id).select("-password -refreshtoken -__v");
        if(registeredUser){
            res.json(new ApiResponse(200,registeredUser,"User created Successfully!"));
        }
    } catch (error) {
        console.log(error.statusCode,error.message);
        res.status(400).json(new ApiResponse(error.statusCode,{},error.message))
    }
    // return response to user
    // res.status(200).json({
    //     message: "user created succesfully"
    // })


}


export { registerUser };