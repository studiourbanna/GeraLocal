import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { StoreProvider } from './contexts/StoreContext';
import Header from './components/shared/Header';
import Footer from './components/shared/Footer';
import Dashboard from './components/admin/Dashboard';
import LandingPage from './components/public/LandingPage';

const App: React.FC = () => {
  const { viewModel } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        {viewModel.isLoggedIn ? <Dashboard /> : <LandingPage />}
      </main>
      <Footer />
    </div>
  );
};

const Root = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default Root;