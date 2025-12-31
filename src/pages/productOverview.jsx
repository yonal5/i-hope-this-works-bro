import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Loader } from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart } from "../utils/cart";

export default function ProductOverview() {
  const params = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(import.meta.env.VITE_API_URL + "/api/products/" + params.id)
      .then((res) => {
        setProduct(res.data);
        setStatus("success");
      })
      .catch(() => {
        toast.error("Failed to fetch product details");
        setStatus("error");
      });
  }, [params.id]);

  if (status === "loading") return <Loader />;
  if (status === "error")
    return (
      <h1 className="text-red-500 text-center mt-20">
        Failed to load product details
      </h1>
    );

  return (
    <div className="w-full min-h-[calc(100vh-100px)] bg-gray-50 py-6 px-4 sm:px-6 lg:px-20 text-gray-800">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col lg:flex-row">
        
        {/* Image Section */}
        <div className="lg:w-1/2 w-full bg-gray-100 flex justify-center items-center p-4 sm:p-6">
          <ImageSlider
            images={product.images}
            className="rounded-xl shadow-md"
          />
        </div>

        {/* Details Section */}
        <div className="lg:w-1/2 w-full p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
              {product.name}
            </h1>
            <p className="text-xs sm:text-sm text-gray-500 mb-3">
              Product ID: {product.productID}
            </p>
            <p className="text-gray-600 mb-4 text-sm sm:text-base">
              Category: <span className="font-semibold">{product.category}</span>
            </p>

            {/* Price Section */}
            <div className="mb-4 flex items-center flex-wrap gap-2 sm:gap-4">
              {product.labelledPrice > product.price ? (
                <>
                  <span className="text-gray-400 line-through text-sm sm:text-lg">
                    LKR {product.labelledPrice.toFixed(2)}
                  </span>
                  <span className="text-accent text-xl sm:text-2xl font-bold">
                    LKR {product.price.toFixed(2)}
                  </span>
                  <span className="bg-red-500 text-white text-xs sm:text-sm font-semibold px-2 py-1 rounded-full animate-pulse">
                    SALE
                  </span>
                </>
              ) : (
                <span className="text-accent text-xl sm:text-2xl font-bold">
                  LKR {product.price.toFixed(2)}
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-700 text-justify text-sm sm:text-base leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => {
                addToCart(product, 1);
                toast.success("Added to cart");
                navigate("/cart");
              }}
              className="w-full sm:w-1/2 py-3 text-white bg-accent hover:bg-accent/90 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Add to Cart
            </button>

            <Link
              to="/chat"
              state={[
                {
                  image: product.images[0],
                  productID: product.productID,
                  name: product.name,
                  price: product.price,
                  labelledPrice: product.labelledPrice,
                  quantity: 1,
                },
              ]}
              className="w-full sm:w-1/2 py-3 text-accent border border-accent hover:bg-accent hover:text-white rounded-xl font-semibold text-center transition-all shadow-md hover:shadow-lg"
            >
              Buy Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
