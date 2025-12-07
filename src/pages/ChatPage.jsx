import { useEffect, useState } from "react";
import axios from "axios";

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const loadMessages = async () => {
    const res = await axios.get("http://localhost:5000/api/chat");
    setMessages(res.data);
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2000); // auto refresh
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!name || !message) return;

    await axios.post("http://localhost:5000/api/chat", {
      sender: "customer",
      name,
      message,
    });

    setMessage("");
    loadMessages();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">

      <h1 className="text-3xl font-bold mb-4">Chat With Us</h1>

      <input
        className="border px-4 py-2 mb-4 rounded"
        placeholder="Your Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="bg-white w-full max-w-xl p-4 h-[450px] overflow-y-auto">
        {messages.map((msg) => (
          <div key={msg._id} className="my-2">
            <b>{msg.sender === "admin" ? "Admin" : msg.name}: </b>
            {msg.message}
          </div>
        ))}
      </div>

      <div className="mt-4 flex w-full max-w-xl">
        <input
          className="flex-1 border px-4 py-2 rounded mr-2"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
