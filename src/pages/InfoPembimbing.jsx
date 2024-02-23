import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";

const getTokenFromLocalStorage = () => {
  return localStorage.getItem("token");
};

axios.interceptors.request.use(
  (config) => {
    const token = getTokenFromLocalStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const fetchPembimbingData = () => {
  return axios
    .get("http://127.0.0.1:8000/api/admin/daftar-pembimbing")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

const assignPembimbingToSiswa = (siswaId, pembimbingId) => {
  return axios
    .post(
      `http://127.0.0.1:8000/api/siswa/${siswaId}/assignPembimbing/${pembimbingId}`,
      { siswaId, pembimbingId }
    )
    .then((response) => {
      // Handle response jika diperlukan
    })
    .catch((error) => {
      console.error(error);
      throw error;
    });
};

export default function InfoPembimbing() {
  const [pembimbing, setPembimbing] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSiswaId, setSelectedSiswaId] = useState("");

  useEffect(() => {
    fetchPembimbingData()
      .then((data) => setPembimbing(data)) // Mengubah setPembimbing([...data]) menjadi setPembimbing(data)
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectSiswa = (siswaId) => {
    setSelectedSiswaId(siswaId);
  };

  const assignPembimbing = (pembimbingId) => {
    assignPembimbingToSiswa(selectedSiswaId, pembimbingId)
      .then(() => {
        setPembimbing((prevPembimbing) =>
          prevPembimbing.map((p) =>
            p.id === pembimbingId ? { ...p, sudahMembimbingDuaSiswa: true } : p
          )
        );
      })
      .catch((error) => console.error(error));
  };

  // Pastikan variabel `pembimbing` memiliki properti `nip`, `name`, `nomorTelpon`, `email`, dan `id`
  const filteredPembimbing = pembimbing.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex ">
      <Sidebar />
      <div className="flex flex-col w-full p-5">
        <h1 className="text-xl font-bold mb-3">Info Pembimbing</h1>
        <input
          type="text"
          placeholder="Cari Pembimbing..."
          value={searchTerm}
          onChange={handleSearch}
          className="w-full px-3 py-1 border border-gray-300 rounded-md mb-3"
        />
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-300 px-3 py-2">NIP</th>
              <th className="border border-gray-300 px-3 py-2">Nama</th>
              <th className="border border-gray-300 px-3 py-2">Nomor Telpon</th>
              <th className="border border-gray-300 px-3 py-2">Email</th>
              <th className="border border-gray-300 px-3 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filteredPembimbing.map((pembimbing) => (
              <tr key={pembimbing.id}>
                <td className="border border-gray-300 px-3 py-2">
                  {pembimbing.nip}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {pembimbing.name}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {pembimbing.nomer_telpon}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  {pembimbing.email}
                </td>
                <td className="border border-gray-300 px-3 py-2">
                  <button
                    onClick={() => assignPembimbing(pembimbing.id)}
                    disabled={pembimbing.sudahMembimbingDuaSiswa}
                    className={`bg-blue-500 text-white px-2 py-1 rounded-md ${
                      pembimbing.sudahMembimbingDuaSiswa
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                    }`}
                  >
                    {pembimbing.sudahMembimbingDuaSiswa ? "Assigned" : "Assign"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
