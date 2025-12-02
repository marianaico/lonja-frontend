import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";

const productos = [
  { nombre: "Camarón", precio: 180 },
  { nombre: "Huachinango", precio: 220 },
  { nombre: "Calamar", precio: 160 },
  { nombre: "Jaiba", precio: 130 },
  { nombre: "Mojarra", precio: 90 },
  { nombre: "Pulpo", precio: 250 },
  { nombre: "Ostión", precio: 140 },
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
    try {
      const res = await client.get("/reportes/diario");
      setReportes(res.data);
    } catch (err) {
      console.error("Error al cargar reportes", err);
    }
  };

  const agregarProducto = (p) => {
    const nuevasVentas = [...ventas, p];
    setVentas(nuevasVentas);
    setTotal(nuevasVentas.reduce((acc, v) => acc + v.precio, 0));
  };

  const eliminarProducto = (index) => {
    const nuevasVentas = ventas.filter((_, i) => i !== index);
    setVentas(nuevasVentas);
    setTotal(nuevasVentas.reduce((acc, v) => acc + v.precio, 0));
  };

  const guardarReporte = async () => {
    if (!fecha || ventas.length === 0) {
      alert("Selecciona fecha y productos");
      return;
    }

    try {
      await client.post("/reportes/diarios/add", {
        fecha,
        ventas
      });

      alert("Reporte guardado correctamente");
      setFecha("");
      setVentas([]);
      setTotal(0);
      cargarReportes();
    } catch (err) {
      console.error(err);
      alert("Error al guardar reporte");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Sistema Lonja Veracruz</h2>
        <button onClick={logout} className="btn btn-danger">
          Salir
        </button>
      </div>

      <input
        type="date"
        className="form-control mb-3"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
      />

      <h4>Productos</h4>
      <div className="row mb-3">
        {productos.map((p, i) => (
          <div className="col-6 mb-2" key={i}>
            <button
              className="btn btn-primary w-100"
              onClick={() => agregarProducto(p)}
            >
              {p.nombre} - ${p.precio}
            </button>
          </div>
        ))}
      </div>

      <h4>Venta actual</h4>
      <ul className="list-group mb-3">
        {ventas.map((v, i) => (
          <li key={i} className="list-group-item d-flex justify-content-between">
            {v.nombre} - ${v.precio}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => eliminarProducto(i)}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <h3>Total: ${total}</h3>

      <button className="btn btn-success w-100 mb-4" onClick={guardarReporte}>
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
