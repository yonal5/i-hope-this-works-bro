
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function RegisterPage() {
	
	const [firstName, setfirstName] = useState("");
	const [lastName, setlastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	const navigate = useNavigate()

	async function Register() {
		if(password !== confirmPassword){
			toast.error("Passwords do not match");
			return;
		}
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + "/api/users/",
				{ 
					firstName: firstName,
					lastName: lastName,
					email : email, 
					password : password
				
				}
			);

			toast.success("Registration successful! Please log in.");
			navigate("/login");

				
		} catch (e) {
			console.error("Register failed:", e);
			//alert("Login failed. Please check your credentials.");
			toast.error("Register failed. Please check your credentials.");
		}
	}


	return (
		<div className="min-h-screen w-full relative flex items-stretch">
			{/* Background image + gradient overlay */}
			<div className="absolute inset-0">
				<div className="h-full w-full bg-cover bg-center" />
				<div className="absolute inset-0 bg-gradient-to-br from-secondary/70 via-secondary/40 to-primary/70" />
			</div>

			{/* Layout */}
			<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full">
				{/* Right side form */}
				<div className="flex items-center justify-center p-6 sm:p-10">
					<div className="w-full max-w-md">
						<div className="rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-8 sm:p-10">
							<div className="mb-8 flex flex-col items-center text-center">
								<img
									src="/logo.png"
									alt="Aruni Batik CreationsLogo"
									className="h-12 w-auto mb-4"
								/>
								<h2 className="text-2xl font-semibold text-white">
									Welcome back to Aruni Batik Creations
								</h2>
								<p className="text-primary/90 text-sm">
									Log in to continue your beauty journey and checkout faster.
								</p>
							</div>

							<div className="space-y-5">
								
								<div className="space-y-2">
									<label
										htmlFor="firstName"
										className="text-sm font-medium text-primary/90"
									>
										First Name
									</label>
									<input
										id="firstName"
										type="text"
										placeholder="e.g., John"
										autoComplete="email"
										onChange={(e) => setfirstName(e.target.value)}
										className="w-full h-11 rounded-xl bg-white/90 text-secondary placeholder-secondary/50 px-4 outline-none ring-2 ring-transparent focus:ring-accent/60 transition"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="lastName"
										className="text-sm font-medium text-primary/90"
									>
										Last Name
									</label>
									<input
										id="lastName"
										type="text"
										placeholder="e.g., Doe"
										autoComplete="email"
										onChange={(e) => setlastName(e.target.value)}
										className="w-full h-11 rounded-xl bg-white/90 text-secondary placeholder-secondary/50 px-4 outline-none ring-2 ring-transparent focus:ring-accent/60 transition"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="email"
										className="text-sm font-medium text-primary/90"
									>
										Email address
									</label>
									<input
										id="email"
										type="email"
										placeholder="e.g., you@example.com"
										autoComplete="email"
										onChange={(e) => setEmail(e.target.value)}
										className="w-full h-11 rounded-xl bg-white/90 text-secondary placeholder-secondary/50 px-4 outline-none ring-2 ring-transparent focus:ring-accent/60 transition"
									/>
								</div>

								<div className="space-y-2">
									<label
										htmlFor="password"
										className="text-sm font-medium text-primary/90"
									>
										Password
									</label>
									<input
										id="password"
										type="password"
										placeholder="Enter your password"
										autoComplete="current-password"
										onChange={(e) => setPassword(e.target.value)}
										className="w-full h-11 rounded-xl bg-white/90 text-secondary placeholder-secondary/50 px-4 outline-none ring-2 ring-transparent focus:ring-accent/60 transition"
									/>
								</div>
								<div className="space-y-2">
									<label
										htmlFor="confirmPassword"
										className="text-sm font-medium text-primary/90"
									>
										Confirm Password
									</label>
									<input
										id="confirmPassword"
										type="password"
										placeholder="Re-enter your password"
										autoComplete="current-password"
										onChange={(e) => setConfirmPassword  (e.target.value)}
										className="w-full h-11 rounded-xl bg-white/90 text-secondary placeholder-secondary/50 px-4 outline-none ring-2 ring-transparent focus:ring-accent/60 transition"
									/>
								</div>


								<button
									onClick={Register}
									className="w-full h-11 rounded-xl bg-accent text-white font-semibold shadow-lg shadow-accent/20 hover:brightness-110 active:scale-[0.99] transition"
								>
									Register
								</button>
								
							</div>

							<div className="mt-8">
								<div className="relative text-center">
									<div className="absolute inset-0 flex items-center">
										<span className="w-full border-t border-white/20"></span>
									</div>
								</div>
							</div>

							<div className="mt-6 text-center text-sm text-primary/90">
								Already have and acount?{" "}
								<Link
									to="/login"
									className="text-accent hover:underline underline-offset-4"
								>
									Login your account
								</Link>
							</div>
						</div>

						{/* Small footer for mobile */}
						<p className="mt-6 text-center text-primary/80 text-xs lg:hidden">
							© {new Date().getFullYear()} Aruni Batik Creations– Batik made with Love
						</p>
					</div>
				</div>
				{/* Left side hero */}
				<div className="hidden lg:flex flex-col justify-between p-10">
					<div className="flex items-center gap-4">
						<img
							src="/logo.png"
							alt="Aruni Batik Creations- Batik made with Love"
							className="h-10 w-auto"
						/>
						<span className="text-primary/90 tracking-wide font-semibold">
							Aruni Batik Creations• Batik made with Love
						</span>
					</div>

					<div className="flex-1 flex items-center">
						<div className="max-w-xl space-y-6">
							<h1 className="text-5xl font-bold leading-tight text-white drop-shadow">
								Best in. <span className="text-accent">ONE Place.</span>
							</h1>
							<p className="text-primary/90 text-lg">
								Register to explore exclusive offers, track your orders, and save
								your Gaming Race. best place to start you Journy.
							</p>
							<div className="h-1 w-28 bg-accent rounded-full" />
						</div>
					</div>

					<p className="text-primary/80 text-sm">
						© {new Date().getFullYear()} Aruni Batik Creations– Batik made with Love. All rights
						reserved.
					</p>
				</div>

				
			</div>
		</div>
	);
}
