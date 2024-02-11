import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Edit = ({ formData, onInputChange, onSubmit, onClose }) => {
  const [submitting, setSubmitting] = useState(false);

  const MySwal = withReactContent(Swal);

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitting(true);

      if (!formData.role) {
        throw new Error("Role tidak boleh kosong.");
      }

      // Perform form submission with role and role_id
      await onSubmit(formData.role, formData.role_id);

      // Handle success
      MySwal.fire({
        title: "Berhasil",
        text: "Akun berhasil diperbarui!",
        icon: "success",
      }).then(() => onClose());
    } catch (error) {
      // Handle error
      MySwal.fire({
        title: "Gagal",
        text:
          error.message ||
          "Gagal memperbarui akun. Pastikan data yang dimasukkan valid.",
        icon: "error",
      });
    } finally {
      // Reset submitting state
      setSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700"
        >
          Nama
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={onInputChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={onInputChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        />
      </div>

      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium text-gray-700"
        >
          Peran
        </label>
        {/* Ubah input role menjadi dropdown */}
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={onInputChange}
          className="mt-1 p-2 border rounded-md w-full"
          required
        >
          <option value="">Pilih peran...</option>
          <option value="admin">Admin</option>
          <option value="kaprog">Kaprog</option>
          <option value="siswa">Siswa</option>
          <option value="pembimbing">Pembimbing</option>
          
        </select>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          className="px-4 py-2 mr-2 text-sm font-bold text-white bg-gray-500 rounded-md"
          onClick={onClose}
        >
          Batal
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-bold text-white bg-blue-500 rounded-md"
          disabled={submitting}
        >
          Simpan
        </button>
      </div>
    </form>
  );
};

export default Edit;
