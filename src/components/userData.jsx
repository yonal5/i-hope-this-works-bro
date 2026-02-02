import axios from "axios";
import { useEffect, useRef, useState } from "react";

export default function UserData() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutMessage, setLogoutMessage] = useState("");
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  /* ================= FETCH USER ================= */
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

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    function close(e) {
      if (
        menuOpen &&
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [menuOpen]);

  /* ================= HELPERS ================= */
  const initials =
    user?.firstName || user?.lastName
      ? `${(user.firstName?.[0] ?? "")}${(user.lastName?.[0] ?? "")}`.toUpperCase()
      : "U";

const logout = () => {
  localStorage.removeItem("token");
  setUser(null);
  setMenuOpen(false);

  setLogoutMessage("You have successfully logged out");

  setTimeout(() => {
    setLogoutMessage("");
    window.location.href = "/login";
  }, 1000); // 1 second
};

  /* ================= RENDER ================= */
  return (
    <div className="relative flex items-center justify-end shrink-0">
      {/* Logout message */}
{logoutMessage && (
  <div className="fixed top-6 right-6 z-[9999] rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg animate-fade-in">
    {logoutMessage}
  </div>
)}

      {loading && (
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-b-transparent" />
      )}

      {/* Logged out */}
      {!loading && !user && (
        <a
          href="/login"
          className="rounded-full bg-accent px-4 py-2 text-sm font-semibold text-white"
        >
          Login
        </a>
      )}

      {/* Logged in */}
      {user && (
        <div className="relative">
          {/* USER BAR */}
          <div
            className="
              flex items-center gap-2 rounded-full bg-primary/80
              px-3 py-1.5 ring-1 ring-secondary/10
              max-[1124px]:px-2
            "
          >
            {/* Avatar */}
            {user.image ? (
              <img
                src={user.image}
                className="h-9 w-9 rounded-full object-cover ring-2 ring-accent/50"
              />
            ) : (
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
                {initials}
              </div>
            )}

            {/* Name + Role (HIDE BELOW 1124px) */}
            <div className="flex flex-col leading-tight max-[1124px]:hidden">
              <span className="text-sm font-semibold text-secondary">
                {user.firstName}
              </span>
              {user.role && (
                <span className="text-[11px] text-secondary/70">
                  {user.role}
                </span>
              )}
            </div>

            {/* Menu button */}
            <button
              ref={btnRef}
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-secondary/10"
            >
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zm0 5.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
              </svg>
            </button>
          </div>

          {/* DROPDOWN */}
          {menuOpen && (
            <div
               ref={menuRef}
                role="menu"
                className="
                  absolute top-12 z-50 w-56 rounded-xl bg-white p-1.5 shadow-lg
                  left-1/2 -translate-x-1/2
                  lg:left-auto lg:translate-x-0 lg:right-0
                "
              >
                <div className="px-3 py-2 border-b border-secondary/10">
                  <p className="text-sm font-semibold text-secondary">
                    {user.firstName ?? "User"} {user.lastName ?? "User"}
                  </p>
                  {user.role && (
                    <p className="text-xs text-secondary/70">{user.role}</p>
                  )}
                </div>

                {/* Home button if admin is in admin panel */}
                {user.role === "admin" && window.location.pathname.includes("/admin") && (
                  <>
                    <div className="my-1 h-px bg-secondary/10" />
                    <MenuItem
                      onClick={() => (window.location.href = "/")}
                      label="Go to Home"
                    />
                  </>
                )}

                <MenuItem
                  onClick={() => (window.location.href = "/settings")}
                  label="Account Settings"
                />
                <MenuItem
                  onClick={() => (window.location.href = "/cart")}
                  label="Cart"
                />

                {user.role === "admin" && (
                  <>
                    <div className="my-1 h-px bg-secondary/10" />
                    <MenuItem
                      onClick={() => (window.location.href = "/admin")}
                      label="Admin Panel"
                    />
                  </>
                )}

                <div className="my-1 h-px bg-secondary/10" />
              <MenuItem label="Logout" onClick={logout} destructive />
                
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ================= MENU ITEM ================= */
function MenuItem({ label, to, onClick, destructive }) {
  return (
    <button
      onClick={onClick || (() => (window.location.href = to))}
      className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
        destructive
          ? "text-red-600 hover:bg-red-50"
          : "text-secondary hover:bg-primary"
      }`}
    >
      {label}
    </button>
  );
}
