import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from './UI';
import { useAuth } from '../context/AuthContext';
import { getShirtImage } from '../utils/getShirtImage';

function formatPrice(price) {
  return Number(price).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export default function ShirtCard({ shirt, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  return (
    <div className="card-hover bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden flex flex-col group animate-fade-in">
      {/* Imagem */}
      <Link to={`/camisas/${shirt.id}`} className="relative block bg-gray-800 overflow-hidden aspect-square">
        {getShirtImage(shirt.club) ? (
          <img
            src={getShirtImage(shirt.club)}
            alt={shirt.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-800">👕</div>
        )}
        {shirt.featured ? (
          <div className="absolute top-3 left-3 bg-yellow-500 text-gray-900 text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide">
            ⭐ Destaque
          </div>
        ) : null}
        {shirt.original_price && (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{Math.round((1 - shirt.price / shirt.original_price) * 100)}%
          </div>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Badge label={shirt.category} />
          <span className="text-xs text-gray-500">{shirt.season}</span>
        </div>
        <Link to={`/camisas/${shirt.id}`} className="font-semibold text-white hover:text-green-400 transition line-clamp-1 mb-1">
          {shirt.name}
        </Link>
        <p className="text-gray-500 text-sm mb-3">{shirt.club} • {shirt.country}</p>

        <div className="mt-auto flex items-end justify-between">
          <div>
            {shirt.original_price && (
              <p className="text-xs text-gray-600 line-through">{formatPrice(shirt.original_price)}</p>
            )}
            <p className="text-lg font-bold text-green-400">{formatPrice(shirt.price)}</p>
          </div>
          <span className={`text-xs px-2 py-1 rounded-lg font-medium ${shirt.stock > 10 ? 'bg-green-900/50 text-green-400' : shirt.stock > 0 ? 'bg-yellow-900/50 text-yellow-400' : 'bg-red-900/50 text-red-400'}`}>
            {shirt.stock > 0 ? `${shirt.stock} em estoque` : 'Esgotado'}
          </span>
        </div>

        {/* Admin actions */}
        {isAdmin && (
          <div className="flex gap-2 mt-3 pt-3 border-t border-gray-800">
            <button onClick={() => onEdit(shirt)} className="flex-1 text-xs py-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/40 transition font-medium">
              ✏️ Editar
            </button>
            <button onClick={() => onDelete(shirt)} className="flex-1 text-xs py-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40 transition font-medium">
              🗑️ Excluir
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
