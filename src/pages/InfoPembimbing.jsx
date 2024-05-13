import React, { useState, useEffect } from "react";
import axios from "axios";
import { Toaster, toast } from "react-hot-toast";
import Sidebar from "../components/Sidebar";
import ReactPaginate from "react-paginate";
import DetailAssign from "./DetailAssign";

const InfoPembimbing = () => {
  const [pembimbings, setPembimbings] = useState([]);
  const [selectedPembimbing, setSelectedPembimbing] = useState(null);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedCompanyId, setSelectedCompanyId] = useState(null); // State baru untuk menyimpan ID perusahaan yang dipilih
  const usersPerPage = 6;
  const pagesVisited = pageNumber * usersPerPage;
  const [showDetailAssign, setShowDetailAssign] = useState(false); // State baru untuk mengontrol tampilan pop up
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://127.0.0.1:8000/api/admin/daftar", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) =>
        setPembimbings(
          response.data.reduce((acc, curr) => {
            setLoading(false);
            if (!acc.find((item) => item.user_id === curr.user_id)) {
              acc.push(curr);
            }
            return acc;
          }, [])
        )
      )
      .catch((error) => setError("Error fetching pembimbings:" + error));

    axios
      .get("http://127.0.0.1:8000/api/admin/daftar-pengajuan", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) =>
        setCompanies(
          response.data.filter(
            (company) =>
              company.nama_perusahaan && company.nama_perusahaan.trim() !== ""
          )
        )
      )
      .catch((error) => setError("Error fetching companies:" + error));
  }, []);

  const handleDetail = (pembimbingId) => {
    setSelectedPembimbing(pembimbingId);
    setShowDetailAssign(true); // Tampilkan pop up saat button di klik
  };

  const handleDe = (pembimbingId) => {
    setSelectedPembimbing(pembimbingId);
    setShowPopup(true); // Tampilkan pop up saat button di klik
  };

  const onClose = () => {
    // Menutup pop-up
    setShowPopup(false);
  };

  const handleAssign = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found. Please login again.");
      return;
    }

    axios
      .post(
        "http://127.0.0.1:8000/api/admin/assign",
        {
          pembimbing_id: selectedPembimbing,
          group_id: selectedCompanyId, // Menggunakan selectedCompanyId yang telah dipilih
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(response.data.message);
        setSelectedPembimbing(null);
        setSelectedCompanyId(null); // Reset selectedCompanyId setelah sukses assign
        setShowPopup(false); // Menutup pop-up setelah assign
      })
      .catch((error) => {
        console.error("Sudah Di bimbing 2 Pembimbing", error);
        toast.error("Failed to assign pembimbing");
      });
  };

  const pageCount = Math.ceil(pembimbings.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="h-screen flex">
      <Sidebar />
      <div className="flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">Daftar Pembimbing</h2>
        {error && <p className="text-red-500">{error}</p>}
        <table className="bg-white text-center  w-full shadow-md rounded-md overflow-hidden border-gray-300">
          <thead className="bg-gray-200">
            <tr className="bg-gray-100">
              <th className="px-4 py-2 border ">No</th>
              <th className="px-4 py-2 border ">Nama</th>
              <th className="px-4 py-2 border ">Email</th>
              <th className="px-4 py-2 border ">Jabatan</th>
              <th className="px-4 py-2 border ">Pangkat</th>
              <th className="px-4 py-2 border ">Nomer Telpon</th>
              <th className="px-4 py-2 border ">Perusahaan Yang dibimbing</th>
              <th className="px-4 py-2 border ">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">
                  Loading...
                </td>
              </tr>
            ) : pembimbings.length > 0 ? (
              pembimbings.map((pembimbing, index) => (
                <tr key={pembimbing.user_id}>
                  <td className="px-4 py-2 border ">
                    {index + 1 + pagesVisited}
                  </td>
                  <td className="px-4 py-2 border ">{pembimbing.name}</td>
                  <td className="px-4 py-2 border ">{pembimbing.email}</td>
                  <td className="px-4 py-2 border ">{pembimbing.jabatan}</td>
                  <td className="px-4 py-2 border ">{pembimbing.pangkat}</td>
                  <td className="px-4 py-2 border ">
                    {pembimbing.nomer_telpon}
                  </td>
                  <td className="px-4 py-2 border ">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDetail(pembimbing.user_id)}
                    >
                      Detail Assign
                    </button>
                  </td>
                  <td className="px-4 py-2 border ">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                      onClick={() => handleDe(pembimbing.user_id)}
                    >
                      Assign Pembimbing
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center">
                  Tidak ada data pembimbing
                </td>
              </tr>
            )}
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

        {showPopup && selectedPembimbing && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-900 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-8 rounded shadow">
              <button
                className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-4"
                onClick={onClose}
              >
                Tutup
              </button>
              <h3 className="text-xl font-bold mt-4">Assign Pembimbing</h3>
              <select
                className="border rounded px-4 py-2 mt-2"
                onChange={(e) => setSelectedCompanyId(e.target.value)}
              >
                <option value="">Pilih Grup</option>
                {companies.map((company, index) => (
                  <option key={index} value={company.group_id}>
                    {company.nama_perusahaan}
                  </option>
                ))}
              </select>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                onClick={handleAssign}
              >
                Assign
              </button>
            </div>
          </div>
        )}
      </div>
      {showDetailAssign && (
        <DetailAssign
          pembimbingId={selectedPembimbing}
          companies={companies}
          onClose={() => setShowDetailAssign(false)}
          onAssign={handleAssign}
        />
      )}

      <Toaster />
    </div>
  );
};

export default InfoPembimbing;
