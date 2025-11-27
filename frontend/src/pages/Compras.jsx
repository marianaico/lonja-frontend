/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Compras() {
  const [compras, setCompras] = useState([]);

  const load = async () => {
    const { data } = await client.get('/compras', { params: { limit: 50 } });
    setCompras(data);
  };

  useEffect(() => {load(); }, []);

  return (
    <div className="container py-4">
      <h4>Compras</h4>
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr><th>Fecha</th><th>Comprador</th><th>Especie</th><th>Tipo</th><th>Lote</th><th>Total</th></tr>
          </thead>
          <tbody>
            {compras.map(c => (
              <tr key={c._id}>
                <td>{new Date(c.fecha).toLocaleString()}</td>
                <td>{c.comprador?.codigoCmp}</td>
                <td>{c.especie?.nombre}</td>
                <td>{c.tipo?.nombre}</td>
                <td>{c.lote?.numeroCajas} cajas</td>
                <td>${c.precioTotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
