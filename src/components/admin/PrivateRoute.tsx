import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
  role?: string; // opcional: se quiser restringir por cargo
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { getCurrentUser } = useAuth();
  const user = getCurrentUser();

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se foi passado um cargo e o usuário não tem esse cargo, redireciona para home
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;
