import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // Import SweetAlert

import Sidebar from '../components/Sidebar';

const PengajuanPkl = () => {
  const [emailData, setEmailData] = useState({
    to: '',
    subject: '',
    message: '',
    attachment: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    if (e.target.name === 'attachment') {
      setEmailData({
        ...emailData,
        [e.target.name]: e.target.files[0],
      });
    } else {
      setEmailData({
        ...emailData,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const access_token = localStorage.getItem('token');

    if (!access_token) {
      console.error('Token not available. Please log in.');
      // Tampilkan SweetAlert atau notifikasi lainnya di sini
      return;
    }

    const headers = {
      Authorization: `Bearer ${access_token}`,
      // 'Content-Type': 'multipart/form-data', // Jangan atur manual, biarkan Axios menangani ini
    };

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('to', emailData.to);
      formData.append('subject', emailData.subject);
      formData.append('message', emailData.message);
      formData.append('attachment', emailData.attachment);

      await axios.post('http://127.0.0.1:8000/api/admin/send-email', formData, { headers });

      Swal.fire({
        icon: 'success',
        title: 'Email Berhasil Dikirim!',
      });

      setEmailData({
        to: '',
        subject: '',
        message: '',
        attachment: null,
      });
    } catch (error) {
      console.error('Error sending email:', error);

      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengirim email',
        text: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='flex h-screen'>
      <Sidebar />
      <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
        <label className="block mb-2">
          To:
          <input
            type="email"
            name="to"
            value={emailData.to}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Subject:
          <input
            type="text"
            name="subject"
            value={emailData.subject}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          Message:
          <textarea
            name="message"
            value={emailData.message}
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <label className="block mb-2">
          File:
          <input
            type="file"
            name="attachment"
            onChange={handleChange}
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>
        <button type="submit" className="mt-4 bg-blue-500 text-white px-4 py-2 rounded" disabled={loading}>
          {loading ? 'Sending...' : 'Send Email'}
        </button>
      </form>
    </div>
  );
};

export default PengajuanPkl;
