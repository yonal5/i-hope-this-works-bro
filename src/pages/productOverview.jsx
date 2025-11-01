import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../components/loader";
import ImageSlider from "../components/imageSlider";
import { addToCart, loadCart } from "../utils/cart";
import { useNavigate } from "react-router-dom";

export default function ProductOverview() {
	const params = useParams();
	//laoding, success, error
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
if (status === "error") return <h1 className="text-red-500">Failed to load product details</h1>;

	return (
		<div className="w-full dh-[calc(100vh-100px)]  text-secondary">
			{status == "loading" && <Loader />}
			{status == "success" && (
				<div className="w-full flex flex-col p-10 lg:flex-row">
					<h1 className="text-2xl font-bold text-center lg:hidden">{product.name}</h1>
					<div className="w-full lg:w-[50%] h-full flex justify-center items-center">
							<ImageSlider className="w-[200px] h-[200px]" images={product.images}/>
                    </div>
					<div className="w-full h-full flex flex-col justify-center items-center gap-4 p-10">
                        <span className="">{product.productID}</span>
						<h1 className="text-2xl font-bold text-center">{product.name}
							
    
                        </h1>                        
						{/* category */}
                        <p >Category: {product.category}</p>
                        {/* price */}
                        {
                            product.labelledPrice>product.price?
                            <div className="flex gap-3 items-center">
                                <p className="text-lg text-secondary font-semibold line-through">USD {product.labelledPrice.toFixed(2)}</p>
                                <p className="text-lg text-accent font-semibold">USD {product.price.toFixed(2)}</p>
                            </div>:
                            <p className="text-lg text-accent font-semibold">USD {product.price.toFixed(2)}</p>
                        }
						<div className="w-full h-[40px] flex gap-4 mt-[60px]">
							<button
							className="w-[50%] h-full border border-accent text-accent hover:text-white font-semibold text-center hover:bg-accent/80"
							onClick={() => {
								addToCart(product, 1);       // add product to cart
								toast.success("Added to cart");
								navigate("/cart");            // navigate to cart page
							}}
							>
							Add to Cart
							</button>

							{/* Buy Now button → goes to Checkout */}
							<Link
							to="/checkout"
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
							className="w-[50%] text-center h-full border border-accent text-accent font-semibold hover:bg-accent hover:text-white"
							>
							Buy Now
							</Link>
                        </div>
                        {/* description */}
                        <p className="mt-[30px] text-justify">{product.description}</p>




					</div>
				</div>
			)}
			{status == "error" && (
				<h1 className="text-red-500">Failed to load product details</h1>
			)}
		</div>
	);

}
