import React, { useState } from "react";
import Swal from "sweetalert2";

const FormTambah = ({ onClose, onSubmit, formData, onInputChange }) => {
  document.title = "AdminDashboard";

  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.role) {
        throw new Error("Role tidak boleh kosong.");
      }

      await onSubmit();
      setSuccessMessage("Akun berhasil ditambahkan.");

      // Reset form data
      onInputChange({ target: { name: "role", value: "" } });
      onInputChange({ target: { name: "name", value: "" } });
      onInputChange({ target: { name: "email", value: "" } });
      onInputChange({ target: { name: "password", value: "" } });

      // Tampilkan notifikasi SweetAlert2 berhasil
      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Akun berhasil ditambahkan.",
      });

      onClose();
    } catch (error) {
      setErrorMessage(
        error.message ||
          "Gagal menambahkan akun. Pastikan data yang dimasukkan valid."
      );

      // Tampilkan notifikasi SweetAlert2 gagal
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text:
          error.message ||
          "Gagal menambahkan akun. Pastikan data yang dimasukkan valid.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-end">
        <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>
      <form onSubmit={handleFormSubmit}>
        {successMessage && (
          <div className="text-green-600 mb-4">{successMessage}</div>
        )}
        {errorMessage && (
          <div className="text-red-600 mb-4">{errorMessage}</div>
        )}
        <div className="mb-4">
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-600"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={onInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          >
            <option value="">Pilih Role</option>
            <option value="admin">Admin</option>
            <option value="kaprog">Kaprog</option>
            <option value="pembimbing">Pembimbing</option>
            <option value="siswa">Siswa</option>

            {/* Tambahkan opsi role lainnya sesuai kebutuhan */}
          </select>
        </div>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-600"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={onInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={onInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={onInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          />
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-md"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FormTambah;
