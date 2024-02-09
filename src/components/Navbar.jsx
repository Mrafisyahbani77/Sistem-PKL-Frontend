import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Api from "../Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Navbar = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await Api.post("/api/logout");

      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("permissions");
      localStorage.removeItem("token");

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
    <nav className="bg-gray-300 text-white p-4 w-full h-16">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          {/* Your brand/logo goes here if needed */}
        </div>
        <ul className="flex items-center">
          <li className="ml-3 relative">
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
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
