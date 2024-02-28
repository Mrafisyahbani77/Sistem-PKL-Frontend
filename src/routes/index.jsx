//import react
import React, { lazy, Suspense } from "react";

//import react router dom
import { Routes, Route } from "react-router-dom";

//import loader component
const Loader = lazy(() => import("../components/Loader.jsx"));

//import view Login
const Login = lazy(() => import("../views/Auth/Login.jsx"));

//forbidden
import Forbidden from "../routes/Forbidden.jsx"

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



//import view dashboard
const SiswaDashboard = lazy(() =>
  import("../views/Dashboard/SiswaDashboard.jsx")
);
const AdminDashboard = lazy(() =>
  import("../views/Dashboard/AdminDashboard.jsx")
);
const Pembimbing = lazy(() => import("../views/Dashboard/Pembimbing.jsx"));
const Kaprog = lazy(() => import("../views/Dashboard/Kaprog.jsx"));

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
      <Route path="/InfoPembimbing" element={<InfoPembimbing/>} />
  


      //pages siswa
      <Route path="/JurnalSiswa" element={<JurnalSiswa />} />
      <Route path="/Info" element={<Info />} />
      <Route path="/FormPengajuan" element={<FormPengajuan />} />
      <Route path="/Absensi" element={<Absensi />} />


     //forbidden

     <Route path="/Forbidden" element={<Forbidden />} />

    </Routes>

  );
}
