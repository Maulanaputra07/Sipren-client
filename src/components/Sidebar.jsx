import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/Provider";
import dashboardIcon from "/icons/RadixIconsDashboard.svg";
import presensiIcon from "/icons/OcticonIdBadge24.svg";
import dataPresensiIcon from "/icons/HugeiconsTaskEdit01.svg";
import dataUserIcon from "/icons/HeroiconsUsers.svg";
import booksIcon from "/icons/booksIcon.svg";
import mapelIcon from "/icons/mapelIcon.svg";
import scheduleIcon from "/icons/scheduleIcon.svg";
import logoutIcon from "/icons/logoutIcon.svg";
import { useAxios } from "../utils/Provider";


function Sidebar() {
    const axios = useAxios();
    const navigate = useNavigate();

  const [date, setDate] = useState({
    second: "00",
    minute: "00",
    hour: "00",
    day: "00",
    month: "00",
    year: "0000",
    currentPeriod: "-",
  });

  function handleLogout(e) {
    e.preventDefault();
    axios
      .delete("/auth/logout")
      .then((res) => {
        localStorage.setItem("user", null);
        localStorage.setItem("token", null);
        navigate("/");
      })
      .catch((err) => console.log(err));
  }

  const {pathname} = useLocation();

  const [isChevronDown, setIsChevronDown] = useState(true);

  const showStatus = (e) => {
    setIsChevronDown(!isChevronDown);
    const grandParentElement = e.currentTarget.parentElement.parentElement;
    isChevronDown
      ? (grandParentElement.style.transform = "translateY(0%)")
      : (grandParentElement.style.transform = "translateY(85%)");
  };

  const auth = useAuth();

  const isActive = (path) => pathname === path;
  const isParentActive = (prefix) => pathname.startsWith(prefix);

  const isAdmin = auth.user.level === 1;
  const isGuru = auth.user.level === 0;

  const dashboardActive = isAdmin ? pathname === "/admin" : pathname === "/guru";

  const sidebarRef = useRef(null);
  const resizerRef = useRef(null);
  const [isResizing, setIsResizing] = useState(false);
  const [widthSidebar, setWidthSidebar] = useState(256);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if(!isResizing || !sidebarRef.current) return;
      document.body.classList.add("nonselect")

      const newWidth = Math.max(100, Math.min(e.clientX, 400));
      sidebarRef.current.style.width = `${newWidth}px`;
    };

    const handleMouseUp = () => {
      if (isResizing && sidebarRef.current) {
        const finalWidth = sidebarRef.current.offsetWidth;
        setWidthSidebar(finalWidth);
        console.log("sidebar width: "+widthSidebar);
        setIsResizing(false);
        document.body.classList.remove("nonselect");
        document.body.style.cursor = "default"
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }


  }, [isResizing])

  return (
    <>
      <header id="sidebar" ref={sidebarRef} className="sidebar bg-sidebar_color shadow-xl relative h-[100vh] min-w-[100px] max-w-[256px] w-[256px]">
        <div
        ref={resizerRef}
        onMouseDown={() => {
          setIsResizing(true);
          document.body.style.cursor = "col-resize";
        }}
        className="absolute top-0 right-0 h-full w-[2px] bg-transparent hover:bg-black cursor-e-resize z-50"
      />
        <button className="menu-btn">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 19"
            style={{ fill: "rgba(0, 0, 0, 1)" }}
          >
            <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>
          </svg>
        </button>
        <div className="logo flex items-center justify-center gap-2" style={{padding: "0.79rem"}}>
          <img src="/images/logo.png" alt="tunas.png" width="60px" />
          {widthSidebar > 220 && (
            <div>
              <p className="text-4xl uppercase font-black font-urbanist">Sipren</p>
              <p className="text-xs font-poppins">SMK Tunas Harapan Pati</p>
            </div>
          )}
        </div>
        <div className="navbar">
          <nav>
            <ul>
              <li className="">
                <Link to={auth.user.level === 1 ? "/admin" : "/guru"} 
                      className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${dashboardActive ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                  <img src={dashboardIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} alt="berandaIcon" />
                  {widthSidebar > 220 && ( <span>Beranda</span> )}
                </Link>
              </li>

              {isGuru && (
                <>
                <li>
                  <Link to="jadwal_guru" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname === "/guru/presensi" ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                  <img src={presensiIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="presensiIcon" />
                  {widthSidebar > 220 && ( <span>Jadwal</span> )}
                  </Link>
                </li>

                {/* <li>
                  <Link to="presensi" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname === "/guru/presensi" ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                  <img src={presensiIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="presensiIcon" />
                  {widthSidebar > 220 && ( <span>Presensi</span> )}
                  </Link>
                </li> */}

                <li>
                  <Link to="data_presensi" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname === "/guru/data_presensi" ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                  <img src={dataPresensiIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="dataPresensiIcon" />
                  {widthSidebar > 220 && ( <span>Data Presensi</span> )}
                  </Link>
                </li>
                </>
              )}

              {/* {isGuru && (
              )}

              {isGuru && (
                
              )} */}

              {isAdmin && (
                <>
                  <li>
                    <Link to="data_user" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname.includes("/data_user") ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                      <img src={dataUserIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="dataPresensiIcon" />
                      {widthSidebar > 220 && (<span>Data User</span>)}
                    </Link>
                  </li>

                  <li>
                    <Link to="kelas" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname.includes("/kelas") ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                    <img src={booksIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="dataPresensiIcon" />
                      {widthSidebar > 220 && (<span>Data Kelas</span>)}
                    </Link>
                  </li>

                  <li>
                    <Link to="mapel" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname.includes("/mapel") ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                    <img src={mapelIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="dataPresensiIcon" />
                      {widthSidebar > 220 && (<span>Data Mapel</span>)}
                    </Link>
                  </li>

                  <li>
                    <Link to="jadwal" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname.includes("/jadwal") ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                    <img src={scheduleIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="dataPresensiIcon" />
                      {widthSidebar > 220 && (<span>Data Jadwal</span>)}
                    </Link>
                  </li>

                  <li>
                    <Link to="data_presensi" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname.includes("/data_presensi") ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                    <img src={dataPresensiIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="dataPresensiIcon" />
                      {widthSidebar > 220 && (<span>Data Presensi</span>)}
                    </Link>
                  </li>

                  {/* <li>
                    <Link to="siswa" className={`group flex item-center gap-3 transition-all py-2 duration-300 ease-in-out ${pathname.includes("/siswa") ? "active py-2 rounded-lg bg-white" : "py-2 hover:bg-white hover:rounded-lg"}`}>
                    <img src={studentsIcon} className={`transition-all duration-300 group-hover:scale-110 ${widthSidebar > 220 ? "w-[35px]" : "w-[40px]"}`} color="" alt="dataPresensiIcon" />
                      {widthSidebar > 220 && (<span>Data Siswa</span>)}
                    </Link>
                  </li> */}

                </>
              )}
              <li className="absolute bottom-5 w-full flex justify-center">
                <form onSubmit={handleLogout} method="POST">
                  <button
                      type="submit"
                      className="group flex items-center gap-4 px-5 py-2 rounded-lg font-semibold text-red  hover:bg-red/80 hover:text-white hover:bg-red-600 transition-all duration-300  hover:shadow-lg focus:outline-none focus:ring-1 focus:ring-red"
                    >
                  <img
                    src={logoutIcon}
                    alt="logout icon"
                    className={`transition-transform duration-300 group-hover:rotate-[-10deg] group-hover:scale-110 ${
                      widthSidebar > 220 ? "w-[30px]" : "w-[25px]"
                    }`}
                  />
                    {widthSidebar > 220 && (
                      <span className="font-poppins text-xl tracking-wide">Logout</span>
                    )}
                  </button>
                </form>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    </>
  );
}

export default Sidebar;
