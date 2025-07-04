import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAxios } from "../../utils/Provider";
import Swal from "sweetalert2";
import { Link, useLocation, useParams } from "react-router-dom";
import addIcon from "/icons/addIcon.svg";


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

function handleImport(){

}

function handleDeleteSiswa(e) {
  Swal.fire({
      title: "Yakin Ingin Menghapus siswa ini?",
      text: "Siswa yang hilang tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if(result.isConfirmed){
        axios.delete(`/siswa/${e.target.value}`)
        .then((res) => {
          Swal.fire({
            title: "Deleted!",
            text: "Your file has been deleted.",
            icon: "success",
          }).then(() => {
            window.location.reload();
          });
        }).catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err.response?.data?.message,
            icon: "error",
            confirmButtonText: "Tutup",
          });
        })
      }
    })
}

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
            <div className="flex p-4 justify-between items-center">
                <p className="text-2xl font-poppins font-semibold">Detail kelas {kelas?.tingkat + " " + kelas?.akronim + " " + kelas?.no_kelas}</p>
                {pathname.includes("/detail/") && pathname.includes("/addsiswa") ? (
                  <div className="flex gap-5">
                      <button onClick={handleImport} className="bg-blue/80 text-white font-poppins rounded-md px-2 py-1">Import CSV</button>
                      <Link to="/admin/kelas" className="p-4 py-2 text-white font-semibold rounded-lg bg-green/80">
                          Simpan
                      </Link>
                    </div>
                ) : (
                  <Link
                    to={`/admin/siswa/add/${id}`}
                    className="bg-green/80 font-poppins text-lg hover:bg-green transition-all duration-200 delay-100 hover:shadow-xl max-w-fit items text-white shadow-md font-bold px-3 py-2 mx-5 rounded-lg flex justify-between items-center"
                  >
                    <img src={addIcon} className={`transition-all duration-300 group-hover:scale-110 w-[35px]`} color="" alt="presensiIcon" />
                    <span className="px-2">Add Siswa</span>
                  </Link>
                )
              }
            </div>
            
            {pathname.includes("/detail/") && pathname.includes("/addsiswa") && (
                <form
            className="p-5 w-full bg-blue_dark text-white bg-opacity-90 rounded-lg"
            onSubmit={handleSubmitForm}
          >
            <div>
            <h1 className="text-xl font-bold">
                Add Siswa
            </h1>

            </div>
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
                {pathname.includes("/detail/") && pathname.includes("/addsiswa") ? (
                  ""
                ) : (
                  <th colSpan={3}>Aksi</th>
                )
              }
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
                            {pathname.includes("/detail/") && pathname.includes("/addsiswa") ? 
                            (
                              ""
                            ) : (
                              <td colSpan={3}>
                              <Link to={"/admin/siswa/update/" + kls.nis} className="bg-orange_scale py-1.5 px-4 rounded">
                                Edit
                              </Link>
                              <button
                                onClick={handleDeleteSiswa}
                                value={kls.nis}
                                className="bg-red py-1 px-4 rounded ml-4"
                              >
                                Delete
                              </button>{" "}
                            </td>
                            )
                          }
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
