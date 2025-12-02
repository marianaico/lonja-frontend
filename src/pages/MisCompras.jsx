import { useEffect, useState } from "react";
import client from "../api/client";

export default function MisCompras() {
  const [compras, setCompras] = useState([]);

  useEffect(() => {
    cargar();
  }, []);

  const cargar = async () => {
    const res = await client.get("/compras/mis");
    setCompras(res.data);
  };

  return (
    <div className="container mt-4">
      <h2>Mis Compras</h2>

      {compras.map((c, i) => (
        <div key={i} className="border p-2 mb-2">
          <strong>{new Date(c.fecha).toLocaleString()}</strong>
          <ul>
            {c.productos.map((p, idx) => (
              <li key={idx}>{p.nombre} x {p.cantidad}</li>
            ))}
          </ul>
          <strong>Total: ${c.total}</strong>
        </div>
      ))}
    </div>
  );
}
