import { useEffect, useState } from "react";
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
    <div className="flex bg-gray-200">
      <Sidekap />
      <div className="flex flex-col space-y-4 p-8">
        {loading ? (
          <p>Loading...</p>
        ) : pembimbingList.length > 0 ? (
          pembimbingList.map((pembimbing, index) => (
            <div key={index} className="bg-gradient-to-r from-gray-300 to-gray400 p-6 max-h-72 rounded shadow-md">
              <div className="">
                <h5 className="text-lg font-semibold mb-2">Nama Pembimbing: {pembimbing.name}</h5>
                <p className="text-gray-600 mb-2 text-sm font-sans">NIP: {pembimbing.nip}</p>
                <p className="text-gray-600 mb-2 text-sm font-sans">Nomer Telpon: {pembimbing.nomer_telpon}</p>
                <p className="text-gray-600 mb-2 text-sm font-mono">Jabatan: {pembimbing.jabatan}</p>
                <p className="text-gray-600 mb-2 text-sm font-mono">Pangkat: {pembimbing.pangkat}</p>
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
