import { useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import "./auth.css";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const register = async (e) => {
    e.preventDefault();

    try {
      await client.post("/auth/register", { nombre, email, password });
      alert("Usuario creado");
      navigate("/login");
    } catch (err) {
      alert("Error al registrar");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={register}>
        <h2>Crear cuenta</h2>

        <input placeholder="Nombre" onChange={(e) => setNombre(e.target.value)} />
        <input placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />

        <button>Registrar</button>
      </form>
    </div>
  );
}
