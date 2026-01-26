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
  const [selectedImage, setSelectedImage] = useState(null);
  const [messages, setMessages] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [message, setMessage] = useState("");
  const [cart] = useState(cartFromState);
  const [sending, setSending] = useState(false);


  const [guestId] = useState(() => {
    let id = localStorage.getItem("guestId");
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem("guestId", id);
    }
    return id;
  });


  const [userNumber] = useState(() => {
    let num = localStorage.getItem("guestNumber");
    if (!num) {
      num = Math.floor(100000 + Math.random() * 900000);
      localStorage.setItem("guestNumber", num);
    }
    return num;
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      setAuthError("⚠️ You are not logged in. Redirecting to login page...");
  
      const timer = setTimeout(() => {
        navigate("/login", {
          replace: true,
          state: { from: location.pathname },
        });
      }, 2500);
  
      return () => clearTimeout(timer);
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (user?.name || user?.username) {
      setCustomerName(user.name || user.username);
    } else {
      setCustomerName(`User-${userNumber}`);
    }
  }, [user, userNumber]);

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
      setMessages([]);
    }
  };

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
        message: "Image uploaded", 
      });

      setSelectedImage(null);
      loadMessages();
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("Image upload failed");
    } finally {
      setSending(false);
    }
  };


  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 2500);
    return () => clearInterval(interval);
  }, []);

  const sendMessage = async () => {
    if (!message.trim() || sending) return;

    setSending(true);

    const prefixedMessage = `User-${userNumber}: ${message.trim()}`;

    try {
      await axios.post(`${BASE_URL}/api/chat`, {
        customerName,
        guestId,
        type: "text",
        message: prefixedMessage,
      });

      setMessage("");
      loadMessages();
    } catch (err) {
      console.error("Send message failed:", err);
      alert("Message failed to send. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
    {authError && (
      <div className="bg-red-100 text-red-700 border border-red-300 px-4 py-3 mb-3 rounded w-full max-w-xl text-center">
        {authError}
      </div>
    )}
    
      <h1 className="text-2xl font-bold mb-3">Chat With Us</h1>

      <input
        className="border px-4 py-2 mb-3 rounded w-full max-w-xl bg-gray-100"
        value={customerName}
        readOnly
      />

      {/* CART */}
      {cart.length > 0 && (
        <div className="bg-white w-full max-w-xl p-3 mb-3 rounded border">
          <h2 className="font-semibold mb-2">Your Cart</h2>
          {cart.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>${item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>
      )}

      {/* CHAT */}
      <div className="bg-white w-full max-w-xl p-3 h-[60vh] overflow-y-auto rounded border">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`my-2 text-sm ${
              msg.sender === "admin" ? "text-red-600 text-right" : "text-left"
            }`}
          >
            <div className="inline-block px-3 py-2 rounded bg-gray-200">
              {msg.type === "image" && msg.imageUrl ? (
                <img
                  src={msg.imageUrl}
                  alt="chat"
                  className="max-w-[220px] rounded"
                />
              ) : (
                msg.message
              )}
            </div>
          </div>
        ))}
      </div>

      {/* INPUT */}
      <div className="mt-3 flex w-full max-w-xl items-center">
        <input
          className="flex-1 border px-4 py-2 rounded-l"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          disabled={sending}
          className="bg-blue-600 text-white px-5 py-2 rounded-r disabled:opacity-50"
        >
          Send
        </button>

        
      </div>
    </div>
  );
}
  
