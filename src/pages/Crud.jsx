import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";
import Sidebar from "../components/Sidebar";
import UserForm from "./FormTambah";
import Edit from "./Edit";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";

const Crud = () => {
  document.title = "AdminDashboard";

  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [pageNumber, setPageNumber] = useState(0);
  const usersPerPage = 6;
  const pagesVisited = pageNumber * usersPerPage;

  const [searchTerm, setSearchTerm] = useState("");
  const [roleCategory, setRoleCategory] = useState("");

  const fetchUsers = async () => {
    try {
        const access_token = localStorage.getItem("token");
        if (!access_token) {
            console.error("Token not available. Please log in.");
            return;
        }

        // Check whether role_id is available or not
        if (formData.role_id) {
            const response = await axios.get(
                `http://127.0.0.1:8000/api/admin/users/byRoleId`,
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                    params: {
                        role_id: formData.role_id,
                    },
                }
            );

            setUsers(response.data.users);
        } else {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/admin/users",
                {
                    headers: {
                        Authorization: `Bearer ${access_token}`,
                    },
                    params: {
                        searchTerm: searchTerm,
                        roleCategory: roleCategory,
                    },
                }
            );

            setUsers(response.data.users);
        }
    } catch (error) {
        console.error("Error fetching users:", error.message);
        setUsers([]);
    }
};

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleCategory]);

  const handleInputChange = (e) => {
    setFormData((prevData) => {
      // Copy previous data
      const newData = { ...prevData };
  
      // Update field based on input name
      newData[e.target.name] = e.target.value;
  
      // Check if the input is the 'role' field and options exist
      if (e.target.name === 'role' && e.target.options) {
        // Get the selected option and its dataset
        const selectedOption = e.target.options[e.target.selectedIndex];
        const roleId = selectedOption?.dataset?.roleId;
  
        // Update role_id in the form data
        newData.role_id = roleId || null;
      }
  
      return newData;
    });
  };  
  

  const handleEdit = async (userId) => {
    try {
      const selectedUser = users.find((user) => user.id === userId);

      if (selectedUser) {
        const { name, email, role } = selectedUser;

        if (role && role.name) {
          setFormData({
            id: userId,
            name: name || "",
            email: email || "",
            password: "",
            role: role.name || "",
          });
          setSelectedUserId(userId);
          setShowEditForm(true);
        } else {
          console.error("Error: Peran pengguna tidak didefinisikan.");
          // Handle error properly, e.g., display a message to the user
        }
      } else {
        console.error("Error: Pengguna terpilih tidak ditemukan.");
        // Handle error properly, e.g., display a message to the user
      }
    } catch (error) {
      console.error("Error fetching user data for edit:", error);
      // Handle error properly, e.g., display a message to the user
    }
  };

  const getRoleIdFromApi = (roleName) => {
    // Logika untuk mendapatkan role_id dari API
    // ...
  
    // Contoh implementasi sederhana, pastikan sesuai dengan API Anda
    const roleMappings = {
      admin: 1,
      kaprog: 2,
      pembimbing: 3,
      siswa: 4,
      // tambahkan mapping lain sesuai kebutuhan
    };
  
    return roleMappings[roleName.toLowerCase()] || null;
  };

  const handleEditSubmit = async () => {
    try {
      const access_token = localStorage.getItem("token");
      if (!access_token) {
        console.error("Token not available. Please log in.");
        return;
      }
  
      if (formData.id) {
        await axios.put(
          `http://127.0.0.1:8000/api/admin/users/${formData.id}`,
          { ...formData, role_id: getRoleIdFromApi(formData.role) },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      } else {
        // Dapatkan role_id dari fungsi getRoleIdFromApi(formData.role)
        const roleId = getRoleIdFromApi(formData.role);
  
        await axios.post(
          "http://127.0.0.1:8000/api/admin/users",
          { ...formData, role_id: roleId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }
  
      fetchUsers();
      setShowAddForm(false);
      setShowEditForm(false);
      setFormData({ id: null, name: "", email: "", password: "", role: "" });
    } catch (error) {
      console.error("Error creating/updating user:", error);
      // Handle errors appropriately
    }
  };
  
  

  const handleDelete = async (userId) => {
    try {
      const result = await Swal.fire({
        title: "Konfirmasi",
        text: "Apakah Anda yakin ingin menghapus pengguna ini?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Ya, hapus!",
        cancelButtonText: "Batal",
      });

      if (result.isConfirmed) {
        const access_token = localStorage.getItem("token");
        if (!access_token) {
          console.error("Token not available. Please log in.");
          return;
        }

        await axios.delete(`http://127.0.0.1:8000/api/admin/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        fetchUsers();

        Swal.fire({
          icon: "success",
          title: "Sukses",
          text: "Akun berhasil dihapus.",
        });
      }
    } catch (error) {
      console.error("Error deleting user:", error);

      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: "Gagal menghapus akun.",
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const access_token = localStorage.getItem("token");
      if (!access_token) {
        console.error("Token not available. Please log in.");
        return;
      }

      let roleId;
      switch (formData.role.toLowerCase()) {
        case "admin":
          roleId = 1;
          break;
        case "siswa":
          roleId = 4;
          break;
        case "kaprog":
          roleId = 2;
          break;
        case "pembimbing":
          roleId = 3;
          break;
        default:
          roleId = 5;
      }

      if (formData.id) {
        await axios.put(
          `http://127.0.0.1:8000/api/admin/users/${formData.id}`,
          { ...formData, role_id: roleId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      } else {
        await axios.post(
          "http://127.0.0.1:8000/api/admin/users",
          { ...formData, role_id: roleId },
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }

      fetchUsers();
      setShowAddForm(false);
      setShowEditForm(false);
      setFormData({ id: null, name: "", email: "", password: "", role: "" });
    } catch (error) {
      console.error("Error creating/updating user:", error);

      if (error.response) {
        console.error("Server Response Data:", error.response.data);
        console.error("Server Response Status:", error.response.status);
        console.error("Server Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("No response received:", error.request);
      } else {
        console.error("Error before sending request:", error.message);
      }
    }
  };

  const pageCount = Math.ceil(users.length / usersPerPage);

  const changePage = ({ selected }) => {
    setPageNumber(selected);
  };

  return (
    <div className="flex bg-gray-200">
      <Sidebar />
      <div className="flex-1 h-screen p-8">
        <div className="p-4">
          <button
            className="text-sm font-bold text-white bg-blue-500 py-2 px-4 rounded-md"
            onClick={() => setShowAddForm(true)}
          >
            Tambah User
          </button>
        </div>
        <div className="text-center mx-auto">
          <div className="flex justify-between mb-4">
            <div className="w-1/2 mr-2">
              <input
                type="text"
                placeholder="Cari berdasarkan nama"
                className="w-full p-2 border border-gray-300 rounded-md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-1/2 ml-2">
              <select
                className="w-full p-2 border border-gray-300 rounded-md"
                value={roleCategory}
                onChange={(e) => setRoleCategory(e.target.value)}
              >
                <option value="">Semua Role</option>
                <option value="admin">Admin</option>
                <option value="siswa">Siswa</option>
                <option value="kaprog">Kaprog</option>
                <option value="pembimbing">Pembimbing</option>
              </select>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">
            Daftar User
          </h2>
          <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">ID</th>
                <th className="py-2 px-4 border">Nama</th>
                <th className="py-2 px-4 border">Email</th>
                <th className="py-2 px-4 border">Role</th>
                <th className="py-2 px-4 border">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users
                .slice(pagesVisited, pagesVisited + usersPerPage)
                .map((user) => (
                  <tr key={user.id}>
                    <td className="py-2 px-4 border">{user.id}</td>
                    <td className="py-2 px-4 border">{user.name}</td>
                    <td className="py-2 px-4 border">{user.email}</td>
                    <td className="py-2 px-4 border">
                      {user.role && user.role.name}
                    </td>
                    <td className="py-2 px-2 border flex items-center">
                      <button
                        className="text-blue-500 hover:underline"
                        onClick={() => handleEdit(user.id)}
                      >
                        <FaUserEdit className="text-lg" />
                      </button>

                      <hr className=" mx-5 h-5" />
                      <button
                        className={`text-red-500 hover:underline ${
                          user.isDeleting ? "bg-red-200" : ""
                        }`}
                        onClick={() => handleDelete(user.id)}
                      >
                        <MdOutlineDeleteForever className="text-lg" />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <ReactPaginate
            previousLabel={"Previous"}
            nextLabel={"Next"}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={"pagination flex gap-2 mt-4"}
            previousLinkClassName={
              "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
            }
            nextLinkClassName={
              "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
            }
            disabledClassName={"pagination__link--disabled"}
            activeClassName={
              "pagination__link--active bg-blue-500 text-white border-blue-500"
            }
          />
        </div>
      </div>

      {showAddForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 max-w-2xl mx-auto rounded-md">
            <UserForm
              onClose={() => {
                setShowAddForm(false);
                setFormData({
                  id: null,
                  name: "",
                  email: "",
                  password: "",
                  role: "",
                });
              }}
              onSubmit={handleSubmit}
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 max-w-2xl mx-auto rounded-md">
            <Edit
              onClose={() => {
                setShowEditForm(false);
                setFormData({
                  id: null,
                  name: "",
                  email: "",
                  password: "",
                  role: "",
                });
              }}
              onSubmit={handleEditSubmit}
              formData={formData}
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Crud;
