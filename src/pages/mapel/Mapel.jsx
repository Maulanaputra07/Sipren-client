import { useEffect, useState } from "react";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAxios } from "../../utils/Provider";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import addIcon from "/icons/addIcon.svg";

export function Mapel(){
    let count = 1;
    const axios = useAxios();
    const [mapel, setMapel] = useState();
    const [showModel, setShowModel] = useState();
    const [current, setCurrent] = useState({nama_mapel: "", produktif: ""});
    const [isEdit, setIsEdit] = useState(false);

    function handleDeleteMapel(e){
        Swal.fire({
            title: "Yakin Ingin Menghapus Mapel ini?",
            text: "Mapel yang hilang tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
            }).then((result) => {
              if (result.isConfirmed) {
                console.log("id_mapel: "+ e.target.value);
                axios
                  .delete(`/mapel/${e.target.value}`)
                  .then((res) => {
                    Swal.fire({
                      title: "Deleted!",
                      text: "Mapel berhasil dihapus.",
                      icon: "success",
                    }).then(() => {
                      window.location.reload();
                    });
                  })
                  .catch((err) => {
                    Swal.fire({
                      title: "Error!",
                      text: err.response?.data?.message || err.message,
                      icon: "error",
                      confirmButtonText: "Tutup",
                    });
                  });
              }
            });
    }

    const handleJenisMapel = (e) => {
        setCurrent({ ...current, produktif: parseInt(e.target.value) });
        console.log("Value jenis mapel : " + e.target.value);
    };


    const handleAddMapel = (e) => {
        setIsEdit(false);
        setCurrent({nama_mapel: "", produktif: ""});
        setShowModel(true);
        e.preventDefault();
        axios
        .post('/mapel', {
            nama_mapel: e.target.nama_mapel.value,
            produktif: current.produktif
        })
        .then((res)=> {
            Swal.fire({
                title: "Success!",
                text: `${res.data?.message}`,
                icon: "success",
            }).then(() => {
                window.location.reload();
            });
        })
        .catch((err) => {
            console.log("error saat post : " + err.response?.data?.message || err.message);
        })

        setShowModel(false);
    }

    useEffect(() => {
        axios
        .get("/mapel")
        .then((res) => {
            setMapel(res.data.data);
        })
        .catch((err) => {
            console.log("error yg terjadi : " + err);
        })
    }, [])

    return(
        <AuthGuard>
        <div className="hero">
        <div className="flex-col gap-1">
            <button onClick={() => setShowModel(true)} className="bg-green/80 ml-2.5 flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green text-lg font-poppins font-semibold text-white">
              <img src={addIcon} className={`transition-all duration-300 group-hover:scale-110 w-[35px]`} color="" alt="presensiIcon" />
              Add Mapel
              </button>
            <div>
                <table className="table">
                    <thead>
                    <tr>
                        <th colSpan={1}>No.</th>
                        <th colSpan={4}>Mapel</th>
                        <th colSpan={3}>Jenis Mapel</th>
                        <th colSpan={3}>Aksi</th>
                    </tr>
                    </thead>
                    <tbody>
                    {mapel &&
                        mapel.map((mpl, i) => (
                        <tr key={i}>
                            <td colSpan={1}>{count++}</td>
                            <td colSpan={4}>
                                {mpl.nama_mapel}
                            </td>
                            <td colSpan={3}>
                                {mpl.produktif === 1 ? "Produktif" : "Normada"}
                            </td>
                            <td colSpan={3}>
                            <div className="flex gap-2 justify-center">
                                <button
                                onClick={handleDeleteMapel}
                                value={mpl.id_mapel}
                                className="bg-red/80 py-1 font-poppins px-4 rounded"
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

            {showModel && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4">Tambah Mapel</h2>
              <form onSubmit={handleAddMapel} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium">Nama Mapel</label>
                  <input
                    type="text"
                    name="nama_mapel"
                    className="mt-1 block w-full border rounded px-3 py-2"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium">Jenis Mapel</label>
                  <select
                    onChange={handleJenisMapel}
                    name="jenis_mapel"
                    className="mt-1 block w-full border border-gray-300 rounded px-3 py-2"
                    required
                  >
                    <option value="">Pilih Jenis</option>
                    <option value={1}>Produktif</option>
                    <option value={0}>Normada</option>
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
    )
}