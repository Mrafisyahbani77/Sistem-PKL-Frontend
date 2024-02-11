import React from "react";
import Navpem from "./Navpem";
import Sidepem from "./Sidepem";


const Laysiswa = ({ children }) => {
  return (
    <div className="flex flex-col md:flex-row w-full h-screen">
      <Sidepem />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navpem />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-4">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Laysiswa;
