import { useNavigate, useParams } from "react-router-dom";
import { useAuth, useAxios } from "../utils/Provider";
import { useEffect } from "react";

function Navbar() {
  const axios = useAxios();
  const auth = useAuth();
  const navigate = useNavigate();

  const pathname = window.location.pathname;

  const handleClick = () => {
    if(auth.user.level === 0){
      navigate("/guru/profile")
    }
  }


  return (
    <>
      <header className="header relative">
        <div className="container">
          <h3 className="shadow-none font-bold">
            {pathname.split("/")[1].replace("_", " ").toLocaleUpperCase()}
          </h3>
          <div onClick={handleClick} className={`${auth.user.level ? "" : "hover:cursor-pointer px-2 py-1 rounded-lg hover:bg-white/70 transition-all duration-300"}`}>
            <div className="user">
              <p>{auth.user.nama}</p>
              <span className="font-poppins">{auth.user.level ? "Admin" : "Guru"}</span>
            </div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="50"
                height="50"
                viewBox="0 0 63 64"
                fill="none"
              >
                <path
                  d="M17.25 48.9125V46.0625C17.25 38.1925 23.63 31.8125 31.5 31.8125C39.37 31.8125 45.75 38.1925 45.75 46.0625V48.9125"
                  stroke="black"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <path
                  d="M31.5 31.8125C36.2221 31.8125 40.05 27.9847 40.05 23.2625C40.05 18.5405 36.2221 14.7125 31.5 14.7125C26.7778 14.7125 22.95 18.5405 22.95 23.2625C22.95 27.9847 26.7778 31.8125 31.5 31.8125Z"
                  stroke="black"
                  strokeWidth="6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M31.5 60.3125C47.2401 60.3125 60 47.5526 60 31.8125C60 16.0724 47.2401 3.3125 31.5 3.3125C15.7599 3.3125 3 16.0724 3 31.8125C3 47.5526 15.7599 60.3125 31.5 60.3125Z"
                  stroke="black"
                  strokeWidth="6"
                />
              </svg>
          </div>
        </div>
      </header>
    </>
  );
}

export default Navbar;
