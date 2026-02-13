// Purchase Service – per-tenant purchase tracking
// Uses same pattern as ExpenseService / IncomeService

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export interface PurchaseItemDTO {
  productId?: string;
  productName: string;
  sku?: string;
  barcode?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  batchNo?: string;
  expireDate?: string | null;
  image?: string;
}

export interface PurchaseDTO {
  _id?: string;
  purchaseNumber?: string;
  items: PurchaseItemDTO[];
  totalAmount: number;
  supplierName: string;
  mobileNumber?: string;
  address?: string;
  paymentType?: 'cash' | 'due';
  paymentMethod?: string;
  cashPaid?: number;
  dueAmount?: number;
  employeeName?: string;
  note?: string;
  status?: string;
  tenantId?: string;
  createdAt?: string;
}

export interface PurchaseSummary {
  totalPurchases: number;
  totalAmount: number;
  totalItems: number;
}

let _tenantId = '';
export function setPurchaseTenantId(id: string) { _tenantId = id; }

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

export const PurchaseService = {
  async list(opts: { startDate?: string; endDate?: string } = {}) {
    const url = buildUrl('/api/purchases', opts);
    const res = await fetch(url, { headers: headers() });
    if (!res.ok) return [];
    return res.json() as Promise<PurchaseDTO[]>;
  },

  async getById(id: string) {
    const res = await fetch(buildUrl(`/api/purchases/${id}`), { headers: headers() });
    if (!res.ok) throw new Error('Purchase not found');
    return res.json() as Promise<PurchaseDTO>;
  },

  async summary() {
    const res = await fetch(buildUrl('/api/purchases/summary/stats'), { headers: headers() });
    if (!res.ok) return { totalPurchases: 0, totalAmount: 0, totalItems: 0 };
    return res.json() as Promise<PurchaseSummary>;
  },

  async create(payload: Omit<PurchaseDTO, '_id' | 'purchaseNumber' | 'createdAt'>) {
    const res = await fetch(buildUrl('/api/purchases'), {
      method: 'POST',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to create purchase');
    return res.json() as Promise<PurchaseDTO>;
  },

  async update(id: string, payload: Partial<PurchaseDTO>) {
    const res = await fetch(buildUrl(`/api/purchases/${id}`), {
      method: 'PUT',
      headers: headers({ 'Content-Type': 'application/json' }),
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error('Failed to update purchase');
    return res.json() as Promise<{ message: string }>;
  },

  async remove(id: string) {
    const res = await fetch(buildUrl(`/api/purchases/${id}`), { method: 'DELETE', headers: headers() });
    if (!res.ok) throw new Error('Failed to delete purchase');
    return res.json() as Promise<{ message: string }>;
  },
};
