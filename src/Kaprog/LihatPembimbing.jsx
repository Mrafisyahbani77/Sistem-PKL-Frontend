import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidekap from "../components/Sidekap";

export default function LihatPembimbing() {
  const [pembimbingList, setPembimbingList] = useState([]);
  const [loading, setLoading] = useState(false); 

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    axios.get("http://127.0.0.1:8000/api/kaprog/data-pembimbing", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        setPembimbingList(response.data.users); // Adjust the data structure based on the actual response
        setLoading(false); 
      })
      .catch(error => {
        console.error("Error:", error);
        setLoading(false); 
      });
  }, []); 

  return (
    <div className="h-screen flex">
      <Sidekap />
      <div className="p-8 flex">
        {loading ? (
          <p>Loading...</p>
        ) : pembimbingList.length > 0 ? (
          pembimbingList.map((pembimbing, index) => (
            <div key={index} className="bg-white p-6 inline-block rounded-lg shadow-md mb-4">
              <div className="">
                <h5 className="text-2xl font-semibold mb-4">Nama: {pembimbing.name}</h5>
                <p className="text-gray-600 mb-2">NIP: {pembimbing.nip}</p>
                <p className="text-gray-600 mb-2">Nomer Telpon: {pembimbing.nomer_telpon}</p>
                <p className="text-gray-600 mb-2">Jabatan: {pembimbing.jabatan}</p>
                <p className="text-gray-600 mb-2">Pangkat: {pembimbing.pangkat}</p>
              </div>
            </div>
          ))
        ) : (
          <p>Data pembimbing tidak ada</p>
        )}
      </div>
    </div>
  );
}
