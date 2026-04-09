import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { Badge, Spinner, Toast } from '../components/UI';
import ShirtForm from '../components/ShirtForm';
import { useAuth } from '../context/AuthContext';
import { getShirtImage } from '../utils/getShirtImage';

function formatPrice(price) {
  return Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ShirtDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  const [shirt, setShirt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [toast, setToast] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    setLoading(true);
    api.getShirt(id)
      .then(res => {
        const s = res.data;
        s.sizes = typeof s.sizes === 'string' ? JSON.parse(s.sizes) : s.sizes;
        s.colors = typeof s.colors === 'string' ? JSON.parse(s.colors) : s.colors;
        setShirt(s);
        if (s.sizes?.length > 0) setSelectedSize(s.sizes[0]);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleUpdate = async (data) => {
    setFormLoading(true);
    try {
      const res = await api.updateShirt(id, data);
      const s = res.data;
      s.sizes = typeof s.sizes === 'string' ? JSON.parse(s.sizes) : s.sizes;
      s.colors = typeof s.colors === 'string' ? JSON.parse(s.colors) : s.colors;
      setShirt(s);
      setEditing(false);
      showToast('Camisa atualizada com sucesso!');
    } catch (e) {
      showToast(e.message, 'error');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm(`Remover "${shirt.name}"?`)) return;
    try {
      await api.deleteShirt(id);
      navigate('/camisas');
    } catch (e) {
      showToast(e.message, 'error');
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize) return showToast('Selecione um tamanho!', 'error');
    showToast(`${shirt.name} (${selectedSize}) adicionado ao carrinho!`);
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-[60vh]">
      <Spinner size="lg" />
    </div>
  );

  if (error || !shirt) return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <div className="text-6xl mb-4">😞</div>
      <h2 className="text-2xl font-bold text-white mb-2">Camisa não encontrada</h2>
      <p className="text-gray-400 mb-6">{error || 'Este produto pode ter sido removido.'}</p>
      <Link to="/camisas" className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition">
        Voltar ao catálogo
      </Link>
    </div>
  );

  const discount = shirt.original_price
    ? Math.round((1 - shirt.price / shirt.original_price) * 100)
    : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-fade-in">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      {editing && (
        <ShirtForm
          initial={shirt}
          onSubmit={handleUpdate}
          onCancel={() => setEditing(false)}
          loading={formLoading}
        />
      )}

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-green-400 transition">Início</Link>
        <span>›</span>
        <Link to="/camisas" className="hover:text-green-400 transition">Camisas</Link>
        <span>›</span>
        <span className="text-gray-300 truncate">{shirt.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Imagem */}
        <div className="relative">
          <div className="bg-gray-900 rounded-2xl overflow-hidden aspect-square border border-gray-800">
            {getShirtImage(shirt.club) ? (
              <img
                src={getShirtImage(shirt.club)}
                alt={shirt.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl bg-gray-800">👕</div>
            )}
          </div>
          {shirt.featured && (
            <div className="absolute top-4 left-4 bg-yellow-500 text-gray-900 text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide">
              ⭐ Destaque
            </div>
          )}
          {discount && (
            <div className="absolute top-4 right-4 bg-red-600 text-white text-sm font-bold px-3 py-1.5 rounded-full">
              -{discount}%
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-3">
            <Badge label={shirt.category} />
            <span className="text-gray-500 text-sm">{shirt.season}</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-white leading-tight mb-2">{shirt.name}</h1>
          <p className="text-gray-400 text-lg mb-6">{shirt.club} • {shirt.country}</p>

          {/* Preço */}
          <div className="mb-6 p-4 bg-gray-900/80 rounded-xl border border-gray-800">
            {shirt.original_price && (
              <p className="text-gray-500 line-through text-sm">{formatPrice(shirt.original_price)}</p>
            )}
            <p className="text-4xl font-bold text-green-400">{formatPrice(shirt.price)}</p>
            <p className="text-gray-500 text-xs mt-1">ou 12x de {formatPrice(shirt.price / 12)} sem juros</p>
          </div>

          {/* Cores */}
          {shirt.colors?.length > 0 && (
            <div className="mb-5">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Cores</p>
              <div className="flex gap-2 flex-wrap">
                {shirt.colors.map(c => (
                  <span key={c} className="px-3 py-1 rounded-lg bg-gray-800 border border-gray-700 text-sm text-gray-300">{c}</span>
                ))}
              </div>
            </div>
          )}

          {/* Tamanhos */}
          {shirt.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Tamanho</p>
              <div className="flex gap-2 flex-wrap">
                {shirt.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`w-12 h-12 rounded-xl border-2 font-bold text-sm transition ${
                      selectedSize === s
                        ? 'border-green-500 bg-green-600 text-white'
                        : 'border-gray-700 bg-gray-800 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Estoque */}
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${shirt.stock > 10 ? 'bg-green-500' : shirt.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
            <span className={`text-sm font-medium ${shirt.stock > 10 ? 'text-green-400' : shirt.stock > 0 ? 'text-yellow-400' : 'text-red-400'}`}>
              {shirt.stock > 0 ? `${shirt.stock} unidades em estoque` : 'Produto esgotado'}
            </span>
          </div>

          {/* CTA */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={handleAddToCart}
              disabled={shirt.stock === 0}
              className="flex-1 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-bold text-base transition disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {shirt.stock === 0 ? 'Esgotado' : '🛒 Adicionar ao carrinho'}
            </button>
          </div>

          {/* Description */}
          {shirt.description && (
            <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-800">
              <p className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-2">Descrição</p>
              <p className="text-gray-300 text-sm leading-relaxed">{shirt.description}</p>
            </div>
          )}

          {/* Admin actions */}
          {isAdmin && (
            <div className="flex gap-3 mt-6 pt-6 border-t border-gray-800">
              <button onClick={() => setEditing(true)} className="flex-1 py-2.5 rounded-xl bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30 font-semibold transition">
                ✏️ Editar camisa
              </button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30 font-semibold transition">
                🗑️ Remover
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
