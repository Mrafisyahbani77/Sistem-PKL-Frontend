import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Api from "../Api";

const FormTambah = ({ onClose, onSubmit, formData, setFormData }) => {
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [daftarKelas, setDaftarKelas] = useState([]);

  useEffect(() => {
    const fetchDaftarKelas = async () => {
      try {
        const response = await Api.getDaftarKelas2();
        setDaftarKelas(response.data);
      } catch (error) {
        console.error("Error fetching daftar kelas:", error);
      }
    };

    fetchDaftarKelas();
  }, []);

  useEffect(() => {
    let roleId = null;

    switch (formData.role) {
      case "admin":
        roleId = 1;
        break;
      case "kaprog":
        roleId = 2;
        break;
      case "pembimbing":
        roleId = 3;
        break;
      case "siswa":
        roleId = 4;
        break;
      default:
        break;
    }

    setFormData((prevData) => ({
      ...prevData,
      role_id: roleId,
    }));
  }, [formData.role]);

  const onInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (!formData.role) {
        throw new Error("Role tidak boleh kosong.");
      }

      const response = await onSubmit(formData);
      console.log("Response from onSubmit:", response);

      if (response && response.error) {
        throw new Error(response.error); // Jika respons mengandung kesalahan, lemparkan error
      }

      // Jika tidak ada kesalahan, anggap berhasil
      setSuccessMessage("Akun berhasil ditambahkan.");

      Swal.fire({
        icon: "success",
        title: "Sukses",
        text: "Akun berhasil ditambahkan.",
      });

      setFormData((prevData) => ({
        ...prevData,
        role: "",
        name: "",
        email: "",
        password: "",
        kelas: "",
        nisn: "",
        nip: "",
        jabatan: "",
        pangkat: "",
        nomer_telpon: "",
      }));

      onClose();
    } catch (error) {
      setErrorMessage(
        error.message ||
        "Gagal menambahkan akun. Pastikan data yang dimasukkan valid."
      );

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


  const renderFormBasedOnRole = () => {
    switch (formData.role) {
      case "admin":
        return (
          <>
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
                value={formData.name || ""}
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
                value={formData.email || ""}
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
                value={formData.password || ""}
                onChange={onInputChange}
                className=" mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
          </>
        );
      case "siswa":
        return (
          <>
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
                value={formData.name || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="nisn"
                className="block text-sm font-medium text-gray-600"
              >
                NISN
              </label>
              <input
                type="number"
                id="nisn"
                name="nisn"
                value={formData.nisn || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <label className="block text-sm font-semibold mt-4 mb-2">
              Kelas:
            </label>
            <select
              className="w-full p-2 border rounded"
              value={formData.kelas || ""}
              onChange={(e) =>
                onInputChange({
                  target: { name: "kelas", value: e.target.value },
                })
              }
              name="kelas"
            >
              <option key="default" value="">
                Pilih Kelas
              </option>
              {daftarKelas.map((kelas, kelasIndex) => (
                <option key={kelasIndex} value={kelas}>
                  {kelas}
                </option>
              ))}
            </select>
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
                value={formData.email || ""}
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
                value={formData.password || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
          </>
        );
      case "pembimbing":
        return (
          <>
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
                value={formData.name || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="nip"
                className="block text-sm font-medium text-gray-600"
              >
                NIP
              </label>
              <input
                type="text"
                id="nip"
                name="nip"
                value={formData.nip || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="nip"
                className="block text-sm font-medium text-gray-600"
              >
                Jabatan
              </label>
              <input
                type="text"
                id="jabatan"
                name="jabatan"
                value={formData.jabatan || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="nip"
                className="block text-sm font-medium text-gray-600"
              >
                Pangkat
              </label>
              <input
                type="text"
                id="pangkat"
                name="pangkat"
                value={formData.pangkat || ""}
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
                value={formData.email || ""}
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
                value={formData.password || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="nomer_telpon"
                className="block text-sm font-medium text-gray-600"
              >
                Nomor Telepon
              </label>
              <input
                type="number"
                id="nomer_telpon"
                name="nomer_telpon"
                pattern="[0-9]{10,14}"
                value={formData.nomer_telpon || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
          </>
        );
      case "kaprog":
        return (
          <>
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
                value={formData.name || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="nip"
                className="block text-sm font-medium text-gray-600"
              >
                NIP
              </label>
              <input
                type="text"
                id="nip"
                name="nip"
                value={formData.nip || ""}
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
                value={formData.email || ""}
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
                value={formData.password || ""}
                onChange={onInputChange}
                className="mt-1 p-2 w-full border rounded-md"
                required
              />
            </div>
          </>
        );
      default:
        return null;
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
            value={formData.role || ""}
            onChange={onInputChange}
            className="mt-1 p-2 w-full border rounded-md"
            required
          >
            <option value="">Pilih Role</option>
            <option value="admin">Admin</option>
            <option value="kaprog">Kaprog</option>
            <option value="pembimbing">Pembimbing</option>
            <option value="siswa">Siswa</option>
          </select>
        </div>
        {renderFormBasedOnRole()}
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
