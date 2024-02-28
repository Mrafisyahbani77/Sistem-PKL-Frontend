import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import ReactPaginate from "react-paginate";
import PdfForm from "./PdfForm";

const DataPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [showPdfForm, setShowPdfForm] = useState(false);
  const [pdfFormData, setPdfFormData] = useState(null); // State untuk menyimpan data formulir tambahan
  const [selectedGroupId, setSelectedGroupId] = useState(null); // State untuk menyimpan group_id terpilih
  

  const itemsPerPage = 5;
  const pagesVisited = pageNumber * itemsPerPage;

  const pageCount = Math.ceil(dataPengajuan.length / itemsPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  const handleCloseDetail = () => {
    setSelectedPengajuan(null);
    setSelectedStatus("");
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admin/pengajuan/all`)
      .then((response) => {
        setDataPengajuan(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching pengajuan data:", error);
      });
  }, []);

  const handleStatusUpdate = async () => {
    try {
      if (!selectedPengajuan) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "No selected pengajuan.",
        });
        return;
      }

      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      await Promise.all(
        selectedPengajuan.map(async (pengajuan) => {
          try {
            await axios.put(
              `http://localhost:8000/api/admin/update-status/${pengajuan.id}`,
              { status: selectedStatus },
              config
            );

            // Update the status in the local data
            const updatedDataPengajuan = dataPengajuan.map((p) =>
              p.id === pengajuan.id ? { ...p, status: selectedStatus } : p
            );
            setDataPengajuan(updatedDataPengajuan);
          } catch (error) {
            console.error("Error updating status:", error);
            Swal.fire({
              icon: "error",
              title: "Error",
              text: "Failed to update status for some pengajuan. Please try again.",
            });
          }
        })
      );

      Swal.fire({
        icon: "success",
        title: "Status Updated Successfully!",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    }
  };

  const handleDetailClick = async (pengajuan) => {
    try {
      const token = localStorage.getItem("token");
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `http://localhost:8000/api/admin/detail-pengajuan/${pengajuan.group_id}`,
        config
      );
      const detailPengajuan = response.data;

      setSelectedPengajuan(detailPengajuan);
      setSelectedGroupId(pengajuan.group_id); // Set selectedGroupId
    } catch (error) {
      console.error("Error fetching detail pengajuan:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch detail pengajuan. Please try again.",
      });
    }
  };

  const handleGeneratePDF = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is empty or undefined");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      setShowPdfForm(true);
      setPdfFormData({ group_id: selectedGroupId }); // Set pdfFormData with group_id
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate PDF. Please try again.",
      });
    }
  };

  const openPdfViewer = (fileName, fileType) => {
    if (!fileName) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${fileType} file name is empty or undefined`,
      });
      return;
    }
    pdfViewer(fileName, fileType);
  };

  const pdfViewer = async (fileName, fileType) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is empty or undefined");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob",
      };

      const response = await axios.get(
        `http://localhost:8000/storage/${fileName}`,
        config
      );

      const pdfBlob = response.data;
      const pdfData = URL.createObjectURL(pdfBlob);
      const newWindow = window.open(pdfData, "_blank");
      if (newWindow) {
        newWindow.document.title = fileName;
      }
    } catch (error) {
      console.error(`Error fetching ${fileType} PDF:`, error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `Failed to fetch ${fileType} PDF. Please try again.`,
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-200">
      <Sidebar />
      <div className="flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Data Pengajuan PKL
        </h2>
        <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                No
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Akun Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                NISN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Kelas
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {dataPengajuan.length > 0 ? (
              dataPengajuan
                .slice(pagesVisited, pagesVisited + itemsPerPage)
                .map((pengajuan, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pengajuan.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pengajuan.nisn}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {pengajuan.kelas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDetailClick(pengajuan)}
                        className="text-blue-500 hover:underline focus:outline-none"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan="5" className="px-6 py-4 text-center">
                  No data available
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
        <div className="w-[90%] max-h-full">
        {selectedPengajuan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex overflow-y-scroll items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg max-w-2xl w-full overflow-auto">
              <ul>
                {selectedPengajuan.map((siswa) => (
                  <li key={siswa.id}>
                    <h3 className="text-xl font-semibold mb-2">
                      Detail Pengajuan - {siswa.name}
                    </h3>
                    <ul>
                      <li>
                        <p>
                          <span className="font-semibold">NISN:</span>{" "}
                          {siswa.nisn}
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-semibold">Kelas:</span>{" "}
                          {siswa.kelas}
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-semibold">Status:</span>{" "}
                          <StatusDropdown
                            selectedStatus={selectedStatus}
                            onStatusChange={setSelectedStatus}
                          />
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-semibold">CV:</span>{" "}
                          <button
                            onClick={() => openPdfViewer(siswa.file_cv, "CV")}
                            className="text-blue-500 hover:underline focus:outline-none"
                          >
                            Lihat CV
                          </button>
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-semibold">Portofolio:</span>{" "}
                          <button
                            onClick={() =>
                              openPdfViewer(siswa.file_portofolio, "Portofolio")
                            }
                            className="text-blue-500 hover:underline focus:outline-none"
                          >
                            Lihat Portofolio
                          </button>
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-semibold">
                            Nama Perusahaan:
                          </span>{" "}
                          {siswa.nama_perusahaan}
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-semibold">
                            Email Perusahaan:
                          </span>{" "}
                          {siswa.email_perusahaan}
                        </p>
                      </li>
                      <li>
                        <p>
                          <span className="font-semibold">
                            Alamat Perusahaan:
                          </span>{" "}
                          {siswa.alamat_perusahaan}
                        </p>
                      </li>
                    </ul>
                  </li>
                ))}
              </ul>
              <button
                onClick={handleGeneratePDF}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generate PDF
              </button>
              <button
                onClick={handleStatusUpdate}
                className="text-blue-500 hover:underline focus:outline-none mt-4"
              >
                Update Status
              </button>
              <button
                onClick={handleCloseDetail}
                className="text-blue-500 hover:underline focus:outline-none mt-4 ml-4"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
        {showPdfForm && (
          <PdfForm
            handleClose={() => setShowPdfForm(false)}
            selectedGroupId={selectedGroupId}
          />
        )}
      </div>
    </div>
    </div>
  );
};

const StatusDropdown = ({ selectedStatus, onStatusChange }) => {
  const statusOptions = ["Diperiksa", "Diproses", "Diterima", "Ditolak"];

  return (
    <select
      value={selectedStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
};

export default DataPengajuan;
