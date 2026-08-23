import BorderAnimatedContainer from "../components/BorderAnimatedContainer";
import ProfileHeader from "../components/ProfileHeader";
import ActiveTabSwitch from "../components/ActiveTabSwitch";
import ChatsList from "../components/ChatsList";
import ContactList from "../components/ContactList";
import ChatContainer from "../components/ChatContainer";
import NoConversationPlaceholder from "../components/NoConversationPlaceholder";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function ChatPage() {
  console.log("this is chat pge");
  const { activeTab, selectedUser } = useContext(AuthContext);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#111827] via-[#1e1b4b] to-[#4c1d95] p-4 overflow-hidden">
      <div className="w-full h-full max-w-6xl mx-auto">

        {/* CHAT CARD */}
        <div className="w-full h-full bg-slate-900/95 border border-white/20 rounded-3xl shadow-2xl overflow-hidden flex">

          {/* LEFT SIDE */}
          <div className="w-80 bg-slate-900/80 border-r border-white/10 flex flex-col">
            <ProfileHeader />
            <ActiveTabSwitch />

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {activeTab === "chats" ? <ChatsList /> : <ContactList />}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex-1 flex flex-col bg-slate-900/60">
            {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
          </div>

        </div>
      </div>
    </div>
  );
}
export default ChatPage;
