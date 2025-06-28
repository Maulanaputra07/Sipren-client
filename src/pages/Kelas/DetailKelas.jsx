import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAxios } from "../../utils/Provider";
import Swal from "sweetalert2";
import { Link, useLocation, useParams } from "react-router-dom";

export function DetailKelas() {
    const {id} = useParams();
    let count = 1;
    const axios = useAxios();
    const [kelas, setKelas] = useState();
    const {pathname} = useLocation();
    const [current, setCurrent] = useState();

//   function handleDeleteKelas(e) {
//     Swal.fire({
//       title: "Yakin Ingin Menghapus Kelas?",
//       text: "Kelas yang hilang tidak bisa dikembalikan!",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#3085d6",
//       cancelButtonColor: "#d33",
//       confirmButtonText: "Yes, delete it!",
//     }).then((result) => {
//       if (result.isConfirmed) {
//         axios
//           .delete(`/kelas/${e.target.value}`)
//           .then((res) => {
//             Swal.fire({
//               title: "Deleted!",
//               text: "Your file has been deleted.",
//               icon: "success",
//             }).then(() => {
//               window.location.reload();
//             });
//           })
//           .catch((err) => {
//             Swal.fire({
//               title: "Error!",
//               text: err.response.data.message,
//               icon: "error",
//               confirmButtonText: "Tutup",
//             });
//           });
//       }
//     });
//   }

const fetchKelas = () => {
    axios
      .get(`/kelas/${id}`)
      .then((res) => {
        setKelas(res.data.data);
        console.log("data kelas: " + res.data.data)
      })
      .catch((err) => {
        console.log(err);
      });
}

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const payload = {
      nis: current.nis,
      rfid: current.rfid,
      nama: current.nama,
      id_kelas: id,
    };

    axios
      .post(`/siswa`, payload)
      .then((res) => {
       Swal.fire({
        title: "Sukses!",
        text: res.data.message,
        icon: "success",
        confirmButtonText: "OK",
      });

      fetchKelas();
      })
      .catch((err) => {
        console.log("payload :" + payload);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Terjadi kesalahan",
          icon: "error",
          confirmButtonText: "Tutup",
        });
      });
  };

  useEffect(() => {
    fetchKelas();
  }, []);
  
  return (
    <AuthGuard>
      <div className="hero">
        <div className="flex-col gap-1">
            <div className="flex p-4 justify-between">
                <p className="text-2xl font-poppins font-semibold">Detail kelas {kelas?.tingkat + " " + kelas?.akronim + " " + kelas?.no_kelas}</p>
                {pathname.includes("/detail/") && pathname.includes("/addsiswa") && (
                    <Link to="/admin/kelas" className="p-4 py-2 text-white font-semibold rounded-lg bg-green/80">
                        Simpan
                    </Link>
                )}
            </div>
            
            {pathname.includes("/detail/") && pathname.includes("/addsiswa") && (
                <form
            className="p-5 w-full bg-blue_dark text-white bg-opacity-90 rounded-lg"
            onSubmit={handleSubmitForm}
          >
            <h1 className="text-xl font-bold">
                Add Siswa
            </h1>
            <div className="flex flex-col mb-2">
              <label htmlFor="nama" className="p-2">
                Nama :
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                onChange={(e) => setCurrent({ ...current, nama: e.target.value })}
                className="text-blue_dark rounded p-2 px-3"
              />
            </div>
            <div className="flex flex-col mb-2">
              <label htmlFor="nis" className="p-2">
                NIS :
              </label>
              <input
                type="text"
                id="nis"
                name="nis"
                onChange={(e) => setCurrent({ ...current, nis: e.target.value })}
                className="text-blue_dark rounded p-2 px-3"
              />
            </div>
            <div className="flex flex-col mb-3">
              <label htmlFor="rfid" className="p-2">
                RFID :
              </label>
              <input
                type="text"
                id="rfid"
                name="rfid"
                onChange={(e) => setCurrent({ ...current, rfid: e.target.value })}
                className="text-blue_dark rounded p-2 px-3"
              />
            </div>

            {/* <div className="flex flex-col mb-5">
              <label htmlFor="jenis_kelamin" className="p-2">
                Jenis Kelamin :
              </label>
              <select
                id="jenis_kelamin"
                name="jenis_kelamin"
                onChange={handleChangeTingkat}
                value={current.jenis_kelamin}
                className="text-blue_dark rounded p-2 px-3 w-2/12"
              >
                <option value="1">Laki-Laki</option>
                <option value="0">Perempuan</option>
              </select>
            </div> */}

            <div className="flex w-full justify-end gap-3">
              <button type="submit" className="p-4 py-2 rounded bg-blue">
                Add
              </button>
            </div>
          </form>
            )}
            
            <table className="table">
            <thead>
              <tr>
                <th colSpan={1}>No.</th>
                <th colSpan={2}>NIS</th>
                <th colSpan={3}>RFID</th>
                <th colSpan={4}>Nama</th>
                {/* <th colSpan={3}>Aksi</th> */}
              </tr>
            </thead>
                <tbody>
                    {kelas && kelas.daftar_siswa.length > 0 ? (
                        kelas.daftar_siswa.map((kls, i) => (
                        <tr key={i}>
                            <td colSpan={1}>{count++}</td>
                            <td colSpan={2}>{kls.nis}</td>
                            <td colSpan={3}>{kls.rfid}</td>
                            <td colSpan={4}>{kls.nama}</td>
                        </tr>
                    ))
                    ) : (
                        <tr>
                            <td colSpan={10} className="bg-blue_light text-center py-3">
                                Belum terdapat siswa di kelas ini
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>
    </AuthGuard>
  );
}
