import { useContext, useEffect } from "react";
import UsersLoadingSkeleton from "./UsersLoadingSkeleton";
import { AuthContext } from "../contexts/AuthContext";
import { CircleUser } from "lucide-react";

function ContactList() {
  const { getAllContacts, contacts, setSelectedUser, isUsersLoading } = useContext(AuthContext);
  useEffect(() => {
    getAllContacts();
  }, []);

  if (isUsersLoading) return <UsersLoadingSkeleton />;

  return (
    <>
     {contacts.map((contact) => (
  <div
    key={contact._id}
    className="bg-blue-500/10 p-4 rounded-lg cursor-pointer hover:bg-blue-500/20 transition-colors"
    onClick={() => setSelectedUser(contact)}
  >
    <div className="flex items-center gap-3">
      <div className={`avatar`}>
        <div className="size-12 rounded-full">
          {contact.profilePic ? (
            <img
              src={contact.profilePic}
              alt="User"
              className="size-full object-cover rounded-full"
            />
          ) : (
            <CircleUser className="size-full text-slate-400" />
          )}
        </div>
      </div>

      <h4 className="text-slate-200 font-medium">
        {contact.fullName}
      </h4>
    </div>
  </div>
))}
    </>
  );
}
export default ContactList;
