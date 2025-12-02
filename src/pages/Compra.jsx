import { useState } from "react";
import client from "../api/client";

const productosBase = [
  { nombre: "Camarón", precio: 180 },
  { nombre: "Mojarra", precio: 90 },
  { nombre: "Pulpo", precio: 250 },
  { nombre: "Calamar", precio: 160 }
];

export default function Compra() {
  const [productos, setProductos] = useState([]);
  const [total, setTotal] = useState(0);

  const agregar = (p) => {
    const existente = productos.find(item => item.nombre === p.nombre);

    if (existente) {
      existente.cantidad += 1;
      setProductos([...productos]);
    } else {
      setProductos([...productos, { ...p, cantidad: 1 }]);
    }

    setTotal(prev => prev + p.precio);
  };

  const guardar = async () => {
    if (productos.length === 0) {
      alert("No hay productos");
      return;
    }

    try {
      await client.post("/compras", { productos });
      alert("Compra registrada");
      setProductos([]);
      setTotal(0);
    } catch (err) {
      alert("Error al guardar compra");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Registrar Compra</h2>

      {productosBase.map((p, i) => (
        <button key={i} onClick={() => agregar(p)}>
          {p.nombre} - ${p.precio}
        </button>
      ))}

      <h4 className="mt-3">Productos</h4>
      {productos.map((p, i) => (
        <div key={i}>
          {p.nombre} x {p.cantidad} = ${p.precio * p.cantidad}
        </div>
      ))}

      <h3>Total: ${total}</h3>
      <button onClick={guardar}>Guardar Compra</button>
    </div>
  );
}

