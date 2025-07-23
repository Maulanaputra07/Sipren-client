import { useState } from "react";
import { AuthGuard } from "../../utils/AuthGuard";
import { useAuth, useAxios } from "../../utils/Provider";
import Swal from "sweetalert2";

export function Profile() {
    const auth = useAuth();
    const axios = useAxios();
    const [showForm, setShowForm] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if(newPassword !== confirmNewPassword){
            Swal.fire({
                title: "Error!",
                text: "New password and confirm password do not match.",
                icon: "error",
                confirmButtonText: "Tutup",
            });
        }

        axios.put('/auth/change_password', {
            current_password: currentPassword,
            new_password: newPassword,
            confirm_new_password: confirmNewPassword
        })
        .then((res) => {
            Swal.fire({
                title: "Success",
                text: "Berhasil ganti password",
                icon: "success",
                confirmButtonText: "OK",
            });

            setCurrentPassword("");
            setNewPassword("");
            setConfirmNewPassword("");
            setShowForm(false);
        })
        .catch((err) => {
            console.log("error: ", err.response?.data?.message);
            Swal.fire({
                title: "Error!",
                text: err.response?.data?.message,
                icon: "error",
                confirmButtonText: "Tutup",
            });
        })

        
    }

    return(
        <AuthGuard>
            <div className="hero">
                <div className="bg-[#FAFAFA] mb-5 shadow-md p-10 rounded-lg flex justify-between items-baseline">
                    <div className="flex gap-5 items-center">
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
                        <div>
                            <p className="font-poppins font-semibold text-2xl">{auth.user.username} - {auth.user.level ? "admin" : "guru"}</p>
                            <p className="font-poppins font-semibold text-2xl">{auth.user.nama}</p>
                        </div>
                    </div>
                    <div>
                        <button
                            onClick={() => setShowForm(!showForm)}
                            className="px-2 py-1 bg-orange_main rounded-md text-lg font-normal"
                        >Change Password</button>
                    </div>
                </div>

                {showForm && (
                    <div className="bg-[#FAFAFA] shadow-md rounded-md p-5">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                            <input
                                type="text"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Current Password"
                                className="border rounded-lg px-3 py-2"
                                required
                            />

                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="New Password"
                                className="border rounded-lg px-3 py-2"
                                required
                            />
                            
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                placeholder="Confirm New Password"
                                className="border rounded-lg px-3 py-2"
                                required
                            />

                            <button
                                type="submit"
                                className="bg-blue/50 hover:bg-blue text-white font-semibold px-4 py-2 rounded-lg transition"
                            >
                                Save New Password
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </AuthGuard>
    )
}