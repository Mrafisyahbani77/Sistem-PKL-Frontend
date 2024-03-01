import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar'

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
        .then(response => setCompanies(response.data))
        .catch(error => setError('Error fetching companies:' + error));
    }, []);

    const handleDetail = (pembimbingId) => {
        setSelectedPembimbing(pembimbingId);
    };

    const handleAssign = (groupId) => {
      const token = localStorage.getItem('token');
  
      if (!token) {
          alert('Token not found. Please login again.');
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
          alert(response.data.message);
          setSelectedPembimbing(null);
      })
      .catch(error => {
          console.error('Failed to assign pembimbing', error);
          alert('Failed to assign pembimbing');
      });
  };
  

    return (
        <div className="h-screen flex">
            <Sidebar/>
            <h2 className="text-xl font-bold mb-4">Daftar Pembimbing</h2>
            {error && <p className="text-red-500">{error}</p>}
            <table className="table-auto w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-2">No</th>
                        <th className="px-4 py-2">Nama</th>
                        <th className="px-4 py-2">Email</th>
                        <th className="px-4 py-2">Jabatan</th>
                        <th className="px-4 py-2">Pangkat</th>
                        <th className="px-4 py-2">Nomer Telpon</th>
                        <th className="px-4 py-2">Nama Perusahaan</th>
                        <th className="px-4 py-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {pembimbings.map((pembimbing, index) => (
                        <tr key={pembimbing.user_id}>
                            <td className="border px-4 py-2">{index + 1}</td>
                            <td className="border px-4 py-2">{pembimbing.name}</td>
                            <td className="border px-4 py-2">{pembimbing.email}</td>
                            <td className="border px-4 py-2">{pembimbing.jabatan}</td>
                            <td className="border px-4 py-2">{pembimbing.pangkat}</td>
                            <td className="border px-4 py-2">{pembimbing.nomer_telpon}</td>
                            <td className="border px-4 py-2">{pembimbing.nama_perusahaan}</td>
                            <td className="border px-4 py-2">
                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleDetail(pembimbing.user_id)}>Detail Assign</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {selectedPembimbing && (
                <div>
                    <h3 className="text-xl font-bold mt-4">Assign Pembimbing</h3>
                    <select
                        className="border rounded px-4 py-2 mt-2"
                        onChange={(e) => setSelectedCompanyId(e.target.value)}
                    >
                        {companies.map((company, index) => (
                            <option key={index} value={company.group_id}>{company.nama_perusahaan}</option>
                        ))}
                    </select>
                    <button
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                        onClick={() => handleAssign(selectedCompanyId)}
                    >
                        Assign
                    </button>
                </div>
            )}
        </div>
    );
};

export default InfoPembimbing;
