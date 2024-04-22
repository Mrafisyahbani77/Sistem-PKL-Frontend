import React, { useState, useRef } from "react";
import axios from "axios";

export default function ImportAkun() {
  const [isOpen, setIsOpen] = useState(false);
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
    const token = localStorage.getItem('token')

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
      <button onClick={() => setIsOpen(true)}>Import Excel File</button>
      {isOpen && (
        <div>
          <input
            type="file"
            accept=".xlsx,.xls"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImport}
          />
          <button onClick={() => fileInputRef.current.click()}>
            Choose File
          </button>
          <button onClick={() => setIsOpen(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
