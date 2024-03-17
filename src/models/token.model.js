import { User } from "./user.model.js";
import  mongoose  from "mongoose";


const emailVerificationToken = new mongoose.Schema({
    _userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    token:{
        type:String,
        require:true
    },
    expireAt:{
        type:Date,
        default:Date.now,
        index:{
            expires: 600000
        }
    }
})


export const EmailVerificationModel =  mongoose.model("EmailVerificationToken",emailVerificationToken);
