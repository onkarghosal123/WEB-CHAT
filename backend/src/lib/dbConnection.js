import mongoose from "mongoose";
import { ENV } from "./env.js";

export const dbConnect = async () => {
  const mongo_uri = ENV.MONGO_URI;

  if (!mongo_uri) {
    console.log("MONGO_URI not available");
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(mongo_uri);

    console.log("Database:", mongoose.connection.name);
    console.log("Mongo DB connected:", conn.connection.host);
  } catch (error) {
    console.error("Mongo DB not connected:", error.message);
    process.exit(1);
  }
};