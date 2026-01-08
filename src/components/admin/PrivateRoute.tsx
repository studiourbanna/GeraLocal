import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
  role?: 'admin' | 'user';
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, role }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    console.warn(`Acesso negado: Usuário ${user.name} tentou acessar rota de ${role}`);
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PrivateRoute;