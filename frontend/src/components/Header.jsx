import { useNavigate, Link, useLocation } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const logout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const names = name.split(" ");
    return names.length > 1
      ? names[0][0] + names[1][0]
      : names[0][0];
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="bg-white border-b px-8 py-4 flex justify-between items-center">

      {/* Left Section */}
      <div>
        <h1 className="text-xl font-semibold text-gray-800">
          Intelligent Data Hub
        </h1>
        <p className="text-sm text-gray-500">
          Public Data Analytics Overview
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-6">

        {/* Navigation Links */}
        <Link
          to="/dashboard"
          className={`font-medium ${
            location.pathname === "/dashboard"
              ? "text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          Dashboard
        </Link>

        <Link
          to="/chatbot"
          className={`font-medium ${
            location.pathname === "/chatbot"
              ? "text-blue-600"
              : "text-gray-600 hover:text-blue-600"
          }`}
        >
          AI Chatbot
        </Link>

        {/* Avatar Dropdown */}
        <div className="relative" ref={menuRef}>
          <div
            onClick={() => setOpen(!open)}
            className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-full cursor-pointer hover:bg-blue-700 transition font-semibold"
          >
            {getInitials(user?.name)}
          </div>

          {open && (
            <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-lg border py-3">

              <div className="px-4 pb-3 border-b">
                <p className="font-semibold text-gray-800">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500">
                  {user?.email}
                </p>
              </div>

              <div className="mt-2 text-sm">

                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Profile
                </div>

                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                  Settings
                </div>

                <div className="border-t my-2"></div>

                <div
                  onClick={logout}
                  className="px-4 py-2 hover:bg-red-50 text-red-600 cursor-pointer"
                >
                  Logout
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}