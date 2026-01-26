import axios from "axios";
import { useState, useEffect, useMemo } from "react";
import mediaUpload from "../utils/mediaUpload";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";

const API = import.meta.env.VITE_API_URL;

export default function UserSettings() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [image, setImage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  /* =========================
     AUTH + LOAD USER
  ========================= */
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get(`${API}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const u = res.data;

        setUser(u);
        setFirstName(u.firstName || "");
        setLastName(u.lastName || "");
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
      });
  }, [token, navigate]);

  /* =========================
     IMAGE PREVIEW
  ========================= */
  const imagePreview = useMemo(() => {
    if (image) return URL.createObjectURL(image);
    return user?.image || "";
  }, [image, user]);

  /* =========================
     UPDATE PROFILE
  ========================= */
  const updateProfile = async () => {
    try {
      let img = user.image;
      if (image) img = await mediaUpload(image);

      const res = await axios.put(
        `${API}/api/users/me`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          image: img,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ updated user from backend
      const updatedUser = {
        ...res.data,
        name: `${res.data.firstName} ${res.data.lastName}`,
      };

      // ✅ update local state
      setUser(updatedUser);

      // ✅ update localStorage (VERY IMPORTANT)
      localStorage.setItem("user", JSON.stringify(updatedUser));

      toast.success("Profile updated successfully");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error("Profile update failed");
    }
  };

  /* =========================
     UPDATE PASSWORD
  ========================= */
  const updatePassword = async () => {
    if (!currentPassword) {
      toast.error("Enter current password");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      await axios.put(
        `${API}/api/users/me/password`,
        { currentPassword, newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Password update failed");
    }
  };

  if (!user) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <>
      <Header />

      <div className="min-h-screen bg-gradient-to-br from-primary via-primary/90 to-secondary/80 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* ================= PROFILE ================= */}
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>

            <div className="flex items-center gap-6 mb-6">
              <div className="w-24 h-24 rounded-full overflow-hidden">
                {imagePreview ? (
                  <img src={imagePreview} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    No Image
                  </div>
                )}
              </div>

              <label className="cursor-pointer bg-accent text-white px-5 py-2 rounded-xl">
                Change Photo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => setImage(e.target.files[0])}
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="First name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="px-4 py-3 rounded-xl border"
              />
              <input
                placeholder="Last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="px-4 py-3 rounded-xl border"
              />
            </div>

            <button
              onClick={updateProfile}
              className="mt-8 w-full bg-accent text-white py-3 rounded-xl font-semibold"
            >
              Save Profile
            </button>
          </div>

          {/* ================= SECURITY ================= */}
          <div className="backdrop-blur-xl bg-white/70 rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Security</h2>

            <input
              type="password"
              placeholder="Current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />

            <input
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full mb-4 px-4 py-3 rounded-xl border"
            />

            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mb-6 px-4 py-3 rounded-xl border"
            />

            <button
              onClick={updatePassword}
              className="w-full bg-secondary text-white py-3 rounded-xl font-semibold"
            >
              Update Password
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
