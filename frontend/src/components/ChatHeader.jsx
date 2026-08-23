import { XIcon,CircleUser } from "lucide-react";
import { useContext, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";

function ChatHeader() {
  const { selectedUser, setSelectedUser, onlineUsers, typing } = useContext(AuthContext);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === "Escape") setSelectedUser(null);
    };

    window.addEventListener("keydown", handleEscKey);

    // cleanup function
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [setSelectedUser]);
  console.log("typing from chat header", typing)

  return (
    <div
      className="flex justify-between items-center bg-slate-900/80 border-b
  border-white/10 max-h-[84px] px-6 flex-1"
    >
      <div className="flex items-center space-x-3">
        <div className={`avatar`}>
          <div className="w-12 rounded-full">
            {selectedUser.profilePic ? (
              <img
                src={selectedUser.profilePic}
                alt={selectedUser.fullName}
                className="size-full object-cover rounded-full"
              />
            ) : (
              <CircleUser className="size-full text-slate-400" />
            )}
          </div>
        </div>

        <div>
          <h3 className="text-white font-medium">{selectedUser.fullName}</h3>

          <p className="text-blue-400 text-sm">
            {typing
              ? "typing.."
              : onlineUsers.includes(selectedUser._id)
                ? "Online"
                : `Last seen ${new Date(selectedUser.lastSeen).toLocaleString()}`}
          </p>
        </div>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <XIcon className="w-5 h-5 text-slate-400 hover:text-white transition-colors cursor-pointer" />
      </button>
    </div>
  );
}
export default ChatHeader;
