import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,

    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    avatar:{
        type:String,
        default:"" , //default Icon link from Cloudinary
    },
    college:{
        type:String,
        trim:true,
        lowercase:true,
        default:"srgc",
    },
    branch:{
        type:String,
        trim:true,
        requird:true,
        enum:[cse,me,ece,ee,ce],
    },
    semester:{
        type:Number,
        required:true,
        enum:[1,2,3,4,5,6,7,8],
    },
    refreshtoken:{
        type:String,
        required:true,
    }
},{timestamps:true});


export const User = mongoose.model("User",userSchema);