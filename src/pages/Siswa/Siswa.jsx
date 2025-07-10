// Page ini tidak terpakai

import { useEffect, useState } from "react";
import { useAxios } from "../../utils/Provider";
import { AuthGuard } from "../../utils/AuthGuard";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { Link } from "react-router-dom";
import addIcon from "/icons/addIcon.svg";

export function Siswa() {
  const axios = useAxios();
  const [siswa, setSiswa] = useState();

  function handleDeleteSiswa(e) {}

  useEffect(() => {
    axios
      .get("/siswa")
      .then((res) => {
        setSiswa(res.data.data);
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <AuthGuard>
      <div className="hero">
        <div className="flex-col gap-1">
          <Link
            to={"add"}
            className="bg-green/80 font-poppins text-lg hover:bg-green transition-all duration-200 delay-100 hover:shadow-xl max-w-fit items text-white shadow-md font-bold px-3 py-2 mx-5 rounded-lg flex justify-between items-center"
          >
            <img src={addIcon} className={`transition-all duration-300 group-hover:scale-110 w-[35px]`} color="" alt="presensiIcon" />
            <span className="px-2">Add Siswa</span>
          </Link>

          <table className="w-full table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>NIS</th>
                <th>Kelas</th>
                <th>RFID ID</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {siswa &&
                siswa.map((s, i) => (
                  <tr key={i}>
                    <td>{s.nama}</td>
                    <td>{s.nis}</td>
                    <td>{`${s.tingkat} ${s.akronim} ${s.no_kelas}`}</td>
                    <td>{s.rfid}</td>
                    <td className="flex gap-2 justify-center">
                      <Link
                            to={"update/" + s.nis}
                            className="bg-orange_scale py-1 px-4 rounded"
                          >
                            Edit
                          </Link>
                      <button
                        onClick={handleDeleteSiswa}
                        value={s.nis}
                        className="bg-red py-1 px-4 rounded"
                      >
                        Delete
                      </button>{" "}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
