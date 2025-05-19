import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
    const hardcodedSvvNetId = "sohamgore"; // Hardcoded credentials
    const hardcodedPassword = "12345678";

    const [svvNetId, setSvvNetId] = useState(""); // User input
    const [password, setPassword] = useState(""); // User input
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        // Check if input matches hardcoded credentials
        if (svvNetId !== hardcodedSvvNetId || password !== hardcodedPassword) {
            setError("Invalid login credentials.");
            return;
        }

        try {
            const res = await axios.post("http://localhost:5000/api/auth/login", { svvNetId, password });

            if (res.status === 200 && res.data.token) {
                localStorage.setItem("token", res.data.token);
                localStorage.setItem("svvNetId", svvNetId); // Store svvNetId
                localStorage.setItem("user", JSON.stringify({ svvNetId: svvNetId, role: "UG (AI&DS)" }));

                console.log("Stored svvNetId:", localStorage.getItem("svvNetId")); // Debugging
                navigate("/ApplicationPortal");
            } else {
                setError("Login failed. Please try again.");
            }
        } catch (err) {
            setError(err.response?.data?.message || "Login failed.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="SVVNet ID"
                    value={svvNetId}
                    onChange={(e) => setSvvNetId(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
