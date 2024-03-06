import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidepem from "../components/Sidepem";
import ReactPaginate from "react-paginate";

export default function Absenpem() {
  const [absensi, setAbsensi] = useState([]);
  const [selectedAbsen, setSelectedAbsen] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const absensiPerPage = 5;
  const pagesVisited = pageNumber * absensiPerPage;
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found. Please login again.");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/pembimbing/absen-siswa",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setAbsensi(response.data.siswa);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleDetailClick = async (absen) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `http://127.0.0.1:8000/api/pembimbing/data-absen/${absen.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSelectedAbsen(response.data.absensi);
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleLocationClick = (latitude, longitude) => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    );
  };

  const pageCount = Math.ceil(absensi.length / absensiPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="bg-gray-100 flex">
      <Sidepem />
      <div className="h-screen flex-1">
        <h1 className="text-2xl text-center font-bold mb-4">Data Absensi</h1>
        <table className="bg-white text-center table-auto w-full shadow-md rounded-md overflow-hidden border-r border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">No</th>
              <th className="border px-4 py-2">Nama</th>
              <th className="border px-4 py-2">Kelas</th>
              <th className="border px-4 py-2">NISN</th>
              <th className="border px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {absensi.length > 0 ? (
              absensi
                .slice(pagesVisited, pagesVisited + absensiPerPage)
                .map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => handleDetailClick(item)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{item.name}</td>
                    <td className="border px-4 py-2">{item.kelas}</td>
                    <td className="border px-4 py-2">{item.nisn}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleDetailClick(item)}
                        className="text-blue-500"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">
                  Tidak ada data absensi
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination flex gap-2 mt-4 justify-center"}
          previousLinkClassName={
            "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
          }
          nextLinkClassName={
            "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
          }
          disabledClassName={"pagination__link--disabled"}
          activeClassName={
            "pagination__link--active bg-gray-500 text-white border-blue-500"
          }
        />
      </div>
      {showModal && selectedAbsen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="bg-white p-4 rounded-lg">
            <div className="flex justify-between mb-4">
              <h2 className="text-lg font-bold">Detail Absensi</h2>
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 rounded text-white font-bold py-2 px-4 hover:bg-red-700"
              >
                Tutup
              </button>
            </div>
            <table className="w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">No</th>
                  <th className="border px-4 py-2">Tanggal</th>
                  <th className="border px-4 py-2">Waktu</th>
                  <th className="border px-4 py-2">Lokasi</th>
                  <th className="border px-4 py-2">Foto</th>
                </tr>
              </thead>
              <tbody>
                {selectedAbsen.map((absen, index) => (
                  <tr key={index}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{absen.tanggal_absen}</td>
                    <td className="border px-4 py-2">{absen.waktu_absen}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() =>
                          handleLocationClick(absen.latitude, absen.longitude)
                        }
                        className="bg-blue-500 text-white font-bold py-2 px-4 hover:bg-blue-600 rounded"
                      >
                        Lihat Lokasi
                      </button>
                    </td>
                    <td className="border px-4 py-2">
                      {absen.foto && (
                        <img
                          src={`http://127.0.0.1:8000${absen.foto}`}
                          alt="Foto Absen"
                          className="w-16 h-16 object-cover"
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
