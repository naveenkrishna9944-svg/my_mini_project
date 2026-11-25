async function request(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.headers.get('content-type')?.includes('application/json')) {
    throw new Error('The retail API is unavailable. Please try again.');
  }
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed.');
  return data;
}

export const api = {
  dashboard: () => request('/api/dashboard'),
  products: () => request('/api/products'),
  addProduct: (body) => request('/api/products', { method: 'POST', body }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),
  sales: () => request('/api/sales'),
  addSale: (body) => request('/api/sales', { method: 'POST', body }),
};

export const money = (n) => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const dateTime = (d) => new Date(d).toLocaleString('en-IN');
