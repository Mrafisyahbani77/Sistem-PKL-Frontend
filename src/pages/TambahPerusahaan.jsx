import React, { useState } from 'react';
import Swal from 'sweetalert2';
import axios from 'axios';

const TambahPerusahaan = ({ setShowTambah }) => {
    const [namaPerusahaan, setNamaPerusahaan] = useState("");
    const [emailPerusahaan, setEmailPerusahaan] = useState("");
    const [alamatPerusahaan, setAlamatPerusahaan] = useState("");
    const [siswaDibutuhkan, setSiswaDibutuhkan] = useState("");
  
    const handleSubmit = (e) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      const data = {
        nama_perusahaan: namaPerusahaan,
        email_perusahaan: emailPerusahaan,
        alamat_perusahaan: alamatPerusahaan,
        siswa_dibutuhkan: siswaDibutuhkan,
      };
  
      axios
        .post("http://127.0.0.1:8000/api/admin/perusahaan", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          Swal.fire("Success", response.data.message, "success");
          setShowTambah(false);
        })
        .catch((error) => {
          Swal.fire("Error", error.response.data.message, "error");
        });
    };
  
    return (
      <div className="fixed z-10 inset-0 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
          </div>
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
            <form onSubmit={handleSubmit} className="p-6">
              <h2 className="text-2xl font-bold mb-4">Tambah Perusahaan</h2>
              <div>
                <label htmlFor="nama_perusahaan" className="block">Nama Perusahaan:</label>
                <input type="text" id="nama_perusahaan" value={namaPerusahaan} onChange={(e) => setNamaPerusahaan(e.target.value)} className="w-full border-gray-300 rounded-md px-4 py-2" required />
              </div>
              <div>
                <label htmlFor="email_perusahaan" className="block">Email Perusahaan:</label>
                <input type="email" id="email_perusahaan" value={emailPerusahaan} onChange={(e) => setEmailPerusahaan(e.target.value)} className="w-full border-gray-300 rounded-md px-4 py-2" required />
              </div>
              <div>
                <label htmlFor="alamat_perusahaan" className="block">Alamat Perusahaan:</label>
                <input type="text" id="alamat_perusahaan" value={alamatPerusahaan} onChange={(e) => setAlamatPerusahaan(e.target.value)} className="w-full border-gray-300 rounded-md px-4 py-2" required />
              </div>
              <div>
                <label htmlFor="siswa_dibutuhkan" className="block">Siswa Dibutuhkan:</label>
                <input type="number" id="siswa_dibutuhkan" value={siswaDibutuhkan} onChange={(e) => setSiswaDibutuhkan(e.target.value)} className="w-full border-gray-300 rounded-md px-4 py-2" required />
              </div>
              <div className="mt-4 flex justify-end">
                <button type="button" onClick={() => setShowTambah(false)} className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2">Batal</button>
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };
  
  export default TambahPerusahaan;