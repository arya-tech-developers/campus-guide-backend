import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

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
        enum:["cse","me","ece","ee","ce"],
    },
    semester:{
        type:String,
        required:true,
        enum:["1","2","3","4","5","6","7","8"],
    },
    refreshtoken:{
        type:String,
        // required:true,
    }
},{timestamps:true});


userSchema.pre("save", async function(next){
    if(this.isModified("password"))
        this.password = await bcrypt.hash(this.password,10);
    next();
})

userSchema.methods.isPasswordCorrect = async function(password){
    return await  bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken = function(){
    return jwt.sign({
        _id:this._id,
        email:this.email,
        name:this.name,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
        expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
    },
    )
}

userSchema.methods.generateRefreshToken = function(){
    return jwt.sign({
        _id:this._id,    
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
    })
}

export const User = mongoose.model("User",userSchema);