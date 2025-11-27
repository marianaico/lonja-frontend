/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import Client from '../api/Client';

export default function Dashboard() {
  const [fecha, setFecha] = useState(() => new Date().toISOString().slice(0, 10));
  // eslint-disable-next-line no-unused-vars
  const [data, setData] = useState([]);

  const load = async () => {
    try {
      const { data } = await Client.get('/reportes/diarios', { params: { fecha } });
      setData(data.data);
    } catch (error) {
      console.error('Error al cargar reportes:', error);
    }
  };

   
  useEffect(() => { load(); }, [fecha]);

  return (
    <div className="container py-4">
      <h4>Reportes diarios</h4>
      <div className="d-flex align-items-center mb-3">
        <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} />
      </div>
      <div className="table-responsive">
        {/* Aquí renderizas los datos */}
      </div>
    </div>
  );
}


