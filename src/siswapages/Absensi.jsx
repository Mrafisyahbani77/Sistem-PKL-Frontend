import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert
import Siswasd from '../components/Siswasd';
import Cookies from 'js-cookie';

const Absensi = () => {
  // State declarations
  const [location, setLocation] = useState(null);
  const [foto, setFoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const [token, setToken] = useState(null);
  const [tanggalabsen, setTanggalAbsensi] = useState('');

  // Effect to retrieve token from local storage
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Function to get formatted address
  const getFormattedAddress = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
      );

      if (response.data.results.length > 0) {
        const address = response.data.results[0].formatted_address;
        return address;
      } else {
        return 'Alamat tidak ditemukan';
      }
    } catch (error) {
      console.error(error);
      return 'Gagal mendapatkan alamat';
    }
  };

  // Effect to get user location
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
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  // Function to handle photo change
  const handleFotoChange = (e) => {
    setFoto(e.target.files[0]);
  };

  // Function to upload photo
  const uploadFoto = async () => {
    try {
      const authToken = Cookies.get('token'); // Ambil token dari cookie
      const formData = new FormData();
      formData.append('latitude', location.latitude);
      formData.append('longitude', location.longitude);
      formData.append('foto', foto);
      formData.append('tanggal_absen', tanggalabsen);

      await axios.post('http://127.0.0.1:8000/api/siswa/absen', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });

      // Tampilkan SweetAlert jika absensi berhasil
      Swal.fire({
        icon: 'success',
        title: 'Absensi Berhasil',
        text: 'Absensi Anda telah berhasil disimpan.',
      });
    } catch (error) {
      console.error(error);
      // Tampilkan SweetAlert jika terjadi kesalahan
      Swal.fire({
        icon: 'error',
        title: 'Gagal Melakukan Absensi',
        text: 'Terjadi kesalahan saat melakukan absensi. Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  // Function to handle absensi
  const handleAbsen = () => {
    if (location && foto) {
      setLoading(true);
      uploadFoto();
    } else {
      setError('Lokasi atau foto belum diatur.');
    }
  };

  return (
    <div className="flex">
      {/* Sidebar Siswa */}
      <Siswasd />

      {/* Halaman Absensi */}
      <div className="w-3/4 p-4">
        <h2 className="text-2xl font-bold mb-4">Absensi</h2>

        {location ? (
          <div>
            <p>Lokasi Pengguna: {location.latitude}, {location.longitude}</p>
            <p>Alamat: {address}</p>
          </div>
        ) : (
          <p>Mendapatkan lokasi...</p>
        )}

        {/* Input for date */}
        <label className="block text-sm font-semibold mb-2">Tanggal Absensi:</label>
        <input
          type="date"
          value={tanggalabsen}
          onChange={(e) => setTanggalAbsensi(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        {/* Input for photo */}
        <label className="block text-sm font-semibold mb-2">Foto:</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFotoChange}
          className="w-full p-2 border rounded"
        />

        {/* Error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Buttons */}
        <div className="mt-6">
          <button
            onClick={handleAbsen}
            className={`bg-green-500 text-white py-2 px-4 rounded mr-2 ${
              loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-600'
            }`}
            disabled={loading}
          >
            {loading ? 'Mengirim...' : 'Absen'}
          </button>

          <button
            onClick={() => {
              alert(`Lokasi: ${location.latitude}, ${location.longitude}\nAlamat: ${address}`);
            }}
            className="bg-blue-500 text-white py-2 px-4 rounded mr-2 hover:bg-blue-600"
            disabled={!location}
          >
            Tampilkan Lokasi
          </button>
        </div>
      </div>
    </div>
  );
};

export default Absensi;
