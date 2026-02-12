
import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Plus,
  Download,
  Upload,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Check,
  LayoutGrid,
  List as ListIcon,
  Filter,
  X,
  Copy,
  Edit,
  Trash2,
  ChevronDown,
  Bell,
  Settings as SettingsIcon,
  MessageSquare,
  PlayCircle,
  ExternalLink,
  Grid,
  Layout,
  Package,
  Users,
  Archive,
  Star,
  Layers,
  Palette,
  FileText,
  MousePointer2,
  Image as ImageIcon,
  BarChart3,
  ShieldCheck,
  CreditCard,
  LifeBuoy,
  BookOpen,
  CheckCircle,
  Eye
} from 'lucide-react';
import OptimizedImage from './OptimizedImage';
import { Product, Category, Brand, Tag, User } from '../types';
import { formatCurrency } from '../utils/format';

interface Props {
  products: Product[];
  categories: Category[];
  brands: Brand[];
  user: User | null;
  onAddProduct: () => void;
  onEditProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onCloneProduct: (product: Product) => void;
  onBulkDelete: (ids: number[]) => void;
  onBulkStatusUpdate: (ids: number[], status: 'Active' | 'Draft') => void;
  onBulkCategoryUpdate: (ids: number[], category: string) => void;
  onSearch: (term: string) => void;
  onDeepSearch: (options: any) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onLogout: () => void;
  onSwitchSection: (section: string) => void;
  activeSection: string;
  onViewInShop?: (product: Product) => void;
  onViewDetails?: (product: Product) => void;
  storeSubdomain?: string;
}

