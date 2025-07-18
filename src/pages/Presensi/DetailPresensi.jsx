import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";

export function DetailPresensi() {
    const axios = useAxios();
    const [detailPresensi, setDetailPresensi] = useState();
    const { id } = useParams();
    const [showModel, setShowModel] = useState();
    const [selectedIdDet, setSelectedIdDet] = useState(null);  
    const [current, setCurrent] = useState({keterangan: "H"});
    const totalSiswa = detailPresensi?.detail_presensi?.length || 0;
    const hadirCount = detailPresensi?.detail_presensi?.filter(s => s.keterangan === 'H').length;
    const tidakHadirCount = detailPresensi?.detail_presensi?.filter(s => s.keterangan === 'T').length;
    const location = useLocation();
    const pathname = location.pathname;



    const fetchSiswa = () => {
      axios
      .get(`/presensi/${id}`)
      .then((res) => {
        setDetailPresensi(res.data.data);
        // console.log(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
    }

  const handleUpdateketerangan = (e) => {
      e.preventDefault();
      // console.log("id_det : " + selectedIdDet);
      axios
      .put(`detail_presensi/${selectedIdDet}`, {
        keterangan: current.keterangan
      })
      .then((res) => {
        Swal.fire({
            title: "Success!",
            text: "Berhsil edit keterangan siswa",
            icon: "success",
        })
          fetchSiswa();
      }).catch((err) => {
          console.log("error saat post : " + err.response?.data?.message || err.message);
      });
  
      setShowModel(false);
  }

  const handleKeterangan = (e) => {
    setCurrent({ ...current, keterangan: e.target.value });
    // console.log("Value Keterangan : " + e.target.value);
  };

  useEffect(() => {
    fetchSiswa();
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="w-full flex flex-col gap-5 h-full">
          <p className="text-xl font-poppins font-semibold">Detail Presensi</p>
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
                              <th className="border px-4 py-2 text-left">Deskripsi keterangan</th>
                              <th className="border px-4 py-2 text-left">Hadir pada</th>
                              {pathname.includes('/guru/data_presensi') && (
                                <th className="border px-4 py-2 text-left">Aksi</th>
                              )}
                            </tr>
                          </thead>
                          <tbody>
                            {detailPresensi.detail_presensi
                            .sort((a, b) => a.nama.localeCompare(b.nama))
                            .map((siswa, index) => (
                              <tr key={index} className="hover:bg-gray-100">
                                <td className="border px-4 py-2">{index + 1}</td>
                                <td className="border px-4 py-2">{siswa.nama}</td>
                                <td className="border px-4 py-2">{siswa.keterangan}</td>
                                <td className="border px-4 py-2">{siswa.deskripsi_keterangan}</td>
                                <td className="border px-4 py-2">{ siswa.present_at == null ? "-" : formatDateTime(new Date(siswa.present_at))}</td>
                                {pathname.includes('/guru/data_presensi') && (
                                  <td className="border px-4 py-2">
                                    <button onClick={() => { setShowModel(true); setSelectedIdDet(siswa.id_det);}}  className="bg-orange_scale p-2 px-3 rounded">Edit</button>
                                  </td>
                                )}
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

            {showModel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Tambah Mapel</h2>
              <form onSubmit={handleUpdateketerangan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Keterangan</label>
                  <select
                    onChange={handleKeterangan}
                    name="keterangan"
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Pilih Keterangan</option>
                    <option value="H">H</option>
                    <option value="T">T</option>
                    <option value="S">S</option>
                    <option value="I">I</option>
                  </select>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModel(false)}
                    className="px-4 py-2 bg-gray-300 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-green text-white rounded"
                  >
                    Simpan
                  </button>
                </div>
              </form>
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
