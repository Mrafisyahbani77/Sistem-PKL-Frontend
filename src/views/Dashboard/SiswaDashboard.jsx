import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Laysiswa from "../../components/Laysiswa";

const SiswaDashboard = () => {
  document.title = "SiswaDashboard";

  const [pendingApplications, setPendingApplications] = useState([]);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const response = await Api.get("http://localhost:8000/api/siswa/status");
        setPendingApplications(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengajuan PKL:", error);
      }
    };

    fetchPendingApplications();
  }, []);

  // Mengupdate waktu mundur saat status berubah menjadi "Diterima"
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000/api/siswa/waktu");
    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData.status === "Diterima") {
        // Cari pengajuan PKL dengan ID yang sesuai dan update waktu mundurnya
        setPendingApplications((prevApplications) => {
          return prevApplications.map((application) => {
            if (application.id === eventData.id) {
              application.duration = eventData.duration;
            }
            return application;
          });
        });
      }
    };

    return () => eventSource.close();
  }, []);

  return (
    <div>
      <Laysiswa>
        <div className="w-full max-w-xl mx-auto mt-8 p-8 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6">
            Status Pengajuan PKL
          </h1>
          {pendingApplications.length === 0 ? (
            <p>Tidak ada pengajuan PKL yang masih dalam status tunggu.</p>
          ) : (
            <ul>
              {pendingApplications.map((application) => (
                <li key={application.id} className="mb-4">
                  <p className="font-bold mb-1">{application.studentName}</p>
                  <p className="font-semibold">Status: {application.status}</p>
                  {application.duration && (
                    <p>Waktu PKL: {application.duration}</p>
                  )}
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