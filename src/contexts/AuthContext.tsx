import React, { createContext, useContext, useState } from 'react';
import { AuthViewModel } from '../viewmodels/AuthViewModel';

interface AuthContextType {
  viewModel: AuthViewModel;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModel] = useState(() => new AuthViewModel());

  const login = (email: string, password: string) => {
    return viewModel.login(email, password);
  };

  const logout = () => {
    viewModel.logout();
  };

  return (
    <AuthContext.Provider value={{ viewModel, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};