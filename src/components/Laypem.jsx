import React from "react";
import Navpem from "./Navpem";
import Sidepem from "./Sidepem";


const Laysiswa = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidepem />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navpem />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 ">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Laysiswa;
