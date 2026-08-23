import { useContext, useEffect, useState } from "react";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import NoChatsFound from "./NoChatsFound";
import { AuthContext } from "../contexts/AuthContext";
import { CircleUser } from "lucide-react";


function ChatsList() {

  const { getMyChatPartners, chats, isUsersLoading, setSelectedUser, onlineUsers, selectedUser, socket, setChats, setMessages, updateSeenMsg, setTyping, typing } = useContext(AuthContext);

  useEffect(() => {
    getMyChatPartners();
  }, []);

  useEffect(() => {
    socket.on("message", async ({ message, senderUser }) => {
      //add coming new msg to the message
      if (message.senderId === selectedUser?._id) {
        setMessages((prev) => [...prev, message])
        //update msg seen status in db.
        await updateSeenMsg(message.senderId)
        //send real time event for update seen msg.
        socket.emit("updateMsgSeen", {
          senderId: message.senderId,
          messageIds: [message._id],
        });
      }
      else {
        //increase unread count

        //check message.sender is exist in chats?
        // it returns boolean
        const exist = chats.find(
          (chatUser) => chatUser._id.toString() === message.senderId.toString()
        )
        if (exist) {
          //update unreadcount by finding in existing chats
          setChats(
            (prev) => prev.map((chatUser) => chatUser._id.toString() === message.senderId.toString() ? { ...chatUser, unreadCount: chatUser.unreadCount + 1 } :  chatUser)
          )
        }
        else {

          //add new chatUser to the chats
          setChats(
            (prev) => [...prev, { ...senderUser, unreadCount: 1 }]
          )
        }
      }

    });
    socket.on("typing", ({ senderId }) => {
      if (senderId === selectedUser?._id) {
        console.log("typing:", typing)
        setTyping(true)
      }
    });
    socket.on("stopTyping", ({ senderId }) => {
      if (senderId === selectedUser?._id) {
        console.log("typing:", typing)
        setTyping(false)
      }
    });
    socket.on("userOffline", (user) => {
      setSelectedUser((prev) => {
        if (!prev) return prev;
        if (prev._id === user._id) { return user; }
        return prev;
      })
    });
    socket.on("updateSeenMsg", (updatedMsgIds) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => {
          //check msg.id is included in updatedmessages or not?
          const isInclude = updatedMsgIds.some(
            (updatedId) =>
              updatedId.toString() === msg._id.toString()
          );

          return isInclude
            ? { ...msg, seen: true }
            : msg;
        })
      );
    });
    socket.on("updateMsg", (updatedMsg) => {
      const msgId = updatedMsg._id;
      if (selectedUser?._id === updatedMsg?.senderId) {
        setMessages((prev) => prev.map((msg) => msg._id === msgId ? (updatedMsg) : (msg)))
        console.log("updatemsg listener")
      }
    });
    socket.on("deleteMsg", (msg) => {
      const msgId = msg._id;
      if (selectedUser?._id === msg.senderId) {
        setMessages((prev) => prev.filter((msg) => msg._id !== msgId))
      }
    })

    return () => {
      socket.off("message");
      socket.off("typing");
      socket.off("stopTyping");
      socket.off("updateSeenMsg");
      socket.off("updateMsg");
      socket.off("deleteMsg");
    }
  }, [socket, selectedUser])

  if (isUsersLoading) return <UsersLoadingSkeleton />;
  if (chats.length === 0) return <NoChatsFound />;

  return (
    <>
      {chats.map((chat) => (
        <div
          key={chat._id}
          className="bg-blue-500/10 p-4 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors"
          onClick={() => setSelectedUser(chat)}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="size-12 rounded-full">
                {chat.profilePic ? (
                  <img
                    src={chat.profilePic}
                    alt="User"
                    className="size-full object-cover rounded-full"
                  />
                ) : (
                  <CircleUser className="size-full text-slate-400" />
                )}
              </div>

              {onlineUsers.includes(chat._id) && (
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-slate-800 rounded-full"></span>
              )}
            </div>

            <h4 className="text-slate-200 font-medium truncate">
              {chat.fullName}
            </h4>

            {chat.unreadCount > 0 && (
              <p className="text-xs bg-blue-500 text-white rounded-full px-2 py-1">
                {chat.unreadCount}
              </p>
            )}
          </div>
        </div>
      ))}
    </>
  );
}
export default ChatsList;
