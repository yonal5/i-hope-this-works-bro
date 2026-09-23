import { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";

const BASE_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);
  const [cards, setCards] = useState({ users: 0, chats: 0 });
  const [error, setError] = useState("");

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Unauthorized. Please login again.");
        return;
      }

      const res = await axios.get(`${BASE_URL}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const users = res.data?.users ?? 0;
      const chats = res.data?.chats ?? 0;

      setCards({ users, chats });

      setStats([
        { name: "Users", value: users },
        { name: "Chats", value: chats },
      ]);

      setError("");
    } catch (err) {
      console.error("Admin stats error:", err);
      setError("Failed to load admin statistics.");
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <main className="flex-1 p-8">

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
            {error}
          </div>
        )}

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">
            <h3 className="text-accent text-lg font-semibold">Users</h3>
            <h1 className="text-3xl font-bold mt-2">{cards.users}</h1>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">
            <h3 className="text-accent text-lg font-semibold">Chats</h3>
            <h1 className="text-3xl font-bold mt-2">{cards.chats}</h1>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">
            <h4 className="text-accent font-semibold mb-4">Activity</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-accent">
            <h4 className="text-accent font-semibold mb-4">Growth</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </main>
    </div>
  );
}
