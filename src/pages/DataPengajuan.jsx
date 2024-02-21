import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Sidebar from "../components/Sidebar";


const DataPengajuan = () => {
  const [dataPengajuan, setDataPengajuan] = useState([]);
  const [selectedPengajuan, setSelectedPengajuan] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  const handleCloseDetail = () => {
    setSelectedPengajuan(null);
    setSelectedStatus("");
  };

  useEffect(() => {
    axios
      .get(`http://localhost:8000/api/admin/pengajuan/all`)
      .then((response) => {
        setDataPengajuan(response.data.data); // Perubahan di sini
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

      const selectedId = selectedPengajuan[0].id; // Ambil ID dari akun yang dipilih

      await axios.put(
        `http://localhost:8000/api/admin/update-status/${selectedId}`,
        { status: selectedStatus },
        config
      );

      const updatedDataPengajuan = dataPengajuan.map((pengajuan) => {
        if (pengajuan.id === selectedId) {
          return {
            ...pengajuan,
            status: selectedStatus,
          };
        }
        return pengajuan;
      });
      setDataPengajuan(updatedDataPengajuan);

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
    } catch (error) {
      console.error("Error fetching detail pengajuan:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to fetch detail pengajuan. Please try again.",
      });
    }
  };

  const openPdfViewer = (fileName, fileType) => {
    if (!fileName) {
      // Tampilkan pesan kesalahan jika nama file kosong atau tidak terdefinisi
      Swal.fire({
        icon: "error",
        title: "Error",
        text: `${fileType} file name is empty or undefined`,
      });
      return;
    }
    // Panggil fungsi pdfViewer dengan nama file dan tipe file
    pdfViewer(fileName, fileType);
  };

  const pdfViewer = async (fileName, fileType) => {
    try {
      const token = localStorage.getItem("token"); // Mengambil token dari local storage
      if (!token) {
        throw new Error("Token is empty or undefined");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "blob", // Menetapkan tipe respons menjadi blob
      };

      const response = await axios.get(
        `http://localhost:8000/storage/${fileName}`,
        config
      ); // Menggunakan token dalam permintaan
      console.log("Response:", response); // Tambahkan log untuk respons

      const pdfBlob = response.data; // Langsung gunakan data respons sebagai blob
      console.log("PDF Blob:", pdfBlob); // Tambahkan log untuk objek blob

      const pdfData = URL.createObjectURL(pdfBlob);
      console.log("PDF Data URL:", pdfData); // Tambahkan log untuk URL objek
      // Tampilkan PDF di jendela baru
      const newWindow = window.open(pdfData, "_blank");
      if (newWindow) {
        newWindow.document.title = fileName; // Set title jendela baru menjadi nama file PDF
      }
    } catch (error) {
      console.error(`Error fetching ${fileType} PDF:`, error);
      // Tampilkan pesan error jika gagal mengambil PDF
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
                Nama Akun Siswa
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nisn
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
            {dataPengajuan.map((pengajuan) => (
              <tr key={pengajuan.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {pengajuan.nama}
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
            ))}
          </tbody>
        </table>
        {selectedPengajuan && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
            <div className="bg-white p-8 rounded-md shadow-lg max-w-2xl w-full overflow-auto">
              {/* <h2 className="text-2xl font-semibold mb-4 text-gray-800">
                Detail Pengajuan - {selectedPengajuan[0]}
              </h2> */}
              <ul>
                {selectedPengajuan.map((siswa) => (
                  <li key={siswa.id}>
                    <h3 className="text-xl font-semibold mb-2">
                      Detail Pengajuan - {siswa.nama}
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
