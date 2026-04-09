import React from 'react';

export function Toast({ message, type = 'success', onClose }) {
  const colors = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-700 border-red-600',
    info: 'bg-blue-700 border-blue-600',
  };
  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-lg border ${colors[type]} text-white shadow-2xl animate-slide-up max-w-sm`}>
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="text-white/70 hover:text-white text-lg leading-none">×</button>
    </div>
  );
}

export function Badge({ label }) {
  const map = {
    titular: 'bg-green-700 text-green-100',
    reserva: 'bg-blue-700 text-blue-100',
    treino: 'bg-yellow-700 text-yellow-100',
    retrô: 'bg-purple-700 text-purple-100',
    seleção: 'bg-amber-700 text-amber-100',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full uppercase tracking-wide ${map[label] || 'bg-gray-700 text-gray-100'}`}>
      {label}
    </span>
  );
}

export function Spinner({ size = 'md' }) {
  const sizes = { sm: 'w-5 h-5', md: 'w-8 h-8', lg: 'w-12 h-12' };
  return (
    <div className={`${sizes[size]} border-2 border-green-500/30 border-t-green-500 rounded-full animate-spin`} />
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div className="flex items-center gap-2 justify-center mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ‹
      </button>
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-2 rounded-lg text-sm font-medium transition ${p === page ? 'bg-green-600 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
      >
        ›
      </button>
    </div>
  );
}

export function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl">
        <h3 className="text-lg font-semibold text-white mb-2">Confirmar ação</h3>
        <p className="text-gray-400 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 transition">Cancelar</button>
          <button onClick={onConfirm} className="flex-1 px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition font-semibold">Confirmar</button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ message = 'Nenhum item encontrado.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="text-6xl mb-4">👕</div>
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  );
}
