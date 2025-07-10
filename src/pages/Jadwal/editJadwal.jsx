import { useAxios } from "../../utils/Provider"
import { AuthGuard } from "../../utils/AuthGuard";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

export function EditJadwal(){
    const axios = useAxios();
    const pathname = window.location.pathname;
    const {id} = useParams();
    const [guru, setGuru] = useState();
    const [mapel, setMapel] = useState();
    const [isProduktif, setIsProduktif] = useState(null);
    const [current, setCurrent] = useState({
        id_user: ""
    });
    const jamBoundary = ["07:00", "07:45", "08:30", "09:15", "10:00", "10:45",
                        "11:30", "12:15", "13:00", "13:45", "14:30", "15:15", "16:00",
                        "16:45"]
    const [mulai, setMulai] = useState("");
    const [selesai, setSelesai] = useState("");
    const [kelas, setKelas] = useState([]);
    const [ruang, setRuang] = useState();
    const [jurusan, setJurusan] = useState([]);
    const [selectedAkronim, setSelectedAkronim] = useState();
    const kelasFiltered = kelas?.filter(k => k.akronim === selectedAkronim) || [];

    const filteredSelesai = mulai ? jamBoundary.filter(jam => jam > mulai) : jamBoundary

    const handleChangeHari = (e) => {
        setCurrent({...current, hari: e.target.value});
    }

    const handleChangeGuru = (e) => {
        setCurrent({...current, id_user: e.target.value});
    }

    const handleChangeAkronim = (e) => {
        setSelectedAkronim(e.target.value);
    }

    const handleChangeKelas = (e) => {
        setCurrent({...current, id_kelas: e.target ? e.target.value : e});
    }

    const handleChangeMapel = (e) => {
        setCurrent({...current, id_mapel: e.target.value})
    }

    const handleJenisChange = (e) => {
        console.log("clicked")
        setIsProduktif(Number(e.target.value));
        console.log("value mapel : " + e.target.value);
    };


    const handleChangeRuang = (e) => {
        setCurrent({...current, id_ruang: e.target.value});
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if(pathname.includes("/update")){
            axios
            .put(`/jadwal/${id}`, {
                id_kelas: current.id_kelas,
                hari: current.hari,
                jadwal_mulai: mulai,
                jadwal_selesai: selesai,
                id_mapel: current.id_mapel,
                id_ruang: current.id_ruang,
                id_user: current.id_user
            }).then((res) => {
                Swal.fire({
                    title: "Success!",
                    text: "Berhasil update jadwal",
                    icon: "success",
                    confirmButtonText: "Tutup"
                }).then(() => {
                    window.location = "/admin/jadwal"
                })
            })
        }else{
            axios
            .post('/jadwal', {
                id_kelas: e.target.kelas.value,
                hari: e.target.hari.value,
                jadwal_mulai: e.target.jadwal_dimulai.value,
                jadwal_selesai: e.target.jadwal_selesai.value,
                id_mapel: e.target.mapel.value,
                id_ruang: e.target.ruang.value,
                id_user: e.target.user.value
            })
            .then((res) => {
                Swal.fire({
                    title: "Success!!",
                    text: "Berhsil menambahkan jadwal.",
                    icon: "success",
                }).then(() => {
                    window.location = "/admin/jadwal"
                })
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error!",
                    text: err.response?.data?.message,
                    icon: "error",
                    confirmButtonText: "Tutup",
                });
            })

        }

    }

    const fetchGuru = () => {
        axios.get('/users')
        .then((res) => {
            setGuru(res.data?.data);
        })
        .catch((err) => {
            console.log("err :" + err?.message);
        })
    }

    const fetchKelas = () => {
        axios.get('/kelas')
        .then((res) => {
            setKelas(res.data?.data);
        })
        .catch((err) => {
            console.log("err : "+ err?.message);
        })
    }

    const fetchJurusan = () => {
        axios.get('/jurusan')
        .then((res) => {
            setJurusan(res.data?.data);
            if(res.data?.data && res.data?.data?.length > 0){
                setSelectedAkronim(res.data?.data[0]?.akronim)
            }
        })
    }

    const fetchMapel = () => {
        axios.get('/mapel')
        .then((res) => {
            setMapel(res.data?.data);
        })
        .catch((err) => {
            console.log("err: "+err?.message)
        })
    }

    const fetchRuang = () => {
        axios.get('/ruang')
        .then((res) => {
            setRuang(res.data?.data)
        })
        .catch((err) => {
            console.log(err?.message);
        })
    }

    useEffect(() => {
        if(pathname.includes("/update")){
            axios
            .get(`/jadwal/${id}`)
            .then((res) => {
                setCurrent({
                    id_kelas: res.data?.data?.id_kelas,
                    hari: res.data?.data?.hari,
                    jadwal_mulai: res.data?.data?.jadwal_mulai,
                    jadwal_selesai: res.data?.data?.jadwal_selesai,
                    id_mapel: res.data?.data?.id_mapel,
                    id_ruang: res.data?.data?.id_ruang,
                    id_user: res.data?.data?.id_user
                });

                setMulai(res.data?.data?.jadwal_mulai?.substring(0, 5));
                setSelesai(res.data?.data?.jadwal_selesai?.substring(0, 5));

                console.log("data update: " + res?.data?.data?.id_kelas)
            })
            .catch((err) => {
                Swal.fire({
                    title: "Error!",
                    text: err.data?.data?.message,
                    icon: "error",
                    confirmButtonText: "Tutup",
                })
            })
        }
    }, [id])

    useEffect(() => {
        fetchGuru();
        fetchMapel();
        fetchJurusan();
        fetchKelas();
        fetchRuang();
    }, [])

    return(
        <AuthGuard>
            <div className="hero">
                <div>
                    <form action="" className="w-full h-full rounded-md border border-gray/20 shadow-lg" onSubmit={handleSubmit}>
                        <div className="p-2 text-xl shadow-md w-fit rounded-br-lg rounded-tl-lg font-poppins font-semibold text-black/70 bg-blue_light">CREATE JADWAL GURU</div>
                        <div className="p-10 flex-col w-full">
                            <div className="flex w-full gap-5 justify-between mb-5">
                                {/* Guru */}
                                <div className="font-poppins w-full">
                                    <p className="font-semibold mb-5">Guru <span className="text-red/65 select-none">*</span></p>
                                    <select name="user" id="user" value={current.id_user} onChange={handleChangeGuru} className="w-full block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                        <option value="" disabled hidden>Pilih guru</option>
                                        {guru && 
                                            guru
                                            .filter((item) => item.level === 0)
                                            .map((item, i) => (
                                                <option key={i} value={item.id_user}>
                                                    <p>{`${item.nama} (${item.username})`}</p>
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>

                                {/* Mapel */}
                                <div className="font-poppins w-full">
                                        <div className="mb-5 flex justify-between items-center space-x-2">
                                            <p className="font-semibold">Mapel <span className="text-red/65 select-none">*</span></p>
                                            <div className="flex gap-2">
                                                <label>
                                                    <input
                                                    type="radio"
                                                    name="type"
                                                    value={0}
                                                    className="hidden peer"
                                                    onChange={handleJenisChange}
                                                    />
                                                    <span className="font-poppins text-sm text-black/40 font-medium bg-gray/40 peer-checked:bg-blue/60 peer-checked:text-white peer-checked:shadow-md px-4 py-2 rounded-full cursor-pointer border border-gray/40">
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
                                                        <span className="font-poppins text-sm peer-checked:bg-blue/60 text-black/40 font-medium bg-gray/40 peer-checked:text-white peer-checked:shadow-md px-4 py-2 rounded-full cursor-pointer border border-gray/40">
                                                        Produktif
                                                        </span>
                                                </label>
                                            </div>
                                        </div>
                                        <select name="mapel" id="mapel" onChange={handleChangeMapel} value={current.id_mapel} className="w-full block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                            <option value="" disabled hidden className="font-poppins">Pilih mapel</option>
                                            {isProduktif !== null && (
                                                isProduktif ? mapel.map((item, i) => (
                                                    item.produktif === 1 ? (
                                                        <option key={i} value={item.id_mapel}>
                                                            {item.nama_mapel}
                                                        </option>
                                                    ) : null
                                                )) : 
                                                mapel.map((item, i) => (
                                                    item.produktif === 0 ? (
                                                        <option key={i} value={item.id_mapel}>
                                                            {item.nama_mapel}
                                                        </option>
                                                    ) : null
                                                ))
                                            )}
                                        </select>
                                </div>
                            </div>
                            <div className="flex w-full gap-5 justify-evenly mb-5">
                                {/* Kelas */}
                                <div className="w-full font-poppins">
                                    <p className="font-semibold mb-1">Kelas <span className="text-red/65 select-none">*</span></p>
                                    <div className="flex gap-2">
                                        <select name="akronim" id="akronim" onChange={handleChangeAkronim} className="block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                            {jurusan && 
                                                jurusan
                                                .map((jur, i) => (
                                                    <option key={i} value={jur.akronim}>
                                                        <p>{jur.akronim}</p>
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        <select name="kelas" id="kelas" value={current.id_kelas} onChange={handleChangeKelas} className="w-full block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                            <option value="" disabled hidden>Pilih kelas</option>
                                            {kelasFiltered &&  kelasFiltered.length > 0 ? (
                                                kelasFiltered.map((kls, i) => (
                                                    <option key={i} value={kls.id_kelas}>
                                                        <p>{kls.tingkat} {kls.akronim} {kls.no_kelas}</p>
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="" disabled>Tidak terdapat kelas</option>
                                            )
                                            }
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full mb-5">
                                {/* Hari */}
                                <div className="w-full">
                                    <p className="font-poppins font-semibold mb-1">Hari <span className="text-red/65 select-none">*</span></p>
                                    <select name="hari" id="hari" onChange={handleChangeHari} value={current.hari} className="w-full block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                        <option value="" disabled hidden>Pilih hari</option>
                                        <option value="senin">Senin</option>
                                        <option value="selasa">Selasa</option>
                                        <option value="rabu">Rabu</option>
                                        <option value="kamis">Kamis</option>
                                        <option value="jumat">Jumat</option>
                                        <option value="sabtu">Sabtu</option>
                                    </select>
                                </div>
                                {/* Jam Dimulai */}
                                <div className="w-full">
                                    <p className="font-poppins font-semibold mb-1">Jam Dimulai <span className="text-red/65 select-none">*</span></p>
                                    <select name="jadwal_dimulai" id="jadwal_dimulai" value={mulai} onChange={(e) => {setMulai(e.target.value); console.log("jam dimulai: " + e.target.value)}} className="w-full block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                        <option value="" disabled hidden>Pilih jam mulai</option>
                                        {jamBoundary.map((jam, i) => (
                                            <option key={i} value={jam}>{jam}</option>
                                        ))}
                                    </select>
                                </div>
                                {/* Jam Selesai */}
                                <div className="w-full">
                                    <p className="font-poppins font-semibold mb-1">Jam Selesai <span className="text-red/65 select-none">*</span></p>
                                    <select name="jadwal_selesai" id="jadwal_selesai" value={selesai} onChange={(e) => {setSelesai(e.target.value); console.log("jam selesai: " + e.target.value)}} className="w-full block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                        <option value="" disabled hidden>Pilih jam Selesai</option>
                                        {filteredSelesai.map((jam, i) => (
                                            <option key={i} value={jam}>{jam}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="w-full mb-5">
                                <p className="font-poppins font-semibold mb-1">Ruang <span className="text-red/65 select-none">*</span></p>
                                <select name="ruang" id="ruang" onChange={handleChangeRuang} value={current.id_ruang} className="w-full block font-poppins p-2 border border-gray/100 rounded-lg bg-white px-4 py-2 text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition focus:border-blue/20 duration-200">
                                    <option value="" disabled hidden>Pilih ruang</option>
                                    {ruang && 
                                        ruang.map((r, i) => (
                                            <option key={i} value={r.id_ruang}>{r.nama_ruang}</option>
                                        ))}
                                </select>
                            </div>
                            <div className="w-full flex justify-end gap-2 items-center">
                                <Link to={"/admin/jadwal"}>
                                    <p className="bg-red px-3 py-2 rounded-lg text-white">Kembali</p>
                                </Link>
                                <button type="submit" className="bg-blue/50 px-3 py-2 rounded-lg">Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    )
}