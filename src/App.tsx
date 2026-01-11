import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Componentes bases da pagina
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { StoreProvider } from '@/contexts/StoreContext';

// Importar páginas
import LandingPage from '@/components/public/LandingPage';

// Paginas de autenticação
import LoginPage from '@/components/auth/LoginPage';
import PasswordlessLogin from '@/components/auth/PasswordlessLogin';

// Páginas para serviço ao administrador
import AdminDashboard from '@/components/admin/Dashboard';
import PrivateRoute from '@/components/admin/PrivateRoute';

// Páginas para serviço ao usuário/cliente
import UserDashboard from '@/components/user/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <BrowserRouter>
            {/* O Header fica fixo no topo */}
            <Header />

            {/* O main ajuda a empurrar o footer para baixo em telas com pouco conteúdo */}
            <main className="min-h-screen">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/passwordless" element={<PasswordlessLogin />} />
                
                {/* ✅ Rotas Protegidas */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute role="admin">
                      <AdminDashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute role="user">
                      <UserDashboard />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </main>

            {/* ✅ O Footer agora é renderizado em todas as rotas */}
            <Footer />
          </BrowserRouter>
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
