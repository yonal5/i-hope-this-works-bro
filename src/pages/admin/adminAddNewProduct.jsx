import { useState } from "react";
import { useNavigate } from "react-router-dom";
import mediaUpload from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddProductPage() {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [altNames, setAltNames] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [price, setPrice] = useState(0);
  const [labelledPrice, setLabelledPrice] = useState(0);
  const [category, setCategory] = useState("one color saree");
  const [stock, setStock] = useState(0);

  const navigate = useNavigate();

  // Handle image selection & preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);

    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  const addProduct = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/login");

    try {
      // Upload images to Supabase
      const urls = await Promise.all(images.map((file) => mediaUpload(file)));
      const alternativeNames = altNames.split(",").map((n) => n.trim());

      const product = {
        productID: productId,
        name,
        altNames: alternativeNames,
        description,
        images: urls,
        price,
        labelledPrice,
        category,
        stock,
      };

      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, product, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Product added successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(
        `Error: ${err.response?.data?.message || err.message}`
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary/70 p-6">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg border border-accent/30">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-accent/20">
          <div>
            <h1 className="text-2xl font-semibold text-secondary">Add Product</h1>
            <p className="text-sm text-secondary/70">
              Create a new SKU with clean metadata.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Product ID */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-secondary">Product ID</span>
              <input
                placeholder="e.g., DS-CR-001"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                className="h-11 px-3 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              />
            </label>

            {/* Name */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-secondary">Name</span>
              <input
                placeholder="Diamond Shine Night Cream"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-11 px-3 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              />
            </label>

            {/* Alternative Names */}
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium text-secondary">Alternative Names</span>
              <input
                placeholder="Comma-separated, e.g., night cream, hydrating cream"
                value={altNames}
                onChange={(e) => setAltNames(e.target.value)}
                className="h-11 px-3 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              />
            </label>

            {/* Description */}
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium text-secondary">Description</span>
              <textarea
                placeholder="Brief product overview, benefits, and usage."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[120px] px-3 py-2 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              />
            </label>

            {/* Images */}
            <label className="flex flex-col md:col-span-2">
              <span className="text-sm font-medium text-secondary">Images</span>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full cursor-pointer rounded-xl border border-secondary/20 file:rounded-lg file:px-4 file:py-2 file:bg-accent/10 file:text-secondary file:font-medium hover:file:bg-accent/20 transition"
              />
              <div className="flex gap-3 mt-2 overflow-x-auto">
                {previewImages.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`preview-${i}`}
                    className="h-20 w-20 object-cover rounded border"
                  />
                ))}
              </div>
            </label>

            {/* Price */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-secondary">Price</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                className="h-11 px-3 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              />
            </label>

            {/* Labelled Price */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-secondary">Labelled Price</span>
              <input
                type="number"
                value={labelledPrice}
                onChange={(e) => setLabelledPrice(e.target.value)}
                placeholder="MRP / Sticker Price"
                className="h-11 px-3 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              />
            </label>

            {/* Category */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-secondary">Category</span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="h-11 px-3 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              >
                {[
                  "one color saree",
                  "two color saree",
                  "three color saree",
                  "four color saree",
                  "five color saree",
                  "six color saree",
                  "seven color saree",
                  "eight color saree",
                ].map((cat) => (
                  <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                ))}
              </select>
            </label>

            {/* Stock */}
            <label className="flex flex-col">
              <span className="text-sm font-medium text-secondary">Stock</span>
              <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="0"
                className="h-11 px-3 rounded-xl border border-secondary/20 outline-none focus:ring-2 focus:ring-accent focus:border-accent transition"
              />
            </label>

          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-accent/20">
          <span className="text-xs text-secondary/60">
            Tip: Maintain consistent naming for SKU discoverability.
          </span>
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition"
            >
              Cancel
            </button>
            <button
              onClick={addProduct}
              className="px-4 py-2 rounded-full bg-accent/20 text-secondary hover:bg-accent/30 transition"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
