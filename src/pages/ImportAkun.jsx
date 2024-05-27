import React, { useState, useRef } from "react";
import axios from "axios";

export default function ImportAkun({ onClose }) {
  const fileInputRef = useRef();

  const handleImport = async () => {
    const file = fileInputRef.current.files[0];

    if (!file) {
      alert("Please select a file");
      return;
    }

    if (
      !file.name.endsWith(".xlsx") &&
      !file.name.endsWith(".xls") &&
      !file.name.endsWith(".csv")
    ) {
      alert("File must be in Excel format (XLSX or XLS) or CSV format");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        "http://127.0.0.1:8000/api/admin/import-akun",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Import successful");
      setIsOpen(false); // Menutup form setelah berhasil mengimpor
    } catch (error) {
      alert("Import failed");
      console.error(error);
    }
  };

  return (
    <div>
      <div>
        <button
          onClick={onClose}
          className="bg-gray-800 hover:bg-gray-900 text-white text-sm py-2 rounded px-2"
        >
          Tutup
        </button>
        <input
          type="file"
          accept=".xlsx,.xls"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleImport}
        />
        <button
          className="flex w-full mt-1 p-2 border focus:outline-none focus:ring focus:border-blue-300 rounded"
          onClick={() => fileInputRef.current.click()}
        >
          Pilih File
        </button>
      </div>
    </div>
  );
}
