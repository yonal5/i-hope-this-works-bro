import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const BASE_URL = import.meta.env.VITE_API_URL;

  // ---------------- LOAD CUSTOMERS ----------------
  const loadCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/customers`);

      setCustomers((prev) => {
        if (!selectedGuestId && res.data.length > 0) {
          setSelectedGuestId(res.data[0].userId);
        }
        return res.data;
      });
    } catch (err) {
      console.error(err);
      setError("Failed to load customers");
    }
  };

  // ---------------- LOAD MESSAGES ----------------
  const loadMessages = async () => {
    if (!selectedGuestId) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/api/chat/admin?guestId=${selectedGuestId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load chats");
    }
  };

  // ---------------- POLLING ----------------
  useEffect(() => {
    loadCustomers();
    loadMessages();

    const interval = setInterval(() => {
      loadCustomers();
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedGuestId]);

  // ---------------- SEND ADMIN REPLY ----------------
  const sendReply = async () => {
    if (!reply.trim() || !selectedGuestId) return;

    try {
      await axios.post(`${BASE_URL}/api/chat/admin/send`, {
        guestId: selectedGuestId,
        message: reply.trim(),
      });
      setReply("");
      loadMessages();
    } catch (err) {
      setError("Failed to send reply");
    }
  };

  const filteredCustomers = customers.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex gap-6 p-6">
      {/* CUSTOMER LIST */}
      <div className="w-64 h-[880px] bg-white p-4 rounded border">
        <h2 className="font-bold">Customers</h2>
        <input
          className="w-full border px-2 py-1 rounded mt-2"
          placeholder="Search customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {filteredCustomers.map((c) => (
          <button
            key={c.userId}
            onClick={() => setSelectedGuestId(c.userId)}
            className={`w-full text-left px-3 py-2 mt-2 rounded ${
              selectedGuestId === c.userId
                ? "bg-blue-600 text-white"
                : "bg-gray-100"
            }`}
          >
            {c.customerName}
          </button>
        ))}
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 w-full h-[880px] flex flex-col">
        <div className="bg-white border rounded p-4 flex-1 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg._id} className="mb-2">
              <b
                className={
                  msg.sender === "admin"
                    ? "text-red-600"
                    : "text-blue-600"
                }
              >
                {msg.sender === "admin" ? "Admin" : "Customer"}:
              </b>
              <p>{msg.message}</p>
              <small className="text-gray-400">
                {new Date(msg.createdAt).toLocaleString()}
              </small>
            </div>
          ))}
        </div>

        <div className="flex mt-2">
          <input
            className="flex-1 border px-3 py-2 rounded"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type reply"
          />
          <button
            onClick={sendReply}
            className="ml-2 bg-blue-600 text-white px-4 rounded"
          >
            Send
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
