// src/api.js
import axios from "axios";

// In dev, proxy /api → http://localhost:5000
// In prod, point at your Render backend
const API = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "/api"
            : `${process.env.REACT_APP_API_URL}/api`,
});

// Add a request interceptor to read token from localStorage
API.interceptors.request.use((config) => {
    const token = localStorage.getItem("jwt");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;

//
// ─── AUTH ──────────────────────────────────────────────────────────────────────
//
export const register = (data) => API.post("/auth/register", data);
export const login = async (data) => {
    const res = await API.post("/auth/login", data);
    // store token
    localStorage.setItem("jwt", res.data.token);
    return res;
};
export const getUser = () => {
    // you can decode JWT client‑side, or simply return the last-known user
    return Promise.resolve({
        data: { user: JSON.parse(localStorage.getItem("user")) },
    });
};
export const logout = () => {
    localStorage.removeItem("jwt");
};

//
// ─── FOLDERS ────────────────────────────────────────────────────────────────────
//
export const getFolders = () => API.get("/folders");
export const createFolder = (name) => API.post("/folders", { name });
export const renameFolder = (id, name) => API.put(`/folders/${id}`, { name });
export const deleteFolder = (id) => API.delete(`/folders/${id}`);
export const getFolderFiles = (id) => API.get(`/folders/${id}/files`);

//
// ─── FILES ──────────────────────────────────────────────────────────────────────
//
export const getUnsortedFiles = () => API.get("/files/unsorted");
export const uploadFile = (formData) => API.post("/files/upload", formData);
export const moveFile = (fileId, folderId) =>
    API.put(`/files/${fileId}/move`, { newFolderId: folderId });
export const deleteFile = (fileId) => API.delete(`/files/${fileId}`);
export const getFileDetails = (fileId) => API.get(`/files/${fileId}/details`);
