import React, { useState } from 'react';
import axios from 'axios';

const TambahPerusahaan = ({ onTambahPerusahaan }) => {
    const [namaPerusahaan, setNamaPerusahaan] = useState('');
    const [emailPerusahaan, setEmailPerusahaan] = useState('');
    const [alamatPerusahaan, setAlamatPerusahaan] = useState('');
    const [siswaDibutuhkan, setSiswaDibutuhkan] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newPerusahaan = {
            nama_perusahaan: namaPerusahaan,
            email_perusahaan: emailPerusahaan,
            alamat_perusahaan: alamatPerusahaan,
            siswa_dibutuhkan: siswaDibutuhkan
        };
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Token not found. Please login again.");
            return;
        }
        axios.post('http://127.0.0.1:8000/api/admin/perusahaan', newPerusahaan, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                console.log('Perusahaan added successfully');
                onTambahPerusahaan(response.data.perusahaan);
                setNamaPerusahaan('');
                setEmailPerusahaan('');
                setAlamatPerusahaan('');
                setSiswaDibutuhkan('');
            })
            .catch(error => {
                console.error('Error adding perusahaan:', error);
            });
    };

    return (
        <div className="px-4">
            <h2 className="text-2xl font-bold mb-4">Tambah Perusahaan</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Nama Perusahaan</label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={namaPerusahaan} onChange={(e) => setNamaPerusahaan(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email Perusahaan</label>
                    <input type="email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={emailPerusahaan} onChange={(e) => setEmailPerusahaan(e.target.value)} />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Alamat Perusahaan</label>
                    <textarea className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={alamatPerusahaan} onChange={(e) => setAlamatPerusahaan(e.target.value)} />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Siswa Dibutuhkan</label>
                    <input type="text" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" value={siswaDibutuhkan} onChange={(e) => setSiswaDibutuhkan(e.target.value)} />
                </div>
                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Tambah</button>
            </form>
        </div>
    );
};

export default TambahPerusahaan;
