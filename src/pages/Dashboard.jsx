import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import "./dashboard.css";

export default function Dashboard() {
  const [fecha, setFecha] = useState("");
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const productos = [
    { nombre: "Camarón", precio: 180 },
    { nombre: "Huachinango", precio: 220 },
    { nombre: "Calamar", precio: 160 },
    { nombre: "Jaiba", precio: 130 },
    { nombre: "Mojarra", precio: 90 },
    { nombre: "Pulpo", precio: 250 },
    { nombre: "Ostión", precio: 140 },
    { nombre: "Langostino", precio: 200 },
  ];

  useEffect(() => {
    let suma = 0;
    ventas.forEach(v => suma += v.precio);
    setTotal(suma);
  }, [ventas]);

  const agregarProducto = (producto) => {
    setVentas([...ventas, producto]);
  };

  const eliminarProducto = (index) => {
    const nuevaLista = ventas.filter((_, i) => i !== index);
    setVentas(nuevaLista);
  };

  const guardarReporte = async () => {
    if (!fecha || ventas.length === 0) {
      alert("Selecciona fecha y al menos un producto");
      return;
    }

    try {
      await client.post("/reportes/diarios/add", {
        fecha,
        ventas
      });

      alert("✅ Reporte guardado correctamente");
      setFecha("");
      setVentas([]);
      setTotal(0);

    } catch (error) {
      console.error(error);
      alert("❌ Error al guardar reporte");
    }
  };

  const salir = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Sistema Lonja Veracruz</h1>
        <button className="btn-salir" onClick={salir}>Salir</button>
      </div>

      <div className="fecha-box">
        <label>Fecha:</label>
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </div>

      <h2>Productos</h2>

      <div className="productos-grid">
        {productos.map((p, i) => (
          <button
            key={i}
            className="producto-btn"
            onClick={() => agregarProducto(p)}
          >
            {p.nombre} - ${p.precio}
          </button>
        ))}
      </div>

      <h2>Venta actual</h2>
      <ul className="venta-lista">
        {ventas.map((v, i) => (
          <li key={i}>
            {v.nombre} - ${v.precio}
            <button className="btn-x" onClick={() => eliminarProducto(i)}>✖</button>
          </li>
        ))}
      </ul>

      <h2 className="total">Total: ${total}</h2>

      <button className="btn-guardar" onClick={guardarReporte}>
        Guardar Reporte
      </button>
    </div>
  );
}
