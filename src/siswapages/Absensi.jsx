import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Siswasd from "../components/Siswasd";
import ReactPaginate from "react-paginate";

const Absensi = () => {
  const [location, setLocation] = useState(null);
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  const [tanggalabsen, setTanggalAbsensi] = useState("");
  const [waktuabsen, setWaktuAbsen] = useState("");
  const [absensiList, setAbsensiList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [alreadyAbsenToday, setAlreadyAbsenToday] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);

  const absensiPerPage = 5;
  const pagesVisited = pageNumber * absensiPerPage;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
  };

  const uploadFoto = async () => {
    try {
      const formData = new FormData();
      formData.append("latitude", location.latitude);
      formData.append("longitude", location.longitude);
      formData.append("foto", foto);
      formData.append("tanggal_absen", tanggalabsen);
      formData.append("waktu_absen", waktuabsen);

      await axios.post("http://127.0.0.1:8000/api/siswa/absen", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      Swal.fire({
        icon: "success",
        title: "Absensi Berhasil",
        text: "Absensi Anda telah berhasil disimpan.",
      });

      fetchAbsensiList();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Gagal Melakukan Absensi",
        text: "Terjadi kesalahan saat melakukan absensi. Silakan coba lagi.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAbsen = () => {
    if (location && foto) {
      if (alreadyAbsenToday) {
        Swal.fire({
          icon: "warning",
          title: "Anda Sudah Absen Hari Ini",
          text: "Anda telah melakukan absensi hari ini. Silakan coba lagi besok.",
        });
      } else {
        setLoading(true);
        uploadFoto();
      }
    } else {
      setError("Lokasi atau foto belum diatur.");
    }
  };

  const fetchAbsensiList = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/siswa/absensi-list",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setAbsensiList(response.data);
      // Check if user has already absen today
      const today = new Date().toISOString().split("T")[0];
      const hasAbsenToday = response.data.some(
        (absensi) => absensi.tanggal_absen === today
      );
      setAlreadyAbsenToday(hasAbsenToday);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token || alreadyAbsenToday) {
      fetchAbsensiList();
    }
  }, [token, alreadyAbsenToday]);

  const pageCount = Math.ceil(absensiList.length / absensiPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex h-screen">
      <Siswasd />
      <div className="w-3/4 p-4">
        <button
          onClick={() => setShowPopup(!showPopup)}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
        >
          {showPopup ? "Tutup Form" : "Buka Form Absen"}
        </button>

        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/2">
              <h3 className="text-xl font-semibold mb-4">Form Absen</h3>
              <p>Lihat lokasi anda:</p>
              <button
                onClick={() =>
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${location?.latitude},${location?.longitude}`,
                    "_blank"
                  )
                }
                className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
              >
                Lihat Lokasi
              </button>

              <label className="block text-sm font-semibold mb-2">Foto:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFotoChange}
                className="w-full p-2 border rounded"
              />

              {error && <p className="text-red-500">{error}</p>}

              <div className="mt-6">
                <button
                  onClick={handleAbsen}
                  className={`bg-green-500 text-white py-2 px-4 rounded mr-2 ${
                    loading
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-green-600"
                  }`}
                  disabled={loading || alreadyAbsenToday}
                >
                  {loading ? "Mengirim..." : "Absen"}
                </button>

                <button
                  onClick={() => setShowPopup(false)}
                  className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}

        <h2 className="text-2xl font-bold text-center mb-4">Absensi</h2>
        <table className="min-w-full bg-white text-center shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className=" bg-gray-200 px-4 py-2">No.</th>
              <th className=" bg-gray-200 px-4 py-2">Tanggal Absen</th>
              <th className=" bg-gray-200 px-4 py-2">Waktu</th>
              <th className=" bg-gray-200 px-4 py-2">Lokasi</th>
              <th className=" bg-gray-200 px-4 py-2">Foto</th>
            </tr>
          </thead>
          <tbody>
            {absensiList
              .slice(pagesVisited, pagesVisited + absensiPerPage)
              .map((absensi, index) => (
                <tr key={index}>
                  <td className="border border-gray-400 px-4 py-2">
                    {index + 1  + pagesVisited}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {absensi.tanggal_absen}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    {absensi.waktu_absen}
                  </td>
                  <td className="border border-gray-400 px-4 py-2">
                    <button
                      onClick={() =>
                        window.open(
                          `https://www.google.com/maps/search/?api=1&query=${absensi.latitude},${absensi.longitude}`,
                          "_blank"
                        )
                      }
                      className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600"
                    >
                      Lihat Lokasi
                    </button>
                  </td>

                  <td className="border border-gray-400 px-4 py-2">
                    {absensi.foto ? (
                      <img
                        src={`http://127.0.0.1:8000/storage/${absensi.foto}`}
                        alt="Foto Absensi"
                        className="w-24 h-24"
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
          pageCount={Math.ceil(absensiList.length / absensiPerPage)}
          onPageChange={({ selected }) => setPageNumber(selected)}
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
    </div>
  );
};

export default Absensi;
