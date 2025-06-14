import mongoose, { mongo } from 'mongoose';

export const connectDB = async () => {
// const mongouri=process.env.MONGO_URI
// console.log(mongouri);
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};