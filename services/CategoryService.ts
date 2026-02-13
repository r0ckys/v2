// Resolve API base URL from Vite env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface CategoryDTO {
  id?: string;
  name: string;
  createdAt?: string;
}

let _tenantId = '';
export function setCategoryTenantId(id: string) { _tenantId = id; }

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const base = API_BASE_URL || window.location.origin;
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    });
  }
  return url.toString();
}

function headers(extra?: Record<string, string>): Record<string, string> {
  const h: Record<string, string> = { ...extra };
  if (_tenantId) h['X-Tenant-Id'] = _tenantId;
  return h;
}

export const CategoryService = {
  async list() {
    const url = buildUrl('/api/expenses/categories/list');
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch categories');
    return res.json() as Promise<{ items: CategoryDTO[] }>;
  },

  async create(payload: { name: string }) {
    const res = await fetch(buildUrl('/api/expenses/categories/create'), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create category');
    return res.json() as Promise<CategoryDTO>;
  },

  async update(id: string, payload: { name: string }) {
    const res = await fetch(buildUrl(`/api/expenses/categories/${id}`), {
      method: 'PUT',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update category');
    return res.json() as Promise<CategoryDTO>;
  },

  async remove(id: string) {
    const res = await fetch(buildUrl(`/api/expenses/categories/${id}`), { method: 'DELETE', headers: headers() });
    if (!res.ok) throw new Error('Failed to delete category');
    return res.json() as Promise<{ success: boolean }>;
  },
};
