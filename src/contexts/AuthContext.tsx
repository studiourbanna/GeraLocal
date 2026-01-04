import React, { createContext, useContext, useState } from 'react';
import { AuthViewModel } from '../viewmodels/AuthViewModel';
import { User } from '@/models/User';

interface AuthContextType {
  viewModel: AuthViewModel;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModel] = useState(() => new AuthViewModel());

  const login = async (email: string, password: string): Promise<boolean> => {
    return await viewModel.login(email, password);
  };

  const logout = () => {
    viewModel.logout();
  };

  const getCurrentUser = (): User | null => {
    return viewModel.getCurrentUser();
  };

  return (
    <AuthContext.Provider value={{ viewModel, login, logout, getCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
