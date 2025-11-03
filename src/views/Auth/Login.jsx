import { useState, useEffect } from "react";
import Api from "../../Api";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { faEnvelope, faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Eye } from "lucide-react";
import { EyeOff } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import pengajuanpkl from "../../assets/images/pkl.png";

export default function Login() {
  document.title = "Login - Sistem Pengajuan Pkl";

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
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
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <Toaster />
      <div className="w-full max-w-6xl">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid lg:grid-cols-2 gap-0">
            {/* Left Side - Form */}
            <div className="order-2 lg:order-1 p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <div className="max-w-md w-full mx-auto">
                <div className="mb-8">
                  <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent mb-3">
                    Selamat Datang
                  </h1>
                  <p className="text-gray-600 text-sm sm:text-base">
                    Silakan login untuk melanjutkan ke Sistem Pengajuan PKL
                  </p>
                </div>

                <form onSubmit={login} className="space-y-6">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FontAwesomeIcon
                        icon={faEnvelope}
                        className="mr-2 text-blue-500"
                      />
                      Email
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        name="email"
                        type="text"
                        autoComplete="email"
                        placeholder="Masukkan email Anda"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      <FontAwesomeIcon
                        icon={faLock}
                        className="mr-2 text-blue-500"
                      />
                      Password
                    </label>
                    <div className="relative">
                      <input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Masukkan password Anda"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="block w-full px-4 py-3.5 rounded-xl border-2 border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base pr-12"
                      />
                      <button
                        type="button"
                        onClick={handleTogglePassword}
                        className="absolute inset-y-0 right-0 px-4 flex items-center focus:outline-none hover:text-blue-500 transition-colors"
                      >
                        {showPassword ? (
                          <Eye className="w-5 h-5 text-gray-500" />
                        ) : (
                          <EyeOff className="w-5 h-5 text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl shadow-lg text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 ${
                        buttonLoading ? "cursor-not-allowed opacity-50" : ""
                      }`}
                      disabled={loading || buttonLoading}
                    >
                      {loading ? "Loading...." : "Login"}
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* Right Side - Image */}
            <div className="order-1 lg:order-2 bg-gradient-to-br from-blue-400 to-indigo-600 p-8 sm:p-12 lg:p-16 flex items-center justify-center">
              <div className="text-center">
                <div className="mb-6 flex justify-center">
                    <img
                      src={pengajuanpkl}
                      className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 object-contain mx-auto drop-shadow-2xl"
                      alt="Icon Pengajuan PKL"
                    />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
                  Sistem Pengajuan PKL
                </h2>
                <p className="text-blue-100 text-sm sm:text-base max-w-md mx-auto">
                  Platform digital untuk memudahkan proses pengajuan dan
                  pengelolaan Praktik Kerja Lapangan
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
