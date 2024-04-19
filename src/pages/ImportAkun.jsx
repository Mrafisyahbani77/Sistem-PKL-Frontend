import React, { useRef } from 'react';
import axios from 'axios';

export default function ImportAkun() {
  const fileInputRef = useRef();

  const handleImport = async () => {
    const file = fileInputRef.current.files[0];

    if (!file) {
      alert('Please select a file');
      return;
    }

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      alert('File must be in Excel format (XLSX or XLS)');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://your-api-url/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Import successful');
    } catch (error) {
      alert('Import failed');
      console.error(error);
    }
  };

  return (
    <div>
      <input type="file" accept=".xlsx,.xls" ref={fileInputRef} style={{ display: 'none' }} onChange={handleImport} />
      <button onClick={() => fileInputRef.current.click()}>Import Excel File</button>
    </div>
  );
}
