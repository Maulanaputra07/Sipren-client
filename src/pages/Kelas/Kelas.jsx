import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAxios } from "../../utils/Provider";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import addIcon from "/icons/addIcon.svg";

export function Kelas() {
  let count = 1;
  const axios = useAxios();
  const [kelas, setKelas] = useState();

  function handleDeleteKelas(e) {
    Swal.fire({
      title: "Yakin Ingin Menghapus Kelas?",
      text: "Kelas yang hilang tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/kelas/${e.target.value}`)
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            }).then(() => {
              window.location.reload();
            });
          })
          .catch((err) => {
            Swal.fire({
              title: "Error!",
              text: err.response.data.message,
              icon: "error",
              confirmButtonText: "Tutup",
            });
          });
      }
    });
  }

  useEffect(() => {
    axios
      .get("/kelas")
      .then((res) => {
        setKelas(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  
  return (
    <AuthGuard>
      <div className="hero">
        <div className="flex-col gap-1">
          <Link
            to={"add"}
            className="bg-green/80 font-poppins text-lg hover:bg-green transition-all duration-200 delay-100 hover:shadow-xl max-w-fit items text-white shadow-md font-bold px-3 py-2 mx-5 rounded-lg flex justify-between items-center"
          >
            <img src={addIcon} className={`transition-all duration-300 group-hover:scale-110 w-[35px]`} color="" alt="presensiIcon" />
            <span className="px-2">Add kelas</span>
          </Link>
          <table className="table">
            <thead>
              <tr>
                <th colSpan={1}>No.</th>
                <th colSpan={4}>Kelas</th>
                <th colSpan={3}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {kelas &&
                kelas.map((kls, i) => (
                  <tr key={i}>
                    <td colSpan={1}>{count++}</td>
                    <td
                      colSpan={4}
                    >{`${kls.tingkat} ${kls.akronim} ${kls.no_kelas}`}</td>
                    <td colSpan={3}>
                      <div className="flex gap-2 justify-center">
                        <Link
                            to={"detail/" + kls.id_kelas}
                            className="bg-white text-black border-2 border-orange_scale py-1 px-4 rounded"
                          >
                            Detail
                          </Link>
                        <Link
                            to={"update/" + kls.id_kelas}
                            className="bg-orange_scale py-1 px-4 rounded"
                          >
                            Edit
                          </Link>
                        <button
                          onClick={handleDeleteKelas}
                          value={kls.id_kelas}
                          className="bg-red py-1 px-4 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
