import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useEffect, useState } from "react";
import { useAxios } from "../../utils/Provider";
import Swal from "sweetalert2";

export const EditSiswa = () => {
  const { nis, id } = useParams();
  const axios = useAxios();
  const [current, setCurrent] = useState({
    rfid: "",
    nama: "",
    nis: "",
    kelas: 1,
  });
  const pathname = window.location.pathname;
  const [kelas, setKelas] = useState([]);

  const handleChangeJurusan = (e) => {
    setCurrent({ ...current, jurusan: e.target.value });
  };

  const handleChangeTingkat = (e) => {
    setCurrent({ ...current, jenis_kelamin: parseInt(e.target.value) });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    const payload = {
      nis: current.nis,
      rfid: current.rfid,
      nama: current.nama,
      id_kelas: id,
    };

    if (pathname.includes("/update")) {
      axios
        .put(`/siswa/${nis}`, payload)
        .then((res) => {
          window.location = `/admin/kelas/detail/${current.id_kelas}`;
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err.response?.data?.message || "Terjadi kesalahan",
            icon: "error",
            confirmButtonText: "Tutup",
          });
        });
    } else {
      axios
        .post(`/siswa`, payload)
        .then((res) => {
          window.location = `/admin/kelas/detail/${id}`;
        })
        .catch((err) => {
          // console.log("payload :" + payload);
          Swal.fire({
            title: "Error!",
            text: err.response?.data?.message || "Terjadi kesalahan",
            icon: "error",
            confirmButtonText: "Tutup",
          });
        });
    }
  };

  useEffect(() => {
    if (pathname.includes("/update")) {
      axios
        .get(`/siswa/${nis}`)
        .then((res) => {
          setCurrent(res.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    axios
      .get("/kelas")
      .then((res) => {
        setKelas(res.data.data);
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "Error!",
          text: err.response?.data?.message || "Terjadi kesalahan",
          icon: "error",
          confirmButtonText: "Tutup",
        });
      });
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="">
          <form
            className="p-5 w-full bg-blue_dark text-white bg-opacity-90 rounded-lg"
            onSubmit={handleSubmitForm}
          >
            <h1 className="text-3xl font-bold pb-7">
              {pathname.includes("/update") ? "Update " : "Add "} Siswa
            </h1>

            <div className="flex flex-col mb-5">
              <label htmlFor="nis" className="p-2">
                NIS :
              </label>
              <input
                type="text"
                id="nis"
                name="nis"
                value={current.nis || ""}
                onChange={(e) => setCurrent({ ...current, nis: e.target.value })}
                className="text-blue_dark rounded p-2 px-3"
              />
            </div>

            <div className="flex flex-col mb-5">
              <label htmlFor="nama" className="p-2">
                Nama :
              </label>
              <input
                type="text"
                id="nama"
                name="nama"
                value={current.nama || ""}
                onChange={(e) => setCurrent({ ...current, nama: e.target.value })}
                className="text-blue_dark rounded p-2 px-3"
              />
            </div>

            <div className="flex flex-col mb-5">
              <label htmlFor="rfid" className="p-2">
                RFID :
              </label>
              <input
                type="text"
                id="rfid"
                name="rfid"
                value={current.rfid || ""}
                onChange={(e) => setCurrent({ ...current, rfid: e.target.value })}
                className="text-blue_dark rounded p-2 px-3"
              />
            </div>
            
            <div className="flex w-full justify-end gap-3">
              <Link to={"/admin/kelas/detail/" + (id ? id : current.id_kelas)}  className="p-4 py-2 rounded bg-red">
                Kembali
              </Link>
              <button type="submit" className="p-4 py-2 rounded bg-blue">
                Kirim
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};
