import client from "../api/client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const [fecha, setFecha] = useState("");
  const [ventas, setVentas] = useState("");
  const [compras, setCompras] = useState("");
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportes = async () => {
      try {
        const res = await client.get("/reportes/diario");
        setReportes(res.data);
      } catch (err) {
        console.error("Error al obtener reportes:", err);
      }
    };
    fetchReportes();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // VALIDACIÓN
    if (!fecha || !ventas || !compras) {
      alert("Todos los campos son obligatorios");
      return;
    }

    if (ventas < 0 || compras < 0) {
      alert("Ventas y compras no pueden ser negativas");
      return;
    }

    try {
      await client.post("/reportes/diarios/add", {
        fecha: new Date(fecha).toISOString(),
        ventas: Number(ventas),
        compras: Number(compras)
      });

      alert("Reporte guardado correctamente");

      setFecha("");
      setVentas("");
      setCompras("");

      const res = await client.get("/reportes/diario");
      setReportes(res.data);

    } catch (err) {
      console.error("Error al guardar reporte:", err);
      alert("Error al guardar el reporte");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Ventas del día</h2>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Fecha</label>
          <input
            type="date"
            className="form-control"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Ventas</label>
          <input
            type="number"
            className="form-control"
            value={ventas}
            onChange={(e) => setVentas(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Compras</label>
          <input
            type="number"
            className="form-control"
            value={compras}
            onChange={(e) => setCompras(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Guardar
        </button>
      </form>

      <hr />

      <h3>Reportes Guardados</h3>
      {reportes.length === 0 ? (
        <p>No hay reportes disponibles</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Ventas</th>
              <th>Compras</th>
            </tr>
          </thead>
          <tbody>
            {reportes.map((r, i) => (
              <tr key={i}>
                <td>{new Date(r.fecha).toLocaleDateString()}</td>
                <td>{r.ventas}</td>
                <td>{r.compras}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
