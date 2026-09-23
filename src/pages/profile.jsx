import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          if (mounted) setLoading(false);
          return;
        }
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mounted) setUser(res.data || null);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("token");
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  if (loading) return <div className="p-6">Loading profile...</div>;
  if (!user) return <div className="p-6">Not signed in. <a href="/login" className="text-primary">Sign in</a></div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">My Profile</h1>
      <div className="flex items-center gap-4 mb-4">
        <img src={user.image || "/placeholder-avatar.png"} alt="avatar" className="w-20 h-20 rounded-full object-cover border" />
        <div>
          <div className="text-lg font-medium">{user.firstName} {user.lastName}</div>
          <div className="text-sm text-gray-600">{user.email}</div>
        </div>
      </div>

      <div className="space-y-2">
        <div><strong>Phone:</strong> {user.phone || "—"}</div>
        <div><strong>Address:</strong> {user.address || "—"}</div>
      </div>

      <div className="mt-6 flex gap-3">
        <button onClick={() => navigate("/settings")} className="px-4 py-2 bg-accent text-white rounded">Edit Profile</button>
        <button onClick={() => navigate("/OrdersPage")} className="px-4 py-2 bg-accent text-white rounded">Orders</button>
        <button onClick={() => { localStorage.removeItem("token"); window.location.reload(); }} className="px-4 py-2 border rounded">Logout</button>
      </div>
    </div>
  );
}