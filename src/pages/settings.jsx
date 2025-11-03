import axios from "axios";
import { useState, useMemo, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient"; // ✅ Import Supabase client

export default function UserSettings() {
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [image, setImage] = useState(null);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [user, setUser] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem("token");
		if (!token) {
			window.location.href = "/login";
			return;
		}

		axios
			.get(import.meta.env.VITE_API_URL + "/api/users/me", {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setFirstName(res.data.firstName);
				setLastName(res.data.lastName);
				setUser(res.data);
			})
			.catch(() => {
				localStorage.removeItem("token");
				window.location.href = "/login";
			});
	}, []);

	// ✅ Upload image to Supabase
	async function uploadToSupabase(file) {
		if (!file) return null;
		const fileExt = file.name.split(".").pop();
		const fileName = `${Date.now()}_${Math.random()
			.toString(36)
			.substring(2)}.${fileExt}`;
		const filePath = `avatars/${fileName}`;

		const { data, error } = await supabase.storage
			.from("avatars") // ✅ Bucket name (make sure this exists)
			.upload(filePath, file, { upsert: false });

		if (error) {
			console.error("Supabase upload error:", error);
			toast.error("Image upload failed!");
			return null;
		}

		const { data: publicUrlData } = supabase.storage
			.from("avatars")
			.getPublicUrl(filePath);

		return publicUrlData?.publicUrl || null;
	}

	// ✅ Update profile info
	async function updateUserData() {
		try {
			const token = localStorage.getItem("token");
			if (!token) return navigate("/login");

			let imageUrl = user?.image || null;
			if (image) {
				imageUrl = await uploadToSupabase(image);
				if (!imageUrl) {
					toast.error("Image upload failed");
					return;
				}
			}

			const updatedData = {
				firstName,
				lastName,
				image: imageUrl,
			};

			await axios.put(import.meta.env.VITE_API_URL + "/api/users/me", updatedData, {
				headers: { Authorization: `Bearer ${token}` },
			});

			toast.success("Profile updated successfully!");
			navigate("/");
		} catch (err) {
			console.error("Profile update error:", err);
			toast.error("Failed to update profile");
		}
	}

	// ✅ Update password
	async function updatePassword() {
		if (password !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}
		try {
			await axios.put(
				import.meta.env.VITE_API_URL + "/api/users/me/password",
				{ password },
				{
					headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
				}
			);
			toast.success("Password updated successfully");
			setPassword("");
			setConfirmPassword("");
			navigate("/");
		} catch (err) {
			console.error("Password update error:", err);
			toast.error("Failed to update password");
		}
	}

	const imagePreview = useMemo(
		() => (image ? URL.createObjectURL(image) : user?.image || ""),
		[image, user]
	);
	const pwdMismatch = password && confirmPassword && password !== confirmPassword;

	return (
		<div className="w-full h-full bg-[url('/bg.jpg')] bg-cover bg-center bg-no-repeat flex flex-col lg:flex-row justify-center">
			{/* Left: User Info */}
			<div className="w-full lg:w-[40%] backdrop-blur-2xl rounded-2xl m-8 p-6 flex flex-col bg-primary/70 shadow-xl ring-1 ring-secondary/10">
				<h1 className="text-2xl font-bold mb-6 text-center text-secondary">
					User Settings
				</h1>

				{/* Avatar */}
				<div className="flex items-center gap-4 mb-6">
					<div className="w-20 h-20 rounded-full overflow-hidden ring-2 ring-accent/60 shrink-0">
						{imagePreview ? (
							<img
								src={imagePreview}
								alt="Profile"
								className="w-full h-full object-cover"
							/>
						) : (
							<div className="w-full h-full grid place-items-center bg-secondary/10 text-secondary/60 text-sm">
								No Photo
							</div>
						)}
					</div>

					<label className="inline-flex items-center gap-3 px-4 py-2 rounded-xl cursor-pointer bg-white/70 hover:bg-white transition border border-secondary/10">
						<span className="text-sm font-medium text-secondary">
							Upload Photo
						</span>
						<input
							type="file"
							accept="image/*"
							className="hidden"
							onChange={(e) => {
								const f = e.target.files?.[0] || null;
								setImage(f);
							}}
						/>
					</label>
				</div>

				{/* Name Inputs */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1">First Name</label>
						<input
							value={firstName}
							onChange={(e) => setFirstName(e.target.value)}
							placeholder="Jane"
							className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
						/>
					</div>
					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1">Last Name</label>
						<input
							value={lastName}
							onChange={(e) => setLastName(e.target.value)}
							placeholder="Doe"
							className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
						/>
					</div>
				</div>

				<div className="mt-6">
					<button
						onClick={updateUserData}
						className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow"
					>
						Save Profile
					</button>
				</div>
			</div>

			{/* Right: Password */}
			<div className="w-full lg:w-[40%] backdrop-blur-2xl rounded-2xl m-8 p-6 flex flex-col bg-primary/70 shadow-xl ring-1 ring-secondary/10">
				<h2 className="text-2xl font-bold mb-6 text-center text-secondary">
					Change Password
				</h2>

				<div className="flex flex-col gap-4">
					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1">
							New Password
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							placeholder="••••••••"
							className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
						/>
					</div>

					<div className="flex flex-col">
						<label className="text-sm text-secondary/80 mb-1">
							Confirm New Password
						</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							placeholder="••••••••"
							className="px-3 py-2 rounded-xl bg-white/80 border border-secondary/10 outline-none focus:ring-2 focus:ring-accent/50"
						/>
					</div>

					{pwdMismatch && (
						<p className="text-sm text-red-600">Passwords do not match.</p>
					)}
				</div>

				<div className="mt-6">
					<button
						onClick={updatePassword}
						disabled={!password || !confirmPassword || pwdMismatch}
						className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-accent text-white font-semibold hover:opacity-90 active:opacity-80 transition shadow disabled:opacity-50 disabled:cursor-not-allowed"
					>
						Update Password
					</button>
				</div>
			</div>
		</div>
	);
}
