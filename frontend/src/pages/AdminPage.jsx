import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import ShirtForm from '../components/ShirtForm';
import { Spinner, Toast, ConfirmModal, Badge, Pagination } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { getShirtImage } from '../utils/getShirtImage';

function formatPrice(p) {
  return Number(p).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function AdminPage() {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const [shirts, setShirts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!isAdmin) navigate('/login');
  }, [isAdmin, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchShirts = useCallback(() => {
    setLoading(true);
    api.getShirts({ page, limit: 10, search })
      .then(res => { setShirts(res.data); setPagination(res.pagination); })
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [page, search]);

  useEffect(() => { fetchShirts(); }, [fetchShirts]);

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        await api.updateShirt(editTarget.id, data);
        showToast('Camisa atualizada!');
      } else {
        await api.createShirt(data);
        showToast('Camisa cadastrada!');
      }
      setFormOpen(false);
      setEditTarget(null);
      fetchShirts();
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await api.deleteShirt(deleteTarget.id);
      showToast('Camisa removida!');
      setDeleteTarget(null);
      fetchShirts();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && (
        <ConfirmModal
          message={`Remover "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {formOpen && (
        <ShirtForm
          initial={editTarget}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditTarget(null); }}
          loading={formLoading}
        />
      )}

      {/* Header */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        <div>
          <p className="text-green-500 text-sm font-semibold uppercase tracking-widest mb-1">Área restrita - Para o Aluno ou ADMIN</p>
          <h1 className="font-display text-5xl text-white">PAINEL ADMIN - Aluno: FELIPE DE LIMA DOS SANTOS</h1>
        </div>
        <button
          onClick={() => { setEditTarget(null); setFormOpen(true); }}
          className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition"
        >
          <span className="text-lg">+</span> Nova Camisa
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total', value: pagination.total, icon: '👕' },
          { label: 'Página', value: `${pagination.page}/${pagination.totalPages}`, icon: '📄' },
          { label: 'Por página', value: 10, icon: '📋' },
          { label: 'Resultados', value: shirts.length, icon: '🔎' },
        ].map(s => (
          <div key={s.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <div className="text-2xl mb-1">{s.icon}</div>
            <div className="text-2xl font-bold text-white">{s.value}</div>
            <div className="text-gray-500 text-xs">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
        <input
          className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
          placeholder="Buscar camisas..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-20"><Spinner size="lg" /></div>
      ) : (
        <>
          <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800">
                    {['ID', 'Imagem', 'Nome', 'Clube', 'Preço', 'Estoque', 'Categoria', 'Destaque', 'Ações'].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {shirts.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="text-center py-12 text-gray-500">Nenhuma camisa encontrada.</td>
                    </tr>
                  ) : shirts.map(shirt => (
                    <tr key={shirt.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                      <td className="px-4 py-3 text-gray-500 font-mono">#{shirt.id}</td>
                      <td className="px-4 py-3">
                        {getShirtImage(shirt.club) ? (
                          <img src={getShirtImage(shirt.club)} alt="" className="w-10 h-10 object-cover rounded-lg" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center text-lg">👕</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-white font-medium max-w-[200px]">
                        <div className="truncate">{shirt.name}</div>
                        <div className="text-gray-500 text-xs">{shirt.season}</div>
                      </td>
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        <div>{shirt.club}</div>
                        <div className="text-gray-500 text-xs">{shirt.country}</div>
                      </td>
                      <td className="px-4 py-3 text-green-400 font-semibold whitespace-nowrap">
                        {formatPrice(shirt.price)}
                        {shirt.original_price && (
                          <div className="text-gray-600 text-xs line-through">{formatPrice(shirt.original_price)}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-lg ${shirt.stock > 10 ? 'bg-green-900/50 text-green-400' : shirt.stock > 0 ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
                          {shirt.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3"><Badge label={shirt.category} /></td>
                      <td className="px-4 py-3 text-center">{shirt.featured ? '⭐' : '—'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => { setEditTarget(shirt); setFormOpen(true); }}
                            className="px-3 py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 text-xs font-semibold transition"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeleteTarget(shirt)}
                            className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 text-xs font-semibold transition"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
