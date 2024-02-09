import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";
//icons
import { MdDashboard } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(Cookies.get("user"));

  const Menus = [
    {
      title: "Admin Dashboard",
      icon: <MdDashboard style={{ fontSize: "24px" }} />,
      path: "/AdminDashboard",
    },
    {
      title: "Tambah User",
      icon: <TiUserAdd style={{ fontSize: "24px" }} />,
      path: "/Crud",
    },
    { title: "Jurnal Siswa", icon:<FaBook style={{ fontSize: "24px" }}/>, gap: true, path: "/Jurnal" },
    { title: "PengajuanPkl", src: "Search", path: "/PengajuanPkl" },
    { title: "Inbox", src: "Chat", path: "/Inbox" },
    { title: "ControlAbsen", src: "Chart", path: "/ControlAbsen" },
    { title: "DataPengajuan", src: "Folder", gap: true, path: "/DataPengajuan" },
    { title: "Setting", src: "Setting", path: "/Setting" },
  ];

  const handleNavigate = (path) => {
    navigate(path);
  };

  return (
    <div className="flex h-screen">
      <div
        className={`${
          open ? "w-72" : "w-20 "
        } bg-gray-800 h-screen p-5 pt-8 relative duration-300`}
      >
        <img
          src="./src/assets/control.png"
          alt="Control Icon"
          className={`absolute cursor-pointer -right-3 top-9 w-7 border-gray-800
           border-2 rounded-full ${!open && "rotate-180"}`}
          onClick={() => setOpen(!open)}
        />
        <div className={`flex gap-x-4 items-center ${!open && "scale-0"}`}>
          <div className="ml-3 relative">
            <div className="flex items-center cursor-pointer focus:outline-none w-full pr-10">
              <img
                className="h-12 w-12 rounded-full border-blue-800 border-2"
                alt={`Foto profil ${user.name}`}
                src={`https://ui-avatars.com/api/?name=${user.name}&background=31316a&color=ffffff&size=100`}
              />
              <div className="ml-2 text-white font-semibold text-lg">
                {user.name}
                <br />
                {user.email}
              </div>
            </div>
          </div>
        </div>
        <ul className="pt-6">
          {Menus.map((Menu, index) => (
            <li
              key={index}
              className={`flex rounded-md p-2 cursor-pointer  hover:bg-gray-600 text-white text-sm items-center gap-x-4 
              ${Menu.gap ? "mt-9" : "mt-5"} ${index === 0 && "bg-light-gray"} ${location.pathname === Menu.path ? "bg-gray-600" : ""}`}
              onClick={() => handleNavigate(Menu.path)}
            >
              {Menu.icon ? (
                <span className="mr-2">{Menu.icon}</span>
              ) : (
                <img
                  src={`./src/assets/${Menu.src}.png`}
                  alt={Menu.title}
                  className={`text-dark-gray transition-all duration-300 ${
                    !open && "filter grayscale"
                  }`}
                />
              )}
              <span className={`${!open && "hidden"} origin-left duration-200`}>
                {Menu.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
