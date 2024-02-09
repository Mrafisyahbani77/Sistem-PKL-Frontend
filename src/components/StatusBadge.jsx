import React from "react";

const StatusBadge = ({ status }) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'proses':
        return 'bg-blue-500';
      case 'selesai':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(status)}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
