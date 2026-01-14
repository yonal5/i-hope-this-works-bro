import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { CiCirclePlus } from "react-icons/ci";
import { FaRegEdit } from "react-icons/fa";
import { FaRegTrashCan } from "react-icons/fa6";
import { Link, useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";

// derive API base URL for static files
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/api\/?$/, "");

// ---------------- DELETE CONFIRM MODAL ----------------
function ProductDeleteConfirm({ productID, close, refresh }) {
  const deleteProduct = () => {
    const token = localStorage.getItem("token");
    axios
      .delete(`${import.meta.env.VITE_API_URL}/api/products/${productID}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("Product deleted successfully");
        close();
        refresh();
      })
      .catch(() => toast.error("Failed to delete product"));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-primary rounded-2xl p-6 w-[500px] flex flex-col items-center gap-6 relative">
        <button
          onClick={close}
          className="absolute -top-5 -right-5 w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-bold hover:bg-white hover:text-red-600 transition"
        >
          X
        </button>
        <p className="text-lg font-semibold text-center">
          Are you sure you want to delete <br /> the product with ID: <span className="font-mono">{productID}</span>?
        </p>
        <div className="flex gap-6">
          <button
            onClick={close}
            className="px-6 py-2 rounded-full bg-gray-200 text-secondary hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={deleteProduct}
            className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- MAIN ADMIN PRODUCT PAGE ----------------
export default function AdminProductPage() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
        .then((res) => setProducts(res.data))
        .finally(() => setIsLoading(false));
    }
  }, [isLoading]);

  return (
    <div className="w-full min-h-full relative">
      {isDeleteConfirmVisible && (
        <ProductDeleteConfirm
          productID={productToDelete}
          close={() => setIsDeleteConfirmVisible(false)}
          refresh={() => setIsLoading(true)}
        />
      )}

      <Link
        to="/admin/add-product"
        className="fixed right-12 bottom-12 text-5xl text-accent hover:text-accent/80 transition"
      >
        <CiCirclePlus />
      </Link>

      <div className="mx-auto max-w-7xl p-6">
        <div className="bg-primary border border-secondary/10 shadow-sm rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-secondary/10">
            <h1 className="text-lg font-semibold text-secondary">Products</h1>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {products.length} items
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <Loader />
            ) : (
              <table className="w-full min-w-[880px] text-left">
                <thead className="bg-secondary text-white">
                  <tr>
                    {["Image", "Product ID", "Name", "Price", "Labelled Price", "Stock", "Category", "Actions"].map((header) => (
                      <th
                        key={header}
                        className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-secondary/10">
                  {products.length ? products.map((item) => (
                    <tr key={item.productID} className="odd:bg-white even:bg-primary hover:bg-accent/5 transition-colors">
                      {/* Image */}
                      <td className="px-4 py-3">
                        <img
                          src={item.images?.[0]?.startsWith("http") ? item.images[0] : API_BASE + item.images?.[0]}
                          alt={item.name}
                          onError={(e) => e.currentTarget.src = "https://via.placeholder.com/64?text=No+Image"}
                          className="h-16 w-16 rounded-lg object-cover ring-1 ring-secondary/15"
                        />
                      </td>

                      {/* Product Info */}
                      <td className="px-4 py-3 font-mono text-sm text-secondary/80">{item.productID}</td>
                      <td className="px-4 py-3 font-medium text-secondary">{item.name}</td>
                      <td className="px-4 py-3 text-secondary/90">
                        <span className="rounded-md bg-secondary/5 px-2 py-1 text-sm">LKR {item.price}</span>
                      </td>
                      <td className="px-4 py-3 text-secondary/70">
                        <span className="text-sm line-through">LKR {item.labelledPrice}</span>
                      </td>
                      <td className="px-4 py-3 text-secondary/70">{item.stock}</td>
                      <td className="px-4 py-3">
                        <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-medium text-accent">{item.category}</span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3">
                        <div className="flex justify-center items-center gap-3">
                          <FaRegTrashCan
                            className="cursor-pointer p-2 rounded-lg text-secondary/70 ring-1 ring-secondary/10 hover:bg-accent/10 hover:text-accent transition"
                            size={36}
                            onClick={() => {
                              setProductToDelete(item.productID);
                              setIsDeleteConfirmVisible(true);
                            }}
                          />
                          <FaRegEdit
                            className="cursor-pointer p-2 rounded-lg text-secondary/70 ring-1 ring-secondary/10 hover:bg-accent/10 hover:text-accent transition"
                            size={36}
                            onClick={() => navigate("/admin/update-product", { state: item })}
                          />
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={8} className="px-4 py-12 text-center text-secondary/60">
                        No products available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
