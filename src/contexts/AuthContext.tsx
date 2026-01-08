import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthViewModel } from '../viewmodels/AuthViewModel';
import { User } from '../models/User';

interface AuthContextType {
  user: User | null;
  viewModel: AuthViewModel;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  toggleFavorite: (productId: string) => Promise<void>;
  addToCart: (productId: string, quantity: number) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [viewModel] = useState(() => new AuthViewModel());
  
  const [user, setUser] = useState<User | null>(() => viewModel.currentUser);

  const sync = useCallback(() => {
    const currentUser = viewModel.currentUser;
    setUser(currentUser ? { ...currentUser } : null);
  }, [viewModel]);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const success = await viewModel.login(email, password);
    if (success) sync();
    return success;
  }, [viewModel, sync]);

  const logout = useCallback(() => {
    viewModel.logout();
    setUser(null);
  }, [viewModel]);

  const toggleFavorite = async (productId: string) => {
    await viewModel.toggleFavorite(productId);
    sync(); 
  };

  const addToCart = async (productId: string, quantity: number) => {
    await viewModel.updateCart(productId, quantity);
    sync(); 
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        viewModel, 
        login, 
        logout,
        isAuthenticated: !!user, 
        toggleFavorite,
        addToCart
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};