import axios from "axios";
import { useEffect, useState, useRef } from "react";

export default function UserDataMobile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUser(res.data))
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (!menuOpen) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const initials =
    user?.firstName || user?.lastName
      ? `${(user?.firstName ?? "")[0] ?? ""}${(user?.lastName ?? "")[0] ?? ""}`.toUpperCase()
      : "U";

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setMenuOpen(false);
    window.location.href = "/login";
  };

  return (
    <div className="w-full flex items-center justify-center relative">
      {/* Loading */}
      {loading && (
        <div
          className="h-9 w-9 rounded-full border-2 border-primary border-b-transparent animate-spin"
          role="status"
          aria-label="Loading"
        />
      )}

      {/* Logged-out */}
      {!loading && !user && (
        <a
          href="/login"
          className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
        >
          Login
        </a>
      )}

      {/* Logged-in */}
      {user && (
        <div className="relative flex flex-col items-center gap-2">
          {/* Avatar */}
          {user.image ? (
            <img
              src={user.image}
              alt={`${user.firstName ?? "User"} avatar`}
              className="h-12 w-12 rounded-full ring-2 ring-accent/50 object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-accent text-white ring-2 ring-accent/50 flex items-center justify-center text-lg font-bold">
              {initials}
            </div>
          )}

          {/* Name */}
          <span className="text-sm font-semibold text-secondary">
            {user.firstName ?? user.email ?? "Account"}
          </span>

          {/* Account Button */}
          <button
            ref={btnRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-full shadow hover:brightness-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60"
          >
            Account
            <svg
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
                clipRule="evenodd"
              />
            </svg>
          </button>
            {menuOpen && (
            <div
                ref={menuRef}
                role="menu"
                className="absolute z-50 w-56 rounded-xl bg-white shadow-lg transition-all"
                style={{
                left: "50%",
                transform: "translateX(-50%)",
                top: (() => {
                    const rect = btnRef.current?.getBoundingClientRect();
                    if (!rect) return "100%"; // fallback
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const menuHeight = 200; // approx height
                    if (spaceBelow < menuHeight) {
                    return undefined; // we'll use bottom instead
                    }
                    return rect.bottom + 8; // 8px gap below button
                })(),
                bottom: (() => {
                    const rect = btnRef.current?.getBoundingClientRect();
                    if (!rect) return undefined;
                    const spaceBelow = window.innerHeight - rect.bottom;
                    const menuHeight = 200;
                    if (spaceBelow < menuHeight) {
                    return window.innerHeight - rect.top + 8; // open above
                    }
                    return undefined;
                })(),
                }}
            >
                <div className="px-3 py-2 border-b border-secondary/10">
                <p className="text-sm font-semibold text-secondary">{user.firstName ?? "User"}</p>
                {user.role && <p className="text-xs text-secondary/70">{user.role}</p>}
                </div>

                {user.role === "admin" && window.location.pathname.includes("/admin") && (
                <>
                    <div className="my-1 h-px bg-secondary/10" />
                    <MenuItem onClick={() => (window.location.href = "/")} label="Go to Home" />
                </>
                )}

                <MenuItem onClick={() => (window.location.href = "/settings")} label="Account Settings" />
                <MenuItem onClick={() => (window.location.href = "/cart")} label="Cart" />

                {user.role === "admin" && (
                <>
                    <div className="my-1 h-px bg-secondary/10" />
                    <MenuItem onClick={() => (window.location.href = "/admin")} label="Admin Panel" />
                </>
                )}

                <div className="my-1 h-px bg-secondary/10" />
                <MenuItem destructive onClick={handleLogout} label="Logout" />
            </div>
            )}

        </div>
      )}
    </div>
  );
}

function MenuItem({ label, onClick, destructive = false }) {
  return (
    <button
      data-menu-item
      onClick={onClick}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/40 ${
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-secondary hover:bg-primary/80"
      }`}
    >
      {label}
    </button>
  );
}
