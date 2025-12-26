import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import mediaUpload from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import { TtitleBar } from "../components/header";


export default function UserSettings() {
	const [user, setUser] = useState(null);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [image, setImage] = useState(null);
	const [currentPassword, setCurrentPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const navigate = useNavigate();

	const token = localStorage.getItem("token");

	useEffect(() => {
		if (!token) {
			navigate("/login");
			return;
		}

		axios
			.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
				headers: { Authorization: `Bearer ${token}` },
			})
			.then((res) => {
				setUser(res.data);
				setFirstName(res.data.firstName);
				setLastName(res.data.lastName);
			})
			.catch(() => {
				localStorage.removeItem("token");
				navigate("/login");
			});
	}, []);

	const imagePreview = useMemo(() => {
		if (image) return URL.createObjectURL(image);
		return user?.image || "";
	}, [image, user]);

	/* ---------- UPDATE PROFILE ---------- */
	const updateProfile = async () => {
		try {
			let img = user.image;
			if (image) img = await mediaUpload(image);

			await axios.put(
				`${import.meta.env.VITE_API_URL}/api/users/me`,
				{ firstName, lastName, image: img },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			toast.success("Profile updated");
			navigate("/");
		} catch {
			toast.error("Profile update failed");
		}
	};

	/* ---------- UPDATE PASSWORD ---------- */
	const updatePassword = async () => {
		if (newPassword !== confirmPassword) {
			toast.error("Passwords do not match");
			return;
		}

		if (!currentPassword) {
			toast.error("Enter current password");
			return;
		}

		try {
			await axios.put(
				`${import.meta.env.VITE_API_URL}/api/users/me/password`,
				{ currentPassword, newPassword },
				{ headers: { Authorization: `Bearer ${token}` } }
			);

			toast.success("Password updated");
			setCurrentPassword("");
			setNewPassword("");
			setConfirmPassword("");
			navigate("/");
		} catch (err) {
			toast.error(err.response?.data?.message || "Failed");
		}
	};

	if (!user) return <div className="mt-20 text-center">Loading...</div>;

	return (<div>
		<Header/>
			  <TtitleBar />

  <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary/80 flex items-center justify-center px-4 py-12">
	
    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

      {/* ================= PROFILE CARD ================= */}
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-secondary mb-6">
          Profile Settings
        </h2>

        {/* Avatar */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-4 ring-accent/40">
            {imagePreview ? (
              <img
                src={imagePreview}
                className="w-full h-full object-cover"
                alt="Profile"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary/10 text-secondary/50">
                No Image
              </div>
            )}
          </div>

          <label className="cursor-pointer px-5 py-2 rounded-xl bg-accent text-white font-medium hover:opacity-90 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        </div>

        {/* Names */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-secondary/70">
              First Name
            </label>
            <input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-secondary/10 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-secondary/70">
              Last Name
            </label>
            <input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-secondary/10 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>
        </div>

        <button
          onClick={updateProfile}
          className="mt-8 w-full bg-accent text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg"
        >
          Save Profile
        </button>
      </div>

      {/* ================= SECURITY CARD ================= */}
      <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8 border border-white/20">
        <h2 className="text-2xl font-bold text-secondary mb-6">
          Security
        </h2>

        <div className="space-y-5">
          <div>
            <label className="text-sm font-medium text-secondary/70">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-secondary/10 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-secondary/70">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-secondary/10 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          <div>
            <label className="text-sm font-medium text-secondary/70">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 px-4 py-3 rounded-xl bg-white border border-secondary/10 focus:ring-2 focus:ring-accent outline-none"
            />
          </div>

          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-sm text-red-600">
              Passwords do not match
            </p>
          )}

          <button
            onClick={updatePassword}
            disabled={!newPassword || !confirmPassword}
            className="mt-6 w-full bg-secondary text-white py-3 rounded-xl font-semibold hover:opacity-90 transition shadow-lg disabled:opacity-50"
          >
            Update Password
          </button>
        </div>
      </div>

    </div>
  </div>
  </div>
)}
