import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Dashboard() {
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  const [data, setData] = useState([]);

  const load = async () => {
    const { data } = await client.get('/reportes/diario', { params: { fecha } });
    setData(data.data);
  };

  useEffect(() => { load(); }, [fecha]);
  

  return (
    <div className="container py-4">
      <h4>Reporte diario</h4>
      <div className="d-flex align-items-center mb-3">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="form-control" style={{ maxWidth: 200 }} />
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr><th>Comprador</th><th>Total</th><th>Detalle</th></tr>
          </thead>
          <tbody>
            {data.map(row => (
              <tr key={row._id}>
                <td>{row._id}</td>
                <td>${row.totalComprador.toFixed(2)}</td>
                <td>
                  {row.detalle.map(d => (
                    <div key={d.especie}>{d.especie}: ${d.totalMonto.toFixed(2)} ({d.compras})</div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
