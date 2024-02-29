// DataSppd.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import GenerateSppd from "./Generatesppd"; // Import komponen GenerateSppd

export default function DataSppd() {
  const [pembimbings, setPembimbings] = useState([]);
  const [selectedPembimbing, setSelectedPembimbing] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showGenerateForm, setShowGenerateForm] = useState(false); // State untuk menampilkan form generate PDF

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/sppd");
      const data = response.data;
      if (Array.isArray(data)) {
        setPembimbings(data);
      } else {
        console.error("Data fetched is not an array:", data);
      }
    } catch (error) {
      console.error("Error fetching pembimbing data:", error);
    }
  };

  const showDetail = async (id) => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/admin/detail-sppd/${id}`);
      setSelectedPembimbing(response.data);
      setShowPopup(true);
    } catch (error) {
      console.error("Error fetching pembimbing detail:", error);
    }
  };
  

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-grow p-8">
        <h1 className="text-2xl font-bold mb-4">Data SPPD</h1>
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-3000">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="border-r  p-2">No</th>
              <th className="border-r  p-2">Nama Pembimbing</th>
              <th className="border-r  p-2">NIP</th>
              <th className="border-r  p-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {pembimbings.map((pembimbing, index) => (
              <tr key={pembimbing.user_id}>
                <td className="border-r  p-2">{index + 1}</td>
                <td className="border-r  p-2">{pembimbing.name}</td>
                <td className="border-r  p-2">{pembimbing.nip}</td>
                <td className="border-r  p-2">
                  <button onClick={() => showDetail(pembimbing.user_id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Detail</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showPopup && selectedPembimbing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-4">Detail Pembimbing</h2>
              <p>User ID: {selectedPembimbing.user_id}</p>
              <p>Status: {selectedPembimbing.status}</p>
              <p>Tanggal: {selectedPembimbing.tanggal}</p>
              <p>Hari: {selectedPembimbing.hari}</p>
              <p>Waktu: {selectedPembimbing.waktu}</p>
              <p>Lamanya Perjalanan: {selectedPembimbing.lamanya_perjalanan}</p>
              <button onClick={() => setShowGenerateForm(true)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Generate PDF</button>
              <button onClick={() => setShowPopup(false)} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4 ml-4">Close</button>
            </div>
          </div>
        )}
        {showGenerateForm && <GenerateSppd />} {/* Tampilkan form generate PDF jika showGenerateForm bernilai true */}
      </div>
    </div>
  );
}
