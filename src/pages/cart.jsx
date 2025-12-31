import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";

import { addToCart, getTotal, loadCart } from "../utils/cart";
import axios from "axios";

export default function CartPage({ user }) { // <-- user prop contains registered name
  const [cart, setCart] = useState(loadCart());
  const navigate = useNavigate();
 
const BASE_URL = import.meta.env.VITE_API_URL;

  const updateCart = (item, qty) => {
    addToCart(item, qty);
    setCart(loadCart());
  };

  const removeItem = (item) => updateCart(item, -item.quantity);

  // Send cart to admin
  const sendCartToAdmin = async () => {
  let userNumber = user?.id; // use registered user id if logged in

  // If no user, generate a guest number
  if (!userNumber) {
    userNumber = localStorage.getItem("guestNumber");
    if (!userNumber) {
      userNumber = Math.floor(Math.random() * 1000000); // random number
      localStorage.setItem("guestNumber", userNumber);
    }
  }

  const guestId = localStorage.getItem("guestId") || crypto.randomUUID();
  localStorage.setItem("guestId", guestId);

  // Name or username for display
  const customerName = user?.name || user?.username || `User-${userNumber}`;

  const cartMessage = cart
    .map(
      (item) => `${item.name} x ${item.quantity} - USD ${item.price.toFixed(2)}`
    )
    .join("\n");

  try {
    await axios.post(`${BASE_URL}/api/chat`, {
      guestId,
      customerName,
      message: `🛒User-${userNumber} Checkout Cart Items:\n${cartMessage}`,
    });

    navigate("/chat");
  } catch (err) {
    console.error("Failed to send cart:", err);
    alert("Failed to send cart to admin.");
  }
};


  return (
  <div className="min-h-screen bg-gradient-to-br from-primary to-primary/80 flex justify-center pt-10 px-3">
    <div className="w-full max-w-3xl flex flex-col gap-6">

      {/* Empty Cart */}
      {cart.length === 0 && (
        <div className="bg-white/80 backdrop-blur rounded-2xl p-10 text-center shadow-lg">
          <p className="text-gray-600 text-xl font-medium">
            🛒 Your cart is empty
          </p>
        </div>
      )}

      {/* Cart Items */}
      {cart.map((item, index) => (
        <div
          key={index}
          className="relative bg-white/90 backdrop-blur rounded-2xl shadow-md hover:shadow-xl transition flex flex-col md:flex-row overflow-hidden"
        >
          {/* Remove */}
          <button
            onClick={() => removeItem(item)}
            className="absolute top-3 right-3 text-red-500 hover:text-white hover:bg-red-500 p-2 rounded-full transition"
          >
            <BiTrash size={20} />
          </button>

          {/* Image */}
          <div className="w-full h-44 bg-gray-100 rounded-xl flex items-center justify-center">
  <img
    src={item.image}
    alt={item.name}
    className="max-h-full max-w-full object-contain"
  />
</div>


          {/* Details */}
          <div className="flex-1 p-4 flex flex-col justify-between">
            <div>
              <h1 className="font-semibold text-lg">{item.name}</h1>
              <span className="text-sm text-secondary">
                ID: {item.productID}
              </span>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-3 mt-3">
              <CiCircleChevDown
                className="text-2xl cursor-pointer hover:text-accent"
                onClick={() => updateCart(item, -1)}
              />
              <span className="text-xl font-semibold">
                {item.quantity}
              </span>
              <CiCircleChevUp
                className="text-2xl cursor-pointer hover:text-accent"
                onClick={() => updateCart(item, 1)}
              />
            </div>
          </div>

          {/* Price */}
          <div className="w-full md:w-40 p-4 flex flex-col items-end justify-center">
            {item.labelledPrice > item.price && (
              <span className="text-gray-400 line-through text-sm">
                USD {item.labelledPrice.toFixed(2)}
              </span>
            )}
            <span className="text-accent font-bold text-2xl">
              USD {item.price.toFixed(2)}
            </span>
          </div>
        </div>
      ))}

      {/* Checkout Bar */}
      {cart.length > 0 && (
        <div className="sticky bottom-4 bg-white/95 backdrop-blur rounded-2xl shadow-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-2xl font-bold text-accent">
            Total: USD {getTotal().toFixed(2)}
          </span>

          <button
            onClick={sendCartToAdmin}
            className="bg-accent text-white px-8 py-3 rounded-xl text-lg font-medium hover:bg-accent/80 transition"
          >
            🚀 Proceed to Checkout
          </button>
        </div>
      )}
    </div>
  </div>
);
}
