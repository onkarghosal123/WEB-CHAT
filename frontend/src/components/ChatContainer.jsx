import { useContext, useEffect, useRef, useState } from "react";
import { Pencil, Trash2, Check, CheckCheck } from "lucide-react"; import ChatHeader from "./ChatHeader";
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder";
import MessageInput from "./MessageInput";
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton";
import { AuthContext } from "../contexts/AuthContext";


function ChatContainer() {
  const [editText, setEdittext] = useState("");
  const { selectedUser, getMessagesByUserId, messages, isMessagesLoading, authUser, setMessages, socket, updateSeenMsg, setChats, updateMsg, deleteMsg, setEditmsg, editMsg } = useContext(AuthContext);
  useEffect(() => {
    getMessagesByUserId(selectedUser._id);
    updateSeenMsg(selectedUser._id);//seen status of msg update in backend
    //but in chatlist there will be still shows unreadCount.So we set unreadCount=0 to that selectedUser.
    setChats((prev) => prev.map(
      (chatUser) => chatUser._id.toString() === selectedUser._id.toString() ? { ...chatUser, unreadCount: 0 } : chatUser
    )
    ) //prev=[{_id:"A",fullname:"soham",unreadCount:2},{_id:"b",fullname:"Rahul",unreadCount:0},{}]

  }, [selectedUser]);//if put messages in dependency array then it calls getMessagesByUserId again and again loop because messages changes.
  //dependency array means useeffect runs only once after the component(selectedUser) mounts  
  console.log(messages, "length", messages.length)
  const handleEdit = (msg) => {
    setEditmsg(msg._id);
    setEdittext(msg.text)
  }
  const handleEditSave = (msg) => {
    updateMsg(msg._id, { text: editText });
    console.log("after updateMsg")
  }
  const handleDelete = (msg) => {
    deleteMsg(msg._id)
  }

  return (
    <>
      <ChatHeader />
      <div className="flex-1 overflow-y-auto px-4 py-4 bg-[#0f172a]">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`flex mb-3 ${msg.senderId.toString() === authUser._id.toString()
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                {msg._id === editMsg ? (
                  <div className="max-w-[70%]">
                    <input
                      type="text"
                      className="text-white bg-slate-800 border border-blue-500/30 rounded-lg px-3 py-2 outline-none focus:border-blue-400"
                      value={editText}
                      onChange={(e) => setEdittext(e.target.value)}
                    />

                    <button
                      onClick={() => handleEditSave(msg)}
                      className="ml-2 text-blue-400 hover:text-blue-300 cursor-pointer"
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-2xl shadow ${msg.senderId.toString() === authUser._id.toString()
                      ? "bg-blue-600 text-white rounded-br-md"
                      : "bg-slate-700 text-white rounded-bl-md"
                      }`}
                  >
                    {msg.picture && (
                      <img
                        src={msg.picture}
                        alt="Shared"
                        className="rounded-lg mb-2 max-h-60 object-cover"
                      />
                    )}

                    {msg.text && <p>{msg.text}</p>}

                    {/* Show Edit button only for sender */}
                    {msg.senderId.toString() === authUser._id.toString() && (
                      <div className="flex justify-end items-center gap-2 mt-2">

                        {/* Seen Status */}
                        {msg.seen ? (
                          <CheckCheck className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Check className="w-4 h-4 text-slate-300" />
                        )}

                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(msg)}
                          className="p-1 text-slate-300 hover:text-blue-400 transition-colors cursor-pointer"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(msg)}
                          className="p-1 text-slate-300 hover:text-red-400 transition-colors cursor-pointer"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>

                      </div>
                    )}

                    <p className="text-[10px] opacity-70 text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      <MessageInput />
    </>
  );
}

export default ChatContainer;
