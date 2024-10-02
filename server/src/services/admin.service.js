import { User } from "../models/user.model.js";
import { hashPassword } from "../utils/bcrypt.js";

export const createAdmin = async () => {
    try {
        const existingAdmin = await User.findOne({ role: "Admin" });

        if (!existingAdmin) {
          const hash = await hashPassword(process.env.ADMIN_PASSWORD); 
          const admin = new User({
            name: "Website_Owner",
            email: process.env.ADMIN_EMAIL,
            password: hash,
            role: "Admin",
          });
          await admin.save();
        } 
    } catch (error) {
        console.error(`Error while creating admin,${error}`)
    }
};
