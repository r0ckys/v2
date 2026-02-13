// Resolve API base URL from Vite env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'localhost:5001';

export interface ExpenseDTO {
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

export interface ExpenseSummary {
  totalAmount: number;
  totalTransactions: number;
  categories: number;
}

let _tenantId = '';
export function setExpenseTenantId(id: string) { _tenantId = id; }

function buildUrl(path: string, params?: Record<string, string | number | boolean | undefined>) {
  const base = API_BASE_URL || window.location.origin;
  const url = new URL(path, base);
  if (params) {
    Object.entries(params).forEach(([k,v]) => {
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

export const ExpenseService = {
  async list(opts: { query?: string; status?: string; category?: string; from?: string; to?: string; page?: number; pageSize?: number } = {}) {
    const url = buildUrl('/api/expenses', opts);
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch expenses');
    return res.json() as Promise<{ items: ExpenseDTO[]; total: number }>;
  },
  async summary(opts: { from?: string; to?: string } = {}) {
    const url = buildUrl('/api/expenses/summary', opts);
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) throw new Error('Failed to fetch summary');
    return res.json() as Promise<ExpenseSummary>;
  },
  async create(payload: ExpenseDTO) {
    const res = await fetch(buildUrl('/api/expenses'), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create expense');
    return res.json() as Promise<ExpenseDTO>;
  },
  async update(id: string, payload: Partial<ExpenseDTO>) {
    const res = await fetch(buildUrl(`/api/expenses/${id}`), {
      method: 'PUT',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update expense');
    return res.json() as Promise<ExpenseDTO>;
  },
  async remove(id: string) {
    const res = await fetch(buildUrl(`/api/expenses/${id}`), { method: 'DELETE', headers: headers() });
    if (!res.ok) throw new Error('Failed to delete expense');
    return res.json() as Promise<{ success: boolean }>;
  },
};
