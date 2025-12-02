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
  const [producto, setProducto] = useState(productos[0]);
  const [cantidad, setCantidad] = useState(1);
  const [ventas, setVentas] = useState([]);
  const [compras, setCompras] = useState("");
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    const res = await client.get("/reportes/diario");
    setReportes(res.data);
  };

  const agregarVenta = () => {
    const subtotal = producto.precio * cantidad;
    setVentas([...ventas, { ...producto, cantidad, subtotal }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || ventas.length === 0 || !compras) {
      alert("Completa todos los datos");
      return;
    }

    await client.post("/reportes/diarios/add", {
      fecha: new Date(fecha),
      ventas,
      compras
    });

    alert("Reporte guardado");
    setVentas([]);
    setFecha("");
    setCompras("");
    cargarReportes();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between">
        <h2>Agregar Reporte Diario</h2>
        <button onClick={handleLogout} className="btn btn-danger">Salir</button>
      </div>

      <form onSubmit={handleSubmit}>

        <input type="date" className="form-control mb-2"
          value={fecha} onChange={e => setFecha(e.target.value)} />

        <select className="form-control mb-2"
          onChange={e => setProducto(productos[e.target.value])}>
          {productos.map((p, i) => (
            <option key={i} value={i}>{p.nombre} - ${p.precio}</option>
          ))}
        </select>

        <input type="number" className="form-control mb-2"
          value={cantidad} onChange={e => setCantidad(e.target.value)} />

        <button type="button" className="btn btn-secondary mb-3"
          onClick={agregarVenta}>
          Agregar producto
        </button>

        <ul>
          {ventas.map((v, i) => (
            <li key={i}>
              {v.producto} x{v.cantidad} = ${v.subtotal}
            </li>
          ))}
        </ul>

        <input type="number" className="form-control mb-2"
          placeholder="Compras del día"
          value={compras}
          onChange={e => setCompras(e.target.value)} />

        <button className="btn btn-primary mt-2">Guardar</button>

      </form>

      <hr />

      <h4>Reportes Guardados</h4>
      <ul>
        {reportes.map((r, i) => (
          <li key={i}>
            {new Date(r.fecha).toLocaleDateString()} - Total Ventas: ${r.totalVentas}
          </li>
        ))}
      </ul>

    </div>
  );
}

