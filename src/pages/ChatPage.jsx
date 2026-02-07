import { useEffect, useState } from "react";
import axios from "axios";
import mediaUpload from "../utils/mediaUpload";
import { useLocation, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function ChatPage({ user }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [authError, setAuthError] = useState("");
  const cartFromState = location.state?.cart || [];

  const [messages, setMessages] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [cart] = useState(cartFromState);
  const [sending, setSending] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  /* ================= GUEST ID ================= */
  const [guestId] = useState(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    return id;
  });

  /* ================= USER NUMBER ================= */
  const [userNumber] = useState(() => {
    let num = localStorage.getItem("guestNumber");
    if (!num) {
      num = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("guestNumber", num);
    }
    return num;
  });

  /* ================= AUTH CHECK ================= */
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("⚠️ You are not logged in. Redirecting...");
      const timer = setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [navigate, location.pathname]);

  /* ================= SET CUSTOMER NAME ================= */
  useEffect(() => {
    if (user?.name || user?.username) {
      setCustomerName(user.name || user.username);
    } else {
      setCustomerName(`User-${userNumber}`);
    }
  }, [user, userNumber]);

  /* ================= LOAD MESSAGES ================= */
  const loadMessages = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat`, {
        params: { guestId },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.messages || [];

      setMessages(data);
    } catch (err) {
      console.error("Load messages failed:", err);
    }
  };

  /* ================= AUTO LOAD ================= */
  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2500);
    return () => clearInterval(interval);
  }, []);

  /* ================= SEND MESSAGE ================= */
  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        type: "text",
        message: message.trim(),
      });

      setMessage("");
      loadMessages();
    } catch (err) {
      console.error(err);
      alert("Send failed");
    } finally {
      setSending(false);
    }
  };

  /* ================= SEND IMAGE ================= */
  const sendImage = async () => {
    if (!selectedImage || sending) return;

    setSending(true);
    try {
      const imageUrl = await mediaUpload(selectedImage);
      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        type: "image",
        imageUrl,
        message: "",
      });
      setSelectedImage(null);
      loadMessages();
    } catch (err) {
      console.error(err);
      alert("Image send failed");
    } finally {
      setSending(false);
    }
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* AUTH ERROR */}
      {authError && (
        <div className="bg-red-100 text-red-600 border px-4 py-2 rounded mb-3 w-full max-w-xl text-center">
          {authError}
        </div>
      )}

      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-3 text-black">Chat With Us</h1>

      {/* CUSTOMER NAME */}
      <input
        value={customerName}
        readOnly
        className="w-full max-w-xl border px-3 py-2 rounded mb-3 bg-white text-black"
      />

      {/* CART */}
      {cart.length > 0 && (
        <div className="bg-white border rounded p-3 mb-3 w-full max-w-xl">
          <h2 className="font-semibold mb-2 text-black">Your Cart</h2>
          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm text-black"
            >
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* CHAT BOX */}
      <div className="bg-white border rounded p-3 w-full max-w-xl h-[60vh] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`my-2 flex ${
              msg.sender === "admin" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] ${
                msg.sender === "admin"
                  ? "bg-gray-200 text-red-500 text-shadow-red-600"
                  : "bg-gray-200 text-black"
              }`}
            >
              {/* IMAGE */}
              {msg.type === "image" && msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="chat"
                  className="max-w-[220px] rounded"
                />
              )}

              {/* TEXT */}
              {msg.type === "text" && msg.message && <div>{msg.message}</div>}

              {/* DATE */}
              <div className="text-xs text-gray-400 mt-1">
                {msg.createdAt
                  ? new Date(msg.createdAt).toLocaleString()
                  : ""}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INPUT AREA */}
      <div className="w-full max-w-xl mt-3 flex">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
          className="flex-1 border px-3 py-2 rounded-l bg-white text-black"
        />
        <button
          onClick={sendMessage}
          disabled={sending}
          className="bg-accent text-white px-5 py-2 rounded-r hover:opacity-80"
        >
          Send
        </button>
      </div>

      {/* IMAGE SEND */}
      <div className="w-full max-w-xl mt-2 flex">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setSelectedImage(e.target.files[0])}
          className="flex-1"
        />
        <button
          onClick={sendImage}
          disabled={sending}
          className="bg-accent text-white px-4 py-2 rounded ml-2"
        >
          Image
        </button>
      </div>
    </div>
  );
}
