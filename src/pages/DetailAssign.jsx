import React, { useState, useEffect } from "react";
import axios from "axios";

const DetailAssign = ({ pembimbingId, onClose }) => {
  const [perusahaan, setPerusahaan] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get(`http://127.0.0.1:8000/api/admin/detail-assign/${pembimbingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      .then((response) => {
        setLoading(false);
        setPerusahaan(response.data.companies);
      })
      .catch((error) => {
        console.error("Error fetching perusahaan:", error);
      });
  }, [pembimbingId]);

  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={onClose}
        >
          Tutup
        </button>
        <h3 className="text-xl font-bold mb-4">Perusahaan yang Dibimbing</h3>
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama Perusahaan</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="2" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              perusahaan.map((namaPerusahaan, index) => (
                <tr key={index}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{namaPerusahaan}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DetailAssign;
