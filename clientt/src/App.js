import { useState, useEffect } from "react";
import { register, login, getUser, logout } from "./api";

function App() {
    const [user, setUser] = useState(null);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        getUser()
            .then(({ data }) => setUser(data.user))
            .catch(() => setUser(null));
    }, []);

    const handleRegister = async () => {
        await register({ email, password });
        setEmail("");
        setPassword("");
    };

    const handleLogin = async () => {
        const { data } = await login({ email, password });
        setUser(data.user);
    };

    const handleLogout = async () => {
        await logout();
        setUser(null);
    };

    return (
        <div>
            <h1>Personal Drive</h1>
            {user ? (
                <>
                    <p>Welcome, {user.email}</p>
                    <button onClick={handleLogout}>Logout</button>
                </>
            ) : (
                <>
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <button onClick={handleRegister}>Register</button>
                    <button onClick={handleLogin}>Login</button>
                </>
            )}
        </div>
    );
}

export default App;
