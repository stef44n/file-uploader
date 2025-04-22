// src/api.js
import axios from "axios";

// In dev, proxy /api → http://localhost:5000
// In prod, point at your Render backend
const API = axios.create({
    baseURL:
        process.env.NODE_ENV === "development"
            ? "/api"
            : `${process.env.REACT_APP_API_URL}/api`,
    withCredentials: true,
});

//
// ─── AUTH ──────────────────────────────────────────────────────────────────────
//
export const register = (data) => API.post("/auth/register", data);
export const login = (data) =>
    API.post("/auth/login", data, { withCredentials: true });
export const getUser = () => API.get("/auth/me");
export const logout = () =>
    API.post("/auth/logout", null, { withCredentials: true });

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
