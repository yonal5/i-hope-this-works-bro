import { useState } from "react";
import { Link } from "react-router-dom";
import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { BiTrash } from "react-icons/bi";

import { addToCart, getTotal, loadCart } from "../utils/cart";

export default function CartPage() {
  const [cart, setCart] = useState(loadCart());

  // Helpers
  const updateCart = (item, qty) => {
    addToCart(item, qty);
    setCart(loadCart());
  };

  const removeItem = (item) => updateCart(item, -item.quantity);

  return (
    <div className="w-full lg:h-[calc(100vh-100px)] bg-primary flex flex-col pt-[25px] items-center">
      <div className="w-[400px] lg:w-[600px] flex flex-col gap-4">
        
        {/* Cart Items */}
        {cart.map((item, index) => (
          <div
            key={index}
            className="w-full h-[300px] lg:h-[120px] bg-white flex flex-col lg:flex-row relative items-center p-3 lg:p-0"
          >
            {/* Remove Button */}
            <button
              onClick={() => removeItem(item)}
              className="absolute right-[-40px] text-2xl text-red-500 rounded-full aspect-square hover:bg-red-500 hover:text-white p-[5px] font-bold"
            >
              <BiTrash />
            </button>

            {/* Image */}
            <img
              src={item.image}
              alt={item.name}
              className="h-[100px] lg:h-full aspect-square object-cover"
            />

            {/* Info */}
            <div className="w-full lg:w-[200px] h-[100px] lg:h-full flex flex-col pl-[5px] pt-[10px] text-center lg:text-left">
              <h1 className="font-semibold text-lg">{item.name}</h1>
              <span className="text-sm text-secondary">{item.productID}</span>
            </div>

            {/* Quantity Controls */}
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

            {/* Price */}
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

        {/* Checkout Section */}
        <div className="w-full h-[120px] bg-white flex flex-col-reverse lg:flex-row justify-end items-center relative">
          <Link
            to="/chat"
            state={cart}
            className="lg:absolute left-0 bg-accent text-white px-6 py-3 lg:ml-[20px] hover:bg-accent/80"
          >
            Proceed to Checkout
          </Link>
          <div className="h-[50px] flex items-center">
            <span className="font-semibold text-accent text-2xl lg:text-right lg:pr-[10px]">
              Total: USD {getTotal().toFixed(2)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
