import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Plus, Search, MoreVertical, ChevronLeft, ChevronRight, ChevronDown, Download, Upload, Filter, Printer, Edit, Trash2, Copy, Eye, X, Loader2, LayoutGrid, List } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product, Category, Brand } from '../../types';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';

// Icons as SVG components
const SearchIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 19C15.4183 19 19 15.4183 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19Z" stroke="#7B7B7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 21L16.65 16.65" stroke="#7B7B7B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SortIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3 7H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M6 12H18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M10 17H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ExpandIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M15 3H21V9" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M9 21H3V15" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M21 3L14 10" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 21L10 14" stroke="#070707" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const AddSquareIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12Z" stroke="white" strokeWidth="1.5"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="5" r="1.5" fill="#1D1A1A"/>
    <circle cx="12" cy="12" r="1.5" fill="#1D1A1A"/>
    <circle cx="12" cy="19" r="1.5" fill="#1D1A1A"/>
  </svg>
);

const ArrowIcon = () => (
  <svg width="10" height="18" viewBox="0 0 10 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="rotate-90">
    <path d="M1 1L9 9L1 17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface FigmaProductListProps {
  products?: Product[];
  categories?: Category[];
  brands?: Brand[];
  onAddProduct?: () => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (id: number) => void;
  onCloneProduct?: (product: Product) => void;
  onBulkDelete?: (ids: number[]) => void;
  onBulkStatusUpdate?: (ids: number[], status: 'Active' | 'Draft') => void;
}

