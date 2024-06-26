import React, { useState, useEffect } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import UserForm from "./FormTambah";
import ImportAkun from "./ImportAkun";
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
  const [showTambahForm, setShowTambahForm] = useState(false);
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

  const handleEdit = async (userId) => {
    try {
      const selectedUser = users.find((user) => user.id === userId);

      if (selectedUser) {
        const {
          name,
          email,
          role,
          password,
          nisn,
          kelas,
          nip,
          jabatan,
          pangkat,
          nomer_telpon,
        } = selectedUser;

        if (role && role.name) {
          setFormData({
            id: userId,
            name: name || "",
            email: email || "",
            password: password || "", // Set nilai password dari selectedUser
            role: role.name || "",
            nisn: nisn || "", // Set nilai nisn dari selectedUser
            kelas: kelas || "", // Set nilai kelas dari selectedUser
            nip: nip || "", // Set nilai nip dari selectedUser
            jabatan: jabatan || "", // Set nilai jabatan dari selectedUser
            pangkat: pangkat || "", // Set nilai pangkat dari selectedUser
            nomor_telepon: nomer_telpon || "", // Set nilai nomor_telepon dari selectedUser
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

  const handleSubmit = async () => {
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

  const renderTable = () => {
    switch (roleCategory) {
      case "admin":
        return (
          <div className="">
            <table className="bg-white table-auto w-full shadow-md rounded-md border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 border">
                        {index + 1 + pagesVisited}
                      </td>
                      <td className="px-4 py-2 border max-w-[50px] overflow-x-auto whitespace-nowrap">
                        {user.name}
                      </td>
                      <td className="px-4 py-2 border max-w-[100px] overflow-x-auto whitespace-nowrap">
                        {user.email}
                      </td>
                      <td className="px-4 py-2 border">
                        <FaUserEdit
                          onClick={() => handleEdit(user.id)}
                          className="cursor-pointer text-center max-w-[50px] text-blue-500"
                        />
                      </td>
                      <td className="py-2 px-4 border">
                        <MdOutlineDeleteForever
                          onClick={() => handleDelete(user.id)}
                          className="cursor-pointer  max-w-[50px] text-center text-red-500"
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
      case "siswa":
        return (
          <div className="">
            <table className="bg-white table-auto w-full shadow-md rounded-md border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Nisn</th>
                  <th className="px-4 py-2">Kelas</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 border">
                        {index + 1 + pagesVisited}
                      </td>
                      <td className="px-4 py-2 border">{user.name}</td>
                      <td className="px-4 py-2 border max-w-[100px] overflow-x-auto whitespace-nowrap">
                        {user.nisn}
                      </td>
                      <td className="px-4 py-2 border">{user.kelas}</td>
                      <td className="px-4 py-2 border overflow-x-auto whitespace-nowrap  max-w-[100px]">
                        {user.email}
                      </td>
                      <td className="px-4 py-2 border max-w-[100px]">
                        <FaUserEdit
                          onClick={() => handleEdit(user.id)}
                          className="cursor-pointer text-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 border max-w-[100px]">
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
      case "pembimbing":
        return (
          <div className="overflow-x-auto">
            <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Nip</th>
                  <th className="px-4 py-2">Jabatan</th>
                  <th className="px-4 py-2">Pangkat</th>
                  <th className="px-4 py-2">Nomor Telepon</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 border">
                        {index + 1 + pagesVisited}
                      </td>
                      <td className="px-4 py-2 border">{user.name}</td>
                      <td className="px-4 py-2 border">{user.nip}</td>
                      <td className="px-4 py-2 border">{user.jabatan}</td>
                      <td className="px-4 py-2 border">{user.pangkat}</td>
                      <td className="px-4 py-2 border">{user.nomer_telpon}</td>
                      <td className="px-4 py-2 border">{user.email}</td>
                      <td className="px-4 py-2 border">
                        <FaUserEdit
                          onClick={() => handleEdit(user.id)}
                          className="cursor-pointer text-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 border">
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
        break;
      case "kaprog":
        return (
          <div className="overflow-x-auto">
            <table className="bg-white table-auto w-full shadow-md rounded-md overflow-hidden border border-gray-300">
              <thead className="bg-gray-200">
                <tr className="bg-gray-200">
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama</th>
                  <th className="px-4 py-2">Nip</th>
                  <th className="px-4 py-2">Email</th>
                  <th className="px-4 py-2">Edit</th>
                  <th className="px-4 py-2">Delete</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .slice(pagesVisited, pagesVisited + usersPerPage)
                  .map((user, index) => (
                    <tr key={user.id}>
                      <td className="px-4 py-2 border">
                        {index + 1 + pagesVisited}
                      </td>
                      <td className="px-4 py-2 border">{user.name}</td>
                      <td className="px-4 py-2 border">{user.nip}</td>
                      <td className="px-4 py-2 border">{user.email}</td>
                      <td className="px-4 py-2 border">
                        <FaUserEdit
                          onClick={() => handleEdit(user.id)}
                          className="cursor-pointer text-blue-500"
                        />
                      </td>
                      <td className="px-4 py-2 border">
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
          <p className="text-center font-semibold">
            Silakan pilih role untuk melihat data
          </p>
        );
    }
  };

  return (
    <div className="flex bg-gray-200">
      <Sidebar />
      <div className="flex-1 h-screen p-8">
        <div className="mb-3">
          <button
            className="text-sm font-bold ml-4 text-white bg-blue-500 py-2 px-4 rounded"
            onClick={() => setShowAddForm(true)}
          >
            Tambah User
          </button>

          <div className="float-left">
            <button
              className="text-sm font-bold text-white bg-blue-500 py-2 px-4 rounded"
              onClick={() => setShowTambahForm(true)}
            >
              Import Akun
            </button>
          </div>
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
        <div className="fixed inset-0 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50">
          <div className="bg-white p-8 mx-auto rounded-md">
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
              roleCategory={roleCategory}
              setFormData={setFormData} // Tambahkan properti setFormData di sini
            />
          </div>
        </div>
      )}

      {showTambahForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 min-w-80 mx-auto rounded-md">
            <ImportAkun
              onClose={() => {
                setShowTambahForm(false);
                setFormData({});
              }}
              onSubmit={handleSubmit}
              formData={formData}
              setFormData={setFormData} // Tambahkan properti setFormData di sini
              onInputChange={handleInputChange}
            />
          </div>
        </div>
      )}

      {/* Form edit user */}
      {showEditForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 min-w-80 mx-auto rounded-md">
            <Edit
              onClose={() => {
                setShowEditForm(false);
                setFormData({
                  id: null,
                  name: "",
                  email: "",
                  password: "",
                  role: "",
                  role_id: "", // Set role_id menjadi kosong saat menutup form
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
