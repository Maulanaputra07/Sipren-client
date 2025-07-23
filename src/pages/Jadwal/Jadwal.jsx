import { useEffect, useState } from "react";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAxios } from "../../utils/Provider";
import addIcon from "/icons/addIcon.svg";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import userSelect from "/icons/userSelect.svg";

export function Jadwal(){
    const axios = useAxios();
    const [jadwal, setJadwal] = useState([]);
    const [guruCount, setGuruCount] = useState([]);
    const [selectedJadwal, setSelectedJadwal] = useState([]);
    const [activeGuru, setActiveGuru] = useState();
    const [guru, setGuru] = useState();
    let count = 1;

    const fetchJawalAll = () => {
        axios.get('/jadwal')
        .then((res) => {
            setJadwal(res.data.data)
            // console.log("jadwal: "+ res.data?.data?.length);

            const count = res.data?.data?.reduce((acc, curr) => {
                acc[curr.nama_guru] = (acc[curr.nama_guru] || 0) + 1;
                return acc;
            }, {});

            const result = Object.entries(count).map(([nama_guru, jumlah]) => ({
                nama_guru,
                jumlah
            }));

            setGuruCount(result);
        })
        .catch((err) => {
            console.log(err?.message);
        })
    }


    const fetchGuru = () => {
        axios.get('/users')
        .then((res) => {
            setGuru(res.data?.data);
            // console.log("data guru: " + res.data?.data?.length);
        })
    }

    const handleClickGuru = (nama_guru) => {
        setActiveGuru(nama_guru);
        const filtered = jadwal.filter((item) => item.nama_guru === nama_guru);
        setSelectedJadwal(filtered);
        // console.log("data fliter: " + filtered);
    }

    function handleDeleteJadwal(e) {
        // console.log("deleted button")

        Swal.fire({
            title: "Yakin Ingin Menghapus Jadwal?",
            text: "Jadwal yang hilang tidak bisa dikembalikan!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!",
        }).then((result) => {
        if (result.isConfirmed) {
            axios
            .delete(`/jadwal/${e.target.value}`)
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
        fetchJawalAll();
        fetchGuru();
    }, []);


    return(
        <AuthGuard>
            <div className="hero">
                <div className="w-full flex flex-col gap-5 h-full">
                    <div className="flex-col">
                        <Link
                            to={"add"}
                            className="bg-green/80 mb-3 font-poppins text-lg hover:bg-green transition-all duration-200 delay-100 hover:shadow-xl max-w-fit items text-white shadow-md font-bold px-3 py-2 mx-5 rounded-lg flex justify-between items-center"
                        >
                            <img src={addIcon} className={`transition-all duration-300 group-hover:scale-110 w-[35px]`} color="" alt="presensiIcon" />
                            <span className="px-2">Add Jadwal</span>
                            <div></div>
                        </Link>
                        <div className="w-full h-full flex mt-2 border border-gray/40 rounded-md p-1 shadow-lg">
                            <div className="w-1/3 max-h-[23rem] px-2 border-r-black/30 border-r-2 overflow-x-auto">
                                {guruCount && 
                                    guruCount
                                    .map((gru, i) => (
                                    <div
                                    value={gru.id_user}
                                    key={i}
                                    onClick={() => {handleClickGuru(gru.nama_guru);}}
                                    className={`group relative cursor-pointer rounded-xl border p-5 mb-4 overflow-hidden transition duration-300
                                    ${activeGuru === gru.nama_guru ? "bg-orange-100 border-orange-500 shadow-lg" : "bg-white border-gray-200 shadow-sm hover:shadow-lg"}
                                    `}
                                    >
                                    <div className={`absolute inset-0 ${activeGuru === gru.nama_guru ? "bg-orange-50 opacity-40" : "opacity-0 group-hover:opacity-30 bg-orange-50"} transition duration-300 rounded-xl`}></div>
                                    <p className={`text-lg font-semibold ${activeGuru === gru.nama_guru ? "text-orange-700" : "text-gray-800 group-hover:text-orange-600"}`}>{gru.nama_guru}</p>
                                    <p className="mt-1 text-sm text-gray-500">Jumlah jadwal : {gru.jumlah}</p>
                                    </div>
                                    ))
                                }
                            </div>
                            <div className="w-2/3 max-h-[23rem] overflow-x-auto px-2">
                                {selectedJadwal.length > 0 ? (
                                    selectedJadwal.map((item, i) => (
                                        <div key={i} className="bg-blue_light rounded-lg mb-2 p-3">
                                            <p className="text-xl p-2 bg-orange_main w-fit font-bold text-white rounded-lg">{item.tingkat} {item.akronim} {item.no_kelas}</p>
                                            <p className="font-poppins text-lg">{item.nama_mapel}</p>
                                            <div className="flex justify-between">
                                                <p>{item.hari}, {item.jadwal_mulai} - {item.jadwal_selesai} | {item.nama_ruang}</p>
                                                <div className="flex gap-2">
                                                    <Link
                                                        to={"update/" + item.id_jadwal}
                                                        className="border text-orange-300 font-semibold hover:bg-orange_main hover:text-white border-orange_main py-1 px-4 rounded">
                                                            Edit
                                                    </Link>
                                                    <button
                                                        onClick={handleDeleteJadwal}
                                                        value={item.id_jadwal}
                                                        className="border border-red text-red hover:bg-red hover:text-white font-poppins py-1 px-4 rounded">
                                                            Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ): (
                                    <div className="w-full h-full justify-center items-center bg-gray/10 flex flex-col">
                                        <img src={userSelect} alt="" width={100} className="bg-blue_light rounded-lg p-2"/>
                                        <p className="font-semibold text-xl">Pilih guru untuk melihat detail jadwal guru</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}