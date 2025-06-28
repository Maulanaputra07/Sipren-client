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
    const totalSiswa = detailPresensi?.detail_presensi?.length || 0;
    const hadirCount = detailPresensi?.detail_presensi?.filter(s => s.keterangan === 'H').length;
    const tidakHadirCount = detailPresensi?.detail_presensi?.filter(s => s.keterangan === 'T').length;

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
              <div>
                <div className="card flex-col border border-gray/40 p-5 rounded-lg">
                <div className="flex justify-between">
                    <div className="mb-3 gap-2">
                        <p className="text-3xl font-poppins font-semibold">{detailPresensi.tingkat  + " " + detailPresensi.akronim + " " + detailPresensi.no_kelas}</p>
                        <p className="font-poppins">{detailPresensi.nama_guru} - {detailPresensi.mapel}</p>
                    </div>
                  <div className="flex gap-5">
                      <div className="bg-gray/40 bg-opacity-25 w-50 text-black rounded-lg px-4 py-2 font-poppins">
                        <p className="text-lg"> Total Siswa </p>
                        <p className="text-lg text-center"> {totalSiswa} </p>
                      </div>
                      <div className="bg-green/50 bg-opacity-25 w-50 rounded-lg px-4 py-2 text-white font-poppins">
                        <p className="text-lg"> Hadir </p>
                        <p className="text-lg text-center"> {hadirCount} </p>
                      </div>
                      <div className="bg-red/50 bg-opacity-25 w-50 rounded-lg px-4 py-2 text-white font-poppins">
                        <p className="text-lg"> Tidak Hadir </p>
                        <p className="text-lg text-center"> {tidakHadirCount} </p>
                      </div>
                  </div>
                </div>
                  <div>
                    <div>
                      <div className="flex-col gap-5 items-center">
                        <p className="font-poppins font-semibold text-xl"> {detailPresensi.nama_materi}</p>
                        <p className="font-poppins font-normal text-xl">{detailPresensi.deskripsi}</p>
                      </div>
                    </div>
                  </div>
                </div>
                    {detailPresensi.detail_presensi.length > 0 && (
                      <div className="mt-5 overflow-hidden shadow">
                        <table className="w-full border-collapse">
                          <thead>
                            <tr className="bg-blue_light">
                              <th className="border px-4 py-2 text-left">No</th>
                              <th className="border px-4 py-2 text-left">Nama</th>
                              <th className="border px-4 py-2 text-left">Keterangan</th>
                              <th className="border px-4 py-2 text-left">Hadir pada</th>
                            </tr>
                          </thead>
                          <tbody>
                            {detailPresensi.detail_presensi.map((siswa, index) => (
                              <tr key={index} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{siswa.nama}</td>
                                <td className="border px-4 py-2">{siswa.keterangan}</td>
                                <td className="border px-4 py-2">{formatDateTime(new Date(siswa.present_at))}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                <div>

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
