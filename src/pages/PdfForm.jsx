import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Api from "../Api"; // Import Api from your Api.js file

const PdfForm = ({ handleClose, selectedGroupId }) => {
    const [formData, setFormData] = useState({
      nomor_surat: "",
      tahun_ajar: "",
      bulan_tahun: "",
      lama_pelaksanaan: "",
      kontak: "",
      group_id: selectedGroupId, // Auto-fill group_id
    });

    useEffect(() => {
        setFormData((prevFormData) => ({
          ...prevFormData,
          group_id: selectedGroupId,
        }));
      }, [selectedGroupId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token is empty or undefined");
      }

      // Debugging: Log data before sending
      console.log("FormData:", formData);

      // Generate PDF
      const response = await Api.generatePDF(token, formData);

      // Debugging: Log response
      console.log("PDF Response:", response);

      // Download the generated PDF
      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.setAttribute("download", "surat_pengajuan_pkl.pdf");
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      // Optionally, you can show a success message
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "PDF generated successfully.",
      });

      // Close the form
      handleClose();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to generate PDF. Please try again.",
      });
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <form onSubmit={handleSubmit}>
        <label className="block mb-2">
          Nomor Surat:
          <input
            type="text"
            name="nomor_surat"
            value={formData.nomor_surat}
            onChange={handleChange}
            className="border-gray-300 border p-1 ml-2"
          />
        </label>
        <label className="block mb-2">
          Tahun Ajar:
          <input
            type="text"
            name="tahun_ajar"
            value={formData.tahun_ajar}
            onChange={handleChange}
            className="border-gray-300 border p-1 ml-2"
          />
        </label>
        <label className="block mb-2">
          Bulan Tahun:
          <input
            type="text"
            name="bulan_tahun"
            value={formData.bulan_tahun}
            onChange={handleChange}
            className="border-gray-300 border p-1 ml-2"
          />
        </label>
        <label className="block mb-2">
          Lama Pelaksanaan:
          <input
            type="text"
            name="lama_pelaksanaan"
            value={formData.lama_pelaksanaan}
            onChange={handleChange}
            className="border-gray-300 border p-1 ml-2"
          />
        </label>
        <label className="block mb-2">
          Kontak:
          <input
            type="text"
            name="kontak"
            value={formData.kontak}
            onChange={handleChange}
            className="border-gray-300 border p-1 ml-2"
          />
        </label>
        <div className="flex justify-between">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Generate PDF
          </button>
          <button
            type="button"
            onClick={handleClose}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Close
          </button>
        </div>
      </form>
    </div>
  );
};

export default PdfForm;
