import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 bg-gray-950/90 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center text-lg font-bold group-hover:bg-green-500 transition">
              ⚽
            </div>
            <span className="font-display text-2xl tracking-widest text-white">
              JERSEY<span className="text-green-500">STORE</span>
            </span>
          </Link>

          {/* Nav links desktop */}
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/') ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              Início
            </Link>
            <Link to="/camisas" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/camisas') ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
              Camisas
            </Link>
            {isAdmin && (
              <Link to="/admin" className={`px-4 py-2 rounded-lg text-sm font-medium transition ${isActive('/admin') ? 'bg-green-600 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800'}`}>
                Painel Admin
              </Link>
            )}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-3">
                <span className="hidden sm:flex items-center gap-1.5 text-xs text-green-400 font-medium bg-green-400/10 px-3 py-1.5 rounded-full border border-green-400/20">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
                  ADMIN
                </span>
                <button onClick={handleLogout} className="text-sm text-gray-400 hover:text-red-400 transition font-medium px-3 py-1.5">
                  Sair
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-medium bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg transition">
                Admin
              </Link>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden text-gray-400 hover:text-white p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <div className="space-y-1.5">
                <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-2' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-5 h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 py-3 space-y-1 animate-fade-in">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-medium">Início</Link>
          <Link to="/camisas" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-medium">Camisas</Link>
          {isAdmin && <Link to="/admin" onClick={() => setMenuOpen(false)} className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-gray-800 text-sm font-medium">Painel Admin</Link>}
        </div>
      )}
    </header>
  );
}
