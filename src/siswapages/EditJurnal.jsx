import React from "react";

const EditJurnal = ({
  kegiatan,
  setKegiatan,
  status,
  setStatus,
  waktu,
  setWaktu,
  tanggal,
  setTanggal,
  handleSubmit
}) => {
  return (
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full sm:max-w-md sm:p-6">
          <div className="sm:flex sm:items-start">
            <form onSubmit={handleSubmit} className="max-w-md mx-auto">
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Kegiatan
                </label>
                <input
                  type="text"
                  value={kegiatan}
                  onChange={(e) => setKegiatan(e.target.value)}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="p-2 border rounded-md w-full"
                  required
                >
                  <option value="proses">Proses</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Waktu
                </label>
                <input
                  type="time"
                  value={waktu}
                  onChange={(e) => setWaktu(e.target.value)}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={tanggal}
                  onChange={(e) => setTanggal(e.target.value)}
                  className="p-2 border rounded-md w-full"
                  required
                />
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditJurnal;
