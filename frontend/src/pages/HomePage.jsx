import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import ShirtCard from '../components/ShirtCard';
import { Spinner, EmptyState } from '../components/UI';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getFeatured()
      .then(res => setFeatured(res.data))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-950 via-green-950/30 to-gray-950 py-24 px-4">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-96 h-96 bg-green-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-green-600 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <p className="text-green-500 font-semibold text-sm uppercase tracking-[0.3em] mb-4">A melhor loja de futebol</p>
          <h1 className="font-display text-6xl sm:text-8xl lg:text-9xl text-white leading-none mb-6">
            VISTA AS<br />
            <span className="text-green-500">CORES</span> DO<br />
            SEU TIME
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
            Camisas oficiais dos maiores clubes do mundo. Autenticidade garantida, entrega rápida para todo o Brasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/camisas" className="px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold text-base transition">
              Ver todas as camisas →
            </Link>
            <a href="#destaques" className="px-8 py-4 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 font-semibold text-base transition">
              Ver destaques
            </a>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="bg-green-600 py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8 text-white font-semibold text-sm">
          <span>🚚 Frete grátis acima de R$299</span>
          <span>🏷️ Produto oficial garantido</span>
          <span>🔄 Troca em 30 dias</span>
          <span>💳 12x sem juros</span>
        </div>
      </section>

      {/* Featured */}
      <section id="destaques" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-green-500 text-sm font-semibold uppercase tracking-widest mb-1">Selecionados para você</p>
            <h2 className="font-display text-4xl sm:text-5xl text-white">DESTAQUES</h2>
          </div>
          <Link to="/camisas" className="text-sm text-gray-400 hover:text-green-400 transition font-medium hidden sm:block">
            Ver todas →
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><Spinner size="lg" /></div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-400 text-sm">{error}</p>
            <p className="text-gray-500 text-sm mt-1">Verifique se o backend está rodando.</p>
          </div>
        ) : featured.length === 0 ? (
          <EmptyState message="Nenhuma camisa em destaque ainda." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featured.map(shirt => (
              <ShirtCard key={shirt.id} shirt={shirt} />
            ))}
          </div>
        )}

        <div className="text-center mt-10 sm:hidden">
          <Link to="/camisas" className="text-sm text-green-400 hover:text-green-300 font-medium">
            Ver todas as camisas →
          </Link>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-16 rounded-2xl bg-gradient-to-r from-green-800 to-green-600 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-4xl text-white mb-2">CAMISAS RETRÔ</h3>
            <p className="text-green-100">Clássicos inesquecíveis para os colecionadores de verdade.</p>
          </div>
          <Link to="/camisas?category=retrô" className="px-6 py-3 rounded-xl bg-white text-green-800 font-bold hover:bg-green-50 transition whitespace-nowrap">
            Ver coleção →
          </Link>
        </div>
      </section>
    </div>
  );
}
