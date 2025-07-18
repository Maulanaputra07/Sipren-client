import { formatDate, useAuth } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { DateTime } from "../../components/Timer/DateTime";
import cardLayout from "/images/cardLayout.png";
import { Link } from "react-router-dom";
import { useAxios } from "../../utils/Provider";
import { useEffect, useState } from "react";
import arrowUp from "/icons/arrowRightUpIcon.svg";
import arrow from "/icons/arrow.svg";
import emptyFolderIcon from "/icons/emptyFolder.svg";
import presenceIcon from "/icons/presenceIcon.svg";
import dataUserIcon from "/icons/HeroiconsUsers.svg";
import booksIcon from "/icons/booksIcon.svg";
import mapelIcon from "/icons/mapelIcon.svg";
import scheduleIcon from "/icons/scheduleIcon.svg";
import { all } from "axios";
import { Toaster, toast } from "react-hot-toast";

function Guru() {
  const today = new Date().toLocaleDateString("sv-SE", { timeZone: "Asia/Jakarta" });
  const auth = useAuth();
  const axios = useAxios();
  const [allUsers, setAllUsers] = useState([]);
  const [allMapel, setAllMapel] = useState([]);
  const [allJadwal, setAllJadwal] = useState([]);
  const [allKelas, setAllKelas] = useState([]);
  const [jadwal, setJadwal] = useState([]);
  const [history, setHistory] = useState([]);
  const historyToday = history.filter((item) => item.presensi_mulai.slice(0, 10) === today).slice(0, 5);

  const fetchJadwal = () => {
    axios.get('/jadwal/mine')
    .then((res) => {
      setJadwal(res.data);
      console.log("jadwal hari ini : " + res.data.length);
    })
    .catch((err) => {
      console.log(err?.message);
    })
  };

  const fetchAllUser = () => {
    axios.get("/users")
    .then((res) => {
      setAllUsers(res.data?.data);
    }).catch((err) => {
      console.log(err.response.message);
    })
  }

  const fetchAllMapel = () => {
    axios
    .get("/mapel")
    .then((res) => {
        setAllMapel(res.data.data);
    })
    .catch((err) => {
        console.log(err.response.message);
    })
  }

  const fetchAllJadwal = () => {
    axios
    .get("/jadwal")
    .then((res) => {
        setAllJadwal(res.data.data);
    })
    .catch((err) => {
        console.log(err.response.message);
    })
  }

  const fetchAllKelas = () => {
    axios
      .get("/kelas")
      .then((res) => {
        setAllKelas(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const fetchHistory = () => {
    axios
      .get("/presensi/mine")
      .then((res) => {
        setHistory(res.data.data);
        console.log("presensi: " + res.data?.data?.length);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  useEffect(() => {
    // toast.success('Berhasil disimpan!');
    if(!auth?.user?.level){
      fetchJadwal();
      fetchHistory();
    }else{
      fetchAllUser();
      fetchAllMapel();
      fetchAllJadwal();
      fetchAllKelas();
    }
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <Toaster position="top-right" reverseOrder={false}/>
        <div className="w-full">
          <div className="flex w-full gap-5 justify-between items-center mb-5">
            <div className="bg-blue_scale text-white w-full max-w-md rounded-md h-24 flex">
              <div className=" p-4 welcome shadow items-center flex w-full content-center justify-start font-poppins">
                <span className="pr-2 text-xl "> Selamat Datang, </span>
                <div className="flex text-2xl font-bold">
                  <h5> {auth?.user?.level ? "Admin" : "Bapak/Ibu Guru"}</h5>
                </div>
              </div>
            </div>
            <div className="history-date">
              <DateTime />
            </div>
          </div>
        </div>
        {!auth?.user?.level ? (
          <div>
            <div className="jadwal">
              <div className="max-w-full h-full flex rounded-md gap-2">
                <div className="w-1/2 shadow-md">
                  <p className="text-2xl bg-orange_fade rounded py-3 px-4 font-semibold font-poppins">JADWAL HARI INI</p>
                  <div className="h-64 w-[30rem] bg-white p-5 ">
                    {jadwal && jadwal.length !== 0 ? (
                      <>
                      <div className="flex gap-4 p-2 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {jadwal
                        // .filter((item) => item.status !== false)
                        .map((item) => (
                          <>
                          <Link to={"/guru/jadwal_guru"}>
                            <div key={item.id_jadwal} className="relative cursor-pointer">
                              <div className={`absolute z-30 right-2.5 top-2 rounded-full ${item.status === true && item.presensi_selesai === null ? "bg-blue_light" : "bg-[#F2F2F0]"}`}>
                                  <img src={arrowUp} width={35} alt="" className={`${item.status === true && item.presensi_selesai === null ? "" : "opacity-20"}`}/>
                              </div>
                              <div className={`w-[12rem] h-40 rounded-md ${item.status === true && item.presensi_selesai === null ? "bg-blue_light text-black" : "bg-[#F2F2F0] text-gray"}`}
                                style={{
                                    maskImage: 'url(/images/cardLayout1.png)',
                                    WebkitMaskImage: 'url(/images/cardLayout1.png)',
                                    maskRepeat: 'no-repeat',
                                    WebkitMaskRepeat: 'no-repeat',
                                    maskSize: 'cover',
                                    WebkitMaskSize: 'cover',
                                }}>
                                  <div className="flex-col justify-between">
                                        <p className="pl-3 pt-5 text-2xl font-poppins font-semibold">{item.tingkat} {item.akronim} {item.no_kelas}</p>
                                        <p className="pl-3 text-sm font-poppins">{item.jadwal_mulai} - {item.jadwal_selesai}</p>
                                  </div>
                                  <div className="flex-col w-full h-[80%] p-5">
                                        <p className="font-poppins font-semibold text-md">{item.nama_mapel}</p>
                                        <p className="font-poppins text-end font-normal text-lg">{item.nama_ruang}</p>
                                  </div>
                              </div>
                            </div>                          
                          </Link>
                          </>
                        ))} 
                      </div>
                      <div className="pt-5 justify-end w-full flex">
                        <Link to={"/guru/jadwal_guru"}>
                          <p className="font-poppins text-lg flex items-center">Detail <img src={arrow} width={30} alt="" /> </p>
                        </Link>
                      </div>
                      </>
                    ): (
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="bg-gray/10 p-10 shadow-lg flex flex-col items-center select-none rounded-lg w-fit gap-4 justify-center">
                                <img src={emptyFolderIcon} alt="" width={100} />
                                <h1 className="text-xl font-semibold">Anda tidak memiliki jadwal hari ini</h1>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
                <div className="w-1/2 shadow-md">
                  <p className="text-2xl bg-orange_fade rounded py-3 px-4 font-semibold font-poppins">HISTORY HARI INI</p>
                  <div className="h-64 w-[30rem] bg-white p-5 ">
                    {historyToday && historyToday.length !== 0 ? (
                      <>
                      <div className="flex gap-4 p-2 overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
                        {historyToday.map((item, i) => (
                          <Link to={`/guru/data_presensi/update/${item.id_presensi}`}>
                            <div key={i} className="p-3 bg-blue_light text-xl rounded-lg w-[12rem] h-[10rem] font-poppins flex-shrink-0">
                              <p className="font-semibold">{item.tingkat + " " + item.akronim + " " + item.no_kelas}</p>
                              <div className="w-full h-full flex flex-col justify-center items-start p-2">
                                <p className="font-semibold">{item.nama_mapel}</p>
                                <p className="font-normal">{item.nama_materi}</p>
                              </div>
                            </div>
                          </Link>
                        ))} 
                      </div>
                      <div className="pt-5 justify-end w-full flex">
                        <Link to={"/guru/data_presensi"}>
                          <p className="font-poppins text-lg flex items-center">Detail <img src={arrow} width={30} alt="" /> </p>
                        </Link>
                      </div>
                      </>
                    ): (
                        <div className="w-full h-full flex justify-center items-center">
                            <div className="bg-gray/10 p-10 shadow-lg flex flex-col items-center select-none rounded-lg w-fit gap-4 justify-center">
                                <img src={emptyFolderIcon} alt="" width={100} />
                                <h1 className="text-xl font-semibold">Anda tidak memiliki jadwal hari ini</h1>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        ) : (
          <div className="w-full flex flex-col gap-5 select-none">
            <div className="w-full h-full flex gap-2">
              <div className="flex gap-3 justify-start items-center w-1/2 h-40 bg-[#F6F6F6] shadow-md rounded-lg p-6  font-poppins">
              <img src={dataUserIcon} width={80} alt="" />
                <div>
                  <p className="text-2xl font-bold">User</p>
                  <p className="font-semibold">Total : {allUsers.length}</p>
                </div>
              </div>
              <div className="flex gap-3 justify-start items-center w-1/2 h-40 bg-[#F6F6F6] shadow-md rounded-lg p-6  font-poppins">
                <img src={mapelIcon} width={80} alt="" />
                <div className="">
                  <p className="text-2xl font-bold">Mapel</p>
                  <p className="font-semibold">Total : {allMapel.length}</p> 
                </div>
              </div>
            </div>
            <div className="w-full h-full flex gap-2">
              <div className="flex gap-3 justify-start items-center w-1/2  h-40 bg-[#F6F6F6] shadow-md rounded-lg p-6  font-poppins">
                <img src={scheduleIcon} width={80} alt="" />
                <div>
                  <p className="text-3xl font-bold">Jadwal</p>
                  <p className="font-semibold">Total: {allJadwal.length}</p>
                </div>
              </div>
              <div className="flex gap-3 justify-start items-center w-1/2  h-40 bg-[#F6F6F6] shadow-md rounded-lg p-6  font-poppins">
                <img src={booksIcon} width={80} alt="" />
                <div>
                  <p className="text-3xl font-bold">Kelas</p>
                  <p className="font-semibold">Total: {allKelas.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

export default Guru;
