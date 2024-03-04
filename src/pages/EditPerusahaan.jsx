import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";

const EditPerusahaan = ({ id, setShowEdit }) => {
  const [formData, setFormData] = useState({
    nama_perusahaan: "",
    email_perusahaan: "",
    alamat_perusahaan: "",
    siswa_dibutuhkan: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(`http://127.0.0.1:8000/api/admin/perusahaan/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const perusahaan = response.data.perusahaan;
        setFormData({
          nama_perusahaan: perusahaan.nama_perusahaan,
          email_perusahaan: perusahaan.email_perusahaan,
          alamat_perusahaan: perusahaan.alamat_perusahaan,
          siswa_dibutuhkan: perusahaan.siswa_dibutuhkan.toString(),
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    axios
      .put(`http://127.0.0.1:8000/api/admin/perusahaan/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        Swal.fire("Success", response.data.message, "success");
        setShowEdit(false);
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
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={handleSubmit} className="p-6">
            <h2 className="text-2xl font-bold mb-4">Edit Perusahaan</h2>
            <div>
              <label htmlFor="nama_perusahaan" className="block">
                Nama Perusahaan:
              </label>
              <input
                type="text"
                id="nama_perusahaan"
                name="nama_perusahaan"
                value={formData.nama_perusahaan}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="email_perusahaan" className="block">
                Email Perusahaan:
              </label>
              <input
                type="email"
                id="email_perusahaan"
                name="email_perusahaan"
                value={formData.email_perusahaan}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="alamat_perusahaan" className="block">
                Alamat Perusahaan:
              </label>
              <input
                type="text"
                id="alamat_perusahaan"
                name="alamat_perusahaan"
                value={formData.alamat_perusahaan}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>
            <div>
              <label htmlFor="siswa_dibutuhkan" className="block">
                Siswa Dibutuhkan:
              </label>
              <input
                type="number"
                id="siswa_dibutuhkan"
                name="siswa_dibutuhkan"
                value={formData.siswa_dibutuhkan}
                onChange={handleInputChange}
                className="w-full border-gray-300 rounded-md px-4 py-2"
                required
              />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md mr-2"
              >
                Batal
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Simpan
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPerusahaan;
