import React from "react";
import Siswasd from "./Siswasd";
import Navsw from "./Navsw";

const Laysiswa = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Siswasd />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navsw />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Laysiswa;
