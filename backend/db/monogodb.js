import mongoose from "mongoose";

async function connectDB() {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URL)

        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch(err) {
        console.log("MongoDB connection Error: ", err.message);
    }
}

export default connectDB;