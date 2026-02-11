import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import Papa from 'papaparse';
import { Product, Category, SubCategory, ChildCategory, Brand, Tag } from '../types';
import ProductPricingAndStock, { ProductPricingData } from '@/components/ProductPricingAndStock';
import { DraftProduct, generateDraftId, getDrafts, saveDraft } from '@/utils/draftManager';
import AdminProductUpload from './AdminProductUpload';

interface AdminProductsProps {
  products: Product[];
  categories: Category[];
  subCategories: SubCategory[];
  childCategories: ChildCategory[];
  brands: Brand[];
  tags: Tag[];
  onAddProduct: (product: Product) => void;
  onUpdateProduct: (product: Product) => void;
  onDeleteProduct: (id: number) => void;
  onBulkDelete: (ids: number[]) => void;
  onBulkUpdate: (ids: number[], updates: Partial<Product>) => void;
  tenantId?: string;
  onLogout: () => void;
  onSwitchSection: (section: string) => void;
  activeSection: string;
}

interface DraftProductData {
  draftId: string;
  name?: string;
}

interface DisplayProduct extends Product {
  _isDraft?: boolean;
  _draftId?: string;
}

interface SvgIconProps {
  [key: string]: any;
}

interface IconsObject {
  Search: React.FC<SvgIconProps>;
  Plus: React.FC<SvgIconProps>;
  Filter: React.FC<SvgIconProps>;
  Upload: React.FC<SvgIconProps>;
  Download: React.FC<SvgIconProps>;
  MoreVertical: React.FC<SvgIconProps>;
}

interface CsvImportRow {
  [key: string]: string | number;
}

interface CsvTemplateData {
  name: string;
  price: string;
  originalPrice: string;
  sku: string;
  stock: string;
  category: string;
  status: string;
  tags: string;
  galleryImages: string;
  description: string;
}

