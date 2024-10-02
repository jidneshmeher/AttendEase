import bcrypt from "bcryptjs"

export const hashPassword = async(password) => {
    return await bcrypt.hash(password, 8);
}

export const verifyPassword = async(password,hash) => {
    return await bcrypt.compare(password,hash)
}