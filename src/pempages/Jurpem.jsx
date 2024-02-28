import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidepem from "../components/Sidepem";

export default function Jurpem() {
  const [jurnals, setJurnals] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/pembimbing/data-jurnal");
        setJurnals(response.data.Jurnak);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="flex h-screen">
      <Sidepem />
      <div className="flex-1">
        <h1 className="text-2xl font-bold mb-4">Data Jurnal</h1>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2">Judul</th>
              <th className="border border-gray-300 px-4 py-2">Tanggal</th>
              <th className="border border-gray-300 px-4 py-2">Isi</th>
            </tr>
          </thead>
          <tbody>
            {jurnals &&
              jurnals.map((jurnal) => (
                <tr key={jurnal.id}>
                  <td className="border border-gray-300 px-4 py-2">
                    {jurnal.judul}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {jurnal.tanggal}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {jurnal.isi}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
