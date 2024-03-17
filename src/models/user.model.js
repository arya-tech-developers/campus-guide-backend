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
        index:true,
        required:true,
        lowercase:true,
        trim:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        default:"pending"
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
    course:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
        // required:true,
        default:"b.tech"
    },
    semester:{
        type:String,
        required:true,
        enum:["1","2","3","4","5","6","7","8"],
    },
    branch:{
        type:String,
        trim:true,
        requird:true,
        enum:["cse","me","ece","ee","ce"],
    },
    refreshToken:{
        type:String,
        // required:true,
    }
},{timestamps:true});


userSchema.pre("save", async function(next){
    if(this.isModified("password")){
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password,salt);
    }
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