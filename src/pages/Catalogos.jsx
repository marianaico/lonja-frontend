import { useEffect, useState } from 'react';
import client from '../api/client';

export default function Catalogos() {
  const [tipos, setTipos] = useState([]);
  const [especies, setEspecies] = useState([]);

  const load = async () => {
    const t = await client.get('/tipos');
    setTipos(t.data);
    const e = await client.get('/especies');
    setEspecies(e.data);
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, []);

  return (
    <div className="container py-4">
      <h4>Catálogos</h4>
      <div className="row">
        <div className="col-md-6">
          <h5>Tipos</h5>
          <ul className="list-group">
            {tipos.map(t => <li className="list-group-item" key={t._id}>{t.nombre}</li>)}
          </ul>
        </div>
        <div className="col-md-6">
          <h5>Especies</h5>
          <ul className="list-group">
            {especies.map(e => <li className="list-group-item" key={e._id}>{e.nombre} ({e.tipo?.nombre})</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
}
