// Income Service for Business Reports
// Manages other income sources besides sales

// Resolve API base URL from Vite env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface IncomeDTO {
  id?: string;
  name: string;
  category: string;
  amount: number;
  date: string; // ISO
  status: 'Published' | 'Draft' | 'Trash';
  note?: string;
  imageUrl?: string;
  tenantId?: string;
}

export interface IncomeSummary {
  totalAmount: number;
  totalTransactions: number;
  categories: number;
}

export interface IncomeCategoryDTO {
  id?: string;
  name: string;
  tenantId?: string;
}

let _tenantId = '';
export function setIncomeTenantId(id: string) { _tenantId = id; }

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

export const IncomeService = {
  async list(opts: { query?: string; status?: string; category?: string; from?: string; to?: string; page?: number; pageSize?: number } = {}) {
    const url = buildUrl('/api/incomes', opts);
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) return { items: [], total: 0 };
    return res.json() as Promise<{ items: IncomeDTO[]; total: number }>;
  },

  async summary(opts: { from?: string; to?: string } = {}) {
    const url = buildUrl('/api/incomes/summary', opts);
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) return { totalAmount: 0, totalTransactions: 0, categories: 0 };
    return res.json() as Promise<IncomeSummary>;
  },

  async listCategories() {
    const res = await fetch(buildUrl('/api/incomes/categories'), { headers: headers() });
    if (!res.ok) return [];
    return res.json() as Promise<IncomeCategoryDTO[]>;
  },

  async createCategory(name: string) {
    const res = await fetch(buildUrl('/api/incomes/categories'), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to create income category');
    return res.json() as Promise<IncomeCategoryDTO>;
  },

  async create(payload: IncomeDTO) {
    const res = await fetch(buildUrl('/api/incomes'), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create income');
    return res.json() as Promise<IncomeDTO>;
  },

  async update(id: string, payload: Partial<IncomeDTO>) {
    const res = await fetch(buildUrl(`/api/incomes/${id}`), {
      method: 'PUT',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update income');
    return res.json() as Promise<IncomeDTO>;
  },

  async remove(id: string) {
    const res = await fetch(buildUrl(`/api/incomes/${id}`), { method: 'DELETE', headers: headers() });
    if (!res.ok) throw new Error('Failed to delete income');
    return res.json() as Promise<{ success: boolean }>;
  },
};
