import { useState, useEffect } from "react";
import Laypem from "../../components/Laypem";
import Api from "../../Api";
import Cookies from "js-cookie";

export default function Pembimbing() {
  document.title = "PembimbingDashboard";

  const [siswaDibimbing, setSiswaDibimbing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [nameData, setLoadName] = useState("");
  const [role, setRole] = useState("")

  useEffect(() => {
    loadName();
    loadRole();
  }, []);

  const loadRole = () => {
    const role = Cookies.get("role");
    if (role){
      try{
        setRole(JSON.parse(role))
      }catch (e) {
        setRole({role})
      }
    }
  }

  const loadName = () => {
    const nameData = Cookies.get("user");
    if (nameData) {
      setLoadName(JSON.parse(nameData));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(
          "http://127.0.0.1:8000/api/pembimbing/dashboard"
        );
        setSiswaDibimbing(response.data.data); // Update untuk menyesuaikan dengan perubahan struktur data dari controller
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompanyClick = (group_id) => {
    setSelectedCompany(
      siswaDibimbing.find((group) => group.group_id === group_id)
    );
  };

  const handleResetClick = () => {
    setSelectedCompany(null);
  };

  return (
    <div>
      <Laypem>
        <div className="flex flex-col flex-1 p-8 transition-all">
          <p className="lg:text-lg md:text-xl sm:text-sm font-bold mb-4">
            Selamat Datang Di Dashboard {role.role}, Hallo {nameData.name}
          </p>
          <h1 className="text-lg font-bold mb-6">
            Daftar Siswa yang Dibimbing
          </h1>
          {loading ? (
            <p className="text-gray-600">Menunggu...</p>
          ) : siswaDibimbing.length === 0 ? (
            <p className="text-gray-600">Belum ada siswa untuk dibimbing</p>
          ) : selectedCompany ? (
            <div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                <p className="text-lg font-semibold mb-2 py-3 px-2 bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg shadow-md">
                  Nama Perusahaan: {selectedCompany.nama_perusahaan}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {selectedCompany.siswa.map((siswa) => (
                  <div
                    key={siswa.user_id}
                    className="bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg shadow-md"
                  >
                    <div className="p-4">
                      <p className="text-lg font-semibold mb-2">
                        Nama Siswa: {siswa.nama}
                      </p>
                      <p className="text-lg font-semibold mb-2">
                        Kelas: {siswa.kelas}
                      </p>
                      <p className="text-lg font-semibold mb-1">
                        NISN: {siswa.nisn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={handleResetClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold mb-5 py-2 px-4 rounded mt-4"
              >
                Kembali
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {siswaDibimbing.map((group) => (
                <div
                  key={group.group_id}
                  className="bg-gradient-to-r from-gray-400 to-gray-300 rounded-lg py-5 shadow-md overflow-hidden text-center"
                >
                  <p className="text-lg font-semibold mb-2">
                    Nama Perusahaan: {group.nama_perusahaan}
                  </p>
                  <button
                    onClick={() => handleCompanyClick(group.group_id)}
                    className="bg-gradient-to-r from-blue-400 to-blue-500 hover:bg-blue-700 text-white shadow-sm font-bold py-2 px-4 rounded mx-auto"
                  >
                    Lihat Siswa
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </Laypem>
    </div>
  );
}
