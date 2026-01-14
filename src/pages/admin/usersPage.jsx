import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Loader } from "../../components/loader";
import { MdOutlineAdminPanelSettings, MdVerified } from "react-icons/md";

// ---------------- BLOCK CONFIRM MODAL ----------------
function UserBlockConfirm({ user, close, refresh }) {
  const toggleBlock = () => {
    const token = localStorage.getItem("token");
    axios
      .put(
        `${import.meta.env.VITE_API_URL}/api/users/block/${user.email}`,
        { isBlock: !user.isBlock },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("User status updated");
        close();
        refresh();
      })
      .catch(() => toast.error("Failed to update user"));
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
      <div className="bg-primary rounded-2xl p-6 w-[500px] flex flex-col items-center gap-6 relative">
        <button
          onClick={close}
          className="absolute -top-5 -right-5 w-10 h-10 bg-red-600 text-white rounded-full font-bold hover:bg-white hover:text-red-600 transition"
        >
          X
        </button>

        <p className="text-lg font-semibold text-center">
          Are you sure you want to{" "}
          <span className="font-bold">
            {user.isBlock ? "unblock" : "block"}
          </span>{" "}
          this user?
          <br />
          <span className="font-mono text-sm">{user.email}</span>
        </p>

        <div className="flex gap-6">
          <button
            onClick={close}
            className="px-6 py-2 rounded-full bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            onClick={toggleBlock}
            className="px-6 py-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
          >
            Yes, Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------- MAIN ADMIN USERS PAGE ----------------
export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) return;

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login first");
      navigate("/login");
      return;
    }

    axios
      .get(`${import.meta.env.VITE_API_URL}/api/users/all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data))
      .finally(() => setIsLoading(false));
  }, [isLoading]);

  return (
    <div className="w-full min-h-full relative">
      {showConfirm && (
        <UserBlockConfirm
          user={selectedUser}
          close={() => setShowConfirm(false)}
          refresh={() => setIsLoading(true)}
        />
      )}

      <div className="mx-auto max-w-7xl p-6">
        <div className="bg-primary border border-secondary/10 shadow-sm rounded-2xl">
          {/* Header */}
          <div className="flex justify-between items-center px-6 py-4 border-b border-secondary/10">
            <h1 className="text-lg font-semibold text-secondary">Users</h1>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
              {users.length} users
            </span>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {isLoading ? (
              <Loader />
            ) : (
              <table className="w-full min-w-[880px] text-left">
                <thead className="bg-secondary text-white">
                  <tr>
                    {[
                      "Image",
                      "Email",
                      "First Name",
                      "Last Name",
                      "Role",
                      "Status",
                      "Actions",
                    ].map((h) => (
                      <th
                        key={h}
                        className="sticky top-0 z-10 px-4 py-3 text-xs font-semibold uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody className="divide-y divide-secondary/10">
                  {users.length ? (
                    users.map((user) => (
                      <tr
                        key={user.email}
                        className="odd:bg-white even:bg-primary hover:bg-accent/5 transition-colors"
                      >
                        {/* Image */}
                        <td className="px-4 py-3">
                          <img
                            src={user.image || "https://via.placeholder.com/64"}
                            alt={user.firstName}
                            referrerPolicy="no-referrer"
                            className={`h-16 w-16 rounded-full object-cover ring-2 ${
                              user.isBlock
                                ? "ring-red-500"
                                : "ring-green-500"
                            }`}
                          />
                        </td>

                        {/* Email */}
                        <td className="px-4 py-3 font-mono text-sm flex items-center gap-2">
                          {user.email}
                          {user.isEmailVerified && (
                            <MdVerified className="text-blue-500" />
                          )}
                        </td>

                        <td className="px-4 py-3 font-medium">
                          {user.firstName}
                        </td>

                        <td className="px-4 py-3">
                          {user.lastName}
                        </td>

                        {/* Role */}
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 rounded-full bg-secondary/5 px-3 py-1 text-sm">
                            {user.role === "admin" && (
                              <MdOutlineAdminPanelSettings />
                            )}
                            {user.role}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                              user.isBlock
                                ? "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {user.isBlock ? "Blocked" : "Active"}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-4 py-3">
                          <div className="flex justify-center">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowConfirm(true);
                              }}
                              className={`px-5 py-1 rounded-full text-white transition ${
                                user.isBlock
                                  ? "bg-green-600 hover:bg-green-700"
                                  : "bg-red-600 hover:bg-red-700"
                              }`}
                            >
                              {user.isBlock ? "Unblock" : "Block"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={7}
                        className="px-4 py-12 text-center text-secondary/60"
                      >
                        No users available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
