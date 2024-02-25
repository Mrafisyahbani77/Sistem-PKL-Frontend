import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TambahPerusahaan from "./TambahPerusahaan";
import EditPerusahaan from "./EditPerusahaan";
import Sidebar from "../components/Sidebar";

const Perusahaan = () => {
  const [perusahaanList, setPerusahaanList] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingPerusahaanId, setEditingPerusahaanId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/api/admin/perusahaan"
      );
      setPerusahaanList(response.data.perusahaan);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleTambahPerusahaan = async (perusahaan) => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/admin/perusahaan",
        perusahaan
      );
      setPerusahaanList([...perusahaanList, response.data.perusahaan]);
      setShowAddForm(false);
      Swal.fire("Sukses!", "Perusahaan berhasil ditambahkan.", "success");
    } catch (error) {
      console.error("Error adding perusahaan:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/admin/perusahaan/${id}`);
      setPerusahaanList(
        perusahaanList.filter((perusahaan) => perusahaan.id !== id)
      );
      Swal.fire("Sukses!", "Perusahaan berhasil dihapus.", "success");
    } catch (error) {
      console.error("Error deleting perusahaan:", error);
      Swal.fire("Error!", "Gagal menghapus perusahaan.", "error");
    }
  };

  const handleEdit = (id) => {
    setEditingPerusahaanId(id);
  };

  const handleCancelEdit = () => {
    setEditingPerusahaanId(null);
  };

  const handleUpdatePerusahaan = (updatedPerusahaan) => {
    setPerusahaanList(
      perusahaanList.map((perusahaan) =>
        perusahaan.id === updatedPerusahaan.id ? updatedPerusahaan : perusahaan
      )
    );
    setEditingPerusahaanId(null);
  };

  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="lg:flex-1 mx-auto p-6">
        <h2 className="text-2xl font-bold mb-4">Daftar Perusahaan</h2>
        <button
          className="text-xs font-bold text-white bg-blue-500 py-1 px-2 rounded-md mb-4"
          onClick={() => setShowAddForm(true)}
        >
          Tambah Perusahaan
        </button>
        {showAddForm && (
          <div className="fixed h-full bg-gray-300 flex items-center justify-center">
            <TambahPerusahaan onTambahPerusahaan={handleTambahPerusahaan} onCancel={() => setShowAddForm(false)} />
          </div>
        )}
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="py-2 px-4 border-r">Nama Perusahaan</th>
              <th className="py-2 px-4 border-r">Email Perusahaan</th>
              <th className="py-2 px-4 border-r">Alamat Perusahaan</th>
              <th className="py-2 px-4 border-r">Siswa Dibutuhkan</th>
              <th className="py-2 px-4 border-r">Aksi</th>
            </tr>
          </thead>
          <tbody className="py-2 px-4 border-b">
            {perusahaanList.map((perusahaan) => (
              <tr key={perusahaan.id}>
                <td className="py-2 px-4 border-r text-center">
                  {perusahaan.nama_perusahaan}
                </td>
                <td className="py-2 px-4 border-r text-center">
                  {perusahaan.email_perusahaan}
                </td>
                <td className="py-2 px-4 border-r text-center">
                  {perusahaan.alamat_perusahaan}
                </td>
                <td className="py-2 px-4 border-r text-center">
                  {perusahaan.siswa_dibutuhkan}
                </td>
                <td className="py-2 px-4 border-r text-center">
                  {editingPerusahaanId === perusahaan.id ? (
                    <EditPerusahaan
                      perusahaan={perusahaan}
                      onEditPerusahaan={handleUpdatePerusahaan}
                      onCancelEdit={handleCancelEdit}
                    />
                  ) : (
                    <>
                      <button className="text-xs mr-2" onClick={() => handleEdit(perusahaan.id)}>
                        Edit
                      </button>
                      <button className="text-xs" onClick={() => handleDelete(perusahaan.id)}>
                        Hapus
                      </button>
                    </>
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

export default Perusahaan;
