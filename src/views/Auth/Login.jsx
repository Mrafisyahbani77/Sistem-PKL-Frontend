import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import toast, { Toaster } from "react-hot-toast"; 
import pengajuanpkl from "../../assets/images/pkl.png"

export default function Login() {
  document.title = "Login - Sistem Pengajuan Pkl";

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);

  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  const token = Cookies.get("token");

  useEffect(() => {
    if (token) {
      navigate("/");
    }
  }, [token, navigate]);

  if (token) {
    return null;
  }

  const login = async (e) => {
    e.preventDefault();
    setLoading(true);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordPattern = /^.{8,}$/;

    if (!email.trim() || !password.trim()) {
      toast.error("Email dan password harus diisi dengan lengkap!", {
        position: "top-center",
        duration: 4000,
      });
      setLoading(false);
      return;
    }

    if (!emailPattern.test(email)) {
      toast.error("Email harus valid, dengan format user@example.com", {
        position: "top-center",
        duration: 4000,
      });
      setLoading(false);
      return;
    }

    if (!passwordPattern.test(password)) {
      toast.error("Password harus terdiri dari minimal 8 karakter", {
        position: "top-center",
        duration: 4000,
      });
      setLoading(false);
      return;
    }

    setButtonLoading(true);

    try {
      const response = await Api.post("/api/login", {
        email: email,
        password: password,
      });

      const { token, user, permissions, roles } = response.data;

      if (!roles || roles.length === 0) {
        toast.error("Akun tidak memiliki role yang valid", {
          position: "top-center",
          duration: 4000,
        });
        setLoading(false);
        setButtonLoading(false);
        return;
      }

      Cookies.set("token", token);
      Cookies.set("user", JSON.stringify(user));
      Cookies.set("permissions", JSON.stringify(permissions));
      Cookies.set("role", roles[0]);

      localStorage.setItem("token", token);

      toast.success("Login berhasil!", {
        position: "top-center",
        duration: 4000,
      });

      const userRole = roles[0];

      switch (userRole) {
        case "admin":
          navigate("/AdminDashboard");
          break;
        case "kaprog":
          navigate("/KaprogDashboard");
          break;
        case "pembimbing":
          navigate("/PembimbingDashboard");
          break;
        case "siswa":
          navigate("/SiswaDashboard");
          break;
        default:
          console.error("Role tidak valid:", userRole);
          navigate("/");
      }
    } catch (error) {
      if (error.response) {
        toast.error("Email atau password salah!", {
          position: "top-center",
          duration: 4000,
        });
      } else if (error.request) {
        toast.error("Kesalahan Jaringan", {
          position: "top-center",
          duration: 4000,
        });
      } else {
        toast.error("Server sedang error", {
          position: "top-center",
          duration: 4000,
        });
      }
    } finally {
      setLoading(false);
      setButtonLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
      <Toaster />
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 shadow-xl transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
          <div className="max-w-md mx-auto">
            <form onSubmit={login} className="space-y-6 flex items-center">
              <div className="mr-4">
                <img
                  src={pengajuanpkl}
                  width="200"
                  className="mb-4 mx-auto rounded-full"
                  alt=""
                />
              </div>
              <div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                    Email
                  </label>
                  <div className="mt-1">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full px-4 py-3 rounded-md shadow-sm bg-gray-200 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700"
                  >
                    <FontAwesomeIcon icon={faLock} className="mr-2" />
                    Password
                  </label>
                  <div className="mt-1">
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full px-4 py-3 rounded-md shadow-sm bg-gray-200 focus:outline-none focus:ring focus:border-blue-300 sm:text-sm"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                      checked={rememberMe}
                      onChange={handleRememberMeChange}
                    />
                    <label
                      htmlFor="rememberMe"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Remember me
                    </label>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:bg-indigo-700 focus:outline-none focus:ring focus:border-blue-300 ${
                      buttonLoading ? "cursor-not-allowed opacity-50" : ""
                    }`}
                    disabled={loading || buttonLoading}
                  >
                    {loading ? "Sedang Loginnn..." : "Login"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
