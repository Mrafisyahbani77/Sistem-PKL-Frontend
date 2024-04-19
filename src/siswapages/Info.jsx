import React, { useState, useEffect } from "react";
import axios from "axios";
import Siswasd from "../components/Siswasd";

const Info = () => {
  const [guruPembimbing, setGuruPembimbing] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Token not found. Please login again.");
        return;
      }

      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/siswa/info-pembimbing",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setGuruPembimbing(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching guru pembimbing data:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex">
      <Siswasd />
      <div className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : guruPembimbing && Object.keys(guruPembimbing).length > 0 ? (
          Object.entries(guruPembimbing).map(([key, guru]) => (
            <div
              key={key}
              className="bg-white rounded-md shadow-md mb-4 cursor-pointer overflow-hidden transition duration-300 hover:shadow-lg max-w-sm"
            >
              <div className="flex-1 p-4 ">
                <h2 className="text-xl font-semibold mb-2">Guru {key}</h2>
                <div className="flex  mb-2">
                  <p className="text-gray-600">Nama:</p>
                  <p className="font-semibold ml-2">{guru.name}</p>
                </div>
                <div className="flex mb-2">
                  <p className="text-gray-600">NIP:</p>
                  <p className="font-semibold ml-2">{guru.nip}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Nomor Telepon:</p>
                  <p className="font-semibold">{guru.nomer_telpon}</p>
                </div>
                <div className="flex justify-between">
                  <p className="text-gray-600">Email:</p>
                  <p className="font-semibold">{guru.email}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>Data guru pembimbing tidak tersedia.</p>
        )}
      </div>
    </div>
  );
};

export default Info;
