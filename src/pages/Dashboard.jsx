import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../api/client";
import "./dashboard.css";

const productos = [
  { nombre: "Camarón", precio: 180 },
  { nombre: "Mojarra", precio: 90 },
  { nombre: "Huachinango", precio: 220 },
  { nombre: "Pulpo", precio: 250 },
  { nombre: "Calamar", precio: 160 },
  { nombre: "Ostión", precio: 140 },
  { nombre: "Jaiba", precio: 130 },
  { nombre: "Langostino", precio: 200 }
];

export default function Dashboard() {
  const [fecha, setFecha] = useState("");
  const [ventas, setVentas] = useState([]);
  const [total, setTotal] = useState(0);
  const [reportes, setReportes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    cargarReportes();
  }, []);

  const cargarReportes = async () => {
    try {
      const res = await client.get("/reportes/diario");
      setReportes(res.data);
    } catch (err) {
      console.error("Error al cargar reportes", err);
    }
  };

  const agregarProducto = (p) => {
    const nuevasVentas = [...ventas, p];
    setVentas(nuevasVentas);
    setTotal(nuevasVentas.reduce((acc, v) => acc + v.precio, 0));
  };

  const eliminarProducto = (i) => {
    const nuevasVentas = ventas.filter((_, index) => index !== i);
    setVentas(nuevasVentas);
    setTotal(nuevasVentas.reduce((acc, v) => acc + v.precio, 0));
  };

  const guardarReporte = async () => {
    if (!fecha || ventas.length === 0) {
      alert("Completa la fecha y agrega productos");
      return;
    }

    try {
      await client.post("/reportes/diarios/add", {
        fecha,
        ventas
      });

      alert("Reporte guardado");

