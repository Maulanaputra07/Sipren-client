import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import { AuthGuard } from "../../utils/AuthGuard";
import { getDecryptedData, useAxios } from "../../utils/Provider";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import addUserIcon from "/icons/LineMdAccountAdd.svg";

export function DataUser() {
  const axios = useAxios();
  const [users, setUsers] = useState();

  function handleDeleteUser(e) {
    e.preventDefault();
    console.log(e.target.id_user.value);
    console.log(e.target.username.value);
    Swal.fire({
      title: `Yakin Ingin Menghapus User "${e.target.username.value}"? `,
      text: "User yang dihapus tidak bisa dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete(`/users/${e.target.id_user.value}`)
          .then((res) => {
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success",
            });
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
    });
  }

  useEffect(() => {
    axios
      .get("/users", {
        headers: { Authorization: `Bearer ${getDecryptedData("token")}` },
      })
      .then((res) => {
        setUsers(res.data.data);
        console.log(res.data.data)
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
            className="bg-green/80 hover:bg-green transition-all duration-200 delay-100 hover:shadow-xl max-w-fit items text-white shadow-md font-bold px-4 py-3 mx-5 rounded flex justify-between items-center"
          >
            <img src={addUserIcon} className={`transition-all duration-300 group-hover:scale-110 w-[35px]`} color="" alt="presensiIcon" />
            <span className="px-2">Add user</span>
          </Link>
          <table className="table w-full">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Username</th>
                <th>Role</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users &&
                users.map((user, key) => {
                  return (
                    <tr key={key}>
                      <td>{user.nama}</td>
                      <td>{user.username}</td>
                      <td>{user.level == 1 ? "Admin" : "Guru"}</td>
                      <td>
                        <div className="flex gap-2 justify-center">
                          <Link
                            to={"update/" + user.id_user}
                            className="bg-orange_scale py-1 px-4 rounded"
                          >
                            Edit
                          </Link>
                          <form onSubmit={handleDeleteUser}>
                            <input
                              type="hidden"
                              name="id_user"
                              value={user.id_user}
                            />
                            <input
                              type="hidden"
                              name="username"
                              value={user.username}
                            />
                            <button className="bg-red py-1 px-4 rounded">
                              Delete
                            </button>
                          </form>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </AuthGuard>
  );
}
