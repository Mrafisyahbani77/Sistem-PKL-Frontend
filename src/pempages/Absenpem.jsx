import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidepem from "../components/Sidepem";

export default function Absenpem() {
  const [absensi, setAbsensi] = useState([]);
  const [selectedAbsen, setSelectedAbsen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
  
      if (!token) {
          alert('Token not found. Please login again.');
          return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/pembimbing/absen-siswa", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setAbsensi(response.data.absensi);
      } catch (error) {
        console.error(error);
      }
    };
    
    fetchData();
  }, []);

  const handleDetailClick = (absen) => {
    setSelectedAbsen(absen);
  };

  const handleLocationClick = (latitude, longitude) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    );
  };

  return (
    <div className="bg-gray-100 flex">
      <Sidepem />
      <div className="h-screen flex-1">
        <h1 className="text-2xl text-center font-bold mb-4">Data Absensi</h1>
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border-r border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="border  px-4 py-2">Nama</th>
              <th className="border  px-4 py-2">Kelas</th>
              <th className="border  px-4 py-2">NISN</th>
              <th className="border  px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {absensi &&
              absensi.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleDetailClick(item)}
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <td className="border  px-4 py-2">{item.nama}</td>
                  <td className="border  px-4 py-2">{item.kelas}</td>
                  <td className="border  px-4 py-2">{item.nisn}</td>
                  <td className="border  px-4 py-2">
                    <button onClick={() => handleDetailClick(item)}>
                      Detail
                    </button>
                  </td>
                  <td className="border  px-4 py-2">
                    <button
                      onClick={() =>
                        handleLocationClick(item.latitude, item.longitude)
                      }
                    >
                      Lihat Lokasi
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {selectedAbsen && (
        <div className="mt-4 border border-gray-300 p-4">
          <h2 className="text-lg font-bold">Detail Absensi</h2>
          <p>
            <strong>Nama:</strong> {selectedAbsen.nama}
          </p>
          <p>
            <strong>Tanggal:</strong> {selectedAbsen.tanggal}
          </p>
          <p>
            <strong>Waktu:</strong> {selectedAbsen.waktu}
          </p>
          <p>
            <strong>Lokasi:</strong> {selectedAbsen.lokasi}
          </p>
          {/* Tambahkan detail lainnya sesuai kebutuhan */}
          {selectedAbsen.foto && (
            <img
              src={selectedAbsen.foto}
              alt="Foto Absen"
              className="mt-2"
              style={{ maxWidth: "200px" }}
            />
          )}
        </div>
      )}
    </div>
  );
}
