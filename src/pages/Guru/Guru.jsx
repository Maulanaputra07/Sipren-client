import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { formatDate, useAuth } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { DateTime } from "../../components/Timer/DateTime";

function Guru() {
  const auth = useAuth();

  return (
    <AuthGuard>
      <div className="hero pl-64">
        <div className="main w-full">
          <div className="flex w-full gap-5 justify-between items-center mb-5">
            <div className="bg-blue_scale text-white w-full max-w-md rounded-md h-24 flex">
              <div className=" p-4 welcome shadow items-center flex w-full content-center justify-start">
                <span className="pr-2 text-xl"> Selamat Datang, </span>
                <div className="flex text-2xl font-bold">
                  <h5> {auth?.user?.level ? "Admin" : "Bapak/Ibu Guru"}</h5>
                </div>
              </div>

              {/* <div className="card selayang-padang shadow">
                <h3>Selayang Pandang</h3>
                <div className="divider"></div>
                <p align="left">
                  “Bukan hanya ilmu dan pengetahuan yang ditumbuhkembangkan
                  dalam proses belajar di sekolah, melainkan karakter positif
                  dan peluang menjadi insan yang hebat di masa depan. Di mana
                  tempat kamu belajar adalah kunci.”
                </p>
                <h5>
                  Ir. Eny Wahyuningsih, M. Pd.{" "}
                  <span>Kepala SMK Tunas Harapan Pati</span>
                </h5>
                <span style={{ fontFamily: "Great Vibes, cursive" }}>
                  Eny Wahyuningsih
                </span>
              </div> */}
            </div>
            <div className="history-date">
              <DateTime />
            </div>
          </div>
        </div>
        <div className="bg-orange_fade w-full p-5 rounded-md">
            <p className="text-2xl">JADWAL HARI INI</p>
        </div>
      </div>
    </AuthGuard>
  );
}

export default Guru;
