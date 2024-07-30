import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Api from "../Api";
import { format } from "date-fns";
import Siswasd from "../components/Siswasd";
import ReactPaginate from "react-paginate";

//icon
import { LuBook } from "react-icons/lu";

const JurnalSiswa = () => {
  const [kegiatan, setKegiatan] = useState("");
  const [status, setStatus] = useState("proses");
  const [waktuMulai, setWaktuMulai] = useState("");
  const [tanggalMulai, setTanggalMulai] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [waktuSelesai, setWaktuSelesai] = useState("");
  const [tanggalSelesai, setTanggalSelesai] = useState("");
  const [journals, setJournals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [postsPerPage] = useState(5);
  const pagesVisited = currentPage * postsPerPage;

  const toggleForm = () => {
    setShowForm(!showForm);
    setEditingId(null); // Reset editingId when toggling form
    setKegiatan("");
    setStatus("proses");
    setWaktuMulai("");
    setTanggalMulai(format(new Date(), "yyyy-MM-dd"));
    setWaktuSelesai("");
    setTanggalSelesai("");
  };

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const response = await Api.get("/api/siswa/jurnal");
      setJournals(response.data);
    } catch (error) {
      console.error(
        "Error fetching journal entries:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const journalData = {
        kegiatan,
        status,
        waktu_mulai: waktuMulai,
        tanggal_mulai: tanggalMulai,
        waktu_selesai: waktuSelesai,
        tanggal_selesai: tanggalSelesai,
      };
      if (editingId) {
        await Api.put(`/api/siswa/jurnal/${editingId}`, journalData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Jurnal berhasil diubah!",
        });
      } else {
        await Api.post("/api/siswa/jurnal", journalData);
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Jurnal berhasil disubmit!",
        });
      }

      fetchJournals();
      toggleForm(); // Close form after submit
    } catch (error) {
      console.error(
        "Error submitting journal entry:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal submit jurnal. Silakan coba lagi.",
      });
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await Api.get(`/api/siswa/jurnal/${id}`);
      const journalData = response.data;

      setKegiatan(journalData.kegiatan);
      setStatus(journalData.status);
      setWaktuMulai(journalData.waktu_mulai);
      setTanggalMulai(journalData.tanggal_mulai);
      setWaktuSelesai(journalData.waktu_selesai);
      setTanggalSelesai(journalData.tanggal_selesai);
      setEditingId(id);
      setShowForm(true); // Show form for editing
    } catch (error) {
      console.error(
        "Error fetching journal entry for edit:",
        error.response ? error.response.data : error.message
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await Api.delete(`/api/siswa/jurnal/${id}`);
      fetchJournals();
      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Jurnal berhasil dihapus!",
      });
    } catch (error) {
      console.error(
        "Error deleting journal entry:",
        error.response ? error.response.data : error.message
      );
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Gagal menghapus jurnal. Silakan coba lagi.",
      });
    }
  };

  const formatTanggal = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const indexOfLastPost = (currentPage + 1) * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentJournals = journals.slice(indexOfFirstPost, indexOfLastPost);

  const pageCount = Math.ceil(journals.length / postsPerPage);

  const changePage = ({ selected }) => {
    setCurrentPage(selected);
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <Siswasd />
      <div className="container mx-auto p-4">
        <div className="container mx-auto p-4 flex items-center justify-center">
          <LuBook className="text-2xl mt-5 mr-2" />
          <h2 className="text-2xl font-semibold mt-8 mb-4">Jurnal Siswa</h2>
        </div>

        <button
          onClick={toggleForm}
          className="bg-blue-400 text-white py-2 px-4 rounded-md hover:bg-blue-600 mb-4"
        >
          Tambah Jurnal
        </button>

        {showForm && (
          <div className="fixed inset-0 overflow-y-auto z-[9999]">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              <div className="fixed inset-0 transition-opacity">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
              &#8203;
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-md sm:p-6">
                <div className="sm:flex sm:items-start">
                  <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Kegiatan
                      </label>
                      <input
                        type="text"
                        value={kegiatan}
                        onChange={(e) => setKegiatan(e.target.value)}
                        className="p-2 border rounded-md w-full"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-bold mb-2">
                        Status
                      </label>
                      <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="p-2 border rounded-md w-full"
                        required
                      >
                        <option value="proses">Proses</option>
                        <option value="selesai">Selesai</option>
                      </select>
                    </div>
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={toggleForm}
                        className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 mr-2"
                      >
                        Kembali
                      </button>
                      <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                      >
                        {editingId ? "Simpan Perubahan" : "Tambah"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <br></br>
          <table
            className="min-w-full bg-white shadow-md rounded-md border border-gray-300"
            style={{ tableLayout: "fixed", borderCollapse: "collapse" }}
          >
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">No</th>
                <th className="py-2 px-4 border">Kegiatan</th>
                <th className="py-2 px-4 border">Status</th>
                <th className="py-2 px-4 border">Waktu Mulai</th>
                <th className="py-2 px-4 border">Tanggal Mulai</th>
                <th className="py-2 px-4 border">Waktu Selesai</th>
                <th className="py-2 px-4">Tanggal Selesai</th>
                <th className="py-2 px-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-center">
              {currentJournals.map((journal, index) => (
                <tr key={journal.id} className="">
                  <td
                    className="py-2 px-4 border"
                    style={{ wordBreak: "break-word", padding: "8px" }}
                  >
                    {index + 1 + pagesVisited}
                  </td>
                  <td
                    className="py-2 px-4 max-w-[100px] overflow-x-auto whitespace-nowrap border"
                    style={{ wordBreak: "break-word", padding: "8px" }}
                  >
                    {journal.kegiatan}
                  </td>
                  <td className="py-2 px-4 border relative ">
                    <span
                      className={`py-1 px-4 border relative rounded-full ${
                        journal.status === "selesai"
                          ? "text-black text-sm bg-green-300"
                          : "text-black text-sm bg-blue-300"
                      }`}
                    >
                      {journal.status === "selesai" ? "Selesai" : "Proses"}
                      <span
                        className={`absolute top-0 right-0 h-2 w-2 rounded-full ${
                          journal.status === "selesai"
                            ? "bg-green-600"
                            : "bg-blue-600"       
                        }`}
                      ></span>
                    </span>
                  </td>
                  <td className="py-2 px-4 border" style={{ padding: "8px" }}>
                    {journal.waktu_mulai}
                  </td>
                  <td className="py-2 px-4 border" style={{ padding: "8px" }}>
                    {formatTanggal(journal.tanggal_mulai)}
                  </td>
                  <td className="py-2 px-4 border" style={{ padding: "8px" }}>
                    {journal.waktu_selesai}
                  </td>
                  <td className="py-2 px-4 border" style={{ padding: "8px" }}>
                    {journal.tanggal_selesai &&
                      formatTanggal(journal.tanggal_selesai)}
                  </td>

                  <td className="py-2 px-4" style={{ padding: "8px" }}>
                    <button
                      onClick={() => handleEdit(journal.id)}
                      className="bg-blue-500 text-white py-1 px-2 rounded-md hover:bg-blue-600 mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(journal.id)}
                      className="bg-red-500 text-white py-1 px-2 rounded-md hover:bg-red-600"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="justify-center mt-4">
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
    </div>
  );
};

export default JurnalSiswa;