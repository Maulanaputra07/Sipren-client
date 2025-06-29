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
                  <div className="h-64 bg-white">

                  </div>
                </div>
                <div className="w-1/2 shadow-md">
                  <p className="text-2xl bg-orange_fade rounded py-3 px-4 font-semibold font-poppins">HISTORY</p>
                  <div className="h-64 bg-white">

                  </div>
                </div>
              </div>
            </div>
            <div className="h-[50vh] mt-5 rounded-lg border border-gray/20 p-10 bg-white">
            </div>
          </div>

        )}
      </div>
    </AuthGuard>
  );
}

export default Guru;
