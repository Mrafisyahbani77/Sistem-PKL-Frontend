import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Api from "../Api";
import ReactPaginate from "react-paginate";

const ControlAbsen = () => {
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [absensiList, setAbsensiList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 6;
  const pagesVisited = pageNumber * usersPerPage;

  useEffect(() => {
    // Mengambil token dari local storage
    const access_token = localStorage.getItem("token");
    setToken(access_token);
  }, []);

  useEffect(() => {
    // Mengambil daftar akun siswa dari API
    if (token) {
      Api.get("/api/admin/absensi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => setSiswaList(response.data))
        .catch((error) => console.error(error));
    }
  }, [token]);

  useEffect(() => {
    // Reset absensiList saat memilih siswa baru
    setAbsensiList([]);
  }, [selectedSiswa]);

  useEffect(() => {
    // Mengambil daftar absensi dari API saat ada siswa yang dipilih
    if (selectedSiswa && selectedSiswa.id && token) {
      Api.get(`/api/admin/absensi/${selectedSiswa.id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const { absensiList } = response.data;
          // Periksa apakah ada foto dalam setiap data absensi
          const updatedAbsensiList = absensiList.map((item) => ({
            ...item,
            foto: item.foto ? `http://localhost:8000${item.foto}` : null, // Tambahkan URL lengkap foto dan sesuaikan dengan kebutuhan Anda
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
    setShowPopup(true); // Menampilkan pop-up saat akun siswa diklik
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
        siswa.nisn.toLowerCase().includes(searchTerm?.toLowerCase()))
  );

  const pageCount = Math.ceil(filteredSiswaList.length / usersPerPage);

  const displaySiswaList = filteredSiswaList
    .slice(pagesVisited, pagesVisited + usersPerPage)
    .map((siswa, index) => (
      <tr
        key={index}
        className={`cursor-pointer py-2 px-4 border-b transition-colors text-center duration-300  ${
          selectedSiswa && selectedSiswa.nisn === siswa.nisn
            ? "bg-gray-100"
            : ""
        } hover:bg-gray-400`}
        onClick={() => handleSiswaClick(siswa)}
      >
        <td className="py-2 px-4 border-r">{index + 1 + pagesVisited}</td>
        <td className="py-2 px-4 border-r">{siswa.nisn}</td>
        <td className="py-2 px-4 border-r">{siswa.kelas}</td>
        <td className="py-2 px-4 border-r">{siswa.name}</td>
      </tr>
    ));

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="mx-auto container p-4">
        <h2 className="text-3xl font-bold mb-4">Absen</h2>
        {/* Pencarian Akun Siswa */}
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
        {/* Tabel Akun Siswa */}
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-r">No</th>
              <th className="py-2 px-4 border-r">Nisn</th>
              <th className="py-2 px-4 border-r">Kelas</th>
              <th className="py-2 px-4 border-r">Nama Siswa</th>
            </tr>
          </thead>
          <tbody>{displaySiswaList}</tbody>
        </table>
        {/* Pagination */}
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
        {/* Detail Absensi Pop-up */}
        {showPopup && selectedSiswa && (
          <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
            <div className="bg-white p-8 max-w-xl rounded-md">
              <button
                onClick={() => setShowPopup(false)} // Menutup pop-up saat tombol diklik
                className="text-white bg-red-500 px-4 py-2 rounded-md text-sm"
              >
                Tutup
              </button>
              <h3 className="text-2xl font-bold mb-2">
                Detail Absensi untuk {selectedSiswa.name}
              </h3>
              <table className="min-w-full divide-y divide-gray-200 border rounded overflow-hidden mt-4">
                <thead className="bg-gray-200">
                  <tr className="bgv-gray-50">
                    <th className="py-2 px-8 border-r">Tanggal</th>
                    <th className="py-2 px-4 border-r">Waktu</th>
                    <th className="py-2 px-4 border-r">Lokasi</th>
                    <th className="py-2 px-4 border-r">Foto Absensi</th>
                  </tr>
                </thead>
                <tbody>
                  {absensiList.length > 0 &&
                    absensiList.map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-r text-center">
                          {item.tanggal_absen}
                        </td>
                        <td className="py-2 px-4 border-r text-center">
                          {item.waktu_absen}
                        </td>
                        <td className="py-2 px-4 border-r text-center">
                          {item.latitude}, {item.longitude}
                        </td>
                        <td className="py-2 px-4 border-r text-center">
                          {item.foto ? (
                            <img src={item.foto} alt="Foto Absensi" />
                          ) : (
                            <span>Foto tidak tersedia</span>
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
    </div>
  );
};

export default ControlAbsen;
