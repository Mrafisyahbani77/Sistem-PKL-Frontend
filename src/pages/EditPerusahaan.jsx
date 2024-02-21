import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const EditPerusahaan = ({ perusahaan, onEditPerusahaan, onCancelEdit }) => {
  const [editedPerusahaan, setEditedPerusahaan] = useState(perusahaan);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedPerusahaan({ ...editedPerusahaan, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/admin/perusahaan/${perusahaan.id}`,
        editedPerusahaan
      );
      onEditPerusahaan(response.data.perusahaan);
      Swal.fire("Sukses!", "Perusahaan berhasil diupdate.", "success");
    } catch (error) {
      console.error("Error updating perusahaan:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="nama_perusahaan"
        value={editedPerusahaan.nama_perusahaan}
        onChange={handleChange}
        placeholder="Nama Perusahaan"
        className="border border-gray-300 rounded-md px-2 py-1 mr-2"
      />
      <input
        type="email"
        name="email_perusahaan"
        value={editedPerusahaan.email_perusahaan}
        onChange={handleChange}
        placeholder="Email Perusahaan"
        className="border border-gray-300 rounded-md px-2 py-1 mr-2"
      />
      <input
        type="text"
        name="alamat_perusahaan"
        value={editedPerusahaan.alamat_perusahaan}
        onChange={handleChange}
        placeholder="Alamat Perusahaan"
        className="border border-gray-300 rounded-md px-2 py-1 mr-2"
      />
      <input
        type="number"
        name="siswa_dibutuhkan"
        value={editedPerusahaan.siswa_dibutuhkan}
        onChange={handleChange}
        placeholder="Siswa Dibutuhkan"
        className="border border-gray-300 rounded-md px-2 py-1 mr-2"
      />
      <button
        type="submit"
        className="text-xs font-bold text-white bg-blue-500 py-1 px-2 rounded-md mr-2"
      >
        Simpan
      </button>
      <button
        type="button"
        onClick={onCancelEdit}
        className="text-xs font-bold text-white bg-red-500 py-1 px-2 rounded-md"
      >
        Batal
      </button>
    </form>
  );
};

export default EditPerusahaan;
