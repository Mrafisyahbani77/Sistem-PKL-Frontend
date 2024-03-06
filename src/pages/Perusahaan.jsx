import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import TambahPerusahaan from "./TambahPerusahaan";
import EditPerusahaan from "./EditPerusahaan";
import ReactPaginate from "react-paginate";

const Perusahaan = () => {
  const [perusahaanList, setPerusahaanList] = useState([]);
  const [showTambah, setShowTambah] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [editId, setEditId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const perPage = 5; // Jumlah data per halaman
  const pagesVisited = pageNumber * perPage;

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get("http://127.0.0.1:8000/api/admin/perusahaan", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPerusahaanList(response.data.perusahaan);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleEdit = (id) => {
    setShowEdit(true);
    setEditId(id);
  };

  const handleDelete = (id) => {
    const token = localStorage.getItem("token");
    Swal.fire({
      title: "Hapus Perusahaan",
      text: "Anda yakin ingin menghapus perusahaan ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`http://127.0.0.1:8000/api/admin/perusahaan/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            Swal.fire({
              title: "Sukses",
              text: response.data.message,
              icon: "success",
            });
            setPerusahaanList(
              perusahaanList.filter((perusahaan) => perusahaan.id !== id)
            );
          })
          .catch((error) => {
            Swal.fire({
              title: "Error",
              text: error.response.data.message,
              icon: "error",
            });
          });
      }
    });
  };

  const pageCount = Math.ceil(perusahaanList.length / perPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex flex-col w-full ml-4">
        <h1 className="text-2xl font-bold mb-4">Daftar Perusahaan</h1>
        <button
          onClick={() => setShowTambah(true)}
          className="bg-blue-500 text-white px-3 py-2 rounded mb-4 text-sm"
        >
          Tambah Perusahaan
        </button>

        {showTambah && <TambahPerusahaan setShowTambah={setShowTambah} />}
        {showEdit && <EditPerusahaan id={editId} setShowEdit={setShowEdit} />}
        <table className="bg-white table-auto w-full text-center shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-200">
              <th className="px-4 py-2">Nama Perusahaan</th>
              <th className="px-4 py-2">Email Perusahaan</th>
              <th className="px-4 py-2">Alamat Perusahaan</th>
              <th className="px-4 py-2">Siswa Dibutuhkan</th>
              <th className="px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {perusahaanList
              .slice(pagesVisited, pagesVisited + perPage)
              .map((perusahaan) => (
                <tr key={perusahaan.id}>
                  <td className="border px-4 py-2">
                    {perusahaan.nama_perusahaan}
                  </td>
                  <td className="border px-4 py-2">
                    {perusahaan.email_perusahaan}
                  </td>
                  <td className="border px-4 py-2">
                    {perusahaan.alamat_perusahaan}
                  </td>
                  <td className="border px-4 py-2">
                    {perusahaan.siswa_dibutuhkan}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      onClick={() => handleEdit(perusahaan.id)}
                      className="bg-green-500 text-white px-2 py-1 rounded-md mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(perusahaan.id)}
                      className="bg-red-500 text-white px-2 py-1 rounded-md"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <ReactPaginate
          previousLabel={"Sebelumnya"}
          nextLabel={"Berikutnya"}
          pageCount={pageCount}
          onPageChange={changePage}
          containerClassName={"pagination flex gap-2 mt-4"}
          previousLinkClassName={
            "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
          }
          nextLinkClassName={
            "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
          }
          disabledClassName={"pagination__link--disabled"}
          activeClassName={
            "pagination__link--active bg-gray-500 text-white border-blue-500"
          }
        />
      </div>
    </div>
  );
};

export default Perusahaan;
