import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const InfoPembimbing = () => {
    const [pembimbings, setPembimbings] = useState([]);
    const [selectedPembimbing, setSelectedPembimbing] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyId, setSelectedCompanyId] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8000/api/admin/daftar', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => setPembimbings(response.data))
        .catch(error => setError('Error fetching pembimbings:' + error));

        axios.get('http://localhost:8000/api/admin/daftar-pengajuan', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => setCompanies(response.data.filter(company => company.nama_perusahaan !== null)))
        .catch(error => setError('Error fetching companies:' + error));
    }, []);

    const handleDetail = (pembimbingId) => {
        setSelectedPembimbing(pembimbingId);
    };

    const handleAssign = (groupId) => {
      const token = localStorage.getItem('token');
  
      if (!token) {
          toast.error('Token not found. Please login again.');
          return;
      }

      const selectedCompany = companies.find(company => company.group_id === groupId);
      if (selectedCompany.pembimbing_count >= 2) {
          toast.error('This company has already been assigned two pembimbings');
          return;
      }
  
      axios.post('http://localhost:8000/api/admin/assign', {
          pembimbing_id: selectedPembimbing,
          group_id: groupId,
      }, {
          headers: {
              Authorization: `Bearer ${token}`
          }
      })
      .then(response => {
          toast.success(response.data.message);
          setSelectedPembimbing(null);
      })
      .catch(error => {
          console.error('Failed to assign pembimbing', error);
          toast.error('Failed to assign pembimbing');
      });
  };
  
  const handleClosePopup = () => {
    setSelectedPembimbing(null);
};

return (
    <div className="h-screen flex">
    <Sidebar />
    <div className="flex flex-col p-4">
        <h2 className="text-xl font-bold mb-4">Daftar Pembimbing</h2>
        {error && <p className="text-red-500">{error}</p>}
        <table className="w-full border border-gray-200">
            <thead>
                <tr className="bg-gray-100">
                    <th className="px-4 py-2 border border-gray-200">No</th>
                    <th className="px-4 py-2 border border-gray-200">Nama</th>
                    <th className="px-4 py-2 border border-gray-200">Email</th>
                    <th className="px-4 py-2 border border-gray-200">Jabatan</th>
                    <th className="px-4 py-2 border border-gray-200">Pangkat</th>
                    <th className="px-4 py-2 border border-gray-200">Nomer Telpon</th>
                    <th className="px-4 py-2 border border-gray-200">Nama Perusahaan</th>
                    <th className="px-4 py-2 border border-gray-200">Action</th>
                </tr>
            </thead>
            <tbody className="border border-gray-200">
                {pembimbings.map((pembimbing, index) => (
                    <tr key={pembimbing.user_id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                        <td className="px-4 py-2 border border-gray-200">{index + 1}</td>
                        <td className="px-4 py-2 border border-gray-200">{pembimbing.name}</td>
                        <td className="px-4 py-2 border border-gray-200">{pembimbing.email}</td>
                        <td className="px-4 py-2 border border-gray-200">{pembimbing.jabatan}</td>
                        <td className="px-4 py-2 border border-gray-200">{pembimbing.pangkat}</td>
                        <td className="px-4 py-2 border border-gray-200">{pembimbing.nomer_telpon}</td>
                        <td className="px-4 py-2 border border-gray-200">{pembimbing.nama_perusahaan}</td>
                        <td className="px-4 py-2 border border-gray-200">
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDetail(pembimbing.user_id)}>Detail Assign</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    {selectedPembimbing && (
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full bg-gray-800 bg-opacity-75">
            <div className="bg-white p-8 rounded-lg shadow-md border border-gray-300">
                <h3 className="text-xl font-bold mb-4">Assign Pembimbing</h3>
                {companies.map((company, index) => (
                  <div key={index}>
                    <p>{company.nama_perusahaan}</p>
                    <button
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 mr-2"
                      onClick={() => handleAssign(company.group_id)}
                      disabled={company.pembimbing_count >= 2}
                    >
                      Assign
                    </button>
                    {company.pembimbing_count >= 2 && <p className="text-red-500">This company has already been assigned two pembimbings</p>}
                  </div>
                ))}
                <button
                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2"
                    onClick={handleClosePopup}
                >
                    Tutup
                </button>
            </div>
        </div>
    )}
    <Toaster/>
</div>
);
};
export default InfoPembimbing;
