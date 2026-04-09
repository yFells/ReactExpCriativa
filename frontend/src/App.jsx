import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ShirtsPage from './pages/ShirtsPage';
import ShirtDetailPage from './pages/ShirtDetailPage';
import AdminPage from './pages/AdminPage';
import LoginPage from './pages/LoginPage';

function Footer() {
  return (
    <footer className="border-t border-gray-800 mt-16 py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-gray-500 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚽</span>
          <span className="font-display text-xl text-gray-400 tracking-widest">JERSEY<span className="text-green-600">STORE</span></span>
        </div>
        <p>© {new Date().getFullYear()} JerseyStore — Todos os direitos reservados.</p>
        <p>Desenvolvido com React + Node.js + MySQL</p>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col bg-gray-950">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/camisas" element={<ShirtsPage />} />
              <Route path="/camisas/:id" element={<ShirtDetailPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={
                <div className="text-center py-24">
                  <div className="text-6xl mb-4">🔍</div>
                  <h2 className="text-2xl font-bold text-white mb-2">Página não encontrada</h2>
                  <a href="/" className="text-green-400 hover:text-green-300">Voltar ao início</a>
                </div>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
