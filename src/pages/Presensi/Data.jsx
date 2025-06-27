import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { Link } from "react-router-dom";

export function DataPresensi() {
  const axios = useAxios();
  const [presensi, setPresensi] = useState();

  useEffect(() => {
    axios
      .get("/presensi")
      .then((res) => {
        setPresensi(res.data.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="w-full flex flex-col gap-5 h-full">
          <p className="text-xl font-poppins font-semibold">Daftar Presensi</p>
          {/* <table className="w-full table">
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Kelas</th>
                <th>Nama Guru</th>
                <th>Materi</th>
                <th>Deskripsi</th>
              </tr>
            </thead>
            <tbody>
              {presensi &&
                presensi.map((pre, i) => (
                  <tr key={i}>
                    <td>{formatDateTime(new Date(pre.created_at))}</td>
                    <td>{`${pre.tingkat} ${pre.akronim} ${pre.no_kelas}`}</td>
                    <td>{pre.nama}</td>
                    <td>{pre.nama_materi}</td>
                    <td>{pre.deskripsi}</td>
                  </tr>
                ))}
            </tbody>
          </table> */}
        {presensi &&
          [...presensi]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((pre, i) => (
              <div key={i} className="card bg-white w-full shadow-lg border border-gray/50 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <p className="text-3xl font-poppins font-semibold rounded-lg mb-3 bg-blue_light p-3">
                    {pre.tingkat + " " + pre.akronim + " " + pre.no_kelas}
                  </p>
                  <p className="text-lg font-poppins font-normal">
                    {formatDateTime(new Date(pre.created_at))}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-poppins font-semibold rounded">{pre.nama_materi}</p>
                    <p className="text-xl font-poppins font-light rounded">{pre.deskripsi}</p>
                  </div>
                  {/* <button className="border rounded-lg px-4 py-1">Detail</button> */}
                  <Link
                    to={"update/" + pre.id_presensi}
                    className="bg-orange_scale py-1 px-4 rounded"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))}
        </div>
      </div>
    </AuthGuard>
  );
}
