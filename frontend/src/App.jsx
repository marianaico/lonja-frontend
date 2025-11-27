import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Compras from './pages/Compras.jsx';
import Lotes from './pages/Lotes.jsx';
import Catalogos from './pages/Catalogos.jsx';

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/compras" element={<PrivateRoute><Compras /></PrivateRoute>} />
      <Route path="/lotes" element={<PrivateRoute><Lotes /></PrivateRoute>} />
      <Route path="/catalogos" element={<PrivateRoute><Catalogos /></PrivateRoute>} />
    </Routes>
  );
}

