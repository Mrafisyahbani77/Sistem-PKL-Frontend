import React, { useState, useEffect } from "react";
import Api from "../../Api";
import Laysiswa from "../../components/Laysiswa";
import Cookies from "js-cookie";

const SiswaDashboard = () => {
  document.title = "SiswaDashboard";

  const [pendingApplications, setPendingApplications] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const [nameData, setLoadName] = useState("");

  useEffect(() => {
    loadName();
  }, []);

  const loadName = () => {
    const nameData = Cookies.get("user");
    if (nameData) {
      setLoadName(JSON.parse(nameData));
    }
  };

  useEffect(() => {
    setLoading(true);
    const fetchPendingApplications = async () => {
      try {
        const response = await Api.get(
          "http://127.0.0.1:8000/api/siswa/status"
        );
        setPendingApplications(response.data);
      } catch (error) {
        console.error("Gagal mengambil data pengajuan PKL:", error);
        setLoading(false);
        setError("Gagal mengambil data pengajuan PKL. Silakan coba lagi.");
      }
    };

    fetchPendingApplications();
  }, []);

  return (
    <div>
      <Laysiswa>
        <p className="lg:text-lg md:text-xl sm:text-sm font-bold mb-4">
          Selamat Datang Di Dashboard, {nameData.name}
        </p>
        <div className="w-full max-w-xl mx-auto mt-8 p-8 bg-gradient-to-r from-gray-200 to-gray-400 rounded shadow-lg">
          <h1 className="text-2xl font-bold mb-6">Status Pengajuan PKL</h1>
          {loading && error && (
            <p className="text-red-500">
              {loading} && {error}
            </p>
          )}
          {pendingApplications.length === 0 ? (
            <p>Tidak ada pengajuan PKL yang masih dalam status tunggu.</p>
          ) : (
            <ul>
              {pendingApplications.map((application) => {
                return (
                  <li key={application.id} className="mb-4">
                    <p className="font-semibold mb-1">
                      Tempat Pkl anda saat ini: {application.nama_perusahaan}
                    </p>
                    <p className="font-semibold mb-1">
                      Status: {application.status}
                    </p>
                    {application.status === "Diterima" && (
                      <Countdown startDate={application.created_at} />
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

const Countdown = ({ startDate }) => {
  const [countdown, setCountdown] = useState("");

  useEffect(() => {
    const calculateCountdown = () => {
      const endTime = new Date(startDate); // startDate adalah string dalam format ISO 8601
      endTime.setMonth(endTime.getMonth() + 6); // Tambahkan 6 bulan ke tanggal status diterima

      const interval = setInterval(() => {
        const now = new Date();
        const difference = endTime - now;

        if (difference <= 0) {
          clearInterval(interval);
          setCountdown("Waktu PKL telah berakhir");
          return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setCountdown(
          `${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik`
        );
      }, 1000);

      return () => clearInterval(interval);
    };

    calculateCountdown();
  }, [startDate]);

  return <p className="font-semibold">Durasi PKL: {countdown}</p>;
};

export default SiswaDashboard;
