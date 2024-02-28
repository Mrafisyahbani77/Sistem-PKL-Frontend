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
    .get("http://127.0.0.1:8000/api/admin/daftar")
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error(error);
      return [];
    });
};

const assignPembimbingToGroup = (pembimbingId, groupId) => {
  return axios
    .post(`http://127.0.0.1:8000/api/admin/assign`, {
      pembimbing_id: pembimbingId,
      group_id: groupId,
    })
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
  const [selectedPembimbingId, setSelectedPembimbingId] = useState("");
  const [groupData, setGroupData] = useState(null);

  useEffect(() => {
    fetchPembimbingData()
      .then((data) => setPembimbing(data))
      .catch((error) => console.error(error));
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectPembimbing = (pembimbingId) => {
    setSelectedPembimbingId(pembimbingId);
  };

  const assignPembimbing = (pembimbingId) => {
    handleSelectPembimbing(pembimbingId);
    fetchGroupData();
  };

  const fetchGroupData = () => {
    axios
      .get("http://127.0.0.1:8000/api/admin/daftar-pengajuan")
      .then((response) => {
        setGroupData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const assignToGroup = (groupId) => {
    assignPembimbingToGroup(selectedPembimbingId, groupId)
      .then(() => {
        alert("Pembimbing berhasil ditugaskan ke kelompok siswa");
      })
      .catch((error) => {
        alert("Gagal menugaskan pembimbing: " + error.message);
      });
  };

  const filteredPembimbing = pembimbing.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
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
              <th className="border-r border-gray-300 px-3 py-2">NIP</th>
              <th className="border-r border-gray-300 px-3 py-2">Nama</th>
              <th className="border-r border-gray-300 px-3 py-2">Nomor Telpon</th>
              <th className="border-r border-gray-300 px-3 py-2">Email</th>
              <th className="border-r border-gray-300 px-3 py-2">Aksi</th>
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
                  {selectedPembimbingId === pembimbing.id &&
                    groupData &&
                    groupData.length > 0 && (
                      <div className="absolute top-0 left-0 h-full w-full flex justify-center items-center bg-gray-800 bg-opacity-50 z-10">
                        
                        <div className="bg-white p-5 rounded-md shadow-md">
                          {groupData.map((group) => (
                            <div key={group.group_id}>
                              <p>
                                Group ID: {group.group_id} -{" "}
                                {group.nama_perusahaan}
                              </p>
                              <h4 className="text-lg font-bold mt-3">
                                Daftar-Siswa:
                              </h4>
                              <ul>
                                {group.siswa &&
                                  group.siswa.map((siswa) => (
                                    <li key={siswa.id}>
                                      {siswa.name} - Kelas: {siswa.kelas}
                                    </li>
                                  ))}
                              </ul>
                              <button
                                onClick={() => assignToGroup(group.group_id)}
                                className="bg-blue-500 text-white px-3 py-1 rounded-md mt-3"
                              >
                                Assign
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
