import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ user: '', pass: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (isAdmin) {
    navigate('/admin');
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      const ok = login(form.user, form.pass);
      if (ok) {
        navigate('/admin');
      } else {
        setError('Usuário ou senha inválidos.');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
            🔐
          </div>
          <h1 className="font-display text-4xl text-white mb-1">ACESSO ADMIN</h1>
          <p className="text-gray-500 text-sm">Área restrita para administradores</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 shadow-2xl">
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Usuário</label>
            <input
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
              placeholder="admin"
              value={form.user}
              onChange={e => setForm(f => ({ ...f, user: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">Senha</label>
            <input
              type="password"
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
              placeholder="••••••••"
              value={form.pass}
              onChange={e => setForm(f => ({ ...f, pass: e.target.value }))}
              required
            />
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 rounded-lg px-3 py-2 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold transition disabled:opacity-50"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>

        <div className="mt-4 p-3 bg-gray-900/50 border border-gray-800 rounded-xl text-center">
          <p className="text-gray-500 text-xs">Credenciais de demonstração:</p>
          <p className="text-gray-400 text-xs font-mono mt-1">usuário: <span className="text-green-400">admin</span> • senha: <span className="text-green-400">jersey2024</span></p>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-500 hover:text-gray-300 text-sm transition">← Voltar à loja</Link>
        </div>
      </div>
    </div>
  );
}
