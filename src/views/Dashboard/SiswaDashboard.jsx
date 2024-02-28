import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Laysiswa from "../../components/Laysiswa";

const SiswaDashboard = () => {
  document.title = "SiswaDashboard";

  const [pendingApplications, setPendingApplications] = useState([]);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const response = await Api.get("http://127.0.0.1:8000/api/siswa/status");
        setPendingApplications(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengajuan PKL:", error);
      }
    };

    fetchPendingApplications();
  }, []);

  useEffect(() => {
    const eventSource = new EventSource("http://127.0.0.1:8000/api/siswa/statusWithCountdown");
    eventSource.onmessage = (event) => {
      const eventData = JSON.parse(event.data);
      if (eventData.status === "Diterima") {
        // Cari pengajuan PKL dengan ID yang sesuai dan update waktu mundurnya
        setPendingApplications((prevApplications) => {
          return prevApplications.map((application) => {
            if (application.id === eventData.id) {
              application.countdown = eventData.countdown;
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
                  {application.countdown && (
                    <p>Waktu PKL: {application.countdown}</p> // Menggunakan countdown
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
