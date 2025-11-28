import { useState } from "react";
import client from "../api/client";

export default function Dashboard() {
  const [fecha, setFecha] = useState("");
  const [ventas, setVentas] = useState("");
  const [compras, setCompras] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await client.post("/reportes/diarios", {
        fecha,
        ventas,
        compras
      });
      alert("Reporte agregado correctamente");
      setFecha("");
      setVentas("");
      setCompras("");
    } catch (err) {
      console.error("Error al guardar reporte:", err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Agregar Reporte Diario</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Ventas</label>
          <input
            type="number"
            className="form-control"
            value={ventas}
            onChange={(e) => setVentas(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Compras</label>
          <input
            type="number"
            className="form-control"
            value={compras}
            onChange={(e) => setCompras(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>
    </div>
  );
}
