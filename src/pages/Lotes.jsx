/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Lotes() {
  const [lotes, setLotes] = useState([]);
  const [fecha, setFecha] = useState('');

  const load = async () => {
    const { data } = await client.get('/lotes', { params: { fecha } });
    setLotes(data);
  };

  useEffect(() => { load(); }, [fecha]);

  return (
    <div className="container py-4">
      <h4>Lotes</h4>
      <div className="d-flex gap-2 mb-3">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} className="form-control" style={{ maxWidth: 200 }} />
        <button className="btn btn-secondary" onClick={() => setFecha('')}>Limpiar</button>
      </div>
      <table className="table">
        <thead><tr><th>Fecha</th><th>Cajas</th><th>Precio Kg salida</th></tr></thead>
        <tbody>
          {lotes.map(l => (
            <tr key={l._id}>
              <td>{new Date(l.fecha).toLocaleString()}</td>
              <td>{l.numeroCajas}</td>
              <td>${l.precioKgSalida.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
