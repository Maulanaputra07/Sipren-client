import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import emptyFolderIcon from "/icons/emptyFolder.svg";

export function JadwalGuru() {
    const axios = useAxios();
    const [showModel, setShowModel] = useState(false);
    const [jadwal, setJadwal] = useState([]);
    const [selectedJadwal, setSelectedJadwal] = useState(null);
    const [formData, setFormData] = useState({
        materi: "",
        deskripsi_materi: "",
    })

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev, [name] : value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        if(selectedJadwal) {
            const payload = {
                id_mapel: selectedJadwal.id_mapel,
                id_jadwal: selectedJadwal.id_jadwal,
                id_kelas:  selectedJadwal.id_kelas,
                materi: formData.materi,
                deskripsi_materi: formData.deskripsi_materi
            };

            console.log('id_mapel: ' + selectedJadwal.id_mapel);
            console.log('materi: ' + formData.materi);
            console.log("Payload: " + payload);

            axios
            .post('/presensi', payload)
            .then((res) => {
                const presensiData = {
                    status: true,
                    id_presensi: res.data.data.id_presensi,
                    id_jadwal: selectedJadwal.id_jadwal,
                    id_kelas: selectedJadwal.id_kelas,
                    id_mapel: selectedJadwal.id_mapel,
                    waktu_mulai: new Date().toISOString(),
                };

                localStorage.setItem("sedangPresensi", JSON.stringify(presensiData))

                Swal.fire({
                    title: "Success!",
                    text: `${res.data?.message}`,
                    icon: "success",
                }).then(() => {
                    window.location = `presensi/${res.data.data.id_presensi}`
                });
            })
            .catch((err) => {
                console.error("Error : "+err)
            })
        }
    }

    const fetchJadwal = () => {
        axios
        .get('/jadwal/mine')
        .then((res) => {
            setJadwal(res.data);
            console.log("jadwal guru: " + res.data?.length);
        })
    }

    useEffect(() => {
        fetchJadwal();
    }, [])

return (
    <AuthGuard>
        <div className="hero">
            <div className="w-full gap-5 h-full">
                <div className="flex gap-3 flex-wrap justify-center items-center">
                    {jadwal?.length !== 0 ? (
                        jadwal.map((item, i) => (
                            <div
                            key={i}
                            onClick={() => {
                                console.log("item.status", item.status)
                                console.log("item.presensi_selesai", item.presensi_selesai)
                                if(item.status === true && item.presensi_selesai === null){
                                    const presensi = JSON.parse(localStorage.getItem("sedangPresensi"));
    
                                    if(presensi && presensi.status && presensi.id_presensi){
                                        window.location = `presensi/${presensi.id_presensi}`
                                    }else{
                                        setSelectedJadwal(item)
                                        setShowModel(true)
                                    }
                                } else{
                                    Swal.fire({
                                        icon: "info",
                                        title: `Tidak dapat mengakses pembelajaran ${item.nama_mapel}`,
                                        text: "Pembelajaran ini hanya dapat diakses sesuai jadwal yang ditentukan.",
                                        confirmButtonColor: "#3085d6",
                                        confirmButtonText: "OK",
                                    });
                                }
                            }}
                            className={`w-[15rem] h-40 m-5 rounded-md ${item.status === false ? "text-black/50" : "text-[#273248] hover:cursor-pointer hover:scale-105 hover:brightness-105 transition-all duration-200"}`}
                                style={{
                                    maskImage: 'url(/images/folder3.png)',
                                    WebkitMaskImage: 'url(/images/folder3.png)',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskSize: 'cover',
                                    WebkitMaskSize: 'cover',
                                }}>
                                    <p className={`pl-8 font-bold p-1 ${item.status === false ? "bg-gray" : "bg-orange-300"}`}>{item.tingkat} {item.akronim} {item.no_kelas}</p>
                                    <div className={`flex flex-col ${item.status === false ? "bg-gray/30" : "bg-[#FEFAE0]"} font-poppins font-semibold text-lg w-full h-[80%] justify-center items-center`}>
                                        <p className="font-bold">{item.nama_mapel}</p>
                                        <p>{item.pecahan_absen === "semua" ?  "" : `(${item.pecahan_absen})`}</p>
                                        <p>{item.nama_ruang}</p>
                                    </div>
                            </div>
                        ))
                    ) : (
                        <div className="w-full h-[80vh] flex justify-center items-center">
                            <div className="bg-gray/10 p-10 shadow-lg flex flex-col items-center select-none rounded-lg w-fit gap-4 justify-center">
                                <img src={emptyFolderIcon} alt="" width={100} />
                                <h1 className="text-2xl font-semibold">Anda tidak memiliki jadwal hari ini</h1>
                            </div>
                        </div>
                    )
                    }
                </div>

                {showModel && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">Presensi</h2>
                            <form action="" className="space-y-4" onSubmit={handleSubmit}>
                                <div>
                                    <label className="block text-md font-medium" >Materi</label>
                                    <input type="text" name="materi" id="materi" onChange={handleChange} required className="mt-1 block w-full border rounded px-3 py-2"/>
                                </div>
                                <div>
                                    <label className="block text-md font-medium" >Deskripsi Materi</label>
                                    <textarea name="deskripsi_materi" id="deskripsi_materi" onChange={handleChange} className="border rounded w-full block px-3 py-2"></textarea>
                                </div>
                                <div className="flex justify-end w-full">
                                    <button type="button" onClick={() => setShowModel(false)} className="px-4 py-2 rounded">Kembali</button>
                                    <button type="submit" className="bg-blue/80 text-white px-3 py-2 rounded">Simpan</button>
                                </div>
                            </form>
                        </div>

                    </div>
                )}
            </div>
        </div>
    </AuthGuard>
);
}
