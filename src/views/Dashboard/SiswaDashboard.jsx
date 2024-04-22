import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Laysiswa from "../../components/Laysiswa";

const SiswaDashboard = () => {
  document.title = "SiswaDashboard";

  const [pendingApplications, setPendingApplications] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPendingApplications = async () => {
      try {
        const response = await Api.get(
          "http://127.0.0.1:8000/api/siswa/status"
        );
        setPendingApplications(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengajuan PKL:", error);
        setError("Gagal mengambil data pengajuan PKL. Silakan coba lagi.");
      }
    };

    fetchPendingApplications();
  }, []);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await Api.get("http://127.0.0.1:8000/api/siswa/Time");
        const eventData = response.data;
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
      } catch (error) {
        console.error("Gagal mengambil data waktu PKL:", error);
        setError("Gagal mengambil data waktu PKL. Silakan coba lagi.");
      }
    };

    // Lakukan pemanggilan pertama
    fetchTime();

    // Interval untuk melakukan pemanggilan berkala setiap 1 menit
    const interval = setInterval(fetchTime, 60000); // 1 menit

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Laysiswa>
        <div className="w-full max-w-xl mx-auto mt-8 p-8 bg-white rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6">Status Pengajuan PKL</h1>
          {error && <p className="text-red-500">{error}</p>}
          {pendingApplications.length === 0 ? (
            <p>Tidak ada pengajuan PKL yang masih dalam status tunggu.</p>
          ) : (
            <ul>
              {pendingApplications.map((application) => {
                console.log("Waktu PKL:", application.countdown); // Tambahkan ini untuk debugging
                return (
                  <li key={application.id} className="mb-4">
                    <p className="font-semibold mb-1">
                      Tempat Pkl anda saat ini: {application.nama_perusahaan}
                    </p>{" "}
                    {/* Ubah properti ini sesuai dengan respons JSON yang benar */}
                    <p className="font-semibold">
                      Status: {application.status}
                    </p>
                    {application.countdown && (
                      <p>Waktu PKL: {application.countdown}</p>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </Laysiswa>
    </div>
  );
};

export default SiswaDashboard;
