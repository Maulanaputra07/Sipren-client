import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAuth, useAxios } from "../../utils/Provider";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export function PresensiStarted() {
  const { id } = useParams();
  const auth = useAuth();
  const axios = useAxios();

  const [detPres, setDetPres] = useState();

  useEffect(() => {
    axios
      .get(`/presensi/${id}`)
      .then((res) => {
        console.log( "data :" +res.data.data);
        setDetPres(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const [rfidData, setRfidData] = useState("");

  function handleEnded() {
    Swal.fire({
      position: "center",
      icon: "success",
      title: "Presensi has been saved",
      showConfirmButton: true,
      timer: 1500,
    }).then(res => {
      window.location = '/guru/data_presensi' 
    });
  }

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (event) => {
      // Tangkap semua karakter
      const key = event.key;

      if (key === "Enter") {
        console.log(buffer);
        setRfidData(buffer);
        axios
          .put(`/detail_presensi/${id}/present`, {
            rfid: buffer,
          })
          .then((res) => {
            window.location.reload();
          })
          .catch((err) => {
            console.log(err);
          });
        buffer = "";
      } else {
        buffer += key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="flex-col gap-1">
          <h1 className="font-semibold font-poppins text-2xl px-5">{}</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Nama Siswa</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(detPres?.detail_presensi) && detPres.detail_presensi.length > 0 ? (
                  detPres.detail_presensi.map((det, index) => {
                    if (det.keterangan !== "T") {
                  return (
                    <tr key={index}>
                      <td>{det.nama}</td>
                      <td>
                        {det.keterangan === "T"
                          ? "Tanpa Keterangan"
                          : det.keterangan === "I"
                          ? "Izin"
                          : det.keterangan === "S"
                          ? "Sakit"
                          : "Hadir"}
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button className="bg-orange_scale p-2 px-8 rounded">Edit</button>
                        </div>
                      </td>
                    </tr>
                  );
                    }
                    return null;
                  })
                ) : (
                <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  Belum terdapat siswa.
                </td>
                </tr>
              )}
            </tbody>
          </table>
                {/* <p className="w-full text-center text-xl font-poppins">Belum terdapat siswa di kelas ini</p> */}
          <h1 className="font-semibold text-black text-2xl px-5">Belum presensi</h1>
          <table className="table">
            <thead>
              <tr>
                <th>Nama Siswa</th>
                <th>Keterangan</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(detPres?.detail_presensi) && detPres.detail_presensi.length > 0 ? (
                  detPres.detail_presensi.map((det, index) => {
                    if (det.keterangan === "T") {
                  return (
                    <tr key={index}>
                      <td>{det.nama}</td>
                      <td>
                        {det.keterangan === "T"
                          ? "Tanpa Keterangan"
                          : det.keterangan === "I"
                          ? "Izin"
                          : det.keterangan === "S"
                          ? "Sakit"
                          : "Hadir"}
                      </td>
                      <td>
                        <div className="flex justify-center">
                          <button className="bg-orange_scale p-2 px-8 rounded">Edit</button>
                        </div>
                      </td>
                    </tr>
                  );
                    }
                    return null;
                  })
                ) : (
                <tr>
                <td colSpan="3" className="text-center text-gray-500 py-4">
                  Belum terdapat siswa.
                </td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="bg-red sticky bottom-5 left-full text-white p-5 py-2 rounded"
            onClick={handleEnded}
          >
            Akhiri
          </button>
        </div>
      </div>
    </AuthGuard>
  );
}
