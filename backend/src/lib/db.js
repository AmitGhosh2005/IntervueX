import mongoose from "mongoose";
import { ENV } from "./env.js";

export const connectDB = async()=>{
    try {
        const conn = await mongoose.connect(ENV.DB_URL);
        console.log("connected to MongoDb", conn.connection.host);
    } catch (error) {
        console.error("failed to connect db ",error);
        process.exit(1);
    }
}