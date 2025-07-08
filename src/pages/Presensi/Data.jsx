import React, { useEffect, useState } from "react";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { Link } from "react-router-dom";

export function DataPresensi() {
  const axios = useAxios();
  const [presensi, setPresensi] = useState();

  useEffect(() => {
    axios
      .get("/presensi/mine")
      .then((res) => {
        setPresensi(res.data.data);
        console.log("presensi: " + res.data?.data?.length);
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
        {presensi && presensi.length > 0 ? (
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
                  <Link
                    to={"update/" + pre.id_presensi}
                    className="bg-orange_scale py-1 px-4 rounded"
                  >
                    Detail
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p>Belum terdapat daftar presensi</p>
          )
          }
        </div>
      </div>
    </AuthGuard>
  );
}
