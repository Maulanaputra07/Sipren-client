import { useState } from "react";
import { BrowserRouter, Route, Routes, useParams } from "react-router-dom";
import Unpresensied from "./components/presensi/data/Unpresensied.jsx";
import Login from "./pages/Auth/Login.jsx";
import Guru from "./pages/Guru/Guru.jsx";
import TimeComponent from "./Temp.jsx";
import Presensi from "./pages/Presensi/Presensi.jsx";
import { DataPresensi } from "./pages/Presensi/Data.jsx";
import { AuthProvider } from "./utils/AuthProvider.jsx";
import { DataUser } from "./pages/Auth/DataUser.jsx";
import { Kelas } from "./pages/Kelas/Kelas.jsx";
import { EditDataUser } from "./pages/Auth/EditDataUser.jsx";
import { PresensiStarted } from "./pages/Presensi/PresensiStarted.jsx";
import { EditKelas } from "./pages/Kelas/EditKelas.jsx";
import RfidReader from "./utils/RFID/RfidReader.jsx";
import { Siswa } from "./pages/Siswa/Siswa.jsx";
import { EditSiswa } from "./pages/Siswa/EditSiswa.jsx";
import { AuthGuard } from "./utils/AuthGuard.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import { DetailPresensi } from "./pages/Presensi/DetailPresensi.jsx";
import { Mapel } from "./pages/mapel/Mapel.jsx";
import { DetailKelas } from "./pages/Kelas/DetailKelas.jsx";
import { JadwalGuru } from "./pages/Jadwal/JadwalGuru.jsx";
import { Jadwal } from "./pages/Jadwal/Jadwal.jsx";
import { EditJadwal } from "./pages/Jadwal/editJadwal.jsx";
import { Profile } from "./pages/Guru/profile.jsx";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
          path="/guru"
          element={
            <AuthGuard allowedLevels={[0]}>
              <Dashboard/>
            </AuthGuard>
          }>

            <Route index element={<Guru/>} />
            <Route path="profile" element={<Profile />} />
            <Route path="jadwal_guru" element={<JadwalGuru/>}/>
            <Route path="presensi" element={<Presensi />} />
            <Route path="presensi/:id" element={<PresensiStarted />} />
            <Route path="data_presensi" element={<DataPresensi />} />
            <Route path="data_presensi/update/:id" element={<DetailPresensi />} />
          </Route>

          <Route
          path="/admin"
          element={
            <AuthGuard allowedLevels={[1]}>
              <Dashboard/>
            </AuthGuard>
          }>

            <Route index element={<Guru/>} />
            {/* <Route path="data_presensi" element={<DataPresensi />} /> */}
            <Route path="guru" element={<Guru />} />
            <Route path="presensi" element={<Presensi />} />
            <Route path="data_user" element={<DataUser />} />
            <Route path="data_user/add" element={<EditDataUser />} />
            <Route path="data_user/update/:id" element={<EditDataUser />} />

            <Route path="mapel" element={<Mapel />} />

            <Route path="jadwal" element={<Jadwal/>} />
            <Route path="jadwal/add" element={<EditJadwal/>} />
            <Route path="jadwal/update/:id" element={<EditJadwal/>} />

            <Route path="kelas" element={<Kelas />} />
            <Route path="kelas/update/:id" element={<EditKelas />} />
            <Route path="kelas/add" element={<EditKelas />} />
            <Route path="kelas/:id/addsiswa" element={<EditSiswa />} />
            <Route path="kelas/detail/:id" element={<DetailKelas/>} />
            <Route path="kelas/detail/:id/addsiswa" element={<DetailKelas/>} />

            {/* <Route path="siswa" element={<Siswa />} /> */}
            <Route path="siswa/add/:id" element={<EditSiswa />} />
            <Route path="siswa/update/:nis" element={<EditSiswa />} />
          </Route>
          
          <Route path="/data_presensi" element={<DataPresensi />} />
          <Route path="/unpre" element={<Unpresensied />} />
          <Route path="/rfid" element={<RfidReader />} />
          <Route path="/temp" element={<TimeComponent />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
