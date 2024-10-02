import { errorHandler } from "../utils/errorHandler.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if (!token) {
            next(errorHandler(401, "Unauthorized request"))
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if (!user) {
            next(errorHandler(401, "Invalid Access Token"))
        }
    
        req.user = user;
        next()
    } catch (error) {
        next(errorHandler(401, error?.message || "Invalid access token"))
    }
    
})