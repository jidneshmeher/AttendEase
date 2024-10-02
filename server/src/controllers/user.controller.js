import { User } from "../models/user.model.js";
import { apiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { errorHandler } from "../utils/errorHandler.js";
import { hashPassword, verifyPassword } from "../utils/bcrypt.js";
import { generateTokens } from "../services/token.service.js";
 
export const signUp = asyncHandler(async(req,res,next) => {
    
    let {name,email,password} = req.body

    name = name?.trim()
    email = email?.trim()
    password = password?.trim()

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

export const signIn = asyncHandler(async(req,res,next) => {

    let {email, password} = req.body

    email = email?.trim()
    password = password?.trim()

    if(!email || !password){
        return next(errorHandler(400,"Invalid credentials"))
    }

    const validUser = await User.findOne({email})

    if(!validUser){
        return next(errorHandler(401,"Account with this email not exist"))
    }

    const hash = validUser.password

    const validPassword = await verifyPassword(password,hash)

    if(!validPassword){
        return next(errorHandler(401,"Invalid Password"))
    }
    
    const {accessToken,refreshToken} = await generateTokens(validUser._id)

    validUser.refreshToken = refreshToken
    await validUser.save()

    const loggedInUser = await User.findById({_id:validUser._id}).select("-password -refreshToken")

    if(!loggedInUser){
        return next(errorHandler(400,"Error while Signing In"))
    }

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiResponse(200,"SignIn Successfull",loggedInUser))

})

export const logout = asyncHandler(async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 
            }
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiResponse(200, "User logged Out",{}))
})

export const refreshAccessToken = asyncHandler(async (req, res, next) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

    if (!incomingRefreshToken) {
        next(errorHandler(401, "unauthorized request"))
    }

    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
    
        if (!user) {
            next(errorHandler(401, "Invalid refresh token"))
        }
    
        if (incomingRefreshToken !== user?.refreshToken) {
            next(errorHandler(401, "Refresh token is expired or used"))            
        }
    
        const options = {
            httpOnly: true,
            secure: true
        }
    
        const {accessToken, newRefreshToken} = await generateTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new apiResponse(
                200, 
                "Access token refreshed",
            )
        )
    } catch (error) {
        next(errorHandler(401, error?.message || "Invalid refresh token"))
    }

})

