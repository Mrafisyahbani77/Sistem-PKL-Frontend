import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ReactPaginate from "react-paginate";
import { FaCalendarAlt, FaBookOpen, FaBook } from "react-icons/fa";
import Api from "../Api";

const Jurnal = () => {
  const [siswa, setSiswa] = useState([]);
  const [jurnals, setJurnals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pageCount, setPageCount] = useState(1);

  useEffect(() => {
    const fetchSiswa = async () => {
      try {
        const { data } = await Api.get("/api/admin/jurnal-siswa");

        // Ensure that data is an array
        const siswaArray = Array.isArray(data) ? data : [];

        setSiswa(siswaArray);
      } catch (error) {
        console.error("Error fetching students:", error.message);
      }
    };

    fetchSiswa();
  }, []);

  useEffect(() => {
    const fetchJurnals = async () => {
      try {
        if (selectedUserId) {
          const { data } = await Api.get(
            `/api/admin/jurnal-siswa/${selectedUserId}`
          );
          setJurnals(data.user_jurnal.jurnal);
          setPageCount(data.pageCount);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchJurnals();
  }, [selectedUserId]);

  const handleSearch = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    setSearchTerm(searchTerm);
  };

  const handleSiswaClick = (userId) => {
    setSelectedUserId(userId);
  };

  const handleCloseJurnal = () => {
    setSelectedUserId(null);
    setJurnals([]);
    setPageCount(1);
  };

  const changePage = (selectedPage) => {
    // Handle page change logic here
  };

  const filteredSiswa = siswa.filter(
    (user) =>
      (user.name && user.name.toLowerCase().includes(searchTerm)) ||
      (user.nisn && user.nisn.toLowerCase().includes(searchTerm))
  );

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
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Daftar Siswa</h3>
        </div>
        <table className="min-w-full border border-gray-300 mb-4">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-r">
                <span>NISN</span>
              </th>
              <th className="py-2 px-4 border-r">
                <span>Nama Siswa</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredSiswa) && filteredSiswa.length > 0 ? (
              filteredSiswa.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => handleSiswaClick(user.id)}
                  className={`cursor-pointer py-2 px-4 border-b ${
                    selectedUserId === user.id ? "bg-gray-200" : ""
                  }`}
                >
                  <td className="py-2 px-4 border-r text-center">
                    {user.nisn}
                  </td>
                  <td className="py-2 px-4 border-r text-center">
                    {user.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2" className="text-center py-4">
                  No students available
                </td>
              </tr>
            )}
          </tbody>
        </table>

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
