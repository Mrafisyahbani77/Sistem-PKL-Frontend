import { useState, useEffect } from "react";
import Api from "../../Api";
import Cookies from "js-cookie";
import Layout from "../../components/Layout";
import Forbidden from "../../routes/Forbidden";
import { Link } from "react-router-dom";

//icon
import { MdScheduleSend } from "react-icons/md";
import { FaUser, FaUserGraduate, FaUserTie } from "react-icons/fa";

const AdminDashboard = () => {
  document.title = "AdminDashboard";

  const [countUsers, setCountUsers] = useState(0);
  const [countSiswa, setCountSiswa] = useState(0);
  const [countKaprog, setCountKaprog] = useState(0);
  const [countAdmin, setCountAdmin] = useState(0);
  const [countPembimbing, setCountPembimbing] = useState(0);
  const [countPendingApplications, setCountPendingApplications] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nameData, setLoadName] = useState("");
  const [role, setRole] = useState("");
  const [isAdmin, setIsAdmin] = useState(false); // Default false

  useEffect(() => {
    const role = Cookies.get("role");
    try {
      const parsedRole = JSON.parse(role);
      setIsAdmin(parsedRole.includes("admin"));
    } catch (e) {
      setIsAdmin(role === "admin");
    }
  }, []);

  useEffect(() => {
    loadName();
    loadRole();
  }, []);

  const loadRole = () => {
    const role = Cookies.get("role");
    if (role) {
      try {
        setRole(JSON.parse(role));
      } catch (e) {
        setRole({ role });
      }
    }
  };

  const loadName = () => {
    const nameData = Cookies.get("user");
    if (nameData) {
      try {
        setLoadName(JSON.parse(nameData));
      } catch (e) {
        setLoadName(nameData);
      }
    }
  };

  const token = Cookies.get("token");

  const fetchData = async () => {
    try {
      const response = await Api.get("/api/admin/dashboard/count-data", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setCountUsers(response.data.countUsers);
      setCountSiswa(response.data.countSiswa);
      setCountKaprog(response.data.countKaprog);
      setCountPembimbing(response.data.countPembimbing);
      setCountAdmin(response.data.countAdmin);
    } catch (error) {
      console.error("Error fetching data:", error.message);
      setError("Error fetching data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingApplicationsCount = async () => {
    try {
      const response = await Api.get(
        "/api/admin/dashboard/count-pending-applications"
      );
      setCountPendingApplications(response.data.countPendingApplications);
    } catch (error) {
      console.error(
        "Error fetching pending applications count:",
        error.message
      );
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
      fetchPendingApplicationsCount();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div>
        <Forbidden />
        {/* <div>
          <Link to="/DashboardUser">
            <button className="btn bg-yellow-500 items-center text-[20px] mt-5">
              Kembali Ke Halaman Utama
            </button>
          </Link>
        </div> */}
      </div>
    );
  }

  return (
    <div>
      <Layout>
        <div className="flex flex-col flex-1 p-8 transition-all">
          <p className="lg:text-sm md:text-xl font-bold mb-4">
            Selamat Datang Di Dashboard {role.role}, Hallo {nameData.name}
          </p>
          <div className="grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4 mb-12 mt-12">
            {[
              { name: "Users", icon: <FaUser />, color: "bg-primary" },
              {
                name: "Siswa",
                icon: <FaUserGraduate />,
                color: "bg-secondary",
              },
              { name: "Pembimbing", icon: <FaUserTie />, color: "bg-tertiary" },
              { name: "Kaprog", icon: <FaUserTie />, color: "bg-tertiary" },
              { name: "Admin", icon: <FaUserTie />, color: "bg-tertiary" },
              {
                name: "Pengajuan Pkl",
                icon: <MdScheduleSend />,
                color: "bg-quaternary",
              },
            ].map((category, index) => (
              <div
                key={index}
                className={`card border-0 shadow w-full h-full p-4 ${category.color}`}
              >
                <div className="card-body">
                  {loading ? (
                    <p>Loading...</p>
                  ) : error ? (
                    <p>{error}</p>
                  ) : (
                    <div className="flex items-center">
                      <div className="icon-shape icon-shape-danger rounded me-4 me-sm-0">
                        {category.icon}
                      </div>
                      <div>
                        <h6 className="text-sm">{category.name}</h6>
                        <h5 className="font-extrabold mb-1">
                          {index === 0
                            ? `Jumlah Pengguna: ${countUsers}`
                            : index === 1
                            ? `Jumlah Siswa: ${countSiswa}`
                            : index === 2
                            ? `Jumlah Pembimbing: ${countPembimbing}`
                            : index === 3
                            ? `Jumlah Kaprog: ${countKaprog}`
                            : index === 4
                            ? `Jumlah Admin: ${countAdmin}`
                            : `Jumlah Pengajuan Menunggu: ${countPendingApplications}`}
                        </h5>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Layout>
    </div>
  );
};

export default AdminDashboard;
