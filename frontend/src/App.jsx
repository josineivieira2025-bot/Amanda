import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout.jsx';
import { ProtectedRoute } from './components/ProtectedRoute.jsx';
import { PublicSiteLayout } from './components/PublicSiteLayout.jsx';
import { Agenda } from './pages/Agenda.jsx';
import { ClientGallery } from './pages/ClientGallery.jsx';
import { Clients } from './pages/Clients.jsx';
import { Dashboard } from './pages/Dashboard.jsx';
import { Events } from './pages/Events.jsx';
import { Finance } from './pages/Finance.jsx';
import { Gallery } from './pages/Gallery.jsx';
import { Login } from './pages/Login.jsx';
import { PublicHome } from './pages/PublicHome.jsx';
import { PublicRioPage } from './pages/PublicRioPage.jsx';
import { Register } from './pages/Register.jsx';
import { PublicServicePage } from './pages/PublicServicePage.jsx';
import { Settings } from './pages/Settings.jsx';

export function App() {
  return (
    <Routes>
      <Route element={<PublicSiteLayout />}>
        <Route path="/" element={<PublicHome />} />
        <Route path="/fotografo-no-rio-de-janeiro" element={<PublicRioPage />} />
        <Route path="/fotografo-casamento-rio-de-janeiro" element={<PublicServicePage slugOverride="casamento" />} />
        <Route path="/ensaio-gestante-rj" element={<PublicServicePage slugOverride="gestante" />} />
        <Route path="/ensaio-infantil-rj" element={<PublicServicePage slugOverride="ensaio-infantil" />} />
        <Route path="/ensaio-casal-rj" element={<PublicServicePage slugOverride="casal" />} />
        <Route path="/servicos/infantil" element={<PublicServicePage slugOverride="ensaio-infantil" />} />
        <Route path="/servicos/:slug" element={<PublicServicePage />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/client/:token" element={<ClientGallery />} />
      <Route
        path="/painel"
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
      <Route path="/app" element={<Navigate to="/painel" replace />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
