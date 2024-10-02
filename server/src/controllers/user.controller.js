import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import { hashPassword } from "../utils/bcrypt.js";

export const signIn = asyncHandler(async(req,res,next) => {
    
    let {name,email,password} = req.body

    if(!name || !email || !password){
        return next(errorHandler(400,"Invalid credentials"))
    }

    const existingUser = await User.findOne({email})

    if(existingUser){
        return next(errorHandler(400,"User already exist"))
    }

    const hashedPassword = await hashPassword(password)

    const newUser = new User({name,email,password:hashedPassword})
    await newUser.save()

    return res
    .status(201)
    .json(new apiResponse(201,"User created successfully",newUser))

})

