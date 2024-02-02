import connectDB from "./db/index.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config(
    {
    path:"./.env"
})

const port = process.env.PORT || 8000


connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`⚙️  Server is running at port: ${port}`);
    })
    app.on("error",(error)=>{
        console.log("Error: ",error);
        throw error;
    })
})
.catch((error)=>{
    console.log("MongoDB Connection Failed !!!",error);
})