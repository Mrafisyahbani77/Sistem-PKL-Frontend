import React, { useState } from "react";
import axios from "axios";

export default function GenerateSppd({ userId }) {
  const [nosurat, setNosurat] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admin/tambah-nosurat", {
        nosurat: nosurat,
        user_id: userId, // Menggunakan userId dari props
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        },
        responseType: 'blob'
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'surat-sppd.pdf';
      a.click();
      window.URL.revokeObjectURL(url);

      console.log("PDF generated successfully");
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Generate Sppd Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Masukkan Nomor Surat:
          <input
          className="rounded ml-5 bg-gray-300"
            type="text"
            value={nosurat}
            onChange={(e) => setNosurat(e.target.value)}
          />
        </label>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 ml-10 text-white font-bold py-2 px-4 rounded mt-4">Generate PDF</button>
      </form>
    </div>
  );
}
