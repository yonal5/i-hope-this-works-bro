import { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const BASE_URL = "http://localhost:5000";
  const messagesContainerRef = useRef(null);

  // Load all customers
  const loadCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/customers`);
      setCustomers(res.data);

      // Set first customer as default selected
      if (!selectedGuestId && res.data.length > 0) {
        setSelectedGuestId(res.data[0].userId);
      }
    } catch (err) {
      console.error("Failed to load customers:", err);
      setError("Failed to load customers");
    }
  };

  // Load messages for selected customer
  const loadMessages = async () => {
    if (!selectedGuestId) return;
    try {
      setLoading(true);
      const res = await axios.get(
        `${BASE_URL}/api/chat/admin?guestId=${selectedGuestId}`
      );
      setMessages(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  // Auto-scroll messages container to bottom
  const scrollMessagesToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  useEffect(() => {
    loadMessages();
    const interval = setInterval(() => {
      loadMessages();
    }, 2000);
    return () => clearInterval(interval);
  }, [selectedGuestId]);

  useEffect(() => {
    scrollMessagesToBottom();
  }, [messages]);

  const filteredCustomers = customers.filter((c) =>
    c.customerName.toLowerCase().includes(search.toLowerCase())
  );

  const sendReply = async () => {
    if (!reply.trim() || !selectedGuestId) return;

    try {
      const res = await axios.post(`${BASE_URL}/api/chat/admin/send`, {
        guestId: selectedGuestId,
        message: reply.trim(),
      });

      if (res.status === 200 || res.status === 201) {
        setReply("");
        loadMessages();
      }
    } catch (err) {
      console.error("Send reply error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to send reply");
    }
  };

  return (
    <div className="flex gap-6 p-6">
      {/* Customer List */}
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
            className={`w-full text-left px-3 py-2 mt-2 rounded ${
              selectedGuestId === c.userId
                ? "bg-blue-600 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
            onClick={() => setSelectedGuestId(c.userId)}
          >
            {c.customerName}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="flex-1 h-[879px] flex flex-col">
        <div
          className="bg-white p-4 h-sc border rounded overflow-y-auto flex-1"
          ref={messagesContainerRef}
        >
          {messages.map((msg) => (
            <div key={msg._id || Math.random()} className="my-2">
              <b
                className={
                  msg.sender === "admin" ? "text-red-600" : "text-blue-600"
                }
              >
                {msg.sender === "admin"
                  ? "Admin"
                  : customers.find((c) => c.userId === msg.guestId)
                      ?.customerName || "Guest"}
                :
              </b>
              <p>{msg.message}</p>
              <p className="text-gray-400 text-xs">
                {new Date(msg.createdAt || msg.time).toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Reply Input */}
        <div className="flex mt-3">
          <input
            className="flex-1 border px-3 py-2 rounded mr-2"
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Type a reply"
          />
          <button
            onClick={sendReply}
            className="bg-blue-600 text-white px-6 py-2 rounded"
          >
            Send
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
