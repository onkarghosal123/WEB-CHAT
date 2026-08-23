import { createContext, useEffect, useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [authUser, setAuthUser] = useState(false)
    const [otpSending, setOtpSending] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)
    const [isSigningUp, setIsSigningUp] = useState(false)
    const [activeTab, setActiveTab] = useState("chats")
    const [selectedUser, setSelectedUser] = useState(null)
    const [isUsersLoading, setIsUsersLoading] = useState(false)
    const [contacts, setContacts] = useState([])
    const [chats, setChats] = useState([])
    const [isMessagesLoading, setIsMessagesLoading] = useState(false)
    const [messages, setMessages] = useState([])
    const [onlineUsers, setOnlineusers] = useState([])
    const [socket, setSocket] = useState(null)
    const [isOtpsent, setIsOtpsent] = useState(false)
    const [typing, setTyping] = useState(false)
    const [editMsg, setEditmsg] = useState(null);

    const connectSocket = (authuserdata) => {
        if (!authuserdata || socket?.connected) return;
        console.log(authuserdata)
        const newSocket = io(import.meta.env.VITE_SOCKET_URL, {
            withCredentials: true, // this ensures cookies are sent with the connection
        });
        newSocket.on("connect", () => {
            console.log("connected", newSocket.id)
        })
        newSocket.on("connect_error", (err) => {
            console.log("connect error", err.message)
        })
        //it will run io.connection on backend
        console.log("socket connected from frontend. socket:", newSocket)
        setSocket(newSocket);
        newSocket.on("getOnlineUsers", (userIds) => {
            setOnlineusers(userIds)
            console.log("Online Users are:", userIds);
        })
    }
    const disconnectSocket = () => {
        if (socket?.connected) socket.disconnect();
        setSocket(null)
    }

    useEffect(() => {
        if (authUser) {
            connectSocket(authUser);
        }

        return () => {
            disconnectSocket();
        };
    }, [authUser?._id]);

    const sendOtp = async (data) => {
        try {
            setOtpSending(true);
            const res = await axiosInstance.post('/auth/send-otp', data);
            setIsOtpsent(true)
        } catch (error) {
            console.log("BACKEND URL:", import.meta.env.VITE_BACKEND_URL);
            console.log("error in sendotp authcontext", error)
            toast.error(error.response.data.message)
        } finally {
            setOtpSending(false)
        }

    }
    const login = async (data) => {
        console.log("This is login fuction in authcontext, Data:", data)
        try {
            setIsLoggingIn(true);
            const res = await axiosInstance.post('/auth/login', data)
            console.log(res)
            setAuthUser(res.data)// authuser not updte imidiately.React schedules to update setAuthuser
            toast.success("Logged in successfully")
            // frontend always connect the socket after login
            console.log("after calling connectSocket in login func authuser:", authUser)
        } catch (error) {
            console.log(error)
            toast.error(error.response.data.message)
        } finally {
            setIsLoggingIn(false);
        }
    }
    const signup = async (data) => {
        try {
            setIsSigningUp(true);
            const res = await axiosInstance.post('/auth/signup', data)
            setAuthUser(res.data)
            toast.success("Signed Up successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            setIsSigningUp(false);
        }
    }
    const logout = async () => {
        try {
            await axiosInstance.post("/auth/logout");
            setAuthUser(null);
            disconnectSocket();
            toast.success("Logged out successfully");
        } catch (error) {
            toast.error("Error logging out");
            console.log("Logout error:", error);
        }
    }
    const updateProfile = async (data) => {
        try {
            const res = await axiosInstance.post("/auth/updateprofilepic", data);
            setAuthUser(res.data);
            toast.success("Profile updated successfully");
        } catch (error) {
            console.log("Error in update profile:", error);
            toast.error(
                error.response?.data?.message || "Failed to update profile"
            );
        }
    }
    const getAllContacts = async () => {
        setIsUsersLoading(true);
        try {
            const res = await axiosInstance.get("/message/contacts");
            setContacts(res.data.allUsers);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsUsersLoading(false);
        }
    }
    const getMyChatPartners = async () => {
        setIsUsersLoading(true);
        try {
            const res = await axiosInstance.get("/message/chats");
            console.log(res.data.usersWithUnread)
            setChats(res.data.usersWithUnread);
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            setIsUsersLoading(false);
        }
    }
    const getMessagesByUserId = async (userId) => {
        setIsMessagesLoading(true);
        try {
            const res = await axiosInstance.get(`/message/${userId}`);
            setMessages(res.data.messages);
            console.log("getMessage api called")
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setIsMessagesLoading(false);
        }
    }
    const sendMessage = async (messageData) => {
        console.log(messageData);

        const tempId = `temp-${Date.now()}`;

        const optimisticMessage = {
            _id: tempId,
            senderId: authUser._id,
            receiverId: selectedUser._id,
            text: messageData.text,
            image: messageData.picture,
            createdAt: new Date().toISOString(),
            isOptimistic: true, // flag to identify optimistic messages (optional)
        };
        // immidetaly update the ui by adding the message
        setMessages((prev) => [...prev, optimisticMessage]);
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`, messageData);
            setMessages((prev) => prev.map((msg) => msg._id === tempId ? res.data.message : msg));
        } catch (error) {
            // remove optimistic message on failure
            setMessages((prev) => prev.filter((msg) => msg._id !== tempId));
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }
    const updateSeenMsg = async (receiverid) => {
        try {
            const res = axiosInstance.post(`/message/seen-msg/${receiverid}`)

        } catch (error) {
            console.log("error in updating seen status of msg frontend", error)
        }
    }
    const updateMsg = async (msgId, editedText) => {
        try {
            const res = await axiosInstance.post(`/message/update-msg/${msgId}`, editedText);
            console.log("res.data.updtmsg = ", res.data.updatedMsg)
            setMessages((prev) => prev.map((msg) => msg._id === msgId ? (res.data.updatedMsg) : (msg)))
            setEditmsg(null);
            console.log("msg updated.", messages)
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("error in updatemsg frontend", error)
        }
    }
    const deleteMsg = async (msgId) => {
        try {
            const res = await axiosInstance.delete(`/message/delete/${msgId}`)
            setMessages((prev) => prev.filter((msg) => msg._id !== msgId))
            console.log("msg deleted")
            toast.success("Message deleted")
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
            console.log("error in deleteMsg", error)
        }
    }
    const contextValue = {
        authUser, setAuthUser, isLoggingIn, setIsLoggingIn, isSigningUp, setIsSigningUp, activeTab, setActiveTab, login, signup, logout, updateProfile, getAllContacts, getMyChatPartners, chats, setChats, selectedUser, setSelectedUser, contacts, isUsersLoading, getMessagesByUserId, messages, setMessages, sendMessage, isMessagesLoading, onlineUsers, socket, isOtpsent, setIsOtpsent, otpSending, setOtpSending, sendOtp, updateSeenMsg, setTyping, typing, deleteMsg, updateMsg, setEditmsg, editMsg
    }

    return (
        <>
            <AuthContext.Provider value={contextValue}>
                {children}
            </AuthContext.Provider>
        </>
    )
}
export default AuthProvider;