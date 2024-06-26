import React, { useState } from "react";
import axios from "axios";
import Sidepem from "../components/Sidepem";

export default function Sppd() {
  const [formData, setFormData] = useState({
    status: "",
    tanggal: "",
    hari: "",
    waktu: "",
    lamanya_perjalanan: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        "http://127.0.0.1:8000/api/pembimbing/pengajuan-sppd",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data); // Tampilkan pesan respons
    } catch (error) {
      console.error(error); // Tampilkan error jika terjadi kesalahan
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-200 h-screen">
      <Sidepem />
      <div className="w-full max-w-xs mx-auto mt-20">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="status"
            >
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            >
              <option value="">Pilih status</option>
              <option value="Monitoring">Monitoring</option>
              <option value="Penjemputan">Penjemputan</option>
              <option value="Pengantaran">Pengantaran</option>
            </select>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tanggal"
            >
              Tanggal bulan dan tahun
            </label>
            <input
              type="text"
              name="tanggal"
              value={formData.tanggal}
              onChange={handleChange}
              placeholder="9 januari 2024"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="hari"
            >
              Hari
            </label>
            <input
              type="text"
              name="hari"
              value={formData.hari}
              onChange={handleChange}
              placeholder="Selasa"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="waktu"
            >
              Waktu
            </label>
            <input
              type="text"
              name="waktu"
              value={formData.waktu}
              onChange={handleChange}
              placeholder="11.00 Wib - Selesai"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="lamanya_perjalanan"
            >
              Lamanya Perjalanan
            </label>
            <input
              type="text"
              name="lamanya_perjalanan"
              value={formData.lamanya_perjalanan}
              onChange={handleChange}
              placeholder=" 1 Hari"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? "mengirim..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
