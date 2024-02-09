import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Api from "../Api";
import Sidebar from "../components/Sidebar";
import PdfViewer from "./PdfViewer";

const DataPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    // Ambil data pengajuan dari API saat komponen dimuat
    Api.getAllPengajuan()
      .then((response) => {
        // Menambahkan URL CV dan Portofolio ke data pengajuan
        setDataPengajuan(response.data.data);
      })
      .catch((error) => {
        console.error("Error fetching pengajuan data:", error);
      });
  }, []);

  const handleStatusChange = async (id, selectedStatus) => {
    try {
      // Kirim perubahan status ke server
      await Api.updateStatus(id, { status: selectedStatus });

      // Perbarui status langsung di antarmuka pengguna
      setDataPengajuan((prevData) =>
        prevData.map((pengajuan) =>
          pengajuan.id === id
            ? { ...pengajuan, status: selectedStatus }
            : pengajuan
        )
      );

      // Tampilkan notifikasi berhasil
      Swal.fire({
        icon: "success",
        title: "Status Updated Successfully!",
      });
    } catch (error) {
      console.error("Error updating status:", error);
      // Tampilkan notifikasi kesalahan
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update status. Please try again.",
      });
    }
  };

  const handleDetailClick = (pengajuan) => {
    setSelectedPengajuan(pengajuan);
    setSelectedStatus(pengajuan.status);
  };

  const handleCloseDetail = () => {
    setSelectedPengajuan(null);
    setSelectedStatus("");
  };

  const handleStatusUpdate = async () => {
    try {
      await handleStatusChange(selectedPengajuan.id, selectedStatus);
      handleCloseDetail();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const openPdfViewer = (pdfUrl, title) => {
    // Implementasi tampilan PDF, Anda dapat menggunakan modal atau library PDF viewer
    Swal.fire({
      html: <PdfViewer pdfUrl={pdfUrl} />,
      showCloseButton: true,
      showConfirmButton: false,
      customClass: "pdf-viewer-modal",
      title,
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />

      <div className="flex-1 p-8">
        <h2 className="text-3xl font-semibold mb-6 text-gray-800">
          Data Pengajuan PKL
        </h2>

        <table className="min-w-full divide-y divide-gray-300 border border-gray-500 rounded-md overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nama Akun Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email Perusahaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Alamat Perusahaan
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Detail
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-300">
            {dataPengajuan.map((pengajuan) => (
              <tr key={pengajuan.id}>
                <td className="px-6 py-4 whitespace-nowrap">{pengajuan.nama}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pengajuan.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{pengajuan.alamat}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDetailClick(pengajuan)}
                    className="text-blue-500 hover:underline focus:outline-none"
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Tampilan Pop-up Detail */}
        {selectedPengajuan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg max-w-2xl w-full overflow-auto">
              <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Detail Pengajuan - {selectedPengajuan.nama}
              </h2>
              <div>
                <h3 className="text-xl font-semibold mb-2">
                  Detail Pengajuan
                </h3>
                <ul>
                  <li>
                    <p>
                      <span className="font-semibold">NISN:</span> {selectedPengajuan.nisn}
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
                  {/* Sisipkan informasi lainnya di sini */}
                </ul>
                {/* Tombol untuk melihat CV dan portofolio */}
                {/* Anda perlu menyesuaikan fungsi onClick untuk menampilkan CV dan portofolio */}
              </div>
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
              {/* Tombol untuk generate PDF */}
              <button
                onClick={() =>
                  openPdfViewer(selectedPengajuan.portofolio_url, "Detail Pengajuan")
                }
                className="text-blue-500 hover:underline focus:outline-none mt-4 ml-4"
              >
                Generate PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Komponen Dropdown untuk Status
const StatusDropdown = ({ selectedStatus, onStatusChange }) => {
  const statusOptions = ["Diperiksa", "Diproses", "Diterima", "Ditolak"];

  return (
    <select
      value={selectedStatus}
      onChange={(e) => onStatusChange(e.target.value)}
      className={`block w-full p-2 border rounded focus:outline-none ${
        selectedStatus === "Diterima"
          ? "bg-green-200"
          : selectedStatus === "Ditolak"
          ? "bg-red-200"
          : "bg-yellow-200"
      }`}
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
