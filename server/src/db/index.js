import mongoose from "mongoose"

export const connectDB = async() => {
    try{
        await mongoose.connect(process.env.MONGODB_URI)
    }catch(err){
        console.log(`MongoDB Connection Error ${err}`)
        process.exit(1)
    }
}