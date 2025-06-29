import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAuth, useAxios } from "../../utils/Provider";
import Swal from "sweetalert2";

function Presensi() {
  const axios = useAxios();
  const auth = useAuth();
  const [titleMatter, setTitleMatter] = useState("");
  const [descriptionMatter, setDescriptionMatter] = useState("");
  const [jurusan, setJurusan] = useState([]);
  const [Kelas, setKelas] = useState([]);
  const [current, setCurrent] = useState({
    jurusan: 1,
    tingkat: "X",
    kelas: [],
  });
  const [isProduktif, setIsProduktif] = useState(null);
  const [mapel, setMapel] = useState([]);

  const handleChangeTingkat = (e) => {
    setCurrent({ ...current, tingkat: e.target.value });
  };

  const handleChangeJurusan = (e) => {
    setCurrent({ ...current, jurusan: e.target.value });
  };

  const handleChangeKelas = (e) => {
    setCurrent({ ...current, id_kelas: e.target.value });
    console.log( "id_kelas: " + e.target.value);
  };

  const handleJenisChange = (e) => {
    setIsProduktif(Number(e.target.value));
    console.log("value mapel : " + e.target.value);
  };

  const handleChangeMapel = (e) => {
    setCurrent({ ...current, id_mapel: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`/presensi`, {
        id_mapel: e.target.mapel.value,
        id_user: auth.user.id_user,
        id_kelas: e.target.kelas.value,
        jam_started: e.target.jam_started.value,
        jam_ended: e.target.jam_ended.value,
        materi: e.target.materi.value,
        deskripsi_materi: e.target.deskripsi.value,
      })
      .then((res) => {
        setCurrent({ ...current, id_presensi: res.data.data.id_presensi });
        window.location = `presensi/${res.data.data.id_presensi}`;
      })
      .catch((err) => {
        Swal.fire({
          title: "Error!",
          text: err.response.data.message,
          icon: "error",
          confirmButtonText: "Tutup",
        });
      });
  };

  useEffect(() => {
    axios
      .get("/kelas")
      .then((res) => {
        console.log(res.data.data);
        setKelas(res.data.data);
        console.log(res.data.data);
        if (!res.data.data.length) {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Kelas tidak ditemukan.",
          }).then(() => {
            window.location.reload();
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [current]);

  useEffect(() => {
    if (auth.user.level) {
      window.location = "/dashboard";
    }

    axios
      .get("/jurusan")
      .then((res) => {
        setJurusan(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/mapel`)
      .then((res) => {
        setMapel(res.data.data);
        // console.log("mapel: "+ res.data.data[0].produktif)
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <form action="" className="w-full rounded-md shadow-lg border border-gray/20 h-full" onSubmit={handleSubmit}>
          <div className="p-2 text-xl shadow-md w-fit rounded-br-lg rounded-tl-lg bg-blue_light font-poppins font-semibold text-black/70">Create presensi kelas</div>
          <div className="p-10 flex-co w-full">
            <div className="justify-evenly">
              <div className="mb-5">
                <p className="font-poppins font-semibold text-lg pb-3">Kelas <span className="text-red/50 select-none">*</span></p>
                <select name="kelas" onChange={handleChangeKelas} id="kelas" className="block w-full p-2 font-poppins border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200" defaultValue="">
                  <option value="" disabled hidden className="font-poppins">Pilih kelas</option>
                  {Kelas &&
                    Kelas.map((kls, i) => (
                      <option key={i} value={kls.id_kelas}>
                        {kls.tingkat +" " + kls.akronim + " " + kls.no_kelas}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-5">
                <p className="font-poppins font-semibold text-lg pb-3">Mapel <span className="text-red/50 select-none">*</span></p>
                <div className="mt-2 flex space-x-2">
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value={0}
                      className="hidden peer"
                      onChange={handleJenisChange}
                    />
                    <span className="font-poppins text-black/40 font-medium bg-gray/40 peer-checked:bg-blue/60 peer-checked:text-white peer-checked:shadow-md px-4 py-2 rounded-full cursor-pointer border border-gray/40">
                      Normada
                    </span>
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="type"
                      value={1}
                      className="hidden peer"
                      onChange={handleJenisChange}
                    />
                    <span className="font-poppins peer-checked:bg-blue/60 text-black/40 font-medium bg-gray/40 peer-checked:text-white peer-checked:shadow-md px-4 py-2 rounded-full cursor-pointer border border-gray/40">
                      Produktif
                    </span>
                  </label>
                </div>
                <select name="mapel" onChange={handleChangeMapel} id="mapel" className="mt-5 block w-full p-2 font-poppins border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200" defaultValue="">
                  <option value="" disabled hidden className="font-poppins">Pilih Mapel</option>
                  {isProduktif !== null && (
                    isProduktif ? mapel.map((map, key) =>
                            map.produktif === 1 ? (
                              <option key={key} value={map.id_mapel}>
                                {map.nama_mapel}
                              </option>
                            ) : null
                          )
                        : mapel.map((map, key) =>
                            map.produktif === 0 ? (
                              <option key={key} value={map.id_mapel}>
                                {map.nama_mapel}
                              </option>
                            ) : null
                          )
                  )}
                </select>
              </div>
              <div className="mb-5">
                <p className="font-poppins font-semibold text-lg pb-3">Jam pembelajaran</p>
                <div className="flex w-full gap-5">
                  <div>
                    <label className="font-normal font-poppins">Dimulai <span className="text-red/50 select-none">*</span></label>
                    <input type="number" name="jam_started" id="jam_started" min="1" max="14" className="border rounded ml-2 w-12 text-center"/>
                  </div>
                  <div>
                    <label className="font-normal font-poppins">Berakhir <span className="text-red/50 select-none">*</span></label>
                    <input type="number" name="jam_ended" id="jam_ended" className="border rounded ml-2 w-12 text-center"/>
                  </div>
                </div>
              </div>
              <div className="w-full flex gap-4 mb-3">
                <div className="w-1/3">
                  <p className="font-poppins font-semibold text-lg pb-3">Materi pembelajaran <span className="text-red/50 select-none">*</span></p>
                  <input type="text" name="materi" id="materi" className="border py-1 w-1/2 rounded-lg px-2"/>
                </div>
                <div className="w-2/3">
                  <p className="font-poppins font-semibold text-lg pb-3">Deskripsi materi <span className="text-red/50 select-none">*</span></p>
                  <textarea name="deskripsi" id="deskripsi" placeholder="Isi deskripsi materi hari ini" cols="40" rows="5" className="border rounded-lg px-2"></textarea>
                </div>
              </div>
              <div className="w-full flex justify-end gap-4">
                <button className="border-red/70 rounded-lg px-3 py-2 bg-red/70">
                  Kembali
                </button>
                <button className="border-blue/60 rounded-lg px-3 py-2 bg-blue/60" type="submit">
                  Simpan
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AuthGuard>
  );
}

export default Presensi;
