const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) {
    const msg = data.errors ? data.errors.join('\n') : (data.message || 'Erro desconhecido.');
    throw new Error(msg);
  }
  return data;
}

export const api = {
  // Listar com filtros e paginação
  getShirts: (params = {}) => {
    const query = new URLSearchParams(
      Object.fromEntries(Object.entries(params).filter(([, v]) => v !== '' && v !== null && v !== undefined))
    ).toString();
    return request(`/shirts${query ? '?' + query : ''}`);
  },

  // Buscar por ID
  getShirt: (id) => request(`/shirts/${id}`),

  // Destaques
  getFeatured: () => request('/shirts/featured'),

  // Criar
  createShirt: (data) => request('/shirts', { method: 'POST', body: JSON.stringify(data) }),

  // Atualizar
  updateShirt: (id, data) => request(`/shirts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

  // Deletar
  deleteShirt: (id) => request(`/shirts/${id}`, { method: 'DELETE' }),
};
