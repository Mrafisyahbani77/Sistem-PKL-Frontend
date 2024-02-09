import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';

const Inbox = () => {
  const [emails, setEmails] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/admin/get-emails')
      .then(response => {
        setEmails(response.data);
      })
      .catch(error => {
        console.error('Error fetching emails:', error);
      });
  }, []);

  return (
    <div className='flex'>
      <Sidebar/>
      <h2 className="text-2xl font-bold mb-4">Email List</h2>
      <ul>
        {emails.map((email, index) => (
          <li key={index} className="mb-4 border p-4 rounded">
            <strong className="block mb-2 text-lg font-semibold">{email.subject}</strong>
            <div className="text-gray-700">{email.from}</div>
            <p className="mt-2">{email.body}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Inbox;
