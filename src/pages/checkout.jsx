import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [cart, setCart] = useState(location.state || []);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    websiteName: "",
    color: "Green", // default color
    theme: "light",
    logo: null,
    domain: "",
    note: "",
  });

  // Handle input changes (including file input)
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") setFormData({ ...formData, logo: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  // Change quantity
  const handleQuantityChange = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity = Math.max(1, (newCart[index].quantity || 1) + delta);
    setCart(newCart);
  };

  // Calculate total safely
  const getTotal = () =>
    cart.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  // Checkout handler
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    // Filter out invalid cart items
    const validCartItems = cart.filter(
      (item) => item.productID && item.quantity > 0 && item.price >= 0
    );

    if (!validCartItems.length) {
      toast.error("Cart is empty or invalid!");
      return;
    }

    // Validate required fields
    const requiredFields = ["fullName", "email", "phone", "websiteName", "color", "theme"];
    for (let field of requiredFields) {
      if (!formData[field]?.trim()) {
        toast.error(`Please fill ${field}`);
        return;
      }
    }

    // Prepare payload safely
    const payload = {
      orderID: "ORD-" + Date.now(), // unique order ID without uuid
      customerName: formData.fullName.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      address: formData.domain?.trim() || "No address provided",
      total: getTotal(),
      status: "pending",
      date: new Date(),
      items: validCartItems.map((item) => ({
        productID: item.productID,
        quantity: item.quantity,
        name: item.name || "No Name",
        price: item.price || 0,
        image: item.image || "",
      })),
      ...(formData.note?.trim() && { note: formData.note.trim() }),
    };

    setLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/api/orders", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (err) {
      console.error("Checkout Error:", err);
      toast.error(err?.response?.data?.message || "Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-10 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-4">Checkout & Website Info</h2>

        {/* Cart Items */}
        <h3 className="font-semibold">Cart Items</h3>
        {cart.length ? (
          cart.map((item, index) => {
            const price = item.price || 0;
            const quantity = item.quantity || 0;
            return (
              <div key={index} className="flex items-center justify-between border p-2 rounded">
                <div>
                  <span className="font-semibold">{item.name || "No Name"}</span> <br />
                  <span className="text-sm text-gray-500">{item.productID || "No ID"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleQuantityChange(index, -1)}>-</button>
                  <span>{quantity}</span>
                  <button onClick={() => handleQuantityChange(index, 1)}>+</button>
                </div>
                <div>${(price * quantity).toFixed(2)}</div>
              </div>
            );
          })
        ) : (
          <p>Your cart is empty.</p>
        )}
        <div className="text-right font-bold">Total: ${getTotal().toFixed(2)}</div>

        {/* Account Info */}
        <h3 className="font-semibold mt-4">Account Information</h3>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          className="border p-2 rounded w-full"
        />
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border p-2 rounded w-full"
        />

        {/* Website Info */}
        <h3 className="font-semibold mt-4">Website Information</h3>
        <input
          type="text"
          name="websiteName"
          value={formData.websiteName}
          onChange={handleChange}
          placeholder="Website Name"
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Theme color (Green, Blue, etc.)"
          className="border p-2 rounded w-full"
        />
        <select
          name="theme"
          value={formData.theme}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
        </select>
        <div>
          <label className="text-sm block mb-1">Upload Logo</label>
          <input type="file" name="logo" accept="image/*" onChange={handleChange} />
        </div>
        <input
          type="text"
          name="domain"
          value={formData.domain}
          onChange={handleChange}
          placeholder="Domain Name (optional)"
          className="border p-2 rounded w-full"
        />
        <textarea
          name="note"
          value={formData.note}
          onChange={handleChange}
          placeholder="Additional Notes / Requirements"
          rows="4"
          className="border p-2 rounded w-full"
        />

        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-accent text-white py-2 rounded hover:bg-accent/80 mt-2"
        >
          {loading ? "Placing Order..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
