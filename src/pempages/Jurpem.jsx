import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidepem from "../components/Sidepem";

export default function Jurpem() {
  const [jurnals, setJurnals] = useState([]);
  const [selectedJurnal, setSelectedJurnal] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found. Please login again.");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/pembimbing/data-jurnal",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setJurnals(response.data.Jurnals);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleDetailClick = (jurnal) => {
    setSelectedJurnal(jurnal);
  };

  return (
    <div className="flex h-screen">
      <Sidepem />
      <div className="flex-1">
        <h1 className="text-2xl text-center font-bold mb-4">Data Jurnal</h1>
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border-r border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="border-r  px-4 py-2">Nama siswa</th>
              <th className="border-r  px-4 py-2">Kelas</th>
              <th className="border-r  px-4 py-2">Nisn</th>
              <th className="border-r  px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {jurnals &&
              jurnals.map((jurnal) => (
                <tr
                  key={jurnal.id}
                  onClick={() => handleDetailClick(jurnal)}
                  className="cursor-pointer hover:bg-gray-100"
                >
                  <td className="border-b px-4 py-2">{jurnal.name}</td>
                  <td className="border-b px-4 py-2">{jurnal.kelas}</td>
                  <td className="border-b px-4 py-2">{jurnal.nisn}</td>
                  <td className="border-b px-4 py-2">Detail</td> {/* Change this to display a detail button or link */}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {selectedJurnal && (
        <div className="flex-1 p-4">
          <h2 className="text-lg font-bold mb-2">Detail Jurnal</h2>
          <p>
            <strong>Kegiatan:</strong> {selectedJurnal.kegiatan}
          </p>
          <p>
            <strong>Status:</strong> {selectedJurnal.status}
          </p>
          <p>
            <strong>Waktu:</strong> {selectedJurnal.waktu}
          </p>
          <p>
            <strong>Tanggal:</strong> {selectedJurnal.tanggal}
          </p>
        </div>
      )}
    </div>
  );
}