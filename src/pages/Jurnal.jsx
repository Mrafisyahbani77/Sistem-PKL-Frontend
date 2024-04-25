import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ReactPaginate from "react-paginate";
import { FaBook } from "react-icons/fa";
import Api from "../Api";

const Jurnal = () => {
  const [siswa, setSiswa] = useState([]);
  const [jurnals, setJurnals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 6;

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const { data } = await Api.get("/api/admin/jurnal-siswa");
        setSiswa(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching students:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSiswa();
  }, []);

  useEffect(() => {
    const fetchJurnals = async () => {
      try {
        if (selectedUserId !== null) {
          const { data } = await Api.get(
            `/api/admin/jurnal-siswa/${selectedUserId}?page=${
              pageNumber + 1
            }&perPage=${usersPerPage}`
          );
          setJurnals(data.user_jurnal.jurnal);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchJurnals();
  }, [selectedUserId, pageNumber]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleDetailClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseJurnal = () => {
    setSelectedUserId(null);
    setJurnals([]);
    setPageNumber(0);
  };

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const sortedSiswa = [...siswa].sort((a, b) => {
    const kelasA = parseInt(a.kelas.split(" ")[1]);
    const kelasB = parseInt(b.kelas.split(" ")[1]);
    return kelasA - kelasB;
  });

  const filteredSiswa = sortedSiswa.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm)) ||
      (user.nisn && user.nisn.toLowerCase().includes(searchTerm))
  );

  const pageCount = Math.ceil(filteredSiswa.length / usersPerPage);

  return (
    <div className="flex">
      <Sidebar />
      <div className="container mx-auto p-4">
        <div className="flex items-center justify-center">
          <h2 className="text-2xl flex pt-4 font-semibold mt-6 mb-4 text-center">
            <FaBook className="mr-2 text-2xl mt-1.5 " />
            Jurnal Siswa
          </h2>
        </div>
        <div className="mb-4">
          <input
            type="text"
            placeholder="Cari siswa..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded-md"
          />
        </div>
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-r">
                <span>No</span>
              </th>
              <th className="py-2 px-4 border-r">
                <span>NISN</span>
              </th>
              <th className="py-2 px-4 border-r">
                <span>Kelas</span>
              </th>
              <th className="py-2 px-4 border-r">
                <span>Nama Siswa</span>
              </th>
              <th className="py-2 px-4 border-r">
                <span>Detail</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center">
                  {" "}
                  Loading...
                </td>
              </tr>
            ) : filteredSiswa.length > 0 ? (
              filteredSiswa
                .slice(
                  pageNumber * usersPerPage,
                  (pageNumber + 1) * usersPerPage
                )
                .map((user, index) => (
                  <tr
                    key={user.id}
                    className={`cursor-pointer py-2 px-4 border-b transition-colors duration-300 ${
                      selectedUserId === user.id ? "bg-gray-200" : ""
                    } `}
                  >
                    <td className="py-2 px-4 border-r text-center">
                      {index + 1}
                    </td>
                    <td className="py-2 px-4 border-r text-center">
                      {user.nisn}
                    </td>
                    <td className="py-2 px-4 border-r text-center">
                      {user.kelas}
                    </td>
                    <td className="py-2 px-4 border-r text-center">
                      {user.name}
                    </td>
                    <td className="py-2 px-4 border-r text-center">
                      <button
                        onClick={() => handleDetailClick(user.id)}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center">
                  Tidak ada data jurnal siswa
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Sebelumnya"}
          nextLabel={"Berikutnya"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination flex gap-2 mt-4"}
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

        {selectedUserId && (
          <div className="bg-black bg-opacity-50 fixed top-0 left-0 w-full h-full flex justify-center items-center">
            <div className="bg-white p-4 rounded-md">
              <h2 className="text-xl font-semibold mb-4">
                Jurnal Detail{" "}
                {siswa.find((user) => user.id === selectedUserId)?.name}
              </h2>
              <table className="min-w-full border border-gray-300 mb-4">
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
                  {Array.isArray(jurnals) && jurnals.length > 0 ? (
                    jurnals.map((jurnal) => (
                      <tr
                        key={jurnal.id}
                        className="hover:bg-gray-100 text-center"
                      >
                        <td className="py-2 px-4 border-r">
                          {jurnal.kegiatan}
                        </td>
                        <td
                          className={`py-2 px-4 border-r ${
                            jurnal.status === "selesai"
                            // ? "text-white bg-green-500 rounded-full"
                            // : "text-white bg-blue-500 rounded-full"
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
              <button
                onClick={handleCloseJurnal}
                className="p-2 mt-4 border rounded-md bg-red-500 text-white"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jurnal;
