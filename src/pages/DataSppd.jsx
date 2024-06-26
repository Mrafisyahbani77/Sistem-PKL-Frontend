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
  const token = localStorage.getItem("token"); // Ambil token dari localStorage

  useEffect(() => {
    fetchData();
  }, []);

  const onClos = () => {
    setShowGenerateForm(null);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/admin/sppd", {
        headers: {
          Authorization: `Bearer ${token}`, // Gunakan token dalam header Authorization
        },
      });
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
      const response = await axios.get(
        `http://127.0.0.1:8000/api/admin/detail-sppd/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Gunakan token dalam header Authorization
          },
        }
      );
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
        <table className="bg-white table-auto w-full text-center shadow-md rounded-md overflow-hidden border border-gray-300">
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
              <tr>
                <td className="border-r  p-2">{index + 1}</td>
                <td className="border-r  p-2">{pembimbing.name}</td>
                <td className="border-r  p-2">{pembimbing.nip}</td>
                <td className="border-r  p-2">
                  <button
                    onClick={() => showDetail(pembimbing.user_id)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {showPopup && selectedPembimbing && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded shadow-lg">
              <h2 className="text-lg font-bold mb-4">
                Detail Pembimbing: {selectedPembimbing.name}
              </h2>
              <table className="table-auto w-full">
                <tbody>
                  <tr>
                    <td className="font-bold">Status:</td>
                    <td>{selectedPembimbing.status}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Tanggal:</td>
                    <td>{selectedPembimbing.tanggal}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Hari:</td>
                    <td>{selectedPembimbing.hari}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Waktu:</td>
                    <td>{selectedPembimbing.waktu}</td>
                  </tr>
                  <tr>
                    <td className="font-bold">Lamanya Perjalanan:</td>
                    <td>{selectedPembimbing.lamanya_perjalanan}</td>
                  </tr>
                </tbody>
              </table>
              <div className="mt-4">
                <button
                  onClick={() => {
                    setShowPopup();
                    setShowGenerateForm(true);
                  }}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  Generate PDF
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ml-4"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
        {showGenerateForm && (
          <div className="flex">
            <GenerateSppd userId={selectedPembimbing.user_id}/>
            <button
              onClick={onClos}
              className="bg-gray-500 hover:bg-gray-600 py-2 px-2 rounded text-sm text-white"
            >
              Tutup Form
            </button>
          </div>
        )}{" "}
        {/* Tampilkan form generate PDF jika showGenerateForm bernilai true */}
      </div>
    </div>
  );
}
