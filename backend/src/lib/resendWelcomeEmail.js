import nodemailer from "nodemailer"
import { ENV } from "./env.js"
import { createWelcomeEmailTemplate, otpEmailTemplate } from "../controller/emailComponent.js"
// create transporter
import dns from "dns";

dns.setDefaultResultOrder("ipv4first");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: ENV.EMAIL_USER,
        pass: ENV.EMAIL_PASS
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000
});

//Your Render service is trying to connect to Gmail's SMTP server over IPv6, but its network route doesn't support that connection, so the connection never reaches Gmail.
//Nodemailer uses smtp.gmail.com.
// Node.js asks DNS for Gmail's IP addresses.
// DNS returns both IPv4 and IPv6 addresses.
// Node chooses one according to its DNS result order.
// In your Render deployment, Node chose the IPv6 address:
// const transporter = nodemailer.createTransport({
//     service:"gmail",
//     auth:{
//         user:ENV.EMAIL_USER,
//         pass:ENV.EMAIL_PASS
//     }
// })

//sending welcome email

export const welcomeEmail = async (email, name) => {
    const mailFormat = {
        from: "onkarghosal49@gmail.com",
        to: email,
        subject: "Welcome to WEB-CHAT !",
        html: createWelcomeEmailTemplate(name, ENV.FRONTEND_APP_URL)
    }
    try {
        await transporter.sendMail(mailFormat);
        console.log("Welcome email sent successfully.")

    } catch (error) {
        console.log("error in sending welcome mail", error)
    }
}
//sending otp email
export const otpEmail = async (email, otp) => {
    const mailFormat = {
        from: "onkarghosal49@gmail.com",
        to: email,
        subject: "OTP for Web-Chat verification.",
        html: otpEmailTemplate(otp)
    }
    try {
        await transporter.sendMail(mailFormat);
        console.log("otp email sent successfully.")

    } catch (error) {
        console.log("error in sending Otp mail", error)
    }
}


