import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import ShirtCard from '../components/ShirtCard';
import ShirtForm from '../components/ShirtForm';
import { Spinner, Pagination, EmptyState, Toast, ConfirmModal } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const CATEGORIES = ['', 'titular', 'reserva', 'treino', 'retrô', 'seleção'];

export default function ShirtsPage() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [shirts, setShirts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [formLoading, setFormLoading] = useState(false);

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const page = parseInt(searchParams.get('page') || '1');

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchShirts = useCallback(() => {
    setLoading(true);
    api.getShirts({ page, limit: 8, search, category })
      .then(res => {
        setShirts(res.data);
        setPagination(res.pagination);
      })
      .catch(e => showToast(e.message, 'error'))
      .finally(() => setLoading(false));
  }, [page, search, category]);

  useEffect(() => { fetchShirts(); }, [fetchShirts]);

  const setParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value); else next.delete(key);
    if (key !== 'page') next.delete('page');
    setSearchParams(next);
  };

  const handleEdit = (shirt) => { setEditTarget(shirt); setFormOpen(true); };
  const handleNew = () => { setEditTarget(null); setFormOpen(true); };
  const handleCloseForm = () => { setFormOpen(false); setEditTarget(null); };

  const handleSubmit = async (data) => {
    setFormLoading(true);
    try {
      if (editTarget) {
        await api.updateShirt(editTarget.id, data);
        showToast('Camisa atualizada com sucesso!');
      } else {
        await api.createShirt(data);
        showToast('Camisa cadastrada com sucesso!');
      }
      handleCloseForm();
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
      showToast('Camisa removida com sucesso!');
      setDeleteTarget(null);
      fetchShirts();
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {deleteTarget && (
        <ConfirmModal
          message={`Deseja remover "${deleteTarget.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
      {formOpen && (
        <ShirtForm
          initial={editTarget}
          onSubmit={handleSubmit}
          onCancel={handleCloseForm}
          loading={formLoading}
        />
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <p className="text-green-500 text-sm font-semibold uppercase tracking-widest mb-1">Catálogo completo</p>
          <h1 className="font-display text-5xl text-white">TODAS AS CAMISAS</h1>
          {!loading && (
            <p className="text-gray-500 text-sm mt-1">{pagination.total} produto{pagination.total !== 1 ? 's' : ''} encontrado{pagination.total !== 1 ? 's' : ''}</p>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white font-semibold rounded-xl transition"
          >
            <span className="text-lg">+</span> Nova Camisa
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">🔍</span>
          <input
            className="w-full bg-gray-900 border border-gray-700 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition"
            placeholder="Buscar por nome, clube ou país..."
            value={search}
            onChange={e => setParam('search', e.target.value)}
          />
        </div>
        <select
          className="bg-gray-900 border border-gray-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-green-500 transition min-w-[160px]"
          value={category}
          onChange={e => setParam('category', e.target.value)}
        >
          <option value="">Todas categorias</option>
          {CATEGORIES.filter(Boolean).map(c => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24"><Spinner size="lg" /></div>
      ) : shirts.length === 0 ? (
        <EmptyState message="Nenhuma camisa encontrada. Tente outros filtros." />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {shirts.map(shirt => (
              <ShirtCard
                key={shirt.id}
                shirt={shirt}
                onEdit={handleEdit}
                onDelete={setDeleteTarget}
              />
            ))}
          </div>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            onPageChange={p => setParam('page', p)}
          />
        </>
      )}
    </div>
  );
}
