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
  const [showModel, setShowModel] = useState();
  const [detPres, setDetPres] = useState();
  const [current, setCurrent] = useState({keterangan: "T"});
  const [selectedIdDet, setSelectedIdDet] = useState(null);  

  const handleUpdateketerangan = (e) => {
    e.preventDefault();
    console.log("id_det : " + selectedIdDet);
    axios
    .put(`detail_presensi/${selectedIdDet}`, {
      keterangan: current.keterangan
    })
    .then((res) => {
        Swal.fire({
            title: "Success!",
            text: `${res.data?.message}`,
            icon: "success",
        }).then(() => {
            window.location.reload();
        });
    }).catch((err) => {
        console.log("error saat post : " + err.response?.data?.message || err.message);
    });

    setShowModel(false);
  }


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

  const handleKeterangan = (e) => {
    setCurrent({ ...current, keterangan: e.target.value });
    console.log("Value Keterangan : " + e.target.value);
  };

  useEffect(() => {
    let buffer = "";

    const handleKeyDown = (event) => {
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
          <h1 className="font-semibold font-poppins text-2xl px-5">Telah presensi</h1>
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
                          <button onClick={() => { setShowModel(true); setSelectedIdDet(det.id_det);}}  className="bg-orange_scale p-2 px-8 rounded">Edit</button>
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
                          <button onClick={() => { setShowModel(true); setSelectedIdDet(det.id_det);}}  className="bg-orange_scale p-2 px-8 rounded">Edit</button>
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
                    <option value="">Keterangan</option>
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
        </div>
      </div>
    </AuthGuard>
  );
}
