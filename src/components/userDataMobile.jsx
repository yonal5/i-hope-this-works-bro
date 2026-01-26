import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { Loader } from "./loader";

export default function UserDataMobile(){
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

    // dropdown state
    const [menuOpen, setMenuOpen] = useState(false);
    const [menuPos, setMenuPos] = useState({ top: null, bottom: null, left: 0, width: 160, openAbove: false });
    const triggerRef = useRef(null);
    const menuRef = useRef(null);

    // fetch current user
    useEffect(() => {
        let mounted = true;
        async function loadUser() {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    if (mounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (mounted) {
                    setUser(res.data || null);
                }
            } catch (err) {
                console.error("Failed to load user:", err);
                localStorage.removeItem("token");
                if (mounted) setUser(null);
            } finally {
                if (mounted) setLoading(false);
            }
        }
        loadUser();
        return () => { mounted = false; };
    }, []);

    // close menu on outside click
    useEffect(() => {
        function onDocDown(e) {
            if (!menuOpen) return;
            if (triggerRef.current && triggerRef.current.contains(e.target)) return;
            if (menuRef.current && menuRef.current.contains(e.target)) return;
            setMenuOpen(false);
        }
        document.addEventListener("pointerdown", onDocDown);
        return () => document.removeEventListener("pointerdown", onDocDown);
    }, [menuOpen]);

    const openMenu = () => {
        if (!triggerRef.current) {
            setMenuOpen(true);
            return;
        }
        const rect = triggerRef.current.getBoundingClientRect();
        const width = Math.max(160, rect.width);

        // decide open above or below; use small gap (2px) so it looks flush
        const estimatedMenuHeight = 160;
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;

        const openAbove = spaceBelow < estimatedMenuHeight && spaceAbove >= estimatedMenuHeight;

        let top = null;
        let bottom = null;

        if (openAbove) {
            bottom = Math.max(8, window.innerHeight - rect.top + 2);
        } else {
            top = Math.max(8, rect.bottom + 2);
        }

        let left = Math.max(8, rect.left);
        const maxLeft = Math.max(8, window.innerWidth - width - 8);
        if (left > maxLeft) left = maxLeft;

        setMenuPos({ top, bottom, left, width, openAbove });
        setMenuOpen(true);
    };

    const onSelect = (val) => {
        setMenuOpen(false);
        if (val === "logout") {
            setIsLogoutConfirmOpen(true);
        } else if (val === "settings") {
            window.location.href = "/settings";
        } else if (val === "orders") {
            window.location.href = "/orders";
        }
    };

    return (
        <div className="flex justify-center items-center relative">
            {isLogoutConfirmOpen && (
                <div className="fixed z-[120] w-full h-screen top-0 left-0 bg-black/30">
                    <div className="w-[300px] h-[150px] bg-primary rounded-lg p-4 flex flex-col justify-between items-center absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                        <span className="text-lg">Are you sure you want to logout?</span>
                        <div className="w-full flex justify-around">
                            <button
                                className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary transition"
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    window.location.href = "/login";
                                }}
                            >
                                Yes
                            </button>
                            <button
                                className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary transition"
                                onClick={() => {
                                    setIsLogoutConfirmOpen(false);
                                }}
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {loading && <div className="w-[30px] h-[30px] border-[3px] border-white border-b-transparent rounded-full animate-spin"></div>}

            {!loading && user && (
                <div className="h-full w-full flex justify-center items-center gap-2">
                    <img
                        src={user.image || "/placeholder-avatar.png"}
                        alt={user.firstName || "User"}
                        className="w-[40px] h-[40px] rounded-full border-[2px] border-primary object-cover"
                    />
                    <span className="ml-2">{user.firstName || user.email || "Account"}</span>

                    <button
                        ref={triggerRef}
                        onClick={() => (menuOpen ? setMenuOpen(false) : openMenu())}
                        className="ml-2 bg-accent text-white px-3 py-1 rounded flex items-center gap-2"
                        aria-haspopup="true"
                        aria-expanded={menuOpen}
                        type="button"
                    >
                        Account
                        <svg className="w-3 h-3" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                        </svg>
                    </button>

                    {menuOpen && (
                    <ul
                       ref={menuRef}
                       className="fixed z-[2000] bg-accent text-white rounded shadow-md"
                       style={{
                         left: `${menuPos.left}px`,
                         minWidth: `${menuPos.width}px`,
                         ...(menuPos.openAbove
                           ? { bottom: `${menuPos.bottom}px` }
                           : { top: `${menuPos.top}px` }),
                       }}
                     >
                       <li>
                         <button
                           className="w-full text-left px-4 py-2 hover:bg-primary/80"
                           onClick={() => onSelect("settings")}
                         >
                           Account Settings
                         </button>
                       </li>
                     
                       {/* 🔐 ADMIN ONLY */}
                       {user.role === "admin" && (
                         <li>
                           <button
                             className="w-full text-left px-4 py-2 hover:bg-primary/80"
                             onClick={() => onSelect("admin")}
                           >
                             Admin Panel
                           </button>
                         </li>
                       )}
                     
                       <li>
                         <button
                           className="w-full text-left px-4 py-2 hover:bg-primary/80"
                           onClick={() => onSelect("logout")}
                         >
                           Logout
                         </button>
                       </li>
                     </ul>                     
                    )}
                </div>
            )}

            {!loading && !user && (
                <a href="/login" className="bg-accent text-white px-4 py-2 rounded hover:bg-secondary transition">
                    Login
                </a>
            )}
        </div>
    );
}
