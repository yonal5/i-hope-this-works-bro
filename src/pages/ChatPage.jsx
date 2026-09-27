import { useCallback, useEffect, useRef, useState } from "react";
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

  // Selected image file
  const [selectedImage, setSelectedImage] = useState(null);

  // Image preview URL
  const [imagePreview, setImagePreview] = useState(null);

  // File input reference
  const fileInputRef = useRef(null);

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
          state: {
            from: location.pathname,
          },
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
  const loadMessages = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat`, {
        params: {
          guestId,
        },
        headers: {
          Authorization: `Bearer ${
            localStorage.getItem("token") || ""
          }`,
        },
      });

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.messages || [];

      setMessages(data);
    } catch (err) {
      console.error("Load messages failed:", err);
    }
  }, [guestId]);

  /* ================= AUTO LOAD ================= */
  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 2500);

    return () => clearInterval(interval);
  }, [loadMessages]);

  /* ================= SEND TEXT MESSAGE ================= */
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

      await loadMessages();
    } catch (err) {
      console.error("Send message failed:", err);
      alert("Send failed");
    } finally {
      setSending(false);
    }
  };

  /* ================= SELECT IMAGE ================= */
  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    // Check that selected file is actually an image
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      e.target.value = "";
      return;
    }

    // Remove previous preview URL
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    // Store selected file
    setSelectedImage(file);

    // Create preview
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  /* ================= REMOVE SELECTED IMAGE ================= */
  const removeSelectedImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(null);
    setImagePreview(null);

    // Reset file input so the same image can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /* ================= SEND IMAGE ================= */
  const sendImage = async () => {
    if (!selectedImage || sending) return;

    setSending(true);

    try {
      // Upload image
      const imageUrl = await mediaUpload(selectedImage);

      // Save image message
      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        type: "image",
        imageUrl,
        message: "",
      });

      // Remove selected image and preview
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }

      setSelectedImage(null);
      setImagePreview(null);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      await loadMessages();
    } catch (err) {
      console.error("Image send failed:", err);
      alert("Image send failed");
    } finally {
      setSending(false);
    }
  };

  /* ================= CLEANUP PREVIEW ================= */
  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

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
      <h1 className="text-2xl font-bold mb-3 text-black">
        Chat With Us
      </h1>

      {/* CUSTOMER NAME */}
      <input
        value={customerName}
        readOnly
        className="w-full max-w-xl border px-3 py-2 rounded mb-3 bg-white text-black"
      />

      {/* CART */}
      {cart.length > 0 && (
        <div className="bg-white border rounded p-3 mb-3 w-full max-w-xl">
          <h2 className="font-semibold mb-2 text-black">
            Your Cart
          </h2>

          {cart.map((item, index) => (
            <div
              key={index}
              className="flex justify-between text-sm text-black"
            >
              <span>
                {item.name} × {item.quantity}
              </span>

              <span>
                ${item.price.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* CHAT BOX */}
      <div className="bg-white border rounded p-3 w-full max-w-xl h-[60vh] overflow-y-auto">

        {messages.length === 0 && (
          <div className="text-center text-gray-400 py-10">
            No messages yet.
          </div>
        )}

        {messages.map((msg, index) => (
          <div
            key={msg._id || msg.id || index}
            className={`my-2 flex ${
              msg.sender === "admin"
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-[75%] ${
                msg.sender === "admin"
                  ? "bg-gray-200 text-red-500"
                  : "bg-gray-200 text-black"
              }`}
            >

              {/* IMAGE MESSAGE */}
              {msg.type === "image" && msg.imageUrl && (
                <img
                  src={msg.imageUrl}
                  alt="Chat attachment"
                  className="max-w-[220px] max-h-[300px] rounded-lg object-contain cursor-pointer"
                  onClick={() => window.open(msg.imageUrl, "_blank")}
                />
              )}

              {/* TEXT MESSAGE */}
              {msg.type === "text" && msg.message && (
                <div className="break-words">
                  {msg.message}
                </div>
              )}

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

      {/* TEXT INPUT AREA */}
      <div className="w-full max-w-xl mt-3 flex">

        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              sendMessage();
            }
          }}
          placeholder="Type message..."
          className="flex-1 border px-3 py-2 rounded-l bg-white text-black"
        />

        <button
          onClick={sendMessage}
          disabled={sending || !message.trim()}
          className="bg-accent text-white px-5 py-2 rounded-r hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send"}
        </button>

      </div>

      {/* ================= IMAGE SEND ================= */}
      <div className="w-full max-w-xl mt-2">

        {/* IMAGE PREVIEW */}
        {imagePreview && (
          <div className="bg-white border rounded-lg p-3 mb-2">

            {/* PREVIEW TITLE */}
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">
                Image Preview
              </span>

              <button
                type="button"
                onClick={removeSelectedImage}
                className="text-red-500 hover:text-red-700 font-bold text-xl"
                title="Remove image"
              >
                ×
              </button>
            </div>

            {/* PREVIEW IMAGE */}
            <div className="flex justify-center">

              <div className="relative">

                <img
                  src={imagePreview}
                  alt="Selected preview"
                  className="max-w-[300px] max-h-[300px] rounded-lg object-contain border"
                />

              </div>

            </div>

            {/* FILE NAME */}
            {selectedImage && (
              <div className="text-xs text-gray-500 mt-2 text-center truncate">
                {selectedImage.name}
              </div>
            )}

          </div>
        )}

        {/* FILE INPUT + IMAGE BUTTON */}
        <div className="flex">

          {/* FILE INPUT */}
          <div className="flex-1 border px-3 py-2 rounded-l bg-white text-black">

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              disabled={sending}
              className="w-full"
            />

          </div>

          {/* SEND IMAGE BUTTON */}
          <button
            onClick={sendImage}
            disabled={!selectedImage || sending}
            className="bg-accent text-white px-4 py-2 rounded ml-2 hover:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Image"}
          </button>

        </div>

      </div>
    </div>
  );
}
