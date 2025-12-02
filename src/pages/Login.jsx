import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import "./auth.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await client.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert("Credenciales incorrectas");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={login}>
        <h2>Sistema Lonja Veracruz</h2>

        <input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button>Entrar</button>
        <span onClick={() => navigate("/register")}>Crear cuenta</span>
      </form>
    </div>
  );
}
