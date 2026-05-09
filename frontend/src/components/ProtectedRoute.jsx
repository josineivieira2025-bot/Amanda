import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="center-screen">Carregando...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return children;
}