const AdminProducts: React.FC<AdminProductsProps> = ({ 
  products,
  categories,
  subCategories,
  childCategories,
  brands,
  tags,
  onAddProduct, 
  onUpdateProduct, 
  onDeleteProduct,
  onBulkDelete,
  onBulkUpdate,
  tenantId,
  onLogout,
  onSwitchSection,
  activeSection
}) => {
  const activeTenantId = tenantId || 'default';
  const [view, setView] = useState<'list' | 'upload'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [draftProducts, setDraftProducts] = useState<any[]>([]);
  const [currentDraftId, setCurrentDraftId] = useState<string | null>(null);
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [openActionDropdown, setOpenActionDropdown] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Refs
  const importInputRef = useRef<HTMLInputElement>(null);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    price: 0,
    status: 'Active'
  });

  // --- 1. Import Logic (Saves to DB per Tenant) ---
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let successCount = 0;
        for (const row of results.data as any[]) {
          try {
            const newProduct: any = {
              ...row,
              tenantId: activeTenantId,
              price: parseFloat(row.price) || 0,
              originalPrice: parseFloat(row.originalPrice) || 0,
              stock: parseInt(row.stock) || 0,
              tags: row.tags ? row.tags.split(',').map((t: string) => t.trim()) : [],
              galleryImages: row.galleryImages ? row.galleryImages.split(';') : [],
              status: row.status || 'Active',
              createdAt: new Date().toISOString()
            };
            // Call prop to save to DB
            await onAddProduct(newProduct);
            successCount++;
          } catch (error) {
            console.error("Failed to import row:", row.name, error);
          }
        }
        alert(`Successfully imported ${successCount} products to ${activeTenantId}.`);
        if (importInputRef.current) importInputRef.current.value = '';

      }
    });
  };

  // --- 2. Export Logic ---
  const handleExportCSV = () => {
    if (products.length === 0) return alert("No products to export");
    const dataToExport = products.map(p => ({
      ...p,
      tags: Array.isArray(p.tags) ? p.tags.join(', ') : '',
      galleryImages: Array.isArray(p.galleryImages) ? p.galleryImages.join(';') : ''
    }));
    const csv = Papa.unparse(dataToExport);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `products_${activeTenantId}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- 3. Download Template Logic ---
  const handleDownloadTemplate = () => {
    const templateData = [{
      name: "Example Product",
      price: "49.99",
      originalPrice: "59.99",
      sku: "SKU123",
      stock: "100",
      category: categories[0]?.name || "General",
      status: "Active",
      tags: "tag1, tag2",
      galleryImages: "url1;url2",
      description: "Sample description"
    }];
    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'systemnextit_product_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- Effects & Helpers ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openActionDropdown !== null && !(event.target as HTMLElement).closest('[data-action-dropdown]')) {
        setOpenActionDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openActionDropdown]);

  useEffect(() => {
    setDraftProducts(getDrafts(activeTenantId));
  }, [activeTenantId]);

  const allProducts = useMemo(() => [
    ...products,
    ...draftProducts.map(draft => ({
      id: parseInt(draft.draftId.replace('draft_', '')) || Date.now(),
      name: draft.name || 'Untitled Draft',
      status: 'Draft',
      _isDraft: true,
      _draftId: draft.draftId,
    } as unknown as Product))
  ], [products, draftProducts]);

  const filteredProducts = useMemo(() =>
    allProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())),
    [allProducts, searchTerm]);

  const paginatedProducts = filteredProducts.slice((currentPage - 1) * 10, currentPage * 10);
  const totalPages = Math.ceil(filteredProducts.length / 10);

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === paginatedProducts.length ? [] : paginatedProducts.map(p => p.id));
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const Icons = {
    Search: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
    Plus: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>,
    Filter: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>,
    Upload: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>,
    Download: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>,
    MoreVertical: (props: any) => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
  };

  if (view === 'upload') {
    return (
      <AdminProductUpload
        initialProduct={editingProduct}
        categories={categories}
        subCategories={subCategories}
        childCategories={childCategories}
        brands={brands}
        tags={tags}
        user={undefined}
        activeTenantId={activeTenantId}
        onCancel={() => { setView('list'); setEditingProduct(null); }}
        onSubmit={(product: Product) => {
          editingProduct ? onUpdateProduct(product) : onAddProduct(product);
          setView('list'); setEditingProduct(null);
        }}
      />
    );
  }

  return (
    <div className="w-full min-h-screen bg-white font-sans text-gray-800 p-4 sm:p-6">
      <input type="file" ref={importInputRef} onChange={handleImportCSV} accept=".csv" className="hidden" />

      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-[#111827]">Products</h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          <div className="relative min-w-0 sm:min-w-[320px]">
            <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              className="block w-full pl-10 pr-4 py-2 bg-[#F3F4F6] border-none rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
              placeholder="Search products/SKU"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => { setEditingProduct(null); setView('upload'); }}
            className="flex items-center justify-center gap-2 px-5 py-2 bg-[#0088FF] text-white rounded-lg text-sm font-semibold hover:bg-blue-600 transition-colors"
          >
            <Icons.Plus /> Add Product
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
        <div className="flex flex-wrap items-center gap-6">
          <button onClick={() => importInputRef.current?.click()} className="flex items-center gap-2 text-[#EA580C] text-sm font-medium hover:opacity-80">
            <Icons.Upload /> Import
          </button>
          <button onClick={handleExportCSV} className="flex items-center gap-2 text-[#EA580C] text-sm font-medium hover:opacity-80">
            <Icons.Download /> Export
          </button>
          <button onClick={handleDownloadTemplate} className="flex items-center gap-2 text-blue-600 text-sm font-medium hover:opacity-80">
            <Icons.Download /> Sample Template
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="w-full overflow-hidden rounded-xl border border-gray-100 shadow-sm bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EBF5FF] text-[#1F2937] text-sm font-semibold">
                <th className="p-4 w-14 text-center">
                  <input type="checkbox" onChange={toggleSelectAll} checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0} />
                </th>
                <th className="p-4">SL</th>
                <th className="p-4">Image</th>
                <th className="p-4">Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedProducts.map((product, index) => (
                <tr key={`${product.id}-${index}`} className={`${selectedIds.includes(product.id) ? 'bg-blue-50/50' : ''} hover:bg-gray-50 transition-colors`}>
                  <td className="p-4 text-center">
                    <input type="checkbox" checked={selectedIds.includes(product.id)} onChange={() => toggleSelect(product.id)} />
                  </td>
                  <td className="p-4 text-sm text-gray-500">{(currentPage - 1) * 10 + index + 1}</td>
                  <td className="p-4">
                    <div className="w-10 h-10 rounded-md bg-gray-100 border overflow-hidden">
                      {product.image && <img src={product.image} className="w-full h-full object-cover" alt="" />}
                    </div>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-900">{product.name}</td>
                  <td className="p-4 text-sm text-gray-600">{product.category || '-'}</td>
                  <td className="p-4 text-sm text-gray-600 font-mono">{product.sku || 'N/A'}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="p-4 text-center relative" data-action-dropdown>
                    <button onClick={() => setOpenActionDropdown(openActionDropdown === product.id ? null : product.id)} className="p-1 hover:bg-gray-100 rounded-md">
                      <Icons.MoreVertical className="text-gray-400" />
                    </button>
                    {openActionDropdown === product.id && (
                      <div className="absolute right-full mr-2 top-0 w-32 bg-white border border-gray-100 rounded-lg shadow-xl z-50 py-1">
                        <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50" onClick={() => { setEditingProduct(product); setView('upload'); }}>Edit</button>
                        <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50" onClick={() => onDeleteProduct(product.id)}>Delete</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
        <p className="text-sm text-gray-500">Showing {paginatedProducts.length} of {filteredProducts.length} products</p>
        <div className="flex gap-2">
          <button disabled={currentPage === 1} onClick={() => setCurrentPage(p => p - 1)} className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all">Previous</button>
          <button disabled={currentPage >= totalPages} onClick={() => setCurrentPage(p => p + 1)} className="px-4 py-2 text-sm font-medium border rounded-lg hover:bg-gray-50 disabled:opacity-40 transition-all">Next</button>
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;