import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar.jsx";
import api from "../Api/index.jsx";

const ControlAbsen = () => {
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [absensiList, setAbsensiList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");

  useEffect(() => {
    // Mengambil token dari local storage
    const access_token = localStorage.getItem("token");
    setToken(access_token);
  }, []);

  useEffect(() => {
    // Mengambil daftar akun siswa dari API
    if (token) {
      api
        .get("/api/admin/absensi", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setSiswaList(response.data))
        .catch((error) => console.error(error));
    }
  }, [token]);

  useEffect(() => {
    // Mengambil daftar absensi dari API saat ada siswa yang dipilih
    if (selectedSiswa && (selectedSiswa.id || selectedSiswa.nama) && token) {
      api
        .get(`/api/admin/absensi/${selectedSiswa.id || selectedSiswa.nama}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          const { absensiList } = response.data;
          const updatedAbsensiList = absensiList.map((item) => ({
            ...item,
            foto: item.foto ? `http://localhost:8000${item.foto}` : null,
          }));
          setAbsensiList(updatedAbsensiList);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedSiswa, token]);

  const handleSiswaClick = (siswa) => {
    setSelectedSiswa(siswa);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Filtering siswaList based on searchTerm for NISN and nama
  const filteredSiswaList = siswaList.filter(
    (siswa) =>
      siswa.nisn.toLowerCase().includes(searchTerm.toLowerCase()) ||
      siswa.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 p-4">
        <h2 className="text-3xl font-bold mb-4">Control Absen</h2>
        {/* Pencarian Akun Siswa */}
        <div className="mb-4">
          <label
            htmlFor="search"
            className="block text-sm font-semibold mb-2"
          >
            Cari Akun Siswa:
          </label>
          <input
            type="text"
            id="search"
            placeholder="Masukkan NISN atau nama siswa..."
            value={searchTerm}
            onChange={handleSearch}
            className="w-full p-2 border rounded"
          />
        </div>
        {/* Tabel Akun Siswa */}
        <table className="min-w-full divide-y divide-gray-200 border rounded overflow-hidden mb-4">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border-b">NISN</th>
              <th className="py-2 px-4 border-b">Nama Siswa</th>
            </tr>
          </thead>
          <tbody>
            {filteredSiswaList.map((siswa) => (
              <tr
                key={siswa.nisn}
                className={`hover:bg-gray-50 cursor-pointer ${
                  selectedSiswa && selectedSiswa.nisn === siswa.nisn
                    ? "bg-gray-200"
                    : ""
                }`}
                onClick={() => handleSiswaClick(siswa)}
              >
                <td className="py-2 px-4 border-b">{siswa.nisn}</td>
                <td className="py-2 px-4 border-b">{siswa.nama}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Detail Absensi */}
        {selectedSiswa && (
          <div>
            <h3 className="text-2xl font-bold mb-2">
              Detail Absensi untuk {selectedSiswa.nama}
            </h3>
            <table className="min-w-full divide-y divide-gray-200 border rounded overflow-hidden">
              <thead className="bg-gray-100">
                <tr>
                  <th className="py-2 px-4 border-b">Lokasi</th>
                  <th className="py-2 px-4 border-b">Foto Absensi</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(absensiList) &&
                  absensiList.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">
                        {item.latitude}, {item.longitude}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {item.foto ? (
                          <img src={item.foto} alt="Foto Absensi" />
                        ) : (
                          <span>Foto tidak tersedia</span>
                        )}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ControlAbsen;
