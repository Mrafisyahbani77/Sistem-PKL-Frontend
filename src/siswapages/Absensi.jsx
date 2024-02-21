import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Siswasd from "../components/Siswasd";

const Absensi = () => {
  const [location, setLocation] = useState(null);
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const [token, setToken] = useState(null);
  const [tanggalabsen, setTanggalAbsensi] = useState("");
  const [waktuabsen, setWaktuAbsen] = useState("");
  const [absensiList, setAbsensiList] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          const formattedAddress = await getFormattedAddress(
            position.coords.latitude,
            position.coords.longitude
          );
          setAddress(formattedAddress);
        },
        (error) => {
          console.error(error.message);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  const getFormattedAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        return address;
      } else {
        return "Alamat tidak ditemukan";
      }
    } catch (error) {
      console.error(error);
      return "Gagal mendapatkan alamat";
    }
  };

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
      formData.append("waktu_absen", waktuabsen); // Menggunakan waktuabsen dari state

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
      setLoading(true);
      uploadFoto();
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
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (token) {
      fetchAbsensiList();
    }
  }, [token]);

  return (
    <div className="flex h-screen">
      <Siswasd />
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Absensi</h2>

        <button
          onClick={() => setShowPopup(!showPopup)}
          className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
        >
          {showPopup ? "Tutup Form Absen" : "Buka Form Absen"}
        </button>

        {showPopup && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="bg-white p-4 rounded shadow-lg w-1/2">
              <h3 className="text-xl font-semibold mb-4">Form Absen</h3>

              <label className="block text-sm font-semibold mb-2">
                Tanggal Absen:
              </label>
              <input
                type="date"
                value={tanggalabsen}
                onChange={(e) => setTanggalAbsensi(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />

              <label className="block text-sm font-semibold mb-2">
                Waktu Absen:
              </label>
              <input
                type="time"
                value={waktuabsen}
                onChange={(e) => setWaktuAbsen(e.target.value)}
                className="w-full p-2 border rounded mb-2"
              />

              <p>
                Lokasi Pengguna: {location?.latitude}, {location?.longitude}
              </p>
              <p>Alamat: {address}</p>

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
                  disabled={loading}
                >
                  {loading ? "Mengirim..." : "Absen"}
                </button>

                <button
                  onClick={() => {
                    window.open(
                      `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`,
                      "_blank"
                    );
                  }}
                  className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
                  disabled={!location}
                >
                  Lihat di Google Maps
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

        <h3 className="text-xl font-semibold mt-8 mb-4">Daftar Absensi:</h3>
        <table className="min-w-full bg-white shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="border border-gray-400 px-4 py-2">
                Tanggal Absen
              </th>
              <th className="border border-gray-400 px-4 py-2">Waktu</th>
              <th className="border border-gray-400 px-4 py-2">Lokasi</th>
              <th className="border border-gray-400 px-4 py-2">Foto</th>
            </tr>
          </thead>
          <tbody>
            {absensiList.map((absensi, index) => (
              <tr key={index}>
                <td className="border border-gray-400 px-4 py-2">
                  {absensi.tanggal_absen}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  {absensi.waktu_absen}
                </td>
                <td className="border border-gray-400 px-4 py-2">
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${absensi.latitude},${absensi.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {absensi.latitude}, {absensi.longitude}
                  </a>
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
      </div>
    </div>
  );
};

export default Absensi;
