import { useAxios } from "../../utils/Provider"
import { AuthGuard } from "../../utils/AuthGuard";
import { useEffect, useState } from "react";

export function EditJadwal(){
    const axios = useAxios();
    const [guru, setGuru] = useState();
    const [mapel, setMapel] = useState();
    const [current, setCurrent] = useState([]);
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
        console.log("hari: " + e.target.value);
    }

    const handleChangeGuru = (e) => {
        setCurrent({...current, id_guru: e.target.value});
        console.log("id_Guru : " + e.target.value);
    }

    const handleChangeAkronim = (e) => {
        setSelectedAkronim(e.target.value);
        console.log("akronim yg dipilih :" + e.target.value);
    }

    const handleChangeKelas = (e) => {
        setCurrent({...current, id_kelas: e.target ? e.target.value : e});
        console.log("id_kelas: " + e.target ? e.target.value : e);
    }

    const handleChangeMapel = (e) => {
        setCurrent({...current, id_mapel: e.target.value})
        console.log("id_mapel: " + e.target.value);
    }

    const handleChangeRuang = (e) => {
        setCurrent({...current, id_ruang: e.target.value});
        console.log("id_ruang: " + e.target.value);
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        axios
        .post('/jadwal', {
            id_kelas: e.target.kelas.value,
            hari: e.target.hari.value,
            jadwal_mulai: e.target.jadwal_dimulai.value,
            jadwal_selesai: e.target.jadwal_selesai.value,
            id_mapel: e.target.mapel.value,
            id_ruang: e.target.ruang.value,
            id_user: e.target.guru.value
        })
        .then((res) => {
            alert("berhasil create")
            window.location = "/admin/jadwal"
        })
        .catch((err) => {
            alert("error")
        })
    }

    const fetchGuru = () => {
        axios.get('/users')
        .then((res) => {
            setGuru(res.data?.data);
            console.log("data guru: " + res.data?.data?.length);
        })
        .catch((err) => {
            console.log("err :" + err?.message);
        })
    }

    const fetchKelas = () => {
        axios.get('/kelas')
        .then((res) => {
            setKelas(res.data?.data);
            console.log("data kelas: "+ res.data?.data?.length)
        })
    }

    const fetchJurusan = () => {
        axios.get('/jurusan')
        .then((res) => {
            setJurusan(res.data?.data);
            console.log("data jurusan: " + res.data?.data[0]?.akronim)

            if(res.data?.data && res.data?.data?.length > 0){
                console.log("set akronim");
                setSelectedAkronim(res.data?.data[0]?.akronim)
            }
        })
    }

    const fetchMapel = () => {
        axios.get('/mapel')
        .then((res) => {
            setMapel(res.data?.data);
            console.log("data mapel: " + res.data?.data?.length)
        })
        .catch((err) => {
            console.log("err: "+err?.message)
        })
    }

    const fetchRuang = () => {
        axios.get('/ruang')
        .then((res) => {
            setRuang(res.data?.data)
            console.log("data ruang: " + res.data?.data?.length);
        })
        .catch((err) => {
            console.log(err?.message);
        })
    }

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
                <h1>Form Jadwal</h1>
                <div>
                    <form action="" className="w-full h-full rounded-md border border-gray/20 shadow-lg" onSubmit={handleSubmit}>
                        <div className="p-2 text-xl shadow-md w-fit rounded-br-lg rounded-tl-lg font-poppins font-semibold text-black/70 bg-blue_light">CREATE JADWAL GURU</div>
                        <div className="p-10 flex-col w-full">
                            <div className="flex w-full gap-5 justify-evenly">
                                <div>
                                    <p>Guru</p>
                                    <select name="guru" id="guru" onChange={handleChangeGuru}>
                                        <option value="">Pilih guru</option>
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
                                <div>
                                    <p>Kelas</p>
                                    <div>
                                        <select name="akronim" id="akronim" onChange={handleChangeAkronim}>
                                            {jurusan && 
                                                jurusan
                                                .map((jur, i) => (
                                                    <option key={i} value={jur.akronim}>
                                                        <p>{jur.akronim}</p>
                                                    </option>
                                                ))
                                            }
                                        </select>
                                        <select name="kelas" id="kelas" onChange={handleChangeKelas}>
                                            <option value="">Pilih kelas</option>
                                            {kelasFiltered &&  kelasFiltered.length > 0 ? (
                                                kelasFiltered.map((kls, i) => (
                                                    <option key={i} value={kls.id_kelas}>
                                                        <p>{kls.tingkat} {kls.akronim} {kls.no_kelas}</p>
                                                    </option>
                                                ))
                                            ) : (
                                                <option value="">Tidak ada kelas tersedia</option>
                                            )
                                            }
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <p>Mapel</p>
                                    <select name="mapel" id="mapel" onChange={handleChangeMapel}>
                                        <option value="">Pilih mapel</option>
                                        {mapel && 
                                            mapel.map((item, i) => (
                                                <option key={i} value={item.id_mapel}>
                                                    <p>{`${item.nama_mapel} (${item.produktif === 1 ? "Produktif" : "Normada"})`}</p>
                                                </option>
                                            ))
                                        }
                                    </select>
                                </div>
                                <div>
                                    <p>Hari</p>
                                    <select name="hari" id="hari" onChange={handleChangeHari}>
                                        <option value="">Pilih hari</option>
                                        <option value="senin">Senin</option>
                                        <option value="selasa">Selasa</option>
                                        <option value="rabu">Rabu</option>
                                        <option value="kamis">Kamis</option>
                                        <option value="jumat">Jumat</option>
                                        <option value="sabtu">Sabtu</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div>
                                    <p>Jam Dimulai</p>
                                    <select name="jadwal_dimulai" id="jadwal_dimulai" value={mulai} onChange={(e) => {setMulai(e.target.value); console.log("jam dimulai: " + e.target.value)}}>
                                        <option value="">Pilih jam mulai</option>
                                        {jamBoundary.map((jam, i) => (
                                            <option key={i} value={jam}>{jam}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>Jam Berakhir</p>
                                    <select name="jadwal_selesai" id="jadwal_selesai" value={selesai} onChange={(e) => {setSelesai(e.target.value); console.log("jam selesai: " + e.target.value)}}>
                                        <option value="">Pilih jam mulai</option>
                                        {filteredSelesai.map((jam, i) => (
                                            <option key={i} value={jam}>{jam}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <p>Ruang</p>
                                    <select name="ruang" id="ruang" onChange={handleChangeRuang}>
                                        <option value="">Pilih ruang</option>
                                        {ruang && 
                                            ruang.map((r, i) => (
                                                <option key={i} value={r.id_ruang}>{r.nama_ruang}</option>
                                            ))}
                                    </select>
                                </div>
                            </div>
                            <div className="w-full text-end">
                                <button type="submit" className="bg-blue/50 px-3 py-2 rounded-lg">Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AuthGuard>
    )
}