import jwt from "jsonwebtoken"
import { ENV } from "../lib/env.js"
import User from "../models/user.js"

export const checkAuth = async (req, res, next) => {
   try {
     const token = req.cookies?.jwt
     if (!token)
         return res.status(400).json({ message: "you have to login" })
     const decoded = jwt.verify(token, ENV.JWT_SECRET)
     if (!decoded) return res.status.json({ message: "not verified" })
     const user = await User.findOne({_id:decoded.userId}).select("-password");
     if (!user) return res.status.json({ message: "Invalid data! User not found." })
         req.user = user;
     next();
   } catch (error) {
    
    console.log("Error in auth middleware:", error);
    res.status(500).json({ message: "Internal server error" });
   }
}