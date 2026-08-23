import { Server } from "socket.io"
import http from "http"
import express from "express"
import { ENV } from "./env.js";
import { socketMiddleware } from "../middleware/socketMiddleware.js";
import User from "../models/user.js";

const app = express();
const server = http.createServer(app)
console.log("creating socket server...")
const io = new Server(server, {
    cors: {
        origin: ENV.FRONTEND_APP_URL,
        credentials: true,
    }
})
// Create a object which store userid:socketid
const userSocketMap = {}

// apply authentication middleware to all socket connections.
// it runs socket.connect(); => socketMiddleware => "connection" event
io.use(socketMiddleware)

io.on("connection", (socket) => {
    console.log("socket connected. User:", socket.user.fullName)
    const userID = socket.user._id
    userSocketMap[userID] = socket.id
    console.log(userSocketMap)
    // after connection established send onlineusers list to all connected client
    // io.emit happens in real time.
    io.emit("getOnlineUsers", Object.keys(userSocketMap))

    socket.on("disconnect", async () => {
        console.log("socket disconnected. User:", socket.user.fullName)
        const userID = socket.user._id
        const updatedUser = await User.findByIdAndUpdate(userID, { lastSeen: new Date() }, { new: true })
        delete userSocketMap[userID]
        io.emit("getOnlineUsers", Object.keys(userSocketMap))
        //for send last seen in real time
        io.emit("userOffline", updatedUser)
    });
    socket.on("updateMsgSeen", ({ senderId, messageIds }) => {
        const senderSocketId = getReceiverSocketId(senderId);

        if (senderSocketId) {
            io.to(senderSocketId).emit("updateMsgSeen", {
                messageIds,
            });
        }
    })
    socket.on("typing", ({ receiverId }) => {
        //check receiverId is online?
        console.log("typing send from socket",)
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { senderId: socket.user._id })

        }
    });
    socket.on("stopTyping", ({ receiverId }) => {
        //check receiverId is online?
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("stopTyping", { senderId: socket.user._id })
            console.log("stoptyping send from socket",)
        }
    })
})
export { io, app, server }

export const getReceiverSocketId = (userId) => {
    if (userSocketMap[userId])
        return userSocketMap[userId];
    else return null;
}