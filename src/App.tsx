import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/shared/Header';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';

// Importar páginas
import LandingPage from './components/public/LandingPage';
import LoginPage from './components/auth/LoginPage';
import PasswordlessLogin from './components/auth/PasswordlessLogin';
import Dashboard from './components/admin/Dashboard'; // ✅ importe o Dashboard

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            <Header />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/passwordless" element={<PasswordlessLogin />} />
              {/* ✅ rota para o Dashboard */}
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
