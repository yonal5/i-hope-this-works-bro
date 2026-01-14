import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AdminChat() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;
  const bottomRef = useRef(null);

  // ---------------- AUTO SCROLL ----------------
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ---------------- LOAD USERS ----------------
  const loadUsers = async () => {
    const res = await axios.get(`${BASE_URL}/api/chat/customers`);
    setUsers(res.data);
  };

  // ---------------- LOAD CHAT ----------------
  const loadMessages = async (userId) => {
  if (!userId) return; // ❗ BLOCK BAD REQUESTS

  const res = await axios.get(
    `${BASE_URL}/api/chat/admin?guestId=${userId}`
  );

  setMessages(res.data);

  await axios.put(`${BASE_URL}/api/chat/admin/read/${userId}`);
};

  // ---------------- POLLING ----------------
  useEffect(() => {
    loadUsers();
    const interval = setInterval(loadUsers, 3000);
    return () => clearInterval(interval);
  }, []);

  // ---------------- SEND MESSAGE ----------------
  const sendReply = async () => {
    if (!reply.trim() || !selectedUser) return;

    await axios.post(`${BASE_URL}/api/chat/admin/send`, {
      guestId: selectedUser.userId,
      message: reply,
    });

    setReply("");
    loadMessages(selectedUser.userId);
  };

  return (
    <div className="h-[90vh] flex bg-gray-100 rounded shadow">

      {/* USER LIST */}
      <div className="w-72 bg-white border-r overflow-y-auto">
        <div className="p-4 font-bold text-lg border-b">Users</div>

        {users.map((u) => (
          <button
            key={u.userId}
            onClick={() => {
              setSelectedUser(u);
              loadMessages(u.userId);
            }}
            className={`w-full px-4 py-3 flex justify-between items-center border-b
              ${selectedUser?.userId === u.userId ? "bg-blue-50" : ""}`}
          >
            <span>{u.customerName}</span>

            {u.unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 rounded-full">
                {u.unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">
        {!selectedUser ? (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Click a user to open chat
          </div>
        ) : (
          <>
            <div className="p-4 bg-white border-b font-semibold">
              Chat with {selectedUser.customerName}
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`max-w-[70%] px-4 py-2 rounded-lg text-sm
                    ${m.sender === "admin"
                      ? "ml-auto bg-blue-600 text-white"
                      : "mr-auto bg-gray-200"}`}
                >
                  {m.message}
                  <div className="text-[10px] opacity-60 text-right mt-1">
                    {new Date(m.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            <div className="p-3 bg-white border-t flex gap-2">
              <input
                value={reply}
                onChange={(e) => setReply(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendReply()}
                placeholder="Type message..."
                className="flex-1 border rounded px-3 py-2"
              />
              <button
                onClick={sendReply}
                className="bg-blue-600 text-white px-5 rounded"
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
