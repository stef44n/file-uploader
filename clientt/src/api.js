import axios from "axios";

const API = axios.create({
    baseURL: `${process.env.REACT_APP_API_URL}/api/auth`,
    withCredentials: true,
});

export const register = (data) => API.post("/register", data);
export const login = (data) => API.post("/login", data);
export const getUser = () => API.get("/me");
export const logout = () => API.post("/logout");