const FigmaProductList: React.FC<FigmaProductListProps> = ({
  products: propProducts = [],
  categories = [],
  brands = [],
  onAddProduct,
  onEditProduct,
  onDeleteProduct,
  onCloneProduct,
  onBulkDelete,
  onBulkStatusUpdate
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState<'large' | 'small' | 'list'>('large');
  const [showViewDropdown, setShowViewDropdown] = useState(false);
  const [productsPerPage, setProductsPerPage] = useState(10);
  
  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [brandFilter, setBrandFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPerPageDropdown, setShowPerPageDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) {
        setOpenDropdownId(null);
        setShowCategoryDropdown(false);
        setShowBrandDropdown(false);
        setShowStatusDropdown(false);
        setShowPerPageDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let filtered = propProducts;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name?.toLowerCase().includes(query) ||
        p.sku?.toLowerCase().includes(query) ||
        p.category?.toLowerCase().includes(query)
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (brandFilter !== 'all') {
      filtered = filtered.filter(p => p.brand === brandFilter);
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(p => p.status === statusFilter);
    }

    return filtered;
  }, [propProducts, searchQuery, categoryFilter, brandFilter, statusFilter]);

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * productsPerPage;
    return filteredProducts.slice(start, start + productsPerPage);
  }, [filteredProducts, currentPage, productsPerPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, categoryFilter, brandFilter, statusFilter]);

  // Selection handlers
  const handleSelectAll = useCallback(() => {
    if (selectedIds.length === paginatedProducts.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(paginatedProducts.map(p => p.id));
    }
  }, [selectedIds, paginatedProducts]);

  const handleSelectProduct = useCallback((id: number) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  }, []);

  const handlePrintMultiple = useCallback(() => {
    if (selectedIds.length === 0) {
      toast.error('Select products to print');
      return;
    }
    toast.success(`Printing ${selectedIds.length} products`);
  }, [selectedIds]);

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('...');
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i);
      }
      if (currentPage < totalPages - 2) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  const uniqueCategories = useMemo(() => {
    const cats = new Set(propProducts.map(p => p.category).filter(Boolean));
    return Array.from(cats);
  }, [propProducts]);

  const uniqueBrands = useMemo(() => {
    const brds = new Set(propProducts.map(p => p.brand).filter(Boolean));
    return Array.from(brds);
  }, [propProducts]);

  return (
    <div className="bg-white rounded-2xl mx-2 sm:mx-4 md:mx-6 p-4 sm:p-6 shadow-sm font-['Poppins']">
      {/* Header Row */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
        <h1 className="text-[22px] font-bold text-[#023337] tracking-[0.11px] font-['Lato']">Products</h1>
        
        <div className="flex flex-wrap items-center gap-4 lg:gap-6">
          {/* Search Bar */}
          <div className="bg-[#f9f9f9] h-[34px] rounded-lg flex items-center px-2 w-[292px]">
            <SearchIcon />
            <input
              type="text"
              placeholder="Search products/SKU"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[12px] text-[#7b7b7b] ml-2 flex-1 outline-none"
            />
          </div>

          {/* Deep Search */}
          <button className="bg-[#f9f9f9] h-[34px] rounded-lg flex items-center gap-2 px-4">
            <SortIcon />
            <span className="text-[12px] text-black">Deep Search</span>
          </button>

          {/* View Mode */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setShowViewDropdown(!showViewDropdown)}
              className="border border-[#ff6a00] h-[48px] rounded-lg flex items-center justify-between px-3 min-w-[140px]"
            >
              <div className="flex flex-col gap-0.5 items-start overflow-hidden">
                <span className="text-[11px] font-medium text-[#070707] tracking-[-0.24px]">View</span>
                <div className="flex items-center gap-1">
                  <ExpandIcon />
                  <span className="text-[13px] text-[#070707] tracking-[-0.3px] truncate">
                    {viewMode === 'large' ? 'Large icons' : viewMode === 'small' ? 'Small icons' : 'List view'}
                  </span>
                </div>
              </div>
              <ChevronDown size={14} className="text-gray-600 flex-shrink-0 ml-1" />
            </button>
            {showViewDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 py-1 w-[155px]">
                <button
                  onClick={() => { setViewMode('large'); setShowViewDropdown(false); }}
                  className={`w-full px-3 py-2 text-left text-[13px] hover:bg-gray-50 flex items-center gap-2 ${viewMode === 'large' ? 'bg-orange-50 text-[#ff6a00]' : ''}`}
                >
                  <ExpandIcon />
                  Large icons
                </button>
                <button
                  onClick={() => { setViewMode('small'); setShowViewDropdown(false); }}
                  className={`w-full px-3 py-2 text-left text-[13px] hover:bg-gray-50 flex items-center gap-2 ${viewMode === 'small' ? 'bg-orange-50 text-[#ff6a00]' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                  Small icons
                </button>
                <button
                  onClick={() => { setViewMode('list'); setShowViewDropdown(false); }}
                  className={`w-full px-3 py-2 text-left text-[13px] hover:bg-gray-50 flex items-center gap-2 ${viewMode === 'list' ? 'bg-orange-50 text-[#ff6a00]' : ''}`}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                  </svg>
                  List view
                </button>
              </div>
            )}
          </div>

          {/* Add Product */}
          <button
            onClick={onAddProduct}
            className="bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] h-[48px] rounded-lg flex items-center gap-1 px-4 w-[142px]"
          >
            <AddSquareIcon />
            <span className="text-[15px] font-bold text-white tracking-[-0.3px] font-['Lato']">Add Product</span>
          </button>
        </div>
      </div>

      {/* Second Row: Import/Export & Filters */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-5">
        <div className="flex items-center gap-4">
          {/* Import */}
          <button className="flex items-center gap-1 text-[12px] text-[#161719]">
            {/* <Download size={20} className="text-[#161719]" /> */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M14.1667 17.5C13.6611 17.0085 11.6667 15.7002 11.6667 15C11.6667 14.2997 13.6611 12.9915 14.1667 12.5M12.5001 15H18.3334" stroke="#FF5500" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M10.0001 17.5C6.07171 17.5 4.10752 17.5 2.88714 16.2796C1.66675 15.0592 1.66675 13.095 1.66675 9.16667V6.62023C1.66675 5.1065 1.66675 4.34963 1.98368 3.78172C2.2096 3.37689 2.54364 3.04285 2.94846 2.81693C3.51638 2.5 4.27325 2.5 5.78697 2.5C6.75676 2.5 7.24166 2.5 7.66613 2.65917C8.63525 3.0226 9.03491 3.90298 9.47225 4.77761L10.0001 5.83333M6.66675 5.83333H13.9584C15.714 5.83333 16.5917 5.83333 17.2223 6.25466C17.4953 6.43706 17.7297 6.67143 17.9121 6.94441C18.3164 7.54952 18.3327 8.38233 18.3334 10V11.6667" stroke="#FF5500" strokeWidth="1.25" strokeLinecap="round"/>
                </svg>

            Import
          </button>

          {/* Export */}
          <button className="flex items-center gap-1 text-[12px] text-[#161719]">
            {/* <Upload size={20} className="text-[#161719]" /> */}
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15.8334 17.5C16.3391 17.0085 18.3334 15.7002 18.3334 15C18.3334 14.2997 16.3391 12.9915 15.8334 12.5M17.5001 15H11.6667" stroke="#FF5500" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10.0001 17.5C6.07171 17.5 4.10752 17.5 2.88714 16.2796C1.66675 15.0592 1.66675 13.095 1.66675 9.16667V6.62023C1.66675 5.1065 1.66675 4.34963 1.98368 3.78172C2.2096 3.37689 2.54364 3.04285 2.94846 2.81693C3.51638 2.5 4.27325 2.5 5.78697 2.5C6.75676 2.5 7.24166 2.5 7.66613 2.65917C8.63525 3.0226 9.03491 3.90298 9.47225 4.77761L10.0001 5.83333M6.66675 5.83333H13.9584C15.714 5.83333 16.5917 5.83333 17.2223 6.25466C17.4953 6.43706 17.7297 6.67143 17.9121 6.94441C18.3164 7.54952 18.3327 8.38233 18.3334 10V10.8333" stroke="#FF5500" strokeWidth="1.25" strokeLinecap="round"/>
            </svg>

            Export
          </button>

          {/* Products Per Page */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setShowPerPageDropdown(!showPerPageDropdown)}
              className="bg-[#f9f9f9] rounded-lg flex items-center justify-between gap-2 px-3 py-2 w-[119px]"
            >
              <span className="text-[12px] text-black">{productsPerPage} Products</span>
              <ChevronDown size={14} className="text-gray-600" />
            </button>
            {showPerPageDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 py-1 w-full">
                {[10, 20, 50, 100].map(num => (
                  <button
                    key={num}
                    onClick={() => { setProductsPerPage(num); setShowPerPageDropdown(false); }}
                    className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50"
                  >
                    {num} Products
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Filter Label */}
          <div className="flex items-center gap-2">
            <SortIcon />
            <span className="text-[12px] text-black">Filter:</span>
          </div>

          {/* Category Filter */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="bg-[#f9f9f9] rounded-lg flex items-center justify-between gap-2 px-3 py-2 w-[119px]"
            >
              <span className="text-[12px] text-black truncate">
                {categoryFilter === 'all' ? 'All Category' : categoryFilter}
              </span>
              <ChevronDown size={14} className="text-gray-600 flex-shrink-0" />
            </button>
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 py-1 w-[150px] max-h-[200px] overflow-y-auto">
                <button
                  onClick={() => { setCategoryFilter('all'); setShowCategoryDropdown(false); }}
                  className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50"
                >
                  All Category
                </button>
                {uniqueCategories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategoryFilter(cat!); setShowCategoryDropdown(false); }}
                    className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50 truncate"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Brand Filter */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setShowBrandDropdown(!showBrandDropdown)}
              className="bg-[#f9f9f9] rounded-lg flex items-center justify-between gap-2 px-3 py-2"
            >
              <span className="text-[12px] text-black truncate">
                {brandFilter === 'all' ? 'All Brands' : brandFilter}
              </span>
              <ChevronDown size={14} className="text-gray-600 flex-shrink-0" />
            </button>
            {showBrandDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 py-1 w-[150px] max-h-[200px] overflow-y-auto">
                <button
                  onClick={() => { setBrandFilter('all'); setShowBrandDropdown(false); }}
                  className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50"
                >
                  All Brands
                </button>
                {uniqueBrands.map(brand => (
                  <button
                    key={brand}
                    onClick={() => { setBrandFilter(brand!); setShowBrandDropdown(false); }}
                    className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50 truncate"
                  >
                    {brand}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className="relative" data-dropdown>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="bg-[#f9f9f9] rounded-lg flex items-center justify-between gap-2 px-3 py-2"
            >
              <span className="text-[12px] text-black">
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </span>
              <ChevronDown size={14} className="text-gray-600" />
            </button>
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-lg border z-50 py-1 w-[120px]">
                <button
                  onClick={() => { setStatusFilter('all'); setShowStatusDropdown(false); }}
                  className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50"
                >
                  All Status
                </button>
                <button
                  onClick={() => { setStatusFilter('Active'); setShowStatusDropdown(false); }}
                  className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50"
                >
                  Publish
                </button>
                <button
                  onClick={() => { setStatusFilter('Draft'); setShowStatusDropdown(false); }}
                  className="w-full px-3 py-2 text-left text-[12px] hover:bg-gray-50"
                >
                  Draft
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Grid View - Large Icons */}
      {viewMode === 'large' && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {paginatedProducts.length > 0 ? paginatedProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow relative group">
              {/* Checkbox */}
              <div className="absolute top-3 left-3 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  className="w-5 h-5 rounded border-gray-300"
                />
              </div>
              {/* Actions Dropdown */}
              <div className="absolute top-3 right-3 z-10" data-dropdown>
                <button
                  onClick={() => setOpenDropdownId(openDropdownId === product.id ? null : product.id)}
                  className="p-1.5 bg-white/80 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <DotsIcon />
                </button>
                {openDropdownId === product.id && (
                  <div className="absolute right-0 top-full mt-1 z-50">
                    <div className="w-[140px] bg-white rounded-lg shadow-xl border overflow-hidden py-1">
                      <button
                        onClick={() => { onEditProduct?.(product); setOpenDropdownId(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => { onCloneProduct?.(product); setOpenDropdownId(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <Copy size={14} /> Duplicate
                      </button>
                      <button
                        onClick={() => { window.open(`/product/${product.slug || product.id}`, '_blank'); setOpenDropdownId(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-sm text-gray-700"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => { onDeleteProduct?.(product.id); setOpenDropdownId(null); }}
                        className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-50 text-sm text-red-600"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
              {/* Image */}
              <div className="w-full aspect-square rounded-lg overflow-hidden bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] mb-3">
                {product.image ? (
                  <img
                    src={normalizeImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-sm">
                    No Image
                  </div>
                )}
              </div>
              {/* Info */}
              <h3 className="text-[14px] font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
              <p className="text-[13px] text-gray-500 mb-2">{product.category || 'Uncategorized'}</p>
              <div className="flex items-center justify-between">
                <span className="text-[15px] font-bold text-[#1e90ff]">৳{product.price}</span>
                <span className={`px-2 py-0.5 rounded-full text-[11px] font-medium ${
                  product.status === 'Active' 
                    ? 'bg-[#c1ffbc] text-[#085e00]' 
                    : 'bg-orange-100 text-orange-700'
                }`}>
                  {product.status === 'Active' ? 'Publish' : 'Draft'}
                </span>
              </div>
              {product.sku && <p className="text-[11px] text-gray-400 mt-2">SKU: {product.sku}</p>}
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="font-medium">No products found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid View - Small Icons */}
      {viewMode === 'small' && (
        <div className="grid grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
          {paginatedProducts.length > 0 ? paginatedProducts.map((product, idx) => (
            <div key={`${product.id}-${idx}`} className="bg-white border border-gray-200 rounded-lg p-2 hover:shadow-md transition-shadow relative group">
              {/* Checkbox */}
              <div className="absolute top-1 left-1 z-10">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(product.id)}
                  onChange={() => handleSelectProduct(product.id)}
                  className="w-4 h-4 rounded border-gray-300"
                />
              </div>
              {/* Image */}
              <div 
                className="w-full aspect-square rounded overflow-hidden bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] mb-2 cursor-pointer"
                onClick={() => onEditProduct?.(product)}
              >
                {product.image ? (
                  <img
                    src={normalizeImageUrl(product.image)}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-xs">
                    No Img
                  </div>
                )}
              </div>
              {/* Info */}
              <h3 className="text-[11px] font-medium text-gray-900 line-clamp-1">{product.name}</h3>
              <div className="flex items-center justify-between mt-1">
                <span className="text-[12px] font-bold text-[#1e90ff]">৳{product.price}</span>
                <span className={`w-2 h-2 rounded-full ${
                  product.status === 'Active' ? 'bg-green-500' : 'bg-orange-400'
                }`} title={product.status === 'Active' ? 'Published' : 'Draft'} />
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                  <Search size={24} className="text-gray-400" />
                </div>
                <p className="font-medium">No products found</p>
                <p className="text-sm">Try adjusting your search or filters</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List View - Table */}
      {viewMode === 'list' && (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-[#38bdf8] to-[#1e90ff]">
            <tr>
              <th className="px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0}
                  onChange={handleSelectAll}
                  className="w-5 h-5 rounded border-[1.5px] border-[#050605] bg-white"
                />
              </th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">SL</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">Image</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">Name</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">Category</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">Sub Category</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">Priority</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">SKU</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">Tags</th>
              <th className="px-4 py-3 text-left font-medium text-black text-[16px]">Status</th>
              <th className="px-4 py-3 text-center font-medium text-black text-[16px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#b9b9b9]/50">
            {paginatedProducts.length > 0 ? paginatedProducts.map((product, index) => (
              <tr key={`${product.id}-${index}`} className="h-[68px] hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(product.id)}
                    onChange={() => handleSelectProduct(product.id)}
                    className="w-5 h-5 rounded border-[1.5px] border-[#eaf8e7] bg-white"
                  />
                </td>
                <td className="px-4 py-3 text-[12px] text-[#1d1a1a] text-center">
                  {(currentPage - 1) * productsPerPage + index + 1}
                </td>
                <td className="px-4 py-3">
                  <div className="w-10 h-10 rounded-lg overflow-hidden bg-gradient-to-r from-[#38bdf8] to-[#1e90ff]">
                    {product.image ? (
                      <img
                        src={normalizeImageUrl(product.image)}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-xs">
                        No img
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <p className="text-[12px] text-[#1d1a1a] max-w-[200px] line-clamp-2">
                    {product.name}
                  </p>
                </td>
                <td className="px-4 py-3 text-[12px] text-[#1d1a1a]">
                  {product.category || '-'}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#1d1a1a]">
                  {product.subCategory || '-'}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#1d1a1a]">
                  {product.rating ? `${Math.round(product.rating * 10)}%` : '-'}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#1d1a1a]">
                  {product.sku || '-'}
                </td>
                <td className="px-4 py-3 text-[12px] text-[#1d1a1a]">
                  {product.tag || (Array.isArray(product.tags) ? product.tags.join(', ') : '') || '-'}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-[9px] py-0.5 rounded-[30px] text-[12px] font-medium ${
                    product.status === 'Active' 
                      ? 'bg-[#c1ffbc] text-[#085e00]' 
                      : 'bg-orange-100 text-orange-700'
                  }`}>
                    {product.status === 'Active' ? 'Publish' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-center relative">
                  <div data-dropdown>
                    <button
                      onClick={() => setOpenDropdownId(openDropdownId === product.id ? null : product.id)}
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <DotsIcon />
                    </button>
                    {openDropdownId === product.id && (
                      <div className="absolute right-0 top-full mt-1 z-50">
                        <div className="w-[160px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden py-2">
                          <button
                            onClick={() => { onEditProduct?.(product); setOpenDropdownId(null); }}
                            className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700"
                          >
                            <Edit size={16} />
                            Edit
                          </button>
                          <button
                            onClick={() => { onCloneProduct?.(product); setOpenDropdownId(null); }}
                            className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700"
                          >
                            <Copy size={16} />
                            Duplicate
                          </button>
                          <button
                            onClick={() => { window.open(`/product/${product.slug || product.id}`, '_blank'); setOpenDropdownId(null); }}
                            className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700"
                          >
                            <Eye size={16} />
                            View
                          </button>
                          <div className="my-1 border-t border-gray-100" />
                          <button
                            onClick={() => { onDeleteProduct?.(product.id); setOpenDropdownId(null); }}
                            className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-red-600"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={11} className="px-4 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                      <Search size={24} className="text-gray-400" />
                    </div>
                    <p className="font-medium">No products found</p>
                    <p className="text-sm">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      )}

      {/* Footer: Print & Pagination */}
      {filteredProducts.length > 0 && (
        <div className="flex flex-col items-center mt-6 pt-4 gap-4">
          {/* Pagination - Centered */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 flex items-center justify-center border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={16} />
            </button>

            {getPageNumbers().map((page, idx) => (
              <button
                key={idx}
                onClick={() => typeof page === 'number' && setCurrentPage(page)}
                disabled={page === '...'}
                className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-[#38bdf8] text-white'
                    : page === '...'
                    ? 'cursor-default'
                    : 'border hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 flex items-center justify-center border rounded-lg disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FigmaProductList;
