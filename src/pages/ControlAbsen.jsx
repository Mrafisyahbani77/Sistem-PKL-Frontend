import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar.jsx";
import Api from "../Api";
import ReactPaginate from "react-paginate";
import axios from "axios";
import Swal from "sweetalert2";

const ControlAbsen = () => {
  const [siswaList, setSiswaList] = useState([]);
  const [selectedSiswa, setSelectedSiswa] = useState(null);
  const [absensiList, setAbsensiList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [token, setToken] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [popupPageNumber, setPopupPageNumber] = useState(0);
  const usersPerPage = 6;
  const popupUsersPerPage = 4;
  const pagesVisited = pageNumber * usersPerPage;
  const popupPagesVisited = popupPageNumber * popupUsersPerPage;

  useEffect(() => {
    // Mengambil token dari local storage
    const access_token = localStorage.getItem("token");
    setToken(access_token);
  }, []);

  useEffect(() => {
    setIsLoading(true); // Set isLoading ke true sebelum melakukan permintaan API
    if (token) {
      Api.get("/api/admin/absensi", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setSiswaList(response.data);
          setIsLoading(false); // Set isLoading kembali ke false setelah data diterima
        })
        .catch((error) => {
          console.error(error);
          setIsLoading(false); // Pastikan isLoading diset kembali ke false bahkan jika terjadi kesalahan
        });
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

  const ExportAbsen = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/export-absen",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "blob",
        }
      );

      const blobUrl = URL.createObjectURL(response.data);

      const downloadLink = document.createElement("a");
      downloadLink.href = blobUrl;
      downloadLink.download = "Laporan-absen-siswa.pdf";
      document.body.appendChild(downloadLink);
      downloadLink.click();

      Swal.fire({
        icon: "success",
        title: "PDF Berhasil Dibuat",
      });
    } catch (error) {
      console.error("Error exporting absen:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal Membuat PDF",
        text: error.message,
      });
    }
  };

  const pageCount = Math.ceil(filteredSiswaList.length / usersPerPage);

  const displaySiswaList = isLoading ? (
    <tr>
      <td colSpan="5" className="text-center">
        Loading...
      </td>
    </tr>
  ) : filteredSiswaList.length === 0 ? (
    <tr>
      <td colSpan="5" className="text-center py-4">
        Tidak ada data siswa yang ditemukan.
      </td>
    </tr>
  ) : (
    filteredSiswaList
      .slice(pagesVisited, pagesVisited + usersPerPage)
      .map((siswa, index) => (
        <tr
          key={index}
          className={`py-2 px-4 border-b transition-colors text-center duration-300  ${
            selectedSiswa && selectedSiswa.nisn === siswa.nisn ? "" : ""
          }`}
        >
          <td className="py-2 px-4 border-r">{index + 1 + pagesVisited}</td>
          <td className="py-2 px-4 border-r">{siswa.nisn}</td>
          <td className="py-2 px-4 border-r">{siswa.kelas}</td>
          <td className="py-2 px-4 border-r">{siswa.name}</td>
          <td className="py-2 px-4 border-r">
            <button
              onClick={() => handleSiswaClick(siswa)}
              className="bg-blue-500 text-white px-2 py-1 rounded-md hover:bg-blue-600"
            >
              Detail
            </button>
          </td>
        </tr>
      ))
  );

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const changePopupPage = ({ selected }) => {
    setPopupPageNumber(selected);
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

          <button
            onClick={ExportAbsen}
            className="bg-blue-500 float-right rounded py-2 px-2 text-sm text-white font-semibold hover:bg-blue-600"
          >
            Export Absen
          </button>
        </div>
        {/* Tabel Akun Siswa */}
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-r">No</th>
              <th className="py-2 px-4 border-r">Nisn</th>
              <th className="py-2 px-4 border-r">Kelas</th>
              <th className="py-2 px-4 border-r">Nama Siswa</th>
              <th className="py-2 px-4 border-r">Aksi</th>
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
                  <tr className="bg-gray-50">
                    <th className="py-2 px-8 border-r">No</th>
                    <th className="py-2 px-8 border-r">Tanggal</th>
                    <th className="py-2 px-4 border-r">Waktu</th>
                    <th className="py-2 px-4 border-r">Lokasi</th>
                    <th className="py-2 px-4 border-r">Foto Absensi</th>
                  </tr>
                </thead>
                <tbody>
                  {absensiList
                    .slice(
                      popupPagesVisited,
                      popupPagesVisited + popupUsersPerPage
                    )
                    .map((item, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="py-2 px-4 border-r text-center">
                          {index + 1}
                        </td>
                        <td className="py-2 px-4 border-r text-center">
                          {item.tanggal_absen}
                        </td>
                        <td className="py-2 px-4 border-r text-center">
                          {item.waktu_absen}
                        </td>
                        <td className="py-2 px-4 border-r text-center">
                          <button
                            href={`https://www.google.com/maps/search/?api=1&query=${item.latitude},${item.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-white bg-blue-500 hover:bg-blue-700 py-2 px-4 rounded"
                          >
                            Lihat di Maps
                          </button>
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
              <ReactPaginate
                previousLabel={"Sebelumnya"}
                nextLabel={"Berikutnya"}
                pageCount={Math.ceil(absensiList.length / popupUsersPerPage)}
                onPageChange={changePopupPage}
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

export default ControlAbsen;
