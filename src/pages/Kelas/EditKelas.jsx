import { Link, useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useEffect, useState } from "react";
import { useAxios } from "../../utils/Provider";
import Swal from "sweetalert2";

export const EditKelas = () => {
  const { id } = useParams();
  const axios = useAxios();
  const [kelas, setKelas] = useState(null);
  const [jurusan, setJurusan] = useState([]);
  const [current, setCurrent] = useState({
    tingkat: "X",
    jurusan: 1,
  });
  
  const pathname = window.location.pathname;

  const handleChangeJurusan = (e) => {
    setCurrent({ ...current, jurusan: e.target.value });
  };

  const handleChangeTingkat = (e) => {
    setCurrent({ ...current, tingkat: e.target.value });
  };

  const handleSubmitForm = (e) => {
    e.preventDefault();

    console.log({
      id_jurusan: parseInt(current.jurusan),
      tingkat: current.tingkat,
      no_kelas: parseInt(current.no_kelas),
    });
    if (pathname.includes("/update")) {
      axios
        .put(`/kelas/${id}`, {
          id_jurusan: current.jurusan,
          tingkat: current.tingkat,
          no_kelas: current.no_kelas,
        })
        .then((res) => {
          window.location = `/admin/kelas/detail/${id}/addsiswa`;
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: "terjadi masalah",
            icon: "error",
            confirmButtonText: "Tutup",
          });
        });
    } else {
      axios
        .get(
          `/kelas?id_jurusan=${current.jurusan}&tingkat=${current.tingkat}&no_kelas=${current.no_kelas}`
        )
        .then((res) => {
          if (res.data.data[0]) {
            console.log("lolos");

            Swal.fire({
              title: "Error!",
              text: "Kelas sudah ada",
              icon: "error",
              confirmButtonText: "Tutup",
            });
          } else {
            axios
              .post(`/kelas`, {
                id_jurusan: current.jurusan,
                tingkat: current.tingkat,
                no_kelas: current.no_kelas,
              })
              .then((res) => {
                  window.location = `/admin/kelas/detail/${res.data.data.id_kelas}/addsiswa`;
              })
              .catch((err) => {
                Swal.fire({
                  title: "Error!",
                  text: "err.response.data.message",
                  icon: "error",
                  confirmButtonText: "Tutup",
                });
              });
          }
        })
        .catch((err) => {
          console.log("error");
          Swal.fire({
            title: "Error!",
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "Tutup",
          });
        });
    }
  };

  useEffect(() => {
    if (pathname.includes("/update")) {
      axios
        .get(`/kelas/${id}`)
        .then((res) => {
          setKelas(res.data.data);
          setCurrent({
            jurusan: res.data.data.id_jurusan,
            tingkat: res.data.data.tingkat,
            no_kelas: res.data.data.no_kelas,
          });
        })
        .catch((err) => {
          Swal.fire({
            title: "Error!",
            text: err.response.data.message,
            icon: "error",
            confirmButtonText: "Tutup",
          }).then(() => {
            window.location = "/kelas";
          });
        });
    }
  }, [id]);

  useEffect(() => {
    axios
      .get("/jurusan")
      .then((res) => {
        setJurusan(res.data.data);
        console.log("data jurusan : " +res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="">
          <form
            className="p-5 max-h-fit w-full bg-blue_dark text-white bg-opacity-90 rounded-lg"
            onSubmit={handleSubmitForm}
          >
            <h1 className="text-3xl font-bold pb-7">
              {pathname.includes("/update") ? "Update " : "Add "} Kelas
            </h1>

            <div className="flex flex-col mb-5">
              <label htmlFor="tingkat" className="p-2">
                Tingkat:
              </label>
              <select
                id="tingkat"
                name="tingkat"
                onChange={handleChangeTingkat}
                value={current.tingkat}
                className="text-blue_dark rounded p-2 px-3 w-24"
              >
                <option value="X">X</option>
                <option value="XI">XI</option>
                <option value="XII">XII</option>
              </select>
            </div>

            <div className="flex flex-col mb-5">
              <label htmlFor="jurusan" className="p-2">
                Jurusan:
              </label>
              <select
                id="jurusan"
                name="jurusan"
                onChange={handleChangeJurusan}
                value={current.jurusan}
                className="text-blue_dark rounded p-2 px-3"
              >
                {jurusan &&
                  jurusan.map((jur, i) => (
                    <option key={i} value={jur.id_jurusan}>
                      {jur.akronim}
                    </option>
                  ))}
              </select>
            </div>

            <div className="flex flex-col mb-5">
              <label htmlFor="no_kelas" className="p-2">
                No Kelas:
              </label>
              <input
                type="number"
                id="no_kelas"
                name="no_kelas"
                value={current.no_kelas}
                onChange={(e) =>
                  setCurrent({ ...current, no_kelas: e.target.value })
                }
                className="text-blue_dark rounded p-2 px-3"
              />
            </div>

            <div className="flex w-full justify-end gap-3">
              <Link to="/admin/kelas" className="p-4 py-2 rounded bg-red">
                Kembali
              </Link>
              <button type="submit" className="p-4 py-2 rounded bg-blue">
                {pathname.includes("/update") ? "Simpan" : "Kirim"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AuthGuard>
  );
};
