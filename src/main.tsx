import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { StoreProvider } from './contexts/StoreContext.tsx'
import './styles/globals.css'
import './styles/themes.css'
import './styles/accessibility.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <StoreProvider>
          <App />
        </StoreProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)