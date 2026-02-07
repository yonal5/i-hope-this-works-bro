import { useEffect, useRef, useState } from "react";
import axios from "axios";
import mediaUpload from "../../utils/mediaUpload";
import { FaPaperPlane, FaBell } from "react-icons/fa";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminChat() {
  const [customers, setCustomers] = useState([]);
  const [selectedGuestId, setSelectedGuestId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const notificationSoundRef = useRef(null);
  const lastMessageIdRef = useRef(null);

  // init sound ONCE
  useEffect(() => {
    notificationSoundRef.current = new Audio("/notification.mp3");
  }, []);

  /* ================= LOAD CUSTOMERS ================= */
  const loadCustomers = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/chat/customers`);

      setCustomers((prev) => {
        if (JSON.stringify(prev) === JSON.stringify(res.data)) {
          return prev;
        }

        return res.data.sort((a, b) => {
          if (b.unreadCount !== a.unreadCount)
            return b.unreadCount - a.unreadCount;
          return (a.customerName || "").localeCompare(b.customerName || "");
        });
      });

      if (!selectedGuestId && res.data.length > 0) {
        setSelectedGuestId(res.data[0].userId);
      }
    } catch (err) {
      console.error("Load customers failed:", err);
    }
  };

  /* ================= LOAD MESSAGES ================= */
  const loadMessages = async () => {
    if (!selectedGuestId) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/chat/admin`, {
        params: { guestId: selectedGuestId },
      });

      const newMessages = res.data;

      // notification check
      if (newMessages.length > 0) {
        const lastMsg = newMessages[newMessages.length - 1];

        if (
          lastMsg.sender === "customer" &&
          lastMessageIdRef.current !== lastMsg._id
        ) {
          notificationSoundRef.current?.play().catch(() => {});
          lastMessageIdRef.current = lastMsg._id;
        }
      }

      setMessages(newMessages);

      // REMOVE any scrollTop or scrollIntoView here!
    } catch (err) {
      console.error("Load messages failed:", err);
    }
  };

  /* ================= POLLING ================= */
  useEffect(() => {
    loadCustomers();
    loadMessages();

    const interval = setInterval(() => {
      loadCustomers();
      loadMessages();
    }, 2000);

    return () => clearInterval(interval);
  }, [selectedGuestId]);

  /* ================= SEND TEXT ================= */
  const sendText = async () => {
    if (!text.trim()) return;

    try {
      setLoading(true);

      await axios.post(`${BASE_URL}/api/chat/admin/send`, {
        guestId: selectedGuestId,
        message: text,
        type: "text",
      });

      setText("");
      loadMessages();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ================= SEND IMAGE ================= */
  const sendImage = async () => {
    if (!image) return;

    try {
      setLoading(true);

      const imageUrl = await mediaUpload(image);

      await axios.post(`${BASE_URL}/api/chat/admin/send`, {
        guestId: selectedGuestId,
        imageUrl,
        type: "image",
      });

      setImage(null);
      loadMessages();
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ================= UI ================= */
  return (
    <div className="flex h-screen bg-gray-100">

      {/* CUSTOMER LIST */}
      <div className="w-80 bg-white border-r flex flex-col">
        <div className="p-4 font-bold border-b">Customers</div>

        <div className="flex-1 overflow-y-auto">
          {customers.map((c) => (
            <div
              key={c.userId}
              onClick={() => setSelectedGuestId(c.userId)}
              className={`p-3 border-b cursor-pointer hover:bg-gray-100 ${
                selectedGuestId === c.userId ? "bg-gray-200" : ""
              }`}
            >
              <div className="flex justify-between">
                <span>{c.customerName || c.userId}</span>
                {c.unreadCount > 0 && selectedGuestId !== c.userId && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 animate-pulse">
                    <FaBell />
                    {c.unreadCount}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 flex flex-col">

        <div className="p-4 border-b bg-white font-semibold">
          {customers.find((c) => c.userId === selectedGuestId)?.customerName ||
            "Select Customer"}
        </div>

        {/* MESSAGES */}
        <div className="flex-1 p-4 overflow-y-auto flex flex-col-reverse">
          {messages
            .slice()
            .reverse()
            .map((m) => (
              <div
                key={m._id}
                className={`flex mb-2 ${
                  m.sender === "admin" ? "justify-end" : "justify-start"
                }`}
              >
                <div className="bg-white px-3 py-2 rounded shadow max-w-xs">
                  {m.type === "image" ? (
                    <img src={m.imageUrl} className="rounded max-w-[220px]" />
                  ) : (
                    m.message
                  )}
                  <div className="text-xs text-gray-400 mt-1">
                    {m.createdAt ? new Date(m.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* INPUT */}
        <div className="p-3 border-t bg-white flex gap-2">
          {/* PLUS ICON for image upload */}
          <label className="cursor-pointer text-2xl font-bold flex items-center justify-center w-10 h-10 bg-gray-200 rounded">
            +
            <input
              hidden
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>

          <input
            className="flex-1 border px-3 py-2 rounded"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendText()}
          />

          <button
            onClick={sendText}
            className="bg-blue-500 text-white p-3 rounded"
          >
            <FaPaperPlane />
          </button>

          {image && (
            <button
              onClick={sendImage}
              className="bg-green-500 text-white px-3 rounded"
            >
              Upload
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