const AdminProductsRedesign: React.FC<Props> = ({
  products,
  categories,
  brands,
  user,
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onCloneProduct,
  onBulkDelete,
  onBulkStatusUpdate,
  onViewInShop,
  onViewDetails,
  storeSubdomain,
  onBulkCategoryUpdate,
  onSearch,
  onDeepSearch,
  currentPage,
  totalPages,
  onPageChange,
  onLogout,
  onSwitchSection,
  activeSection
}) => {
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeepSearchOpen, setIsDeepSearchOpen] = useState(false);
  const [openActionDropdown, setOpenActionDropdown] = useState<string | null>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionDropdown) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setOpenActionDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionDropdown]);

  // Helper to get selected product IDs from Set of keys
  const getSelectedProductIds = (): number[] => {
    return products.filter((p, idx) => selectedIds.has(getProductKey(p, idx))).map(p => p.id);
  };

  // Deep Search Local State
  const [deepSearchTerm, setDeepSearchTerm] = useState('');
  const [searchInFields, setSearchInFields] = useState({
    name: true,
    description: true,
    category: true,
    brand: true,
    sku: true
  });
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [stockRange, setStockRange] = useState({ min: '', max: '' });

  // Helper to get unique key for each product
  const getProductKey = (product: Product, idx: number) => {
    return (product as any)._id || `${product.id}-${idx}`;
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = products.map((p, idx) => getProductKey(p, idx));
      setSelectedIds(new Set(allKeys));
    } else {
      setSelectedIds(new Set());
    }
  };

  const toggleSelect = (key: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const handleApplyDeepSearch = () => {
    onDeepSearch({
      term: deepSearchTerm,
      fields: searchInFields,
      priceRange,
      stockRange
    });
    setIsDeepSearchOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-stone-50 font-poppins text-black animate-fade-in">
        {/* Content Wrapper */}
        <main className="p-4 md:p-8 space-y-6">
          {/* Products Control Header */}
          <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-teal-950 text-xl font-bold font-lato tracking-tight">Products</h2>

              <div className="flex items-center gap-6">
                <div className="relative w-72">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={18} />
                  <input
                    type="text"
                    placeholder="Search products/SKU"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      onSearch(e.target.value);
                    }}
                    className="w-full bg-zinc-100 border-none rounded-lg pl-10 pr-4 py-2 text-xs focus:ring-1 focus:ring-sky-400"
                  />
                </div>

                <button
                  onClick={() => setIsDeepSearchOpen(!isDeepSearchOpen)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition ${isDeepSearchOpen ? 'bg-sky-100 text-sky-600' : 'bg-zinc-100 text-black'}`}
                >
                  <Filter size={14} /> Deep Search
                </button>

                <button
                  onClick={onAddProduct}
                  className="bg-gradient-to-r from-sky-400 to-blue-500 px-6 py-3 rounded-lg text-white font-bold flex items-center gap-2 hover:opacity-90 transition shadow-lg"
                >
                  <Plus size={18} /> Add Product
                </button>
              </div>
            </div>

            {/* Deep Search Panel */}
            {isDeepSearchOpen && (
              <div className="bg-stone-50 border border-gray-200 rounded-xl p-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Search In Fields</label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(searchInFields).map(([field, active]) => (
                        <label key={field} className="flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => setSearchInFields(prev => ({...prev, [field]: e.target.checked}))}
                            className="rounded border-gray-300 text-sky-500 focus:ring-sky-500"
                          />
                          <span className="capitalize">{field}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Price Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={priceRange.min}
                        onChange={(e) => setPriceRange(prev => ({...prev, min: e.target.value}))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={priceRange.max}
                        onChange={(e) => setPriceRange(prev => ({...prev, max: e.target.value}))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700">Stock Range</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={stockRange.min}
                        onChange={(e) => setStockRange(prev => ({...prev, min: e.target.value}))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
                      />
                      <span>-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        value={stockRange.max}
                        onChange={(e) => setStockRange(prev => ({...prev, max: e.target.value}))}
                        className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-sky-400"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                  <button onClick={() => setIsDeepSearchOpen(false)} className="px-4 py-2 text-sm text-gray-600 hover:underline">Cancel</button>
                  <button onClick={handleApplyDeepSearch} className="bg-sky-500 text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-sky-600 transition">Apply Filters</button>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-xs font-normal text-neutral-900 hover:text-orange-600 transition">
                  <div className="w-5 h-5 flex items-center justify-center border border-orange-600 rounded text-orange-600"><Upload size={12} /></div>
                  Import
                </button>
                <button className="flex items-center gap-1 text-xs font-normal text-neutral-900 hover:text-orange-600 transition">
                  <div className="w-5 h-5 flex items-center justify-center border border-orange-600 rounded text-orange-600"><Download size={12} /></div>
                  Export
                </button>
                <div className="bg-zinc-100 px-4 py-2 rounded-lg flex items-center gap-2">
                  <span className="text-black text-xs font-normal">{products.length} Products</span>
                  <ChevronDown size={14} className="text-black" />
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-xs font-normal text-black">
                  <Filter size={14} /> Filter:
                </div>
                {['All Category', 'All Brands', 'All Status'].map(filter => (
                  <div key={filter} className="bg-zinc-100 px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-zinc-200 transition">
                    <span className="text-black text-xs font-normal">{filter}</span>
                    <ChevronDown size={14} className="text-black" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Table Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gradient-to-b from-sky-400/20 to-blue-500/20 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 w-12">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
                        checked={selectedIds.size === products.length && products.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider">SL</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider">Image</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider w-1/4">Name</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider">Category</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider">Sub Category</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider">SKU</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider text-center">Tags</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider">Status</th>
                    <th className="px-4 py-4 text-black text-sm font-medium uppercase tracking-wider text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((product, idx) => {
                    const productKey = getProductKey(product, idx);
                    return (
                    <tr key={productKey} className={`hover:bg-sky-50/30 transition-colors ${selectedIds.has(productKey) ? 'bg-sky-50/50' : ''}`}>
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-gray-300 text-sky-500 focus:ring-sky-500 cursor-pointer"
                          checked={selectedIds.has(productKey)}
                          onChange={() => toggleSelect(productKey)}
                        />
                      </td>
                      <td className="px-4 py-4 text-stone-900 text-xs font-normal">{(currentPage - 1) * 10 + idx + 1}</td>
                      <td className="px-4 py-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg overflow-hidden border border-gray-100 shadow-sm">
                          <OptimizedImage
                            src={product.image?.[0] || product.image || 'https://placehold.co/40x40'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex flex-col">
                          <span className="text-stone-900 text-xs font-medium line-clamp-2" title={product.name}>{product.name}</span>
                          <span className="text-[10px] text-gray-400 mt-1">ID: {product.id}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-stone-900 text-xs font-normal">{product.category || 'Watch'}</td>
                      <td className="px-4 py-4 text-stone-900 text-xs font-normal">{product.subCategory || 'Mans Watch'}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                           <div className="w-full bg-gray-100 rounded-full h-1.5 max-w-[60px]">
                              <div className="bg-sky-400 h-1.5 rounded-full" style={{ width: `${(product as any).priority || 50}%` }}></div>
                           </div>
                           <span className="text-stone-900 text-xs font-normal">{(product as any).priority || 57}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-stone-900 text-xs font-normal uppercase tracking-tighter">{product.sku || 'pr123456'}</td>
                      <td className="px-4 py-4 text-center">
                        <span className="bg-zinc-100 text-stone-900 text-[10px] px-2 py-1 rounded-md border border-gray-200">
                          {product.tags?.[0] || 'New Arrival'}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors ${
                          product.status === 'Active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-amber-100 text-amber-700'
                        }`}>
                          {product.status || 'Draft'}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-center">
                        <div className="relative inline-block" data-dropdown>
                          <button
                            onClick={() => setOpenActionDropdown(openActionDropdown === productKey ? null : productKey)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                          >
                            <MoreVertical size={16} className="text-black" />
                          </button>

                          {openActionDropdown === productKey && (
                            <div className="absolute right-full top-0 mr-2 z-50" style={{ width: '180px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: '8px 0' }}>
                              {/* Edit */}
                              <button 
                                onClick={() => { onEditProduct(product); setOpenActionDropdown(null); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black', whiteSpace: 'nowrap' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <Edit size={24} color="black" />
                                Edit
                              </button>
                              {/* View in Shop */}
                              <button 
                                onClick={() => { 
                                  if (onViewInShop) {
                                    onViewInShop(product);
                                  } else if (storeSubdomain) {
                                    window.open(`//${storeSubdomain}.${window.location.host}/product/${product.id}`, '_blank');
                                  }
                                  setOpenActionDropdown(null); 
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black', whiteSpace: 'nowrap' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <ExternalLink size={24} color="black" />
                                View in Shop
                              </button>
                              {/* Details - Highlighted */}
                              <button 
                                onClick={() => { if (onViewDetails) onViewDetails(product); setOpenActionDropdown(null); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: '#f4f4f4', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black', whiteSpace: 'nowrap' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaeaea'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f4f4'}
                              >
                                <Eye size={24} color="black" />
                                Details
                              </button>
                              {/* Duplicate */}
                              <button 
                                onClick={() => { onCloneProduct(product); setOpenActionDropdown(null); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black', whiteSpace: 'nowrap' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <Copy size={24} color="black" />
                                Duplicate
                              </button>
                              {/* Product Status */}
                              <button 
                                onClick={() => { 
                                  const newStatus = product.status === 'Active' ? 'Draft' : 'Active';
                                  onBulkStatusUpdate([product.id], newStatus as 'Active' | 'Draft');
                                  setOpenActionDropdown(null); 
                                }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black', whiteSpace: 'nowrap' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <CheckCircle size={24} color="black" />
                                {product.status === 'Active' ? 'Set Draft' : 'Set Active'}
                              </button>
                              {/* Delete */}
                              <button 
                                onClick={() => { onDeleteProduct(product.id); setOpenActionDropdown(null); }}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: '#da0000', whiteSpace: 'nowrap' }}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                              >
                                <Trash2 size={24} color="#da0000" />
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>

              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center py-32 text-gray-400">
                  <Archive size={64} strokeWidth={1} className="mb-4 opacity-20" />
                  <p className="text-lg font-medium">No products found</p>
                  <p className="text-sm">Try adding a new product or changing filters</p>
                </div>
              )}
            </div>

            {/* Pagination Section */}
            <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between">
              <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
              >
                <ChevronLeft size={18} /> Previous
              </button>

              <div className="flex items-center gap-2">
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  // Only show first, last, and around current
                  if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                    return (
                      <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={`w-10 h-10 flex items-center justify-center rounded-lg text-sm font-bold transition ${
                          currentPage === page ? 'bg-sky-100 text-blue-500 shadow-sm' : 'text-teal-950 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  }
                  if (page === currentPage - 2 || page === currentPage + 2) {
                    return <span key={page} className="px-1 text-gray-400">...</span>;
                  }
                  return null;
                })}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="h-10 px-4 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 transition"
              >
                Next <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </main>

        {/* Floating Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-white border border-gray-200 shadow-2xl rounded-2xl px-8 py-4 flex items-center gap-8 z-[100] animate-in slide-in-from-bottom-8">
            <div className="flex flex-col">
              <span className="text-sky-500 font-bold text-lg">{selectedIds.length}</span>
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Selected</span>
            </div>

            <div className="w-px h-8 bg-gray-100"></div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => onBulkStatusUpdate(getSelectedProductIds(), 'Active')}
                className="px-4 py-2 rounded-lg bg-green-50 text-green-700 text-xs font-bold hover:bg-green-100 transition flex items-center gap-2"
              >
                <CheckCircle size={14} /> Publish
              </button>
              <button
                onClick={() => onBulkStatusUpdate(getSelectedProductIds(), 'Draft')}
                className="px-4 py-2 rounded-lg bg-amber-50 text-amber-700 text-xs font-bold hover:bg-amber-100 transition flex items-center gap-2"
              >
                <Eye size={14} /> Draft
              </button>
              <button
                onClick={() => onBulkDelete(getSelectedProductIds())}
                className="px-4 py-2 rounded-lg bg-red-50 text-red-600 text-xs font-bold hover:bg-red-100 transition flex items-center gap-2"
              >
                <Trash2 size={14} /> Delete
              </button>
            </div>

            <button onClick={() => setSelectedIds(new Set())} className="p-2 hover:bg-gray-100 rounded-full transition text-gray-400">
              <X size={18} />
            </button>
          </div>
        )}
    </div>
  );
};

export default AdminProductsRedesign;
