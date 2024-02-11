import React from "react";
import Navkap from "./Navkap"
import Sidekap from "./Sidekap"

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidekap />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Navkap />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
