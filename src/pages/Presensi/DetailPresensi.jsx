import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { useParams } from "react-router-dom";

export function DetailPresensi() {
    const axios = useAxios();
    const [detailPresensi, setDetailPresensi] = useState();
    const { id } = useParams();

  useEffect(() => {
    axios
      .get(`/presensi/${id}`)
      .then((res) => {
        setDetailPresensi(res.data.data);
        console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="w-full flex flex-col gap-5 h-full">
          <p className="text-xl font-poppins font-semibold">Detail Presensi</p>
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
            {detailPresensi && (
                <div className="flex-col border border-gray/40 p-5 rounded-lg">
                  <div className="mb-3 flex items-end gap-2">
                      <p className="text-3xl font-poppins font-semibold">{detailPresensi.tingkat  + " " + detailPresensi.akronim + " " + detailPresensi.no_kelas}</p>
                      <p>{detailPresensi.nama_guru}</p>
                  </div>
                  <div className="flex">
                    <p className="font-poppins font-semibold text-xl">{detailPresensi.nama_materi}</p>
                  </div>
                </div>
            )}


        {/* {detailPresensi &&
          [...detailPresensi]
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .map((pre, i) => (
              <div key={i} className="card bg-white w-full shadow-lg border border-gray/50 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <p className="text-3xl font-poppins font-semibold rounded-lg mb-3 bg-blue_light p-3">
                    {pre.tingkat + " " + pre.akronim + " " + pre.no_kelas + " id : " + pre.id_presensi}
                  </p>
                  <p className="text-lg font-poppins font-normal">
                    {formatDateTime(new Date(pre.created_at))}
                  </p>
                </div>
                <div className="flex justify-between">
                  <div>
                    <p className="text-xl font-poppins font-semibold rounded">{pre.nama_materi}</p>
                    <p className="text-xl font-poppins font-light rounded">{pre.deskripsi}</p>
                  </div>
                  <button className="border rounded-lg px-4 py-1">Detail</button>
                </div>
              </div>
            ))} */}
        </div>
      </div>
    </AuthGuard>
  );
}
