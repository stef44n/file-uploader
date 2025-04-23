import { useState, useEffect } from "react";
import { register, login, getUser, logout } from "./api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import StorageManager from "./components/StorageManager";

function App() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    // ─── Register ─────────────────────────────────────────────────────────────
    const handleRegister = async () => {
        try {
            await register({ email, password });
            toast.success("Registered successfully! Please log in.");
            setEmail("");
            setPassword("");
        } catch (err) {
            console.error("Register error:", err);
            toast.error(err.response?.data?.message || "Registration failed.");
        }
    };

    // ─── Login ────────────────────────────────────────────────────────────────
    const handleLogin = async () => {
        try {
            const { data } = await login({ email, password });
            setUser(data.user);
            toast.success("Logged in successfully!");
        } catch (err) {
            console.error("Login error:", err);
            toast.error(err.response?.data?.message || "Login failed.");
        }
    };

    // ─── Logout ───────────────────────────────────────────────────────────────
    const handleLogout = async () => {
        try {
            await logout();
            setUser(null);
            toast.info("Logged out.");
        } catch (err) {
            console.error("Logout error:", err);
            toast.error("Logout failed.");
        }
    };

    return (
        <>
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />
            <div
                style={{
                    maxWidth: "600px",
                    margin: "2rem auto",
                    padding: "2rem",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                    fontFamily: "Arial, sans-serif",
                    backgroundColor: "#fff",
                }}
            >
                <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>
                    📁 Personal Drive
                </h1>

                {user ? (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "1.5rem",
                            }}
                        >
                            <p style={{ fontSize: "1.1rem", margin: 0 }}>
                                👋 Welcome, <strong>{user.email}</strong>
                            </p>
                            <button
                                onClick={handleLogout}
                                style={{
                                    padding: "0.5rem 1rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#dc3545",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Logout
                            </button>
                        </div>

                        <StorageManager />
                    </>
                ) : (
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "1rem",
                        }}
                    >
                        <input
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                padding: "0.75rem",
                                fontSize: "1rem",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                padding: "0.75rem",
                                fontSize: "1rem",
                                borderRadius: "6px",
                                border: "1px solid #ccc",
                            }}
                        />
                        <div
                            style={{
                                display: "flex",
                                gap: "1rem",
                                justifyContent: "center",
                            }}
                        >
                            <button
                                onClick={handleRegister}
                                style={{
                                    padding: "0.6rem 1.2rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#28a745",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Register
                            </button>
                            <button
                                onClick={handleLogin}
                                style={{
                                    padding: "0.6rem 1.2rem",
                                    fontSize: "1rem",
                                    backgroundColor: "#007bff",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                }}
                            >
                                Login
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
