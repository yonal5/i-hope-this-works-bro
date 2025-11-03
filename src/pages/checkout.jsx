import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // ✅ Cart items passed from Cart page
  const [cart, setCart] = useState(location.state || []);
  const [loading, setLoading] = useState(false);

  // ✅ Account & Website info
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    websiteName: "",
    color: "#ffffff",
    theme: "light",
    logo: null,
    domain: "",
    note: "",
  });

  // ✅ Pre-fill account info if user logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/account`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setFormData((prev) => ({
          ...prev,
          fullName: res.data.fullName || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
        }));
      })
      .catch(() => {});
  }, []);

  // ✅ Input change handler
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "logo") {
      setFormData({ ...formData, logo: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // ✅ Quantity change for cart items
  const handleQuantityChange = (index, delta) => {
    const newCart = [...cart];
    newCart[index].quantity += delta;
    if (newCart[index].quantity < 1) newCart[index].quantity = 1;
    setCart(newCart);
  };

  // ✅ Calculate total
  const getTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  // ✅ Checkout handler
  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    // Create FormData for file + data
    const orderData = new FormData();
    for (const key in formData) {
      orderData.append(key, formData[key]);
    }
    orderData.append("cartItems", JSON.stringify(cart));

    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/orders/weborder`,
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Order placed successfully!");
      navigate("/thank-you"); // Redirect after order placed
    } catch (err) {
      toast.error("Failed to place order");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex justify-center items-start pt-10 bg-gray-100">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[600px] flex flex-col gap-6">
        <h2 className="text-2xl font-bold text-center mb-4">
          Checkout & Website Info
        </h2>

        {/* ✅ Cart Items */}
        <h3 className="font-semibold">Cart Items</h3>
        {cart.map((item, index) => (
          <div
            key={index}
            className="flex items-center justify-between border p-2 rounded"
          >
            <div>
              <span className="font-semibold">{item.name}</span> <br />
              <span className="text-sm text-gray-500">{item.productID}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleQuantityChange(index, -1)}
                className="px-2 border rounded"
              >
                -
              </button>
              <span>{item.quantity}</span>
              <button
                onClick={() => handleQuantityChange(index, 1)}
                className="px-2 border rounded"
              >
                +
              </button>
            </div>
            <div>${(item.price * item.quantity).toFixed(2)}</div>
          </div>
        ))}
        <div className="text-right font-bold">
          Total: ${getTotal().toFixed(2)}
        </div>

        {/* ✅ Account Info */}
        <h3 className="font-semibold mt-4">Account Information</h3>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Full Name"
          required
          className="border p-2 rounded w-full"
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Email"
          required
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

        {/* ✅ Website Info */}
        <h3 className="font-semibold mt-4">Website Information</h3>
        <input
          type="text"
          name="websiteName"
          value={formData.websiteName}
          onChange={handleChange}
          placeholder="Website Name"
          required
          className="border p-2 rounded w-full"
        />

        <input
          type="text"
          name="color"
          value={formData.color}
          onChange={handleChange}
          placeholder="Theme Color (e.g. Blue, Green)"
          className="border p-2 rounded w-full"
        />

        <div>
          <label className="text-sm block mb-1">Theme</label>
          <select
            name="theme"
            value={formData.theme}
            onChange={handleChange}
            className="border p-2 rounded w-full"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>

        <div>
          <label className="text-sm block mb-1">Upload Logo</label>
          <input
            type="file"
            name="logo"
            accept="image/*"
            onChange={handleChange}
            className="w-full"
          />
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

        {/* ✅ Checkout Button */}
        <button
          onClick={handleCheckout}
          disabled={loading}
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mt-2"
        >
          {loading ? "Placing Order..." : "Checkout"}
        </button>
      </div>
    </div>
  );
}
