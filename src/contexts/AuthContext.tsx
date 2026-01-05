import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthViewModel } from '../viewmodels/AuthViewModel';
import { User } from '../models/User';

interface AuthContextType {
  viewModel: AuthViewModel;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => User | null;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Instância do AuthViewModel
  const [viewModel] = useState(() => new AuthViewModel());
  
  // Estado para rastrear autenticação
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return viewModel.getCurrentUser() !== null;
  });

  // Login com memoização e atualização de estado - corrigido
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const success = await viewModel.login(email, password);
    setIsAuthenticated(success); // Agora recebe boolean diretamente
    return success;
  }, [viewModel]);

  // Logout com atualização de estado
  const logout = useCallback(() => {
    viewModel.logout();
    setIsAuthenticated(false);
  }, [viewModel]);

  // Get current user
  const getCurrentUser = useCallback((): User | null => {
    return viewModel.getCurrentUser();
  }, [viewModel]);

  return (
    <AuthContext.Provider 
      value={{ 
        viewModel, 
        login, 
        logout, 
        getCurrentUser,
        isAuthenticated 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};