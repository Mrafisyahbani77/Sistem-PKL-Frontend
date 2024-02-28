import axios from "axios";
import Cookies from "js-cookie";

const Api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);



Api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (401 === error.response.status) {
      Cookies.remove("token");
      Cookies.remove("user");
      Cookies.remove("permissions");
      window.location = "/";
    } else if (403 === error.response.status) {
      window.location = "/Forbidden";
    } else {
      return Promise.reject(error);
    }
  }
);

Api.getDaftarAkun = (token) => {
  return Api.get("/api/siswa/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

Api.getDaftarSiswa = (token) => {
  return Api.get("/api/siswa/daftar-siswa", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

Api.getDaftarKelas2 = (token) => {
  return Api.get("/api/admin/daftar-kelas", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

Api.getDaftarKelas = (token) => {
  return Api.get("/api/siswa/daftar-kelas-2", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

Api.getDaftarPerusahaan = (token) => {
  return Api.get(`/api/siswa/daftar-perusahaan`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

Api.submitPengajuan = (token, formData) => {
  return Api.post("/api/siswa/pengajuan-pkl", formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};

Api.getAllPengajuan = (token) => {
  return Api.get("/api/admin/pengajuan/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

Api.updatePengajuanStatus = (token, id, formData) => {
  return Api.put(`/api/admin/update-status/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
};


export default Api;
