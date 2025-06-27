import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setEncryptedData, useAuth, useAxios } from "../../utils/Provider";
// import imgTunas from '../../../public/images/bg-2.png';
import Swal from "sweetalert2";

function Login() {
  const axios = useAxios();
  const navigate = useNavigate();
  const auth = useAuth();

  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post("/auth/login", {
        username: e.target.username.value,
        password: e.target.password.value,
      })
      .then((res) => {
        console.log(res.data);
        setEncryptedData("token", res.data.accessToken);
        setEncryptedData("user", res.data.user); // simpan user langsung
        if(res.data.user.level){
          window.location = "/admin";
        }else{
          window.location = "/guru";
        }
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

  return (
    <div className="login w-full h-screen flex items-center ">
      <div className="w-1/2 flex flex-col justify-center items-center h-full relative">
        <div className="logo absolute z-10 top-0 left-3 p-3">
          <img src="/images/logo.png" alt="Ini Logo" style={{ width: "4em" }} />
        </div>

        <div className="mb-10 -space-y-3">
          <p className="text-7xl font-black uppercase font-urbanist">sipren</p>
          <p className="pl-24 font-poppins">Sistem Presensi Siswa</p>
        </div>
        <form className="login" method="POST" onSubmit={handleSubmit}>
          {/* <div className="input">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="43"
              height="43"
              viewBox="0 0 53 53"
              fill="none"
            >
              <path
                d="M14.75 40.6703V38.3203C14.75 31.831 20.0107 26.5703 26.5 26.5703C32.9893 26.5703 38.25 31.831 38.25 38.3203V40.6703"
                stroke="black"
                strokeWidth="5" 
                strokeLinecap="round"
              />
              <path
                d="M26.5 26.5703C30.3937 26.5703 33.55 23.414 33.55 19.5203C33.55 15.6267 30.3937 12.4703 26.5 12.4703C22.6063 12.4703 19.45 15.6267 19.45 19.5203C19.45 23.414 22.6063 26.5703 26.5 26.5703Z"
                stroke="black"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M26.5 50.0703C39.4787 50.0703 50 39.549 50 26.5703C50 13.5916 39.4787 3.07031 26.5 3.07031C13.5213 3.07031 3 13.5916 3 26.5703C3 39.549 13.5213 50.0703 26.5 50.0703Z"
                stroke="black"
                strokeWidth="5"
              />
            </svg>
            <input
              type="text"
              className="px-3"
              placeholder="Username"
              name="username"
              autoComplete="username"
            />
          </div>

          <div className="input">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="40"
              height="40"
              viewBox="0 0 49 53"
              fill="none"
            >
              <path
                d="M38.8333 26.5H43.85C45.0375 26.5 46 27.289 46 28.2625V48.2375C46 49.211 45.0375 50 43.85 50H5.15C3.96259 50 3 49.211 3 48.2375V28.2625C3 27.289 3.96259 26.5 5.15 26.5H10.1667M38.8333 26.5V14.75C38.8333 10.8333 35.9667 3 24.5 3C13.0333 3 10.1667 10.8333 10.1667 14.75V26.5M38.8333 26.5H10.1667"
                stroke="black"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="password"
              className="px-3"
              placeholder="Password"
              name="password"
              autoComplete="password"
            />
          </div> */}

          <div className="card-login d-flex flex-col backdrop-blur-md border-2 border-gray/20 rounded-2xl shadow-lg px-10 pt-16 pb-10 w-[50rem] max-w-lg h-full text-white">
            <div className="input relative ">
              <input
              type="text"
              required
              className="p-5 text-black font-poppins peer w-full text-xl h-12 pt-5 border-2 border-gray/30 rounded-lg outline-none placeholder-transparent bg-transparent transition-all focus:border-orange_main"
              placeholder="Username"
              name="username"
              autoComplete="username"
            />
            <label
              className="absolute left-0 -top-7 font-poppins text-orange_main text-lg transition-all 
              peer-placeholder-shown:top-2.5 
              peer-placeholder-shown:left-2 
              peer-placeholder-shown:text-xl 
              peer-placeholder-shown:text-gray 
              peer-focus:-top-7
              peer-focus:left-0
              peer-focus:text-xl 
              peer-focus:text-orange_main 
              px-1"
            >
              Username
            </label>
            </div>

            <div className="input relative mt-8">
              <input
              type="password"
              required
              className="p-5 text-black font-poppins peer w-full text-xl h-12 pt-5 border-2 border-gray/30 rounded-lg outline-none placeholder-transparent bg-transparent transition-all focus:border-orange_main"
              placeholder="Password"
              name="password"
              autoComplete="password"
            />
            <label
              className="absolute left-0 -top-7 font-poppins text-orange_main text-lg transition-all 
              peer-placeholder-shown:top-2.5 
              peer-placeholder-shown:left-2 
              peer-placeholder-shown:text-xl 
              peer-placeholder-shown:text-gray 
              peer-focus:-top-7
              peer-focus:left-0
              peer-focus:text-xl 
              peer-focus:text-orange_main 
              px-1"
            >
              Password
            </label>
            </div>

            <div className="btn-parent mt-4">
              <button className="btn bg-orange_main font-poppins p-2 text-2xl max-w-lg w-full font-medium rounded-lg" type="submit">
                Login
              </button>
            </div>
          </div>

        </form>
      </div>
      <div className="tleading-none h-full flex justify-center items-center bg-white w-1/2 relative">
        <p className="absolute top-5 left-8 font-bold text-xl z-10 text-white font-poppins">SMK TUNAS HARAPAN PATI</p>
        {/* <div className="imgLogin h-full w-full rounded-xl"></div> */}
            <div className="h-full w-full bg-cover brightness-50 bg-right bg-[url(/images/bg-2.png)]"
            style={{
              maskImage: 'url(/images/RectangleLayout.png)',
              WebkitMaskImage: 'url(/images/RectangleLayout.png)',
              maskRepeat: 'no-repeat',
              WebkitMaskRepeat: 'no-repeat',
              maskSize: 'cover',
              WebkitMaskSize: 'cover',
            }}
            ></div>
      </div>
    </div>
  );
}

export default Login;
