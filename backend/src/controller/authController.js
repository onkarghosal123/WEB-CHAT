import cloudinary from "../lib/cloudinary.js";
import { setCookie } from "../lib/cookie.js";
import { welcomeEmail, otpEmail } from "../lib/resendWelcomeEmail.js";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { otpEmailTemplate } from "./emailComponent.js";
//import { ENV } from "../lib/env.js";

export const signUp = async (req, res) => {
    const { fullName, email, password } = req.body;
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password should be 6 character" })
        }

        // check if emailis valid: regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: "Invalid email format" });
        }

        const user = await User.findOne({ email });
        if (user)
            return res.status(400).json({ message: "User alreday exists." })
        //Generate Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const newUser = await new User({
            fullName, email, password: hashPassword
        })
        await newUser.save();
        if (newUser) {
            welcomeEmail(newUser.email, newUser.fullName)
        }
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            fullName: newUser.fullName
        })

    } catch (error) {
        console.log("Error in signup controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }

}

export const sendOtp = async (req, res) => {
    const { email, password } = req.body;
    console.log(email,password)
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required." });
    }
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials !" })
        }
        const isPassCorrect = await bcrypt.compare(password, user.password)
        if (!isPassCorrect) {
            return res.status(400).json({ message: "Invalid credentials !" })
        }
        //generate Otp
        const generatedOtp = Math.floor(100000 + Math.random() * 900000);
        console.log(generatedOtp)
        user.otp = generatedOtp;
        user.otpExpiry = new Date(Date.now() + 5 * 60 * 1000)
        await user.save()
        //send otp in email
        await otpEmail(user.email, generatedOtp)
        res.status(201).json({
            email: user.email,
        })
    } catch (error) {
        console.log("Error in sendOtp controller", error)
        res.status(500).json({ message: "Internal server Error" })
    }
}


export const logIn = async (req, res) => {

    const { email, otp } = req.body;
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials !" })
        }
        //verify otp
        if(new Date()>user.otpExpiry){
            return res.status(400).json({message:"Invalidd OTP"})
        }
        console.log(user.otp)
        if(user.otp!==otp){
            return res.status(400).json({message:"Invalid OTP"})
        } 
        user.otp = undefined
        user.otpExpiry = undefined
        await user.save()
        console.log("Otp verified successfully.")
        setCookie(user._id, res)
        res.status(201).json({
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in Login controller", error)
        res.status(500).json({ message: "Internal server Error" })
    }

}

export const logOut = (req, res) => {
    res.cookie("jwt", "", { maxAge: 0 })
        .status(200)
        .json({ message: "Logged out successfully" });

};

export const updateProfilePic = async (req, res) => {
    const profilePic = req.file;
    console.log(profilePic)
    if (!profilePic)
        return res.status(400).json({ message: "Profilepic required." })
    try {
        const userId = req.user._id
        const uploadedPic = await cloudinary.uploader.upload(profilePic.path);
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadedPic.secure_url }, { new: true })
        res.status(201).json({
            _id: updatedUser._id,
            email: updatedUser.email,
            fullName: updatedUser.fullName,
            profilePic: updatedUser.profilePic
        })

    } catch (error) {
        console.log("Error in updateProfilePic controller", error)
        res.status(500).json({ message: "Internal server Error" })
    }


}