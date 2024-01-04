import dotenv from "dotenv";
import { DB_Name } from "../constants.js";
import mongoose from "mongoose";

dotenv.config()

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.DATABASE_URI}/${DB_Name}`);
        console.log("MongoDB connected Succesfully !! DB HOST: ", connectionInstance.connection.host);
    } catch (error) {
        console.log("Error in DB Connection ", error);
        process.exit(1);
    }
}

export default connectDB;