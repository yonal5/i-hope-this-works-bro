import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [reply, setReply] = useState("");
const [name, setName] = useState("");
  const loadMessages = async () => {
    const res = await axios.get("http://localhost:5000/api/chat");
    setMessages(res.data);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  const sendReply = async () => {
    if (!reply) return;

    await axios.post("http://localhost:5000/api/chat", {
      sender: "admin",
      name: "Admin",
      message: reply,
    });

    setReply("");
    loadMessages();
  };

  return (
    <div className="p-6 bg-accent text-white min-h-screen">

      <h1 className="text-3xl font-bold mb-4">Admin Chat Panel</h1>

      <div className="bg-gray-800 p-4 h-[500px] overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg._id} className="my-2">
            <b>{msg.sender === "admin" ? "Admin" : msg.name}: </b>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          className="flex-1 border px-4 py-2 rounded mr-2 bg-gray-700 text-white"
          placeholder="Reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
        />
        <button
          onClick={sendReply}
          className="bg-black px-4 py-2 rounded"
        >
          Send
        </button>
        
      </div>
    </div>
  );
}
