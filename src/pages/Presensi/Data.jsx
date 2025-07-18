import React, { useEffect, useState } from "react";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { Link, useLocation } from "react-router-dom";

export function DataPresensi() {
  const axios = useAxios();
  const [presensi, setPresensi] = useState();
  const [guru, setGuru] = useState();
  const {pathname} = useLocation();
  const [selectedGuru, setSelectedGuru] = useState("");
  
  const fetchPresensiGuru = () => {
    axios
      .get("/presensi/mine")
      .then((res) => {
        setPresensi(res.data.data);
        console.log("presensi: " + res.data?.data?.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const handleChangeGuru = (e) => {
    console.log("value guru: ", e.target ? e.target.value : e);
    setSelectedGuru(e.target ? e.target.value : e)
  }

  const fetchGuru = () => {
        axios.get('/users')
        .then((res) => {
            setGuru(res.data?.data);
        })
        .catch((err) => {
            console.log("err :" + err?.message);
        })
    }

  const fetchPresensiAdmin = () => {
    axios
      .get("/presensi/")
      .then((res) => {
        setPresensi(res.data.data);
        console.log("presensi: " + res.data?.data?.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    if(pathname.includes('/admin/data_presensi')){
      fetchGuru();
      fetchPresensiAdmin();
    }else{
      fetchPresensiGuru();
    }

  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="w-full flex flex-col gap-5 h-full">
          <p className="text-xl font-poppins font-semibold">Daftar Presensi</p>
          {pathname.includes('/admin/data_presensi') && (
            <div>
              <select className="border px-3 py-2 rounded-md" name="guru" id="guru" onChange={handleChangeGuru}>
                <option value="" disabled hidden>Pilih guru</option>
                <option value="">All</option>
                {guru && 
                    guru
                    .filter((item) => item.level === 0)
                    .map((item, i) => (
                        <option key={i} value={item.username}>
                            <p>{`${item.nama} ( ${item.username} )`}</p>
                        </option>
                    ))
                }
              </select>
            </div>
          )}
        {presensi && presensi.length > 0 ? (
          (() => {
            const dataTampil = selectedGuru ? [...presensi].filter((pre) => pre.username === selectedGuru) : [...presensi];

            if(dataTampil.length === 0){
              return <p className="font-semibold text-2xl text-center bg-blue_light p-3 rounded-lg">Guru ini tidak memiliki history presensi</p>
            }

            return dataTampil
            .sort((a, b) => new Date(b.presensi_mulai) - new Date(a.presensi_mulai))
            .map((pre, i) => (
              <div key={i} className="card bg-white w-full shadow-lg border border-gray/50 p-5 rounded-lg">
                <div className="flex justify-between items-center mb-5">
                  <p className="text-3xl font-poppins font-semibold rounded-lg mb-3 bg-blue_light p-3">
                    {pre.tingkat + " " + pre.akronim + " " + pre.no_kelas}
                  </p>
                  <p className="text-lg font-poppins font-normal">
                    {formatDateTime(new Date(pre.presensi_mulai))}
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xl font-poppins font-semibold rounded">{pathname.includes('/admin/data_presensi') ? pre.nama : ""}</p>
                    <p className="text-xl font-poppins font-semibold rounded">{pre.nama_mapel} - {pre.nama_materi}</p>
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
            ));
          })() ) : (
            <p>Belum terdapat daftar presensi</p>
          )}
        </div>
      </div>
    </AuthGuard>
  );
}
