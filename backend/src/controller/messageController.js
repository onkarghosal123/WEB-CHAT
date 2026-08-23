import cloudinary from "../lib/cloudinary.js"
import User from "../models/user.js"
import Message from "../models/message.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const sendMessage = async (req, res) => {
    const receiverId = req.params.id
    console.log("Receiver id for send message:", receiverId)
    const senderId = req.user._id
    const { text } = req.body;
    const picture = req.file;
    console.log("picture", picture)
    console.log("text:", text)

    if (!text && !picture) {
        return res.status(400).json({ message: "Text and image both can't be empty." })
    }
    try {
        //fetch sender user for sending with msg to the socket so that socket can listen message and also sender user.
        const senderUser = await User.findById(senderId);
        const receivedUser = await User.findById(receiverId)
        if (!receivedUser) return res.status(400).json({ message: "Receiver not found." })

        //img upload to cloudinary
        let pictureUrl = null;
        if (picture) {
            const uploadedPicture = await cloudinary.uploader.upload(picture.path);
            pictureUrl = uploadedPicture.secure_url;

            console.log("Picture uploaded to Cloudinary successfully");
        }
        const message = await new Message({
            senderId, receiverId, text, picture: pictureUrl, seen: false
        })
        await message.save();
        //check received user is online ?
        //without socket.io: if receiver is online then receiver cant see the realtime msg receiver must refresh the page or request getmsgfunction to see the new msg.
        //with socket: if receiver online then msg save to db then find the receiversocketid then push to reciever so that receiver can see real time msg without refresh

        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            console.log("receiver SocketId is:", receiverSocketId)
            io.to(receiverSocketId).emit("message", { message, senderUser });
        }
        res.status(201).json({ message })
    } catch (error) {

        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getallMsgbyId = async (req, res) => {
    const friendId = req.params.id
    const myId = req.user._id
    try {
        const receivedUser = await User.findById(friendId)
        if (!receivedUser) return res.status(400).json({ message: "Receiver not found." })
        console.log("frndid::", friendId);
        console.log("myid::", myId)
        const messages = await Message.find({
            $or: [
                { senderId: friendId, receiverId: myId },
                { senderId: myId, receiverId: friendId },
            ],
        });
        res.status(201).json({ messages })

    } catch (error) {
        console.log("Error in getallMsgbyId controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
}

export const updateSeenMsg = async (req, res) => {
    try {
        const receiverId = req.params.id
        const loggedInUserId = req.user._id
        //find unreadmsg
        const unseenMessages = await Message.find({
            senderId: receiverId,
            receiverId: loggedInUserId,
            seen: false,
        });
        if (unseenMessages.length === 0) return;
        //store is of all unread msg
        const messageIds = unseenMessages.map((msg) => msg._id);//its a array

        //update msg where senderid is receiverid and receiverid is loggedinuserId
        await Message.updateMany(
            {
                _id: { $in: messageIds },
            },
            {
                $set: { seen: true },
            }
        );
        const senderSocketId = getReceiverSocketId(receiverId);
        if (senderSocketId) {
            io.to(senderSocketId).emit("updateSeenMsg", messageIds)
        }

    } catch (error) {
        console.log("error in update seen msg", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const getAllContacts = async (req, res) => {
    const loggedUser = req.user._id;
    try {
        const allUsers = await User.find({ _id: { $ne: loggedUser } }).select("-password");
        res.status(201).json({ allUsers })

    } catch (error) {
        console.log("Error in getAllContacts controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
}

export const getChatContacts = async (req, res) => {
    const loggedInUserId = req.user._id
    try {
        // find all the messages where the logged-in user is either sender or receiver
        const messages = await Message.find({
            $or: [{ senderId: loggedInUserId }, { receiverId: loggedInUserId }],
        });
        //then find opponent's id of those messages 
        const chatPartnerIds = [
            ...new Set(
                messages.map((msg) =>
                    msg.senderId.toString() === loggedInUserId.toString() ? msg.receiverId.toString() : msg.senderId.toString()
                    //if senderId is me then select receiverId. if senderId is other then select senderId
                )
            ),
        ];
        //find chatPartner's user details
        const chatPartners = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
        const usersWithUnread = await Promise.all(
            chatPartners.map(async (user) => {
                const unreadCount = await Message.countDocuments({
                    senderId: user._id,
                    receiverId: loggedInUserId,
                    seen: false
                });
                return { ...user.toObject(), unreadCount }// {_id:af675ra,fullName:"Soham",unreadCount:unreadCount}
            })
        )
        res.status(201).json({ usersWithUnread })
    } catch (error) {

        console.log("Error in getChatContacts controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const updateMsg = async (req, res) => {
    try {
        const { text } = req.body;
        const msgId = req.params.id
        console.log(text, msgId)
        const msg = await Message.findById(msgId);
        const receiverId = msg.receiverId
        if (!msg) {
            return res.status(401).json({ message: "Message not found" });
        }
        if (msg.senderId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "unauthorized" })
        }
        const updatedMsg = await Message.findByIdAndUpdate(msgId, { text }, { new: true });
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("updateMsg", updatedMsg)
        }
        console.log("msg updated succesfully", updatedMsg)
        res.status(201).json({ updatedMsg })
    } catch (error) {
        console.log("Error in updateMsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}
export const deleteMsg = async (req, res) => {
    try {
        const msgId = req.params.id;
        const msg = await Message.findById(msgId);
        const receiverId = msg.receiverId
        if (!msg) {
            return res.status(401).json({ message: "Message not found" });
        }
        if (msg.senderId.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "unauthorized" })
        }
        const deleteMsg = await Message.findByIdAndDelete(msgId)

        //check receiverId is online ?
        const receiverSocketId = getReceiverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("deleteMsg", msg)
        }
        console.log("msg deleted", deleteMsg)
        res.status(201).json({ message: "Message deleted" })

    } catch (error) {
        console.log("Error in deletemsg controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });

    }
}