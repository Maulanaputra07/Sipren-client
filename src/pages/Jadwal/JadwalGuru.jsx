import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

export function JadwalGuru() {
    const axios = useAxios();
    const [showModel, setShowModel] = useState(false);
    const [jadwal, setJadwal] = useState();
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
            <div className="w-full flex flex-col gap-5 h-full">
                <h1>Jadwal anda hari ini </h1>
                <div className="flex gap-3 flex-wrap">
                    {jadwal &&
                        jadwal.map((item, i) => (
                            <div
                            onClick={() => {
                                setSelectedJadwal(item)
                                setShowModel(true)
                            }}
                            className="w-[15rem] h-40 rounded-md"
                                style={{
                                    maskImage: 'url(/images/folder3.png)',
                                    WebkitMaskImage: 'url(/images/folder3.png)',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskSize: 'cover',
                                    WebkitMaskSize: 'cover',
                                }}>
                                    <p className="pl-8 bg-orange-300 text-white p-1">{item.tingkat} {item.akronim} {item.no_kelas} {item.id_jadwal}</p>
                                    <div className="flex bg-blue/50 w-full h-[80%] justify-center items-center">
                                        <p className="text-white font-poppins font-semibold text-lg">{item.nama_mapel}</p>
                                    </div>
                            </div>
                        ))
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
                                    <textarea name="deskripsi_materi" id="deskripsi_materi" onChange={handleChange} className="border rounded w-full block"></textarea>
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
