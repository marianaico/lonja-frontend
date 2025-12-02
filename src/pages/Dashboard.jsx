import client from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./dashboard.css";

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

  const agregarProducto = (producto) => {
    const nuevaVenta = {
      producto: producto.nombre,
      cantidad: 1,
      precio: producto.precio,
      subtotal: producto.precio
    };

    const nuevasVentas = [...ventas, nuevaVenta];
    setVentas(nuevasVentas);
    setTotal(nuevasVentas.reduce((acc, v) => acc + v.subtotal, 0));
  };

  const eliminarVenta = (index) => {
    const nuevasVentas = ventas.filter((_, i) => i !== index);
    setVentas(nuevasVentas);
    setTotal(nuevasVentas.reduce((acc, v) => acc + v.subtotal, 0));
  };

  const handleSubmit = async () => {
    if (!fecha || ventas.length === 0) {
      alert("Selecciona fecha y productos");
      return;
    }

    await client.post("/reportes/diarios/add", {
      fecha: new Date(fecha),
      ventas
    });

    alert("Reporte guardado");
    setFecha("");
    setVentas([]);
    setTotal(0);
    cargarReportes();
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Sistema Lonja Veracruz - Reportes", 20, 20);

    const tableData = reportes.map(r => [
      new Date(r.fecha).toLocaleDateString(),
      `$${r.totalVentas}`
    ]);

    doc.autoTable({
      head: [["Fecha", "Total Ventas"]],
      body: tableData
    });

    doc.save("reporte-lonja.pdf");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const dataGrafica = {
    labels: reportes.map(r =>
      new Date(r.fecha).toLocaleDateString()
    ),
    datasets: [{
      label: "Ventas por día",
      data: reportes.map(r => r.totalVentas),
      backgroundColor: "#219ebc"
    }]
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Sistema Lonja Veracruz</h1>
        <button onClick={handleLogout} className="btn-salir">Salir</button>
      </header>

      <div className="card-form">
        <h3>Agregar Reporte Diario</h3>

        <input type="date" className="input"
          value={fecha} onChange={e => setFecha(e.target.value)} />

        <h4>Productos</h4>
        <div className="lista-productos">
          {productos.map((p, i) => (
            <button key={i} className="producto-item"
              onClick={() => agregarProducto(p)}>
              {p.nombre} ${p.precio}
            </button>
          ))}
        </div>

        <h4>Ventas</h4>
        <ul className="lista-ventas">
          {ventas.map((v, i) => (
            <li key={i}>
              {v.producto} - ${v.precio}
              <button onClick={() => eliminarVenta(i)}>X</button>
            </li>
          ))}
        </ul>

        <h3>Total: ${total}</h3>

        <button className="btn-guardar" onClick={handleSubmit}>
          Guardar Reporte
        </button>

        <button className="btn-guardar mt-3" onClick={exportarPDF}>
          Exportar PDF
        </button>
      </div>

      <div className="card-reportes">
        <h3>Gráfica de Ventas</h3>
        <Bar data={dataGrafica} />

        <h3>Reportes Guardados</h3>
        {reportes.map((r, i) => (
          <div key={i} className="reporte-item">
            {new Date(r.fecha).toLocaleDateString()} - Total: ${r.totalVentas}
          </div>
        ))}
      </div>
    </div>
  );
}

