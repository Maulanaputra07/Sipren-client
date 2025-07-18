import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAuth, useAxios } from "../../utils/Provider";
import { useLocation, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { Toaster, toast } from "react-hot-toast";

export function PresensiStarted() {
  const { id } = useParams();
  const auth = useAuth();
  const axios = useAxios();
  const [showModel, setShowModel] = useState();
  const [detPres, setDetPres] = useState();
  const [current, setCurrent] = useState({keterangan: "T", deskripsi_keterangan: ""});
  const [selectedIdDet, setSelectedIdDet] = useState(null);  

  const handleUpdateketerangan = (e) => {
    e.preventDefault();
    // console.log("id_det : " + selectedIdDet);
    axios
    .put(`detail_presensi/${selectedIdDet}`, {
      keterangan: current.keterangan,
      deskripsi_keterangan: current.deskripsi_keterangan
    })
    .then((res) => {
      const ketMap = {
        "T": { text: "Terlambat", color: "#ef4444" },
        "S": { text: "Sakit",  color: "#f97316" },
        "H": { text: "Hadir", color: "#22c55e" },
        "I": { text: "Izin", color: "#3b82f6" },
    };

    const ket = ketMap[current.keterangan] || { text: "Unknown", icon: "question", color: "#6b7280" };

        Swal.fire({
            position: "center",
            title: ket.text,
            text: res.data?.message,
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
        }).then(() => {
            fetchSiswa();
        });
    }).catch((err) => {
        console.log("error saat post : " + err.response?.data?.message || err.message);
    });

    setCurrent({
    keterangan: "",
    deskripsi_keterangan: "",
  });

    setShowModel(false);
  }

  const fetchSiswa = () => {
    axios
      .get(`/presensi/${id}`)
      .then((res) => {
        // console.log( "data :" +res.data.data?.detail_presensi.length);
        setDetPres(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const [rfidData, setRfidData] = useState("");

  function handleEnded() {
    localStorage.removeItem("sedangPresensi");

    axios.post(`/presensi/${id}/end`)
      .then((res) => {
        // console.log("berakhir");
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Presensi has been saved",
          showConfirmButton: true,
          timer: 1500,
        }).then(res => {
          window.location = '/guru/data_presensi' 
        });
      })
    }
    
  const handleKeterangan = (e) => {
    const value = e.target.value;

    if(value === "H"){
      setCurrent({ ...current, keterangan: value, deskripsi_keterangan: "-" });
    }else{
      setCurrent({ ...current, keterangan: value, deskripsi_keterangan: "" });
    }
  };

  const handleDeskripsiChange = (e) => {
  setCurrent({
    ...current,
    deskripsi_keterangan: e.target.value,
  });
};

  useEffect(() => {
    // const presensi = JSON.parse(localStorage.getItem("sedangPresensi"));

    // if(presensi && presensi.status && presensi.detail_presensi) {
    //   console.log("Sedang presensi dengan ID: ", presensi.id_presensi);

    //   if(window.location.pathname !== `/presensi/${presensi.id_presensi}`){
    //     window.location = `/presensi/${presensi.id_presensi}`
    //   }
    // }

    // cek validasi
    // if()

    
    fetchSiswa();
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    let buffer = "";

    const handleKeyDown = (event) => {
      const key = event.key;

      if (key === "Enter") {
        // console.log(buffer);
        setRfidData(buffer);
        axios
          .put(`/detail_presensi/${id}/present`, {
            rfid: buffer,
          })
          .then((res) => {
            Swal.fire({
            title: "Hadir",
            text: res.data?.message,
            icon: "success",
            showConfirmButton: false,
            timer: 1000,
        }).then(()=> {
          fetchSiswa();
        })
          })
          .catch((err) => {
            console.log(err);
            
            Swal.fire({
            title: "Error",
            text: err.response?.data?.message,
            icon: "error",
            showConfirmButton: false,
            timer: 1000,
          });

          });
        buffer = "";
      } else {
        buffer += key;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload)
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="w-fit sticky top-0 z-50 border bg-orange_main mb-3 text-[#333333] border-gray/40 px-5 py-2 text-xl font-semibold rounded-md shadow-md">
          <h1>{detPres?.tingkat} {detPres?.akronim} {detPres?.no_kelas} | {detPres?.mapel}</h1>
        </div>
        <div className="flex gap-1">
          <div>
            <h1 className="font-semibold font-poppins text-2xl px-5">Telah presensi</h1>
            <table className="table">
              <thead>
                <tr>
                  <th colSpan={2}>Nama Siswa</th>
                  <th>Keterangan</th>
                  <th>Deskripsi keterangan</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {Array.isArray(detPres?.detail_presensi) && detPres.detail_presensi.length > 0 ? (
                    detPres.detail_presensi
                    .filter((det) => det.keterangan !== "T")
                    .sort((a, b) => new Date(b.present_at) - new Date(a.present_at))
                    .map((det, index) => (
                      <tr key={index}>
                        <td className="px-3" colSpan={2}>{det.nama}</td>
                        <td>
                          {det.keterangan === "T"
                            ? "Tanpa Keterangan"
                            : det.keterangan === "I"
                            ? "Izin"
                            : det.keterangan === "S"
                            ? "Sakit"
                            : "Hadir"}
                        </td>
                        <td>{det.deskripsi_keterangan}</td>
                        <td>
                          <div className="flex justify-center">
                            <button onClick={() => { setShowModel(true); setSelectedIdDet(det.id_det);}}  className="bg-orange_scale p-2 px-8 rounded">Edit</button>
                          </div>
                        </td>
                      </tr>
                    //   if (det.keterangan !== "T") {
                    // return (
                    // );
                    //   }
                    //   return null;
                    ))
                  ) : (
                  <tr>
                  <td colSpan="3" className="text-center text-gray-500 py-4">
                    Belum terdapat siswa.
                  </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div>
            <h1 className="font-semibold text-black text-2xl px-5">Belum presensi</h1>
            <table className="table text-sm">
              <thead>
                <tr>
                  <th>Nama Siswa</th>
                  <th>Keterangan</th>
                  <th>Deskripsi keterangan</th>
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
                        <td>{det.deskripsi_keterangan === null ? "Belum melakukan presensi" : det.deskripsi_keterangan}</td>
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
          </div>
          

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
                    <option value="H">H - Hadir</option>
                    <option value="T">T - Tanpa Keterangan</option>
                    <option value="S">S - Sakit</option>
                    <option value="I">I - Izin</option>
                  </select>
                </div>

                {current.keterangan !== "H" && current.keterangan !== "" && (
                  <div>
                    <label className="block text-sm font-medium">Deskripsi Keterangan</label>
                    <input
                      type="text"
                      name="deskripsi_keterangan"
                      value={current.deskripsi_keterangan}
                      onChange={handleDeskripsiChange}
                      className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                      required
                    />
                  </div>
                )}

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
        <button
            className="w-fit fixed bottom-0 right-10 z-50 border bg-red mb-3 text-[#FAFAFA] border-gray/40 px-5 py-2 text-xl font-semibold rounded-md shadow-md"
            onClick={handleEnded}
          >
            Akhiri
          </button>
      </div>
    </AuthGuard>
  );
}
