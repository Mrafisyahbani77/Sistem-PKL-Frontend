import React, { useState, useEffect } from "react";
import Laypem from "../../components/Laypem";
import Api from "../../Api";

export default function Pembimbing() {
  const [siswaDibimbing, setSiswaDibimbing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Api.get(
          "http://127.0.0.1:8000/api/pembimbing/dashboard"
        );
        setSiswaDibimbing(response.data.data); // Update untuk menyesuaikan dengan perubahan struktur data dari controller
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCompanyClick = (siswa) => {
    setSelectedCompany(siswa);
  };

  const handleResetClick = () => {
    setSelectedCompany(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Laypem>
        <div className="mx-auto max-w-3xl px-4 py-8">
          <h1 className="text-2xl font-bold mb-6">
            Daftar Siswa yang Dibimbing
          </h1>
          {loading ? (
            <p className="text-gray-600">Menunggu...</p>
          ) : siswaDibimbing.length === 0 ? (
            <p className="text-gray-600">Belum ada siswa untuk dibimbing</p>
          ) : selectedCompany ? (
            <div>
              <p className="text-lg font-semibold mb-2">
                Nama Perusahaan: {selectedCompany.nama_perusahaan}
              </p>
              <button
                onClick={handleResetClick}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              >
                Kembali
              </button>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
                {siswaDibimbing.map((siswa) => (
                  <div
                    key={siswa.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="p-4">
                      <p className="text-lg font-semibold mb-2">{siswa.nama}</p>
                      <p className="text-lg font-semibold mb-2">
                        {siswa.kelas}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        NISN: {siswa.nisn}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-xs">
              <div className="bg-white rounded-lg shadow-md overflow-hidden text-center">
                <p className="text-lg font-semibold mb-2">
                  Nama Perusahaan: {siswaDibimbing[0].nama_perusahaan}
                </p>
                <button
                  onClick={() => handleCompanyClick(siswaDibimbing[0])}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
                >
                  Lihat Siswa
                </button>
              </div>
            </div>
          )}
        </div>
      </Laypem>
    </div>
  );
}
