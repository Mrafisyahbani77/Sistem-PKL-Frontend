import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';

const PdfViewer = ({ fileName }) => {
  const [numPages, setNumPages] = useState(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  return (
    <div>
      <Document
        file={`http://localhost:8000/storage/${fileName}`}
        onLoadSuccess={onDocumentLoadSuccess}
      >
        {Array.from(new Array(numPages), (el, index) => (
          <Page key={`page_${index + 1}`} pageNumber={index + 1} />
        ))}
      </Document>
      {numPages && (
        <p>
          Page 1 of {numPages}
        </p>
      )}
    </div>
  );
};

export default PdfViewer;
