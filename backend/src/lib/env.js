import dotenv from "dotenv";
dotenv.config();

export const ENV = {
    PORT: process.env.PORT|| 5000,
    NODE_ENV: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET,
    MONGO_URI:process.env.MONGO_URI,
    FRONTEND_APP_URL:process.env.FRONTEND_APP_URL,
    ARCJET_KEY:process.env.ARCJET_KEY,
    EMAIL_USER:process.env.EMAIL_USER,
    EMAIL_PASS:process.env.EMAIL_PASS,
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET
}