import React, { useState, useEffect } from "react";
import Laypem from "../../components/Laypem";
import Api from "../../Api";

export default function Pembimbing() {
  const [siswaDibimbing, setSiswaDibimbing] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Panggil API untuk mendapatkan daftar siswa yang dibimbing oleh pembimbing
        const response = await Api.get("http://127.0.0.1:8000/api/pembimbing/dashboard");
        setSiswaDibimbing(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen">
      <Laypem>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">Daftar Siswa yang Dibimbing</h1>
          {loading ? (
            <p className="text-gray-600">Menunggu...</p>
          ) : siswaDibimbing.length === 0 ? (
            <p className="text-gray-600">Belum ada siswa untuk dibimbing</p>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
              {siswaDibimbing.map((siswa) => (
                <div key={siswa.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-4">
                    <p className="text-lg font-semibold mb-2">{siswa.name}</p>
                    <p className="text-sm text-gray-600 mb-1">NISN: {siswa.nisn}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Laypem>
    </div>
  );
}
