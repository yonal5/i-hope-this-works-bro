import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../utils/cart"; // ✅ make sure this path is correct
import toast from "react-hot-toast";

export default function ProductCard(props) {
	const product = props.product;
	return (
		<div className="w-[350px] h-auto shadow-2xl m-3 flex rounded-[40px] flex-col p-[25px]">
			<Link to={"/overview/"+product.productID} >
				<img className="w-full h-[250px] flex object-cover " src={product.images[0]}/>
            </Link>
			
			<h1 className="text-xl font-bold text-secondary">{product.name}</h1>
			{
				product.labelledPrice>product.price?
				<div className="flex gap-3 items-center">
					
					<p className="text-lg text-accent font-semibold">USD {product.price.toFixed(2)}</p>
				</div>:
				<p className="text-lg text-accent font-semibold">USD {product.price.toFixed(2)}</p>
			}
			<p className="text-sm text-secondary/70">{product.productID}</p>
			
			{/* ✅ Add to Cart button */}
			<div className="flex flex-col gap-3 mt-4">
  {/* 🛒 Add to Cart Button */}
  <button
    onClick={() => {
      addToCart(product, 1);
      toast.success("Added to cart!");
      navigate("/cart");
    }}
    className="w-full py-2.5 rounded-xl border-2 border-accent text-accent font-semibold 
               transition-all duration-300 hover:bg-accent hover:text-white 
               shadow-sm hover:shadow-md active:scale-[0.98]"
  >
    Add to Cart
  </button>

  {/* 👁️ View Product Button */}
  <Link
    to={`/overview/${product.productID}`}
    className="w-full py-2.5 rounded-xl border-2 border-accent text-accent text-center font-semibold 
               transition-all duration-300 hover:bg-accent/90 hover:text-white 
               shadow-sm hover:shadow-md active:scale-[0.98]"
  >
    View Product
  </Link>
</div>

			
		</div>
	);
}
