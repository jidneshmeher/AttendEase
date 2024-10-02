import jwt from "jsonwebtoken"

export const generateTokens = async(_id) => {
    try {
        const accessToken =  jwt.sign(
            {_id},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
        )

        const refreshToken =  jwt.sign(
            {_id},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
        )

        return {accessToken,refreshToken}

    } catch (error) {
        console.error("Error while generating tokens")    
    }

}