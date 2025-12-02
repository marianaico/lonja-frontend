import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Compra from "./pages/Compra";
import MisCompras from "./pages/MisCompras";
import AdminCompras from "./pages/AdminCompras";

// Protección de rutas
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protegidas */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/compras"
          element={
            <PrivateRoute>
              <Compra />
            </PrivateRoute>
          }
        />

        <Route
          path="/mis-compras"
          element={
            <PrivateRoute>
              <MisCompras />
            </PrivateRoute>
          }
        />

        <Route
          path="/admin-compras"
          element={
            <PrivateRoute>
              <AdminCompras />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

