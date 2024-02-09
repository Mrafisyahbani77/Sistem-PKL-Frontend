import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../../Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Wakahubin = () => {
  document.title = "KaprogDashboard";

  const navigate = useNavigate();
  const user = JSON.parse(Cookies.get("user"));
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  const logout = async (e) => {
    e.preventDefault();

    try {
      await Api.post("/api/logout");

      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("permissions");

      toast.success("Logout Successfully!", {
        position: "top-right",
        duration: 4000,
      });

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Handle error or show an error toast
    }
  };

  return (
    <nav className="bg-gray-800 text-white p-4 w-full h-16">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Your brand/logo goes here if needed */}
        </div>
        <ul className="flex items-center">
          <li className="ml-3 relative">
            <button
              className="flex items-center cursor-pointer focus:outline-none  w-full pr-10"
              onClick={() => setDropdownOpen(!isDropdownOpen)}
            >
              <img
                className="h-8 w-8 rounded-full"
                alt={`Profile picture of ${user.name}`}
                src={`https://ui-avatars.com/api/?name=${user.name}&background=31316a&color=ffffff&size=100`}
              />
              <span className="ml-2">{user.name}</span>
            </button>
            {isDropdownOpen && (
              <div className="right-0 mt-2 bg-white border rounded shadow-md md:w-30 flex">
                <Link
                  to="#"
                  onClick={logout}
                  className="block px-4 py-2 text-gray-800 hover:text-red-700"
                >
                  <svg
                    className="w-5 h-5 text-danger inline-block mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </Link>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Wakahubin;
