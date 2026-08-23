import jwt from "jsonwebtoken";
import { ENV } from "../lib/env.js";
import User from "../models/user.js";

export const socketMiddleware = async (socket, next) => {
    try {
        const token = socket.handshake.headers.cookie
            ?.split("; ")
            .find((row) => row.startsWith("jwt="))
            ?.split("=")[1];
        if (!token) {
            console.log("Socket connection rejected: No token provided");
            return next(new Error("Unauthorized - No Token Provided"));
        }
        const decoded = jwt.verify(token, ENV.JWT_SECRET)
        if (!decoded) {
            console.log("invalid token provided");
            return next(new Error("Unauthorized - invalid token"));
        }
        const user = await User.findOne({ _id: decoded.userId }).select("-password");
        if (!user) {
            console.log("Invalid User");
            return next(new Error("Unauthorzed - Invalid user"));
        }

        socket.user = user
        console.log("socketmiddleware",socket.user)
        next();
    } catch (error) {
        console.log("Error in socket middleware authentication:", error.message);
        next(new Error("Unauthorized - Authentication failed"));
    }
}