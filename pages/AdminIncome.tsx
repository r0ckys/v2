import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, Calendar, Printer, Image as ImageIcon, Edit2, Trash2, ChevronLeft, ChevronRight, X, TrendingUp, DollarSign, RefreshCw, Download } from 'lucide-react';
import { IncomeService, IncomeDTO } from '../services/IncomeService';
import { CategoryService } from '../services/CategoryService';
import { normalizeImageUrl } from '../utils/imageUrlHelper';

interface IncomeItem {
  id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  status: 'Published' | 'Draft' | 'Trash';
  note?: string;
  imageUrl?: string;
}

interface IncomeCategoryDTO {
  id: string;
  name: string;
}

const AdminIncome: React.FC = () => {
  const [query, setQuery] = useState('');
  const [statusTab, setStatusTab] = useState<'All'|'Published'|'Draft'|'Trash'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [dateRange, setDateRange] = useState<{from?: string; to?: string}>({});
  const [items, setItems] = useState<IncomeItem[]>([]);
  const [categories, setCategories] = useState<IncomeCategoryDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState<Partial<IncomeItem>>({ status: 'Draft' });
  const [editingIncomeId, setEditingIncomeId] = useState<string | null>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Default income categories
  const defaultCategories: IncomeCategoryDTO[] = [
    { id: '1', name: 'Investment Return' },
    { id: '2', name: 'Interest Income' },
    { id: '3', name: 'Rental Income' },
    { id: '4', name: 'Commission' },
    { id: '5', name: 'Refund' },
    { id: '6', name: 'Other Income' },
  ];

  const filtered = useMemo(() => {
    return items.filter(i =>
      (statusTab === 'All' || i.status === statusTab) &&
      (!selectedCategory || i.category === selectedCategory) &&
      (!query || i.name.toLowerCase().includes(query.toLowerCase())) &&
      (!dateRange.from || new Date(i.date) >= new Date(dateRange.from)) &&
      (!dateRange.to || new Date(i.date) <= new Date(dateRange.to))
    );
  }, [items, statusTab, selectedCategory, query, dateRange]);

  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  const totalAmount = useMemo(() => filtered.reduce((sum, i) => sum + i.amount, 0), [filtered]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [incomeRes, catRes] = await Promise.all([
          IncomeService.list({
            query,
            status: statusTab === 'All' ? undefined : statusTab,
            category: selectedCategory || undefined,
            from: dateRange.from,
            to: dateRange.to,
            page,
            pageSize,
          }),
          CategoryService.list().catch(() => ({ items: [] })),
        ]);
        setItems(incomeRes.items as any);
        // Use categories from API if available, otherwise use defaults
        const apiCategories = catRes.items.map((c: any) => ({ id: c.id || String(Math.random()), name: c.name }));
        setCategories(apiCategories.length > 0 ? apiCategories : defaultCategories);
      } catch (e: any) {
        setError(e?.message || 'Failed to load incomes');
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [query, statusTab, selectedCategory, dateRange.from, dateRange.to, page]);

  const handleAdd = async () => {
    if (!newItem.name || !newItem.category || !newItem.amount || !newItem.date) return;
    const payload: IncomeDTO = {
      name: newItem.name!,
      category: newItem.category!,
      amount: Number(newItem.amount!),
      date: newItem.date!,
      status: (newItem.status as any) || 'Draft',
      note: newItem.note,
      imageUrl: newItem.imageUrl,
    };
    try {
      if (editingIncomeId) {
        const updated = await IncomeService.update(editingIncomeId, payload);
        setItems(prev => prev.map(item => item.id === editingIncomeId ? { ...(updated as any), id: updated.id || editingIncomeId } : item));
      } else {
        const created = await IncomeService.create(payload);
        setItems(prev => [{ ...(created as any), id: created.id || String(Date.now()) }, ...prev]);
      }
      setIsAddOpen(false);
      setNewItem({ status: 'Draft' });
      setEditingIncomeId(null);
    } catch (e: any) {
      setError(e?.message || 'Failed to save income');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this income entry?')) return;
    try {
      await IncomeService.remove(id);
      setItems(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      setError(e?.message || 'Failed to delete income');
    }
  };

  const handleEdit = (item: IncomeItem) => {
    setNewItem(item);
    setEditingIncomeId(item.id);
    setIsAddOpen(true);
  };

  const formatCurrency = (amount: number) =>
    `৳${amount.toLocaleString('en-BD', { minimumFractionDigits: 2 })}`;

  return (
    <div className="p-2 sm:p-3 md:p-4 lg:p-6 bg-[#F8FAFC] min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4 md:mb-6">
        <div>
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-green-500" />
            Income
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm md:text-sm mt-0.5 hidden sm:block">Track your other income sources</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { setNewItem({ status: 'Draft', date: new Date().toISOString().split('T')[0] }); setEditingIncomeId(null); setIsAddOpen(true); }}
            className="flex items-center justify-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-[#38BDF8] to-[#1E90FF] text-white rounded-lg hover:from-[#2BAEE8] hover:to-[#1A7FE8] transition text-xs sm:text-sm font-semibold whitespace-nowrap flex-1 sm:flex-initial"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="hidden xs:inline">Add Income</span>
            <span className="xs:hidden">Add</span>
          </button>
        </div>
      </div>

      {/* Summary Card */}
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 mb-3 sm:mb-4 md:mb-6 border border-gray-200 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-green-600 text-[10px] sm:text-xs md:text-sm font-medium">Total Income</p>
            <p className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mt-1 break-words">{formatCurrency(totalAmount)}</p>
            <p className="text-gray-500 text-[10px] sm:text-[10px] md:text-xs mt-0.5 sm:mt-1">{filtered.length} transactions</p>
          </div>
          <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-green-50 flex items-center justify-center flex-shrink-0 ml-2 sm:ml-3">
            <DollarSign className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg sm:rounded-xl p-2 sm:p-3 md:p-4 mb-3 sm:mb-4 md:mb-6 border border-gray-200 shadow-sm">
        <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search incomes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
            />
          </div>

          {/* Category Filter & Date Range */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-xs sm:text-sm focus:outline-none focus:border-green-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>

            {/* Date Range */}
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 hidden sm:block" />
              <input
                type="date"
                value={dateRange.from || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, from: e.target.value }))}
                className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-xs sm:text-sm focus:outline-none min-w-0"
              />
              <span className="text-gray-400 text-xs sm:text-sm">—</span>
              <input
                type="date"
                value={dateRange.to || ''}
                onChange={(e) => setDateRange(prev => ({ ...prev, to: e.target.value }))}
                className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-xs sm:text-sm focus:outline-none min-w-0"
              />
            </div>
          </div>
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3 md:mt-4 overflow-x-auto scrollbar-hide pb-1 sm:pb-0">
          {(['All', 'Published', 'Draft', 'Trash'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusTab(tab)}
              className={`px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs md:text-sm transition whitespace-nowrap ${
                statusTab === tab
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {error ? (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <p className="text-red-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto scrollbar-hide -mx-3 sm:mx-0 px-3 sm:px-0">
            <table className="w-full min-w-[600px]">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden md:table-cell">Category</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden sm:table-cell">Date</th>
                  <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase hidden lg:table-cell">Status</th>
                  <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paged.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-500 text-sm">
                      No income entries found
                    </td>
                  </tr>
                ) : (
                  paged.map((item, idx) => (
                    <tr key={item.id || idx} className="hover:bg-gray-50 transition">
                      <td className="px-3 sm:px-4 py-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                          {item.imageUrl ? (
                            <img src={normalizeImageUrl(item.imageUrl)} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg object-cover" />
                          ) : (
                            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-green-50 flex items-center justify-center">
                              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="text-gray-900 font-medium text-sm sm:text-base truncate">{item.name}</p>
                            <p className="text-xs text-gray-500 md:hidden truncate">{item.category}</p>
                            {item.note && <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-[200px]">{item.note}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 py-3 hidden md:table-cell">
                        <span className="px-2 py-1 bg-green-50 text-green-600 text-xs rounded-full whitespace-nowrap">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-green-600 font-semibold text-sm sm:text-base whitespace-nowrap">
                        +{formatCurrency(item.amount)}
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-gray-600 text-xs sm:text-sm hidden sm:table-cell">
                        {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="px-3 sm:px-4 py-3 hidden lg:table-cell">
                        <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                          item.status === 'Published' ? 'bg-emerald-50 text-emerald-600' :
                          item.status === 'Draft' ? 'bg-yellow-50 text-yellow-600' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {filtered.length > pageSize && (
            <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between bg-gray-50">
              <p className="text-sm text-gray-600">
                Showing {((page - 1) * pageSize) + 1} - {Math.min(page * pageSize, filtered.length)} of {filtered.length}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">Page {page}</span>
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * pageSize >= filtered.length}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-200 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Add/Edit Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                {editingIncomeId ? 'Edit Income' : 'Add New Income'}
              </h2>
              <button
                onClick={() => { setIsAddOpen(false); setEditingIncomeId(null); setNewItem({ status: 'Draft' }); }}
                className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm text-gray-600 mb-1 font-medium">Name *</label>
                <input
                  type="text"
                  value={newItem.name || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Income description"
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1 font-medium">Category *</label>
                  <select
                    value={newItem.category || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="">Select category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1 font-medium">Amount (৳) *</label>
                  <input
                    type="number"
                    value={newItem.amount || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, amount: Number(e.target.value) }))}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1 font-medium">Date *</label>
                  <input
                    type="date"
                    value={newItem.date || ''}
                    onChange={(e) => setNewItem(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm text-gray-600 mb-1 font-medium">Status</label>
                  <select
                    value={newItem.status || 'Draft'}
                    onChange={(e) => setNewItem(prev => ({ ...prev, status: e.target.value as any }))}
                    className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 text-sm focus:outline-none focus:border-green-500"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Note</label>
                <textarea
                  value={newItem.note || ''}
                  onChange={(e) => setNewItem(prev => ({ ...prev, note: e.target.value }))}
                  placeholder="Additional notes..."
                  rows={3}
                  className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500 resize-none"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              <button
                onClick={() => { setIsAddOpen(false); setEditingIncomeId(null); setNewItem({ status: 'Draft' }); }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!newItem.name || !newItem.category || !newItem.amount || !newItem.date}
                className="px-4 py-2 bg-gradient-to-r from-[#38BDF8] to-[#1E90FF] text-white rounded-lg hover:from-[#2BAEE8] hover:to-[#1A7FE8] disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {editingIncomeId ? 'Update' : 'Add'} Income
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminIncome;
