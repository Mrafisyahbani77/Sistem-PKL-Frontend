// Import useEffect, useState, dan Fragment dari React
import { useState, useEffect } from "react";
import Sidekap from "../components/Sidekap";
import axios from "axios";
import ReactPaginate from "react-paginate";

const Absensikap = () => {
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [absensiList, setAbsensiList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 6;
  const AbsenPerPage = 6;
  const AbsenVisited = pageNumber * AbsenPerPage;
  const pagesVisited = pageNumber * usersPerPage;

  useEffect(() => {
    const access_token = localStorage.getItem("token");
    setToken(access_token);
  }, []);

  useEffect(() => {
    if (token) {
      axios
        .get("http://localhost:8000/api/kaprog/absen-siswa", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setSiswaList(response.data.siswa))
        .catch((error) => console.error(error));
    }
  }, [token]);

  useEffect(() => {
    setAbsensiList([]);
  }, [selectedSiswa]);

  useEffect(() => {
    if (selectedSiswa && selectedSiswa.id && token) {
      axios
        .get(
          `http://localhost:8000/api/kaprog/absen-siswa/${selectedSiswa.id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((response) => {
          const { absensi } = response.data;
          const updatedAbsensiList = absensi.map((item) => ({
            ...item,
            foto: item.foto ? `http://localhost:8000${item.foto}` : null,
          }));
          setAbsensiList(updatedAbsensiList);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    }
  }, [selectedSiswa, token]);

  const handleSiswaClick = (siswa) => {
    setSelectedSiswa(siswa);
    setShowPopup(true);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPageNumber(0);
  };

  const filteredSiswaList = siswaList.filter(
    (siswa) =>
      (siswa.name &&
        siswa.name.toLowerCase().includes(searchTerm?.toLowerCase())) ||
      (siswa.nisn &&
        siswa.nisn.toLowerCase().includes(searchTerm?.toLowerCase())) ||
      (selectedKelas && siswa.kelas === selectedKelas)
  );

  const pageCount = Math.ceil(filteredSiswaList.length / usersPerPage);
  const AbsenCount = Math.ceil(absensiList.length / AbsenPerPage);

  const displaySiswaList = filteredSiswaList
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((siswa, index) => (
      <tr
        key={index}
        className={`py-2 px-4 border-b transition-colors text-center duration-300  ${
          selectedSiswa && selectedSiswa.nisn === siswa.nisn
            ? "bg-gray-100"
            : ""
        } `}
      >
        <td className="py-2 px-4 border">{index + 1 + pagesVisited}</td>
        <td className="py-2 px-4 border">{siswa.nisn}</td>
        <td className="py-2 px-4 border">{siswa.kelas}</td>
        <td className="py-2 px-4 border">{siswa.name}</td>
        <td className="py-2 px-4 border">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => handleSiswaClick(siswa)}
          >
            Detail
          </button>
        </td>
      </tr>
    ));

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex h-screen">
      <Sidekap />
      <div className="mx-auto container p-4">
        <h2 className="text-3xl font-bold mb-4">Absen</h2>
        <div className="mb-4">
          <input
            type="text"
            id="search"
            placeholder="Cari akun siswa..."
            value={searchTerm}
            onChange={handleSearch}
            className="p-2 border rounded"
          />
          
        </div>
        <table className="bg-white table-auto w-full shadow-md rounded-md border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border">No</th>
              <th className="py-2 px-4 border">Nisn</th>
              <th className="py-2 px-4 border">Kelas</th>
              <th className="py-2 px-4 border">Nama Siswa</th>
              <th className="py-2 px-4 border">Detail</th>
            </tr>
          </thead>
          <tbody>{displaySiswaList}</tbody>
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
        {showPopup && selectedSiswa && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 max-w-xl rounded-md">
              <button
                onClick={() => setShowPopup(false)}
                className="text-white bg-red-500 px-4 py-2 rounded-md text-sm"
              >
                Tutup
              </button>
              <h3 className="text-2xl font-bold mb-2">
                Detail Absensi untuk {selectedSiswa.name}
              </h3>
              <table className="w-full divide-y divide-gray-200 border rounded mt-4">
                <thead className="bg-gray-200">
                  <tr className="bgv-gray-50">
                    <th className="py-2 px-4 border">No</th>
                    <th className="py-2 px-8 border">Tanggal</th>
                    <th className="py-2 px-4 border">Waktu</th>
                    <th className="py-2 px-10 border">Lokasi</th>
                    <th className="py-2 px-4 border">Foto Absensi</th>
                  </tr>
                </thead>
                <tbody>
                  {absensiList.length > 0 &&
                    absensiList.map((item, index) => (
                      <tr key={index} className="">
                        <td className="py-2 px-4 border text-center">
                          {index + 1 + AbsenVisited}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {item.tanggal_absen}
                        </td>
                        <td className="py-2 px-4 border text-center">
                          {item.waktu_absen}
                        </td>
                        <td className="py-2 px-2 border text-center">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-blue-500 hover:bg-blue-700 text-white text-sm font-bold py-1 px-2 rounded"
                          >
                            Lihat Lokasi
                          </a>
                        </td>
                        <td className="py-2 px-4 max-w-[100px] max-h-[100px] overflow-x-auto overflow-y-auto whitespace-nowrap border text-center">
                          {item.foto ? (
                            <img
                              src={item.foto}
                              className="w-16 items-center h-20 object-cover"
                              alt="Foto Absensi"
                            />
                          ) : (
                            <span>Foto tidak tersedia</span>
                          )}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
              <ReactPaginate
                previousLabel={"Sebelumnya"}
                nextLabel={"Berikutnya"}
                pageCount={AbsenCount}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Absensikap;
