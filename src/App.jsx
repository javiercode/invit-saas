import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './core/contexts/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Páginas
import CatalogPage from './features/catalog/pages/CatalogPage';
import InvitationViewerPage from './features/builder/pages/InvitationViewerPage';
import BuilderPage from './features/builder/pages/BuilderPage';
import DashboardPage from './features/dashboard/pages/DashboardPage';
import SimuladorPage from './features/builder/pages/SimuladorPage';
import AdminPage from './features/admin/pages/AdminPage';
import RequireAuth from './components/common/RequireAuth';
import LoginPage from './features/auth/pages/LoginPage';

import './App.css';

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="app-container">
          <Navbar />
          <div className="app-main-content">
            <Routes>
              <Route path="/" element={<CatalogPage />} />
              <Route path="/catalogo" element={<CatalogPage />} />
              <Route path="/invitacion/:slug" element={<InvitationViewerPage />} />
              <Route path="/builder" element={<RequireAuth><BuilderPage /></RequireAuth>} />
              <Route path="/simulador" element={<SimuladorPage />} />
              <Route path="/admin" element={<RequireAuth adminOnly><AdminPage /></RequireAuth>} />
              <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;