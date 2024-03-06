//import react
import React, { lazy, Suspense } from "react";

//import react router dom
import { Routes, Route } from "react-router-dom";

//import loader component
const Loader = lazy(() => import("../components/Loader.jsx"));

//import view Login
const Login = lazy(() => import("../views/Auth/Login.jsx"));

//forbidden
import Forbidden from "../routes/Forbidden.jsx";

//pages admin
import Crud from "../pages/Crud.jsx";
import Jurnal from "../pages/Jurnal.jsx";
import Perusahaan from "../pages/Perusahaan.jsx";
import Edit from "../pages/Edit.jsx";
import PengajuanPkl from "../pages/PengajuanPkl.jsx";
import ControlAbsen from "../pages/ControlAbsen.jsx";
import DataPengajuan from "../pages/DataPengajuan.jsx";
import DataSppd from "../pages/DataSppd.jsx";
import InfoPembimbing from "../pages/InfoPembimbing.jsx";

//pages siswa
import JurnalSiswa from "../siswapages/JurnalSiswa.jsx";
import Info from "../siswapages/Info.jsx";
import FormPengajuan from "../siswapages/FormPengajuan.jsx";
import Absensi from "../siswapages/Absensi.jsx";

//kaprog
import Absensikap from "../Kaprog/Absensikap.jsx";
import Jurnalkap from "../Kaprog/Jurnalkap.jsx";
import LihatPembimbing from "../Kaprog/LihatPembimbing.jsx";

//pembimbing
import Sppd from "../pempages/Sppd.jsx";
import Absenpem from "../pempages/Absenpem.jsx";
import Jurpem from "../pempages/Jurpem.jsx";

//import view dashboard
import SiswaDashboard from "../views/Dashboard/SiswaDashboard.jsx"

import AdminDashboard from "../views/Dashboard/AdminDashboard.jsx"
import Kaprog from "../views/Dashboard/Kaprog.jsx"
import Pembimbing from "../views/Dashboard/Pembimbing.jsx"



export default function RoutesIndex() {
  return (
    <Routes>
      {/* route "/" */}
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <Login />
          </Suspense>
        }
      />
      
      //dashboard
      <Route path="/SiswaDashboard" element={<SiswaDashboard />} />
      <Route path="/AdminDashboard" element={<AdminDashboard />} />
      <Route path="/PembimbingDashboard" element={<Pembimbing />} />
      <Route path="/KaprogDashboard" element={<Kaprog />} />

      //pages admin
      <Route path="/Crud" element={<Crud />} />
      <Route path="/Jurnal" element={<Jurnal />} />
      <Route path="/Perusahaan" element={<Perusahaan />} />
      <Route path="/Edit" element={<Edit />} />
      <Route path="/ControlAbsen" element={<ControlAbsen />} />
      <Route path="/PengajuanPkl" element={<PengajuanPkl />} />
      <Route path="/DataPengajuan" element={<DataPengajuan />} />
      <Route path="/DataSppd" element={<DataSppd />} />
      <Route path="/InfoPembimbing" element={<InfoPembimbing />} />

      //Kaprog
      <Route path="/Absensikap" element={<Absensikap />} />
      <Route path="/Jurnalkap" element={<Jurnalkap />} />
      <Route path="/LihatPembimbing" element={<LihatPembimbing />} />

      //pages siswa
      <Route path="/JurnalSiswa" element={<JurnalSiswa />} />
      <Route path="/Info" element={<Info />} />
      <Route path="/FormPengajuan" element={<FormPengajuan />} />
      <Route path="/Absensi" element={<Absensi />} />

      //pembimbing
      <Route path="/Sppd" element={<Sppd />} />
      <Route path="/Absenpem" element={<Absenpem />} />
      <Route path="/Jurpem" element={<Jurpem />} />

      //forbidden
      <Route path="/Forbidden" element={<Forbidden />} />
    </Routes>
  );
}
