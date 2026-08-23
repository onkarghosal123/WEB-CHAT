import express from "express";
import { ENV } from "./lib/env.js";
import authRoute from "./routes/authRoute.js"
import messageRoute from "./routes/messageRoute.js"
import { dbConnect } from "./lib/dbConnection.js";
import cookieParser from "cookie-parser"
import cors from "cors"
import {app,server} from "./lib/socket.js"

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser())
app.use(
    cors({
        origin:ENV.FRONTEND_APP_URL,
        credentials: true,
    })
)


app.use('/auth', authRoute)
app.use('/message', messageRoute)
app.get('/', (req, res) => {
    res.send("server is running on'/'")
})

server.listen(ENV.PORT, () => {
    console.log(`Server running on port ${ENV.PORT}`);
    dbConnect();

})

// when we deploy then we have yake care of 4 lines 
// 1.For frontend permission in backend
    //app.use(cors({
    // origin: process.env.CLIENT_URL,
    // credentials: true, }));
// 2.For socket server: 
    //const io = new Server(server, {cors: {
    // origin: process.env.CLIENT_URL,
    // credentials: true,  },});
//3.for socket connetion with backend
    //const socket = io(import.meta.env.VITE_SOCKET_URL, {
    //withCredentials: true,});
//4.Axios
    //axios.create({
    //baseURL: import.meta.env.VITE_BACKEND_URL,
    //withCredentials: true,});