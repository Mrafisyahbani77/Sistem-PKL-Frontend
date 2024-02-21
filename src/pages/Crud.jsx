import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import UserForm from "./FormTambah";
import Edit from "./Edit";
import { MdOutlineDeleteForever } from "react-icons/md";
import { FaUserEdit } from "react-icons/fa";
import Swal from "sweetalert2";
import ReactPaginate from "react-paginate";

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
    } catch (error) {
      console.error("Error fetching users:", error.message);
      setUsers([]);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, roleCategory]);

  const handleInputChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleDelete = async (id) => {
    try {
      const access_token = localStorage.getItem("token");
      if (!access_token) {
        console.error("Token not available. Please log in.");
        return;
      }

      await axios.delete(`http://127.0.0.1:8000/api/admin/users/${id}`, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });

      fetchUsers();
      Swal.fire("Success", "User deleted successfully", "success");
    } catch (error) {
      console.error("Error deleting user:", error.message);
      Swal.fire("Error", "Failed to delete user", "error");
    }
  };

  const handleEdit = async (id) => {
    const userToEdit = users.find((user) => user.id === id);
    setFormData({
      id: userToEdit.id,
      name: userToEdit.name,
      email: userToEdit.email,
      password: userToEdit.password,
      role: userToEdit.role,
    });
    setShowEditForm(true);
  };

  const handleSubmit = async () => {
    try {
      const access_token = localStorage.getItem("token");
      if (!access_token) {
        console.error("Token not available. Please log in.");
        return;
      }

      let response;
      if (formData.id) {
        response = await axios.put(
          `http://127.0.0.1:8000/api/admin/users/${formData.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      } else {
        response = await axios.post(
          "http://127.0.0.1:8000/api/admin/users",
          formData,
          {
            headers: {
              Authorization: `Bearer ${access_token}`,
            },
          }
        );
      }

      if (response.status === 200 || response.status === 201) {
        fetchUsers();
        setShowAddForm(false);
        setShowEditForm(false);
        setFormData({
          id: null,
          name: "",
          email: "",
          password: "",
          role: "",
        });

        Swal.fire("Success", "User saved successfully", "success");
      } else {
        Swal.fire("Error", "Failed to save user", "error");
      }
    } catch (error) {
      console.error("Error saving user:", error.message);
      if (error.response && error.response.data && error.response.data.errors) {
        const errors = Object.values(error.response.data.errors).join("\n");
        Swal.fire("Error", `Validation errors:\n${errors}`, "error");
      } else {
        Swal.fire("Error", "Failed to save user", "error");
      }
    }
  };

  const renderTable = () => {
    switch (roleCategory) {
      case "admin":
        return (
          <div className="overflow-x-auto">
            <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Password</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2">{index + 1}</td>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">{user.password}</td>
                      <td className="px-4 py-2">
                        <FaUserEdit
                          onClick={() => handleEdit(user.id)}
                          className="cursor-pointer text-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <MdOutlineDeleteForever
                          onClick={() => handleDelete(user.id)}
                          className="cursor-pointer text-red-500"
                        />
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
            <ReactPaginate
              previousLabel={"Sebelumnya"}
              nextLabel={"Berikutnya"}
              pageCount={Math.ceil(users.length / usersPerPage)}
              onPageChange={({ selected }) => setPageNumber(selected)}
              containerClassName={"pagination flex gap-2 mt-4 justify-center"}
              previousLinkClassName={
                "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
              }
              nextLinkClassName={
                "pagination__link px-4 py-2 border border-gray-300 rounded-md text-gray-600 hover:text-gray-800 hover:border-gray-400 bg-gray-100"
              }
              disabledClassName={"pagination__link--disabled"}
              activeClassName={
                "pagination__link--active bg-gray-500 text-white border-blue-500"
              }
            />
          </div>
        );
      default:
        return (
          <p className="text-center">Silakan pilih role untuk melihat data</p>
        );
    }
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
                placeholder="Cari Akun Pengguna"
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
                <option value="">Pilih Role</option>
                <option value="admin">Admin</option>
                <option value="siswa">Siswa</option>
                <option value="pembimbing">Pembimbing</option>
                <option value="kaprog">Kaprog</option>
              </select>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mt-8 mb-4 text-center">
            Daftar Akun Pengguna
          </h2>
          {renderTable()}
        </div>
      </div>

      {/* Form tambah user */}
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
              onInputChange={(e) => {
                setFormData((prevData) => ({
                  ...prevData,
                  [e.target.name]: e.target.value,
                }));
              }}
              roleCategory={roleCategory}
              setFormData={setFormData} // Tambahkan properti setFormData di sini
            />
          </div>
        </div>
      )}

      {/* Form edit user */}
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
              onSubmit={handleSubmit}
              formData={formData}
              onInputChange={handleInputChange}
              roleCategory={roleCategory}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Crud;
