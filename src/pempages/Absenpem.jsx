import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidepem from "../components/Sidepem";

export default function Absenpem() {
  const [absensi, setAbsensi] = useState([]);
  const [selectedAbsen, setSelectedAbsen] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/pembimbing/data-absen");
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

  return (
    <div className="h-screen flex">
      <Sidepem />
      <h1 className="text-2xl text-center font-bold mb-4">Data Absensi</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-100">
          <tr>
            <th className="border border-gray-300 px-4 py-2">Nama</th>
            <th className="border border-gray-300 px-4 py-2">Tanggal</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
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
                <td className="border border-gray-300 px-4 py-2">
                  {item.nama}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.tanggal}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.status}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
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
            <strong>Status:</strong> {selectedAbsen.status}
          </p>
          {/* Tambahkan detail lainnya sesuai kebutuhan */}
        </div>
      )}
    </div>
  );
}
