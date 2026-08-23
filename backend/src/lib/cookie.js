import { ENV } from "./env.js"
import jwt from "jsonwebtoken"

export const setCookie = (userId, res) => {
    if (!ENV.JWT_SECRET) {
        throw new Error("JWT_SECRET unavilable.")
    }
    const token = jwt.sign({ userId }, ENV.JWT_SECRET, { expiresIn: "5d" });
    if (token) {
        res.cookie("jwt", token, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // MS
            httpOnly: true, // prevent XSS attacks: cross-site scripting
            sameSite: ENV.NODE_ENV === "development" ? "lax" :"none" , // CSRF attacks
            secure: ENV.NODE_ENV === "development" ? false : true,
            path: '/'
        });
        console.log("cookie set");
    }


}