import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

function ActiveTabSwitch() {
  const { activeTab, setActiveTab } = useContext(AuthContext);

  return (
 <div className="flex p-2 m-2 gap-2">
  <button
    onClick={() => setActiveTab("chats")}
    className={`flex-1 py-2 rounded-lg ${
      activeTab === "chats"
        ? "bg-blue-500/20 text-blue-400"
        : "text-slate-400 hover:bg-white/5"
    }`}
  >
    Chats
  </button>

  <button
    onClick={() => setActiveTab("contacts")}
    className={`flex-1 py-2 rounded-lg ${
      activeTab === "contacts"
        ? "bg-blue-500/20 text-blue-400"
        : "text-slate-400 hover:bg-white/5"
    }`}
  >
    Contacts
  </button>
</div>
  );
}
export default ActiveTabSwitch;
