import React, { useState } from "react";
import axios from "axios";

export default function GenerateSppd({ userId }) {
  const [nosurat, setNosurat] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/admin/tambah-nosurat", {
        nosurat: nosurat,
        user_id: userId, // Menambahkan user_id ke permintaan
      });
      console.log("PDF generated successfully");
      // Tambahkan logika untuk menampilkan pesan sukses atau redirect ke halaman lain
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div className="bg-white p-8 rounded shadow-lg">
      <h2 className="text-lg font-bold mb-4">Generate PDF Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nomor Surat:
          <input
            type="text"
            value={nosurat}
            onChange={(e) => setNosurat(e.target.value)}
          />
        </label>
        <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">Generate PDF</button>
      </form>
    </div>
  );
}
