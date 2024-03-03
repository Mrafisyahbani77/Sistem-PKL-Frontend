import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidepem from "../components/Sidepem";
import ReactPaginate from "react-paginate";

export default function Jurpem() {
  const [siswas, setSiswas] = useState([]);
  const [selectedJurnal, setSelectedJurnal] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const journalsPerPage = 5;
  const pagesVisited = pageNumber * journalsPerPage;

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found. Please login again.");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/pembimbing/data-jurnal-2",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSiswas(response.data.siswas);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleDetailClick = async (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token not found. Please login again.");
      return;
    }

    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/api/pembimbing/data-jurnal/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSelectedJurnal(response.data.user_jurnal);
      setSelectedUserId(id); // Menyimpan ID siswa yang dipilih
    } catch (error) {
      console.error(error);
    }
  };

  const handleCloseJurnal = () => {
    setSelectedJurnal(null); // Menutup pop-up 
  };

  const pageCount = Math.ceil(siswas.length / journalsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex h-screen">
      <Sidepem />
      <div className="flex-1">
        <h1 className="text-2xl text-center font-bold mb-4">Data Jurnal</h1>
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border-r border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="border-r  px-4 py-2">No</th>
              <th className="border-r  px-4 py-2">Nama siswa</th>
              <th className="border-r  px-4 py-2">Kelas</th>
              <th className="border-r  px-4 py-2">Nisn</th>
              <th className="border-r  px-4 py-2">Detail</th>
            </tr>
          </thead>
          <tbody>
            {siswas &&
              siswas
                .slice(pagesVisited, pagesVisited + journalsPerPage)
                .map((siswa, index) => (
                  <tr
                    key={siswa.id}
                    onClick={() => handleDetailClick(siswa.id)}
                    className="cursor-pointer text-center hover:bg-gray-100"
                  >
                    <td className="border-r border-b px-4 py-2">{index + 1}</td>
                    <td className="border-r border-b px-4 py-2">{siswa.nama}</td>
                    <td className="border-r border-b px-4 py-2">{siswa.kelas}</td>
                    <td className="border-r border-b px-4 py-2">{siswa.nisn}</td>
                    <td className="border-r border-b px-4 py-2 text-blue-500 cursor-pointer" onClick={() => handleDetailClick(siswa.id)}>Detail</td>{" "}
                    {/* Change this to display a detail button or link */}
                  </tr>
                ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Sebelumnya"}
          nextLabel={"Selanjutnya"}
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
      {selectedJurnal && (
        <div className="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center">
          <div className="bg-white p-4 rounded-md">
            <button
              onClick={handleCloseJurnal}
              className="p-2 mt-2 ml-80 border rounded-md bg-red-500 text-white"
            >
              Tutup
            </button>
            <h2 className="text-xl font-semibold mb-4">
              Jurnal Detail{" "}
              {siswas.find((user) => user.id === selectedUserId)?.nama}
            </h2>
            <table className="min-w-full border border-gray-300 mb-20">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border-r">
                    <span>Kegiatan</span>
                  </th>
                  <th className="py-2 px-4 border-r">
                    <span>Status</span>
                  </th>
                  <th className="py-2 px-4 border-r">
                    <span>Waktu</span>
                  </th>
                  <th className="py-2 px-4 border-r">
                    <span>Tanggal</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(selectedJurnal.jurnal) &&
                selectedJurnal.jurnal.length > 0 ? (
                  selectedJurnal.jurnal.map((jurnal) => (
                    <tr
                      key={jurnal.id}
                      className="hover:bg-gray-100 text-center"
                    >
                      <td className="py-2 px-4 border-r">{jurnal.kegiatan}</td>
                      <td
                        className={`py-2 px-4 border-r ${
                          jurnal.status === "selesai"
                            ? "text-white bg-green-500 rounded-full"
                            : "text-white bg-blue-500 rounded-full"
                        }`}
                      >
                        {jurnal.status}
                      </td>
                      <td className="py-2 px-4 border-r">{jurnal.waktu}</td>
                      <td className="py-2 px-4 border-r">{jurnal.tanggal}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
