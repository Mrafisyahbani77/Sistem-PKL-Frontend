import React, { useState, useEffect } from "react";
import Siswasd from "../../components/Siswasd";
import Api from "../../Api";
import Navsw from "../../components/Navsw";
import Laysiswa from "../../components/Laysiswa";

const SiswaDashboard = () => {
  document.title = "SiswaDashboard";

  const [pendingApplications, setPendingApplications] = useState([]);

  useEffect(() => {
    // Ambil data pengajuan PKL yang masih dalam status tunggu dari API
    const fetchPendingApplications = async () => {
      try {
        const response = await Api.get("/api/applications/pending");
        setPendingApplications(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengajuan PKL:", error);
      }
    };

    fetchPendingApplications();
  }, []);

  // Fungsi untuk menghitung waktu PKL
  const calculateInternshipDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const months = Math.floor(diffDays / 30);
    const days = diffDays % 30;
    return `${months} bulan ${days} hari`;
  };

  return (
    <div>
      <Laysiswa>
        {/* <Navsw/> */}

        {/* <Siswasd /> */}
        <div className="w-full max-w-xl mx-auto mt-8 p-8 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6">
            Status Tunggu Pengajuan PKL
          </h1>
          {pendingApplications.length === 0 ? (
            <p>Tidak ada pengajuan PKL yang masih dalam status tunggu.</p>
          ) : (
            <ul>
              {pendingApplications.map((application) => (
                <li key={application.id} className="mb-4">
                  <p className="font-bold mb-1">{application.studentName}</p>
                  <p>Status: {application.status}</p>
                  <p>
                    Waktu PKL:{" "}
                    {calculateInternshipDuration(
                      application.startDate,
                      application.endDate
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Laysiswa>
    </div>
  );
};

export default SiswaDashboard;