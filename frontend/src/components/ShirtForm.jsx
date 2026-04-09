import React, { useState } from 'react';

const CATEGORIES = ['titular', 'reserva', 'treino', 'retrô', 'seleção'];
const SIZE_OPTIONS = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

const defaultForm = {
  name: '', club: '', country: '', season: '', price: '',
  original_price: '', description: '',
  sizes: ['P', 'M', 'G', 'GG'], colors: ['Branco'],
  stock: 0, category: 'titular', featured: false, active: true,
};

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function ShirtForm({ initial = null, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(initial ? {
    ...defaultForm, ...initial,
    sizes: typeof initial.sizes === 'string' ? JSON.parse(initial.sizes) : initial.sizes,
    colors: typeof initial.colors === 'string' ? JSON.parse(initial.colors) : initial.colors,
    original_price: initial.original_price || '',
  } : defaultForm);

  const [colorsStr, setColorsStr] = useState((form.colors || []).join(', '));

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value }));

  const toggleSize = (size) => {
    setForm(f => ({
      ...f,
      sizes: f.sizes.includes(size) ? f.sizes.filter(s => s !== size) : [...f.sizes, size],
    }));
  };

  const handleColors = (e) => {
    setColorsStr(e.target.value);
    setForm(f => ({ ...f, colors: e.target.value.split(',').map(c => c.trim()).filter(Boolean) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      price: Number(form.price),
      original_price: form.original_price ? Number(form.original_price) : null,
      stock: Number(form.stock),
    });
  };

  const inputClass = "w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-white text-sm placeholder-gray-500 focus:outline-none focus:border-green-500 transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl my-4 shadow-2xl animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h2 className="font-display text-2xl tracking-wide text-white">
            {initial ? 'EDITAR CAMISA' : 'NOVA CAMISA'}
          </h2>
          <button onClick={onCancel} className="text-gray-500 hover:text-white text-2xl transition">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Nome da Camisa *">
              <input className={inputClass} value={form.name} onChange={set('name')} placeholder="Ex: Camisa Titular Flamengo 2024" required />
            </Field>
            <Field label="Clube *">
              <input className={inputClass} value={form.club} onChange={set('club')} placeholder="Ex: Flamengo" required />
            </Field>
            <Field label="País *">
              <input className={inputClass} value={form.country} onChange={set('country')} placeholder="Ex: Brasil" required />
            </Field>
            <Field label="Temporada *">
              <input className={inputClass} value={form.season} onChange={set('season')} placeholder="Ex: 2024/25" required />
            </Field>
            <Field label="Preço (R$) *">
              <input className={inputClass} type="number" step="0.01" min="0" value={form.price} onChange={set('price')} placeholder="299.90" required />
            </Field>
            <Field label="Preço Original (R$)">
              <input className={inputClass} type="number" step="0.01" min="0" value={form.original_price} onChange={set('original_price')} placeholder="Deixar vazio se não tiver desconto" />
            </Field>
            <Field label="Estoque *">
              <input className={inputClass} type="number" min="0" value={form.stock} onChange={set('stock')} required />
            </Field>
            <Field label="Categoria *">
              <select className={inputClass} value={form.category} onChange={set('category')} required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </Field>
          </div>

          <Field label="Descrição">
            <textarea className={`${inputClass} h-24 resize-none`} value={form.description} onChange={set('description')} placeholder="Descrição detalhada da camisa..." />
          </Field>

          <Field label="Tamanhos disponíveis *">
            <div className="flex gap-2 flex-wrap">
              {SIZE_OPTIONS.map(s => (
                <button key={s} type="button" onClick={() => toggleSize(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold border transition ${form.sizes.includes(s) ? 'bg-green-600 border-green-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-500'}`}>
                  {s}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Cores (separadas por vírgula)">
            <input className={inputClass} value={colorsStr} onChange={handleColors} placeholder="Vermelho/Preto, Branco" />
          </Field>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="w-4 h-4 rounded accent-green-500" checked={form.featured} onChange={set('featured')} />
              <span className="text-sm text-gray-300">Destaque</span>
            </label>
            {initial && (
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded accent-green-500" checked={form.active} onChange={set('active')} />
                <span className="text-sm text-gray-300">Ativo</span>
              </label>
            )}
          </div>
        </form>

        <div className="flex gap-3 p-5 border-t border-gray-800">
          <button type="button" onClick={onCancel} className="flex-1 py-2.5 rounded-xl bg-gray-800 text-gray-300 hover:bg-gray-700 transition font-medium">
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-500 text-white font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Salvando...' : (initial ? 'Salvar alterações' : 'Cadastrar camisa')}
          </button>
        </div>
      </div>
    </div>
  );
}
