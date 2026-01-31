import mongoose from "mongoose";
import "dotenv/config"

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`Database connected successfully to the host: ${conn.connection.host}`);
        
    } catch (error) {
        
    }
}