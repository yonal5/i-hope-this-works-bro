import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";

import { addToCart, getTotal, loadCart } from "../utils/cart";
import axios from "axios";

export default function CartPage({ user }) { // <-- user prop contains registered name
  const [cart, setCart] = useState(loadCart());
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:5000";

  const updateCart = (item, qty) => {
    addToCart(item, qty);
    setCart(loadCart());
  };

  const removeItem = (item) => updateCart(item, -item.quantity);

  // Send cart to admin
  const sendCartToAdmin = async () => {
    const guestId = localStorage.getItem("guestId") || crypto.randomUUID();
    localStorage.setItem("guestId", guestId);

    // Use registered name from user object
    const customerName = user?.name || user?.username || "Guest";

    // Create a single message with all cart items
    const cartMessage = cart.map(item => `${item.name} x ${item.quantity} - USD ${item.price.toFixed(2)}`).join("\n");

    try {
      await axios.post(`${BASE_URL}/api/chat`, {
        guestId,
        customerName,
        message: `🛒 Checkout Cart Items:\n${cartMessage}`,
      });

      // redirect to chat page
      navigate("/chat");
    } catch (err) {
      console.error("Failed to send cart:", err);
      alert("Failed to send cart to admin.");
    }
  };

  return (
    <div className="w-full lg:h-[calc(100vh-100px)] bg-primary flex flex-col pt-[25px] items-center">
      <div className="w-[400px] lg:w-[600px] flex flex-col gap-4">
        {cart.length === 0 ? (
          <div className="w-full bg-white p-6 text-center rounded">
            <p className="text-gray-600 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <>
            {cart.map((item, index) => (
              <div
                key={index}
                className="w-full h-[300px] lg:h-[120px] bg-white flex flex-col lg:flex-row relative items-center p-3 lg:p-0"
              >
                <button
                  onClick={() => removeItem(item)}
                  className="absolute right-[-40px] text-2xl text-red-500 rounded-full aspect-square hover:bg-red-500 hover:text-white p-[5px] font-bold"
                >
                  <BiTrash />
                </button>

                <img
                  src={item.image}
                  alt={item.name}
                  className="h-[100px] lg:h-full aspect-square object-cover"
                />

                <div className="w-full lg:w-[200px] h-[100px] lg:h-full flex flex-col pl-[5px] pt-[10px] text-center lg:text-left">
                  <h1 className="font-semibold text-lg">{item.name}</h1>
                  <span className="text-sm text-secondary">{item.productID}</span>
                </div>

                <div className="w-[100px] h-full flex flex-row lg:flex-col justify-center items-center">
                  <CiCircleChevUp
                    className="text-3xl cursor-pointer"
                    onClick={() => updateCart(item, 1)}
                  />
                  <span className="font-semibold text-4xl">{item.quantity}</span>
                  <CiCircleChevDown
                    className="text-3xl cursor-pointer"
                    onClick={() => updateCart(item, -1)}
                  />
                </div>

                <div className="w-full lg:w-[180px] lg:h-full flex flex-row lg:flex-col items-center justify-center">
                  {item.labelledPrice > item.price && (
                    <span className="text-secondary text-lg line-through lg:w-full text-center lg:text-right pr-[10px] lg:mt-[20px]">
                      USD {item.labelledPrice.toFixed(2)}
                    </span>
                  )}
                  <span className="font-semibold text-accent text-2xl lg:w-full text-center lg:text-right pr-[10px] lg:mt-[5px]">
                    USD {item.price.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            <div className="w-full h-[120px] bg-white flex flex-col-reverse lg:flex-row justify-end items-center relative">
              <button
                onClick={sendCartToAdmin}
                className="lg:absolute left-0 bg-accent text-white px-6 py-3 lg:ml-[20px] hover:bg-accent/80"
              >
                Proceed to Checkout
              </button>

              <div className="h-[50px] flex items-center">
                <span className="font-semibold text-accent text-2xl lg:text-right lg:pr-[10px]">
                  Total: USD {getTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
