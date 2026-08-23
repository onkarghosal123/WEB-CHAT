import nodemailer from "nodemailer"
import { ENV } from "./env.js"
import { createWelcomeEmailTemplate, otpEmailTemplate } from "../controller/emailComponent.js"
//create transporter
const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:ENV.EMAIL_USER,
        pass:ENV.EMAIL_PASS
    }
})
//sending welcome email
 export const welcomeEmail =async (email,name)=>{
  const mailFormat = {
    from:"onkarghosal49@gmail.com",
    to:email,
    subject:"Welcome to WEB-CHAT !",
    html:createWelcomeEmailTemplate(name,ENV.FRONTEND_APP_URL)
}
try {
    await transporter.sendMail(mailFormat);
    console.log("Welcome email sent successfully.")
    
} catch (error) {
    console.log("error in sending welcome mail",error)
}}
//sending otp email
export const otpEmail = async (email,otp)=>{
  const mailFormat = {
    from:"onkarghosal49@gmail.com",
    to:email,
    subject:"OTP for Web-Chat verification.",
    html:otpEmailTemplate(otp)
}
try {
    await transporter.sendMail(mailFormat);
    console.log("otp email sent successfully.")
    
} catch (error) {
    console.log("error in sending Otp mail",error)
}
}


