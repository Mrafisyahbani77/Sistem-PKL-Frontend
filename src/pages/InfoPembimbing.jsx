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
  const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
  const [error, setError] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 6;
  const [showDetailAssign, setShowDetailAssign] = useState(false); // State baru untuk mengontrol tampilan pop up

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios
      .get("http://localhost:8000/api/admin/daftar", {
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
      .get("http://localhost:8000/api/admin/daftar-pengajuan", {
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

  const handleClosePopup = () => {
    setSelectedPembimbing(null);
    setShowDetailAssign(false); // Sembunyikan pop up saat tombol tutup di klik
  };

  const handleAssign = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Token not found. Please login again.");
      return;
    }

    selectedCompanyIds.forEach((companyId) => {
      axios
        .post(
          "http://localhost:8000/api/admin/assign",
          {
            pembimbing_id: selectedPembimbing,
            group_id: companyId,
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
        })
        .catch((error) => {
          console.error("Sudah Di bimbing 2 Pembimbing", error);
          toast.error("Failed to assign pembimbing");
        });
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
            ) : (
              pembimbings.map((pembimbing, index) => (
                <tr
                  key={pembimbing.user_id}
                >
                  <td className="px-4 py-2 border ">{index + 1}</td>
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
                      onClick={() => handleDetail(pembimbing.user_id)}
                    >
                      Assign Pembimbing
                    </button>
                  </td>
                </tr>
              ))
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
