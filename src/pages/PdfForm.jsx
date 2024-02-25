import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert

const PdfForm = ({ selectedGroupId }) => {
  const [formData, setFormData] = useState({
    nomor_surat: '',
    tahun_ajar: '',
    bulan_tahun: '',
    lama_pelaksanaan: '',
    kontak: '',
    group_id: selectedGroupId,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const access_token = localStorage.getItem('token');

    if (!access_token) {
      console.error('Token not available. Please log in.');
      return;
    }

    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${access_token}`,
      };

      // Menambahkan group_id ke formData sebelum mengirim ke server
      const dataToSend = { ...formData, group_id: selectedGroupId };

      const response = await axios.post('http://localhost:8000/api/admin/generate-pdf', dataToSend, { headers, responseType: 'blob' });

      const blobUrl = URL.createObjectURL(response.data);

      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = 'Pengajuan-pkl-siswa.pdf';
      document.body.appendChild(downloadLink);
      downloadLink.click();

      Swal.fire({
        icon: 'success',
        title: 'PDF Berhasil Dibuat',
      });

      setFormData({
        nomor_surat: '',
        tahun_ajar: '',
        bulan_tahun: '',
        lama_pelaksanaan: '',
        kontak: '',
        group_id: selectedGroupId,
      });
    } catch (error) {
      console.error('Error creating PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Membuat PDF',
        text: 'Silakan coba lagi.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <form onSubmit={handleSubmit}>
        <label>
          Nomor Surat:
          <input
            type="text"
            name="nomor_surat"
            value={formData.nomor_surat}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label>
          Tahun Ajar:
          <input
            type="text"
            name="tahun_ajar"
            value={formData.tahun_ajar}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label>
          Bulan Tahun:
          <input
            type="text"
            name="bulan_tahun"
            value={formData.bulan_tahun}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label>
          Lama Pelaksanaan:
          <input
            type="text"
            name="lama_pelaksanaan"
            value={formData.lama_pelaksanaan}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label>
          Kontak:
          <input
            type="text"
            name="kontak"
            value={formData.kontak}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Generating...' : 'Generate PDF'}
        </button>
      </form>
    </div>
  );
};

export default PdfForm;
