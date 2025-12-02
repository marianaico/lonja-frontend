import { useEffect, useState } from "react";
import client from "../api/client";

export default function AdminCompras() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await client.get("/compras/admin/todas");
    setCompras(res.data);
  };

  return (
    <div className="container mt-4">
      <h2>Compras del Sistema (Admin)</h2>

      <table>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Correo</th>
            <th>Total</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {compras.map((c, i) => (
            <tr key={i}>
              <td>{c.usuario?.nombre}</td>
              <td>{c.usuario?.email}</td>
              <td>${c.total}</td>
              <td>{new Date(c.fecha).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

