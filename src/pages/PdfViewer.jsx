import React, { useState } from 'react';
import Modal from './Modal';

const PdfViewer = ({ pdfUrl }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      <button onClick={openModal}>Lihat PDF</button>
      <Modal isOpen={isModalOpen} onClose={closeModal} pdfUrl={pdfUrl} />
    </div>
  );
};

export default PdfViewer;
