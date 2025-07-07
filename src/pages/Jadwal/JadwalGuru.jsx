import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { formatDateTime, useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import { useParams } from "react-router-dom";

export function JadwalGuru() {

return (
    <AuthGuard>
        <div className="hero">
            <div className="w-full flex flex-col gap-5 h-full">
                <h1>Jadwal anda hari ini </h1>
                <div>
                    <div className="w-[15rem] h-40 rounded-md"
                        style={{
                            maskImage: 'url(/images/folder3.png)',
                            WebkitMaskImage: 'url(/images/folder3.png)',
                            maskRepeat: 'no-repeat',
                            WebkitMaskRepeat: 'no-repeat',
                            maskSize: 'cover',
                            WebkitMaskSize: 'cover',
                        }}>
                            <p className="pl-8 bg-orange-300 text-white p-1">[ KELAS ]</p>
                            <div className="flex bg-orange-400 w-full h-[80%] justify-center items-center">
                                <p className="text-white font-poppins font-semibold text-lg">[ MATERI KELAS ]</p>
                            </div>
                    </div>
                </div>
            </div>
        </div>
    </AuthGuard>
);
}
