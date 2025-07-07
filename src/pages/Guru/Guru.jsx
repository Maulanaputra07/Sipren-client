import { formatDate, useAuth } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { DateTime } from "../../components/Timer/DateTime";
import cardLayout from "/images/cardLayout.png";
import { Link } from "react-router-dom";
import { useAxios } from "../../utils/Provider";
import { useEffect, useState } from "react";
import arrow from "/icons/arrowRightUpIcon.svg";

function Guru() {
  const auth = useAuth();
  const axios = useAxios();
  const [jadwal, setJadwal] = useState([]);

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

  useEffect(() => {
    fetchJadwal();
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
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
        {!auth?.user?.level && (

          <div>
            <div className="jadwal">
              <div className="w-full h-full flex rounded-md gap-2">
                <div className="w-1/2 shadow-md">
                  <p className="text-2xl bg-orange_fade rounded py-3 px-4 font-semibold font-poppins">JADWAL HARI INI</p>
                  <div className="h-64 bg-white p-5 ">
                    {jadwal && jadwal.length !== 0 ? (
                      <>
                      <div className="flex relative gap-4 p-2 overflow-y-hidden">
                        {jadwal.map((item) => (
                          <div key={item.id_jadwal} className="relative">
                            <div className="absolute hover:cursor-pointer z-30 right-2.5 top-2 rounded-full bg-transparent border border-gray/50">
                              <Link to="">
                                <img src={arrow} width={35} alt="" />
                              </Link>
                            </div>
                            <div className={`w-[12rem] h-40 rounded-md ${item.status === "true" ? "bg-green" : "bg-[#F2F2F0]"}`}
                              style={{
                                  maskImage: 'url(/images/cardLayout1.png)',
                                  WebkitMaskImage: 'url(/images/cardLayout1.png)',
                                  maskRepeat: 'no-repeat',
                                  WebkitMaskRepeat: 'no-repeat',
                                  maskSize: 'cover',
                                  WebkitMaskSize: 'cover',
                              }}>
                                <div className="flex-col justify-between">
                                      <p className="pl-3 text-black pt-5 text-2xl font-poppins font-semibold">{item.tingkat} {item.akronim} {item.no_kelas}</p>
                                      <p className="pl-3 text-sm font-poppins">{item.jadwal_mulai} - {item.jadwal_selesai}</p>
                                </div>
                                <div className="flex-col w-full h-[80%] p-5">
                                      <p className="text-black font-poppins font-semibold text-lg">{item.nama_mapel}</p>
                                      <p className="text-black font-poppins text-end font-normal text-lg">{item.nama_ruang}</p>
                                </div>
                            </div>
                          </div>
                        ))} 
                      </div>
                      <div className="pt-5 justify-end w-full flex">
                        <p className="font-poppins text-xl">Detail</p>
                      </div>
                      </>
                    ): (
                      <div> 
                        <h1>Anda tidak memiliki jadwal hari ini</h1>
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-1/2 shadow-md">
                  <p className="text-2xl bg-orange_fade rounded py-3 px-4 font-semibold font-poppins">HISTORY</p>
                  <div className="h-64 bg-white">

                  </div>
                </div>
              </div>
            </div>
            <div className="h-[50vh] mt-5 rounded-lg border border-gray/20 p-10 bg-blue/30">
            </div>
          </div>

        )}
      </div>
    </AuthGuard>
  );
}

export default Guru;
