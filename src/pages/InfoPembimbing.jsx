import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Toaster, toast } from 'react-hot-toast';
import Sidebar from '../components/Sidebar';

const InfoPembimbing = () => {
    const [pembimbings, setPembimbings] = useState([]);
    const [selectedPembimbing, setSelectedPembimbing] = useState(null);
    const [companies, setCompanies] = useState([]);
    const [selectedCompanyIds, setSelectedCompanyIds] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get('http://localhost:8000/api/admin/daftar', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => setPembimbings(response.data.reduce((acc, curr) => {
            if (!acc.find(item => item.user_id === curr.user_id)) {
                acc.push(curr);
            }
            return acc;
        }, [])))
        .catch(error => setError('Error fetching pembimbings:' + error));

        axios.get('http://localhost:8000/api/admin/daftar-pengajuan', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => setCompanies(response.data.filter(company => company.nama_perusahaan && company.nama_perusahaan.trim() !== '')))
        .catch(error => setError('Error fetching companies:' + error));
    }, []);

    const handleDetail = (pembimbingId) => {
        setSelectedPembimbing(pembimbingId);
    };

    const handleAssign = () => {
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Token not found. Please login again.');
            return;
        }

        selectedCompanyIds.forEach((companyId) => {
          axios.post('http://localhost:8000/api/admin/assign', {
              pembimbing_id: selectedPembimbing,
              group_id: companyId,
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
              console.error('Sudah Di bimbing 2 Pembimbing', error);
              toast.error('Failed to assign pembimbing');
          });
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
                <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border-gray-300">
                    <thead className='bg-gray-200'>
                        <tr className="bg-gray-100">
                            <th className="px-4 py-2 border ">No</th>
                            <th className="px-4 py-2 border ">Nama</th>
                            <th className="px-4 py-2 border ">Email</th>
                            <th className="px-4 py-2 border ">Jabatan</th>
                            <th className="px-4 py-2 border ">Pangkat</th>
                            <th className="px-4 py-2 border ">Nomer Telpon</th>
                            <th className="px-4 py-2 border ">Nama Perusahaan</th>
                            <th className="px-4 py-2 border ">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pembimbings.map((pembimbing, index) => (
                            <tr key={pembimbing.user_id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                                <td className="px-4 py-2 border ">{index + 1}</td>
                                <td className="px-4 py-2 border ">{pembimbing.name}</td>
                                <td className="px-4 py-2 border ">{pembimbing.email}</td>
                                <td className="px-4 py-2 border ">{pembimbing.jabatan}</td>
                                <td className="px-4 py-2 border ">{pembimbing.pangkat}</td>
                                <td className="px-4 py-2 border ">{pembimbing.nomer_telpon}</td>
                                <td className="px-4 py-2 border ">{pembimbing.nama_perusahaan}</td>
                                <td className="px-4 py-2 border ">
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
                        <select
                          multiple
                          value={selectedCompanyIds}
                          onChange={(e) => setSelectedCompanyIds(Array.from(e.target.selectedOptions, option => option.value))}
                          className="border border-gray-300 p-2 rounded-md"
                        >
                          {companies.map((company, index) => (
                            <option key={index} value={company.group_id}>{company.nama_perusahaan}</option>
                          ))}
                        </select>
                        <button
                            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2"
                            onClick={handleAssign}
                        >
                            Assign
                        </button>
                        <button
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded mt-2"
                            onClick={handleClosePopup}
                        >
                            Tutup
                        </button>
                    </div>
                </div>
            )}
            <Toaster />
        </div>
    );
};

export default InfoPembimbing;
