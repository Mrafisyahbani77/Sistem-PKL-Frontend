import React, { useState } from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const Edit = ({ formData, onInputChange, onSubmit, onClose, roleCategory }) => {
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
      await onSubmit();

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

  const renderTable = () => {
    switch (roleCategory) {
      case "admin":
        return (
          <>
            <div>
              <label htmlFor="name">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={onInputChange}
                required
              />
            </div>
            {/* Hide password field for admin */}
            <div style={{ display: 'none' }}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ''}
                onChange={onInputChange}
                required
              />
            </div>
          </>
        );
      default:
        return (
          <>
            <div>
              <label htmlFor="name">Nama</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email || ''}
                onChange={onInputChange}
                required
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password || ''}
                onChange={onInputChange}
                required
              />
            </div>
            {roleCategory !== "siswa" && (
              <div>
                <label htmlFor="nip">NIP</label>
                <input
                  type="text"
                  id="nip"
                  name="nip"
                  value={formData.nip || ''}
                  onChange={onInputChange}
                  required
                />
              </div>
            )}
            {roleCategory === "siswa" && (
              <>
                <div>
                  <label htmlFor="nisn">NISN</label>
                  <input
                    type="text"
                    id="nisn"
                    name="nisn"
                    value={formData.nisn || ''}
                    onChange={onInputChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="kelas">Kelas</label>
                  <input
                    type="text"
                    id="kelas"
                    name="kelas"
                    value={formData.kelas || ''}
                    onChange={onInputChange}
                    required
                  />
                </div>
              </>
            )}
            {roleCategory === "pembimbing" && (
              <div>
                <label htmlFor="nomor_telepon">Nomor Telepon</label>
                <input
                  type="text"
                  id="nomor_telepon"
                  name="nomor_telepon"
                  value={formData.nomor_telepon || ''}
                  onChange={onInputChange}
                  required
                />
              </div>
            )}
          </>
        );
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleFormSubmit}>
      {renderTable()}
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
