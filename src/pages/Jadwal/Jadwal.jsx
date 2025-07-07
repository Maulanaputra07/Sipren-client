import { useEffect, useState } from "react";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAxios } from "../../utils/Provider";
import addIcon from "/icons/addIcon.svg";
import { Link } from "react-router-dom";

export function Jadwal(){
    const axios = useAxios();
    const [Jadwal, setJadwal] = useState();
    let count = 0;

    const fetchJawalAll = () => {
        axios.get('/jadwal')
        .then((res) => {
            setJadwal(res.data.data)
            console.log("jadwal: "+ res.data?.data?.length);
        })
        .catch((err) => {
            console.log(err?.message);
        })
    }

    useEffect(() => {
        fetchJawalAll();
    }, []);


    return(
        <AuthGuard>
            <div className="hero">
                <div className="w-full flex flex-col gap-5 h-full">
                    <h1>Daftar user dan jadwalnya</h1>
                    <div className="flex-col">
                        <Link
                            to={"add"}
                            className="bg-green/80 font-poppins text-lg hover:bg-green transition-all duration-200 delay-100 hover:shadow-xl max-w-fit items text-white shadow-md font-bold px-3 py-2 mx-5 rounded-lg flex justify-between items-center"
                        >
                            <img src={addIcon} className={`transition-all duration-300 group-hover:scale-110 w-[35px]`} color="" alt="presensiIcon" />
                            <span className="px-2">Add Jadwal</span>
                            <div></div>
                        </Link>
                        <div>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th colSpan={1}>No.</th>
                                        <th colSpan={4}>Nama Guru</th>
                                        <th colSpan={3}>Nama Mapel</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Jadwal &&
                                        Jadwal.map((jdwl, i) => (
                                        <tr key={i}>
                                            <td colSpan={1}>{count++}</td>
                                            <td colSpan={4}>
                                                {`${jdwl.nama_guru}`}
                                            </td>
                                            <td colSpan={3}>{jdwl.nama_mapel}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AuthGuard>
    )
}