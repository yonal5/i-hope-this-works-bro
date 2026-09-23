import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
    const navigate = useNavigate()
 
	const googleLogin = useGoogleLogin({
		onSuccess: (response) => {
			axios.post(import.meta.env.VITE_API_URL + "/api/users/google-login", {
				token: response.access_token
			}).then((res) => {
				localStorage.setItem("token", res.data.token);
				const user = res.data.user;
				if (user.role === "admin") {
					navigate("/admin");
				} else {
					navigate("/");
				}
			}).catch(() => {
				toast.error("Google login failed. Please try again.");
			});
		}
	});

	async function login() {
		try {
			const response = await axios.post(
				import.meta.env.VITE_API_URL + "/api/users/login",
				{ email, password }
			);
			localStorage.setItem("token", response.data.token);
			toast.success("Login successful!");

			const user = response.data.user;
			if (user.role === "admin") {
				navigate("/admin");
			} else {
				navigate("/");
			}
		} catch {
			toast.error("Login failed. Please check your credentials.");
		}
	}

	return (
		<div className="min-h-screen w-full relative flex items-stretch">
			{/* Background */}
			<div className="absolute inset-0">
				<div className="absolute inset-0 bg-gradient-to-br from-secondary/70 via-secondary/40 to-primary/70" />
			</div>

			<div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 w-full">

				{/* Left side */}
				<div className="hidden lg:flex flex-col justify-between p-10">
					<div className="flex items-center gap-4">
						<img src="/logo.png" alt="SnapSite" className="h-16 w-auto" />
						<span className="text-primary/90 tracking-wide font-semibold">
							SnapSite
						</span>
					</div>

					<div className="flex-1 flex items-center">
						<div className="max-w-xl space-y-6">
							<h1 className="text-5xl font-bold leading-tight text-white drop-shadow">
								All your <span className="text-accent">Web Solutions</span><br />
								in One Place.
							</h1>
							<p className="text-primary/90 text-lg">
								Sign in to manage your websites, track your orders,
								and access professional web solutions with ease.
							</p>
							<div className="h-1 w-28 bg-accent rounded-full" />
						</div>
					</div>

					<p className="text-primary/80 text-sm">
						© {new Date().getFullYear()} SnapSite – Professional Website Solutions. All rights reserved.
					</p>
				</div>

				{/* Right side form */}
				<div className="flex items-center justify-center p-6 sm:p-10">
					<div className="w-full max-w-md">
						<div className="rounded-3xl backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl p-8 sm:p-10">
							<div className="mb-8 flex flex-col items-center text-center">
								<img src="/logo.png" alt="SnapSite Logo" className="w-[150px] h-[100px] mb-4" />
								<h2 className="text-2xl font-semibold text-white">
									Welcome back to SnapSite
								</h2>
								<p className="text-primary/90 text-sm">
									Log in to access your account and manage your website services.
								</p>
							</div>

							<div className="space-y-5">
								<div>
									<label className="text-sm font-medium text-primary/90">
										Email address
									</label>
									<input
										type="email"
										onChange={(e) => setEmail(e.target.value)}
										className="w-full h-11 rounded-xl bg-white/90 px-4"
									/>
								</div>

								<div>
									<label className="text-sm font-medium text-primary/90">
										Password
									</label>
									<input
										type="password"
										onChange={(e) => setPassword(e.target.value)}
										className="w-full h-11 rounded-xl bg-white/90 px-4"
									/>
								</div>

								<div className="flex justify-end text-sm">
									<Link to="/forget-password" className="text-accent hover:underline">
										Forgot password?
									</Link>
								</div>

								<button
									onClick={login}
									className="w-full h-11 rounded-xl bg-accent text-white font-semibold"
								>
									Log In
								</button>

								<button
									onClick={googleLogin}
									className="w-full h-11 rounded-xl bg-accent text-white font-semibold"
								>
									Continue with Google
								</button>
							</div>

							<div className="mt-6 text-center text-sm text-primary/90">
								New to SnapSite?{" "}
								<Link to="/register" className="text-accent hover:underline">
									Create an account
								</Link>
							</div>
						</div>

						<p className="mt-6 text-center text-primary/80 text-xs lg:hidden">
							© {new Date().getFullYear()} SnapSite – Professional Website Solutions
						</p>
					</div>
				</div>

			</div>
		</div>
	);
}
