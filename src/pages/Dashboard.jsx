import client from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const productos = [
  { nombre: "Camarón", precio: 180 },
  { nombre: "Mojarra", precio: 90 },
  { nombre: "Huachinango", precio: 220 },
  { nombre: "Pulpo", precio: 250 },
  { nombre: "Calamar", precio: 160 },
  { nombre: "Ostión", precio: 140 },
  { nombre: "Jaiba", precio: 130 },
  { nombre: "Langostino", precio: 200 }
];

export default function Dashboard() {
  const [fecha, setFecha] = useState("");
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    const res = await client.get("/reportes/diario");
    setReportes(res.data);
  };

  const agregarProducto = (p) => {
    const nuevasVentas = [...ventas, p];
    setVentas(nuevasVentas);

    const nuevoTotal = nuevasVentas.reduce((acc, v) => acc + v.precio, 0);
    setTotal(nuevoTotal);
  };

  const eliminarProducto = (i) => {
    const nuevasVentas = ventas.filter((_, index) => index !== i);
    setVentas(nuevasVentas);

    const nuevoTotal = nuevasVentas.reduce((acc, v) => acc + v.precio, 0);
    setTotal(nuevoTotal);
  };

  const guardarReporte = async () => {
    if (!fecha || ventas.length === 0) {
      alert("Faltan datos");
      return;
    }

    await client.post("/reportes/diarios/add", {
      fecha,
      ventas
    });

    alert("Reporte guardado");
    setFecha("");
    setVentas([]);
    setTotal(0);
    cargarReportes();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Sistema Lonja Veracruz</h2>
        <button onClick={handleLogout} className="btn btn-danger">Salir</button>
      </div>

      <input
        type="date"
        className="form-control mb-2"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <h4>Productos</h4>
      <div className="row">
        {productos.map((p, i) => (
          <div className="col-6 mb-2" key={i}>
            <button
              onClick={() => agregarProducto(p)}
              className="btn btn-primary w-100"
            >
              {p.nombre} - ${p.precio}
            </button>
          </div>
        ))}
      </div>

      <h4 className="mt-3">Ventas</h4>
      <ul className="list-group">
        {ventas.map((v, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            {v.nombre} - ${v.precio}
            <button onClick={() => eliminarProducto(i)} className="btn btn-sm btn-danger">
              X
            </button>
          </li>
        ))}
      </ul>

      <h3 className="mt-3">Total: ${total}</h3>

      <button onClick={guardarReporte} className="btn btn-success w-100 mt-2">
        Guardar Reporte
      </button>

      <hr />

      <h4>Reportes Guardados</h4>
      {reportes.map((r, i) => (
        <div key={i} className="border p-2 mb-2">
          {new Date(r.fecha).toLocaleDateString()} - Total: ${r.total}
        </div>
      ))}
    </div>
  );
}
