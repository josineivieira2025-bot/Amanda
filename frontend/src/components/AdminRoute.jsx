import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="center-screen">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== 'admin') return <Navigate to="/painel" replace />;

  return children;
}
