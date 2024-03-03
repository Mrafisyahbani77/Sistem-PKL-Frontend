import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../Api";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Navpem = () => {
  const navigate = useNavigate();
  const [loading, setLoading]= useState(false);

  const logout = async () => {
    setLoading(true);
    try {
      await Api.post("/api/logout");

      Cookies.remove("user");
      Cookies.remove("token");
      Cookies.remove("permissions");
      Cookies.remove("role");
      localStorage.removeItem("token");

      toast.success("Logout Berhasil!", {
        position: "top-right",
        duration: 4000,
      });

      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      // Handle error or show an error toast
    }finally{
      setLoading(false);
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
          <button
              onClick={logout}
              className={`block bg-red-500 rounded px-4 py-2 text-white hover:bg-red-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Logging Out...' : 'Log Out'}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navpem;
