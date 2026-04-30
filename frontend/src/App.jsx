import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { Agenda } from './pages/Agenda.jsx';
import { ClientGallery } from './pages/ClientGallery.jsx';
import { Clients } from './pages/Clients.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Events } from './pages/Events.jsx';
import { Finance } from './pages/Finance.jsx';
import { Gallery } from './pages/Gallery.jsx';
import { Login } from './pages/Login.jsx';
import { Register } from './pages/Register.jsx';
import { Settings } from './pages/Settings.jsx';

export function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/client/:token" element={<ClientGallery />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="clientes" element={<Clients />} />
        <Route path="eventos" element={<Events />} />
        <Route path="galeria" element={<Gallery />} />
        <Route path="financeiro" element={<Finance />} />
        <Route path="configuracoes" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
