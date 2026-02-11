import React, { useState, useEffect, useMemo } from 'react';
import { ActivityLogSkeleton } from '../components/SkeletonLoaders';
import {
  Activity,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Edit,
  Filter,
  Package,
  Plus,
  RefreshCw,
  Search,
  ShoppingCart,
  Trash2,
  Upload,
  User,
  X,
  Download,
  Settings,
  Image,
  FileText,
  Bell,
  MessageSquare,
  Database,
  LogIn,
  LogOut,
  Boxes,
  ArrowRight,
  TrendingUp,
  TrendingDown,
  MoreVertical,
  FilterX,
} from 'lucide-react';

// Figma-based inline styles
const figmaStyles = {
  container: {
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
    position: 'relative' as const,
  },
  mainContent: {
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
    padding: '20px',
    overflow: 'hidden',
  },
  headerRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap' as const,
    gap: '16px',
  },
  title: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: '22px',
    color: '#023337',
    letterSpacing: '0.11px',
    margin: 0,
  },
  filtersRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    flexWrap: 'wrap' as const,
  },
  dateRangeGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  filterButton: {
    backgroundColor: '#f9f9f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px 7px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    gap: '8px',
  },
  filterButtonText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    color: '#000000',
  },
  filterToText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    color: '#000000',
  },
  clearFilterButton: {
    backgroundColor: '#ffffff',
    border: '1px solid #ff6a00',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    padding: '6px 16px 6px 12px',
    borderRadius: '8px',
    height: '48px',
    cursor: 'pointer',
  },
  clearFilterText: {
    fontFamily: "'Lato', sans-serif",
    fontWeight: 700,
    fontSize: '15px',
    background: 'linear-gradient(180deg, #ff6a00 0%, #ff9f1c 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '-0.3px',
  },
  tableHeader: {
    height: '48px',
    background: 'linear-gradient(180deg, #e0f7fa 0%, #b2ebf2 100%)',
    display: 'grid',
    gridTemplateColumns: '60px 150px 150px 1fr 120px 160px 40px',
    alignItems: 'center',
    padding: '0 20px',
  },
  tableHeaderText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: '16px',
    color: '#000000',
  },
  tableRow: {
    height: '68px',
    borderBottom: '0.5px solid #b9b9b9',
    display: 'grid',
    gridTemplateColumns: '60px 150px 150px 1fr 120px 160px 40px',
    alignItems: 'center',
    padding: '0 20px',
  },
  cellText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    color: '#1d1a1a',
  },
  entityTitle: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 500,
    fontSize: '16px',
    color: '#1d1a1a',
  },
  entitySubtitle: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 400,
    fontSize: '12px',
    color: '#6a717f',
  },
  actionBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  actionIcon: {
    width: '16px',
    height: '16px',
    borderRadius: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkBadge: {
    backgroundColor: '#ded8ff',
    borderRadius: '28px',
    padding: '0 8px',
    height: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bulkText: {
    fontFamily: "'Poppins', sans-serif",
    fontWeight: 300,
    fontSize: '12px',
    color: '#2300e8',
  },
  pagination: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '20px',
  },
  pageButton: {
    width: '32px',
    height: '32px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    color: '#1d1a1a',
  },
  pageButtonActive: {
    backgroundColor: '#38bdf8',
    border: 'none',
    color: '#ffffff',
  },
  navButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '14px',
    color: '#1d1a1a',
  },
  dropdown: {
    position: 'absolute' as const,
    top: '100%',
    left: 0,
    marginTop: '4px',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    zIndex: 50,
    minWidth: '150px',
    overflow: 'hidden',
  },
  dropdownItem: {
    padding: '10px 16px',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '12px',
    color: '#1d1a1a',
    cursor: 'pointer',
    border: 'none',
    width: '100%',
    textAlign: 'left' as const,
    backgroundColor: 'transparent',
  },
  dotsIcon: {
    width: '24px',
    height: '24px',
    cursor: 'pointer',
    color: '#6a717f',
  },
};
const API_BASE_URL = typeof import.meta !== 'undefined' && import.meta.env?.VITE_API_BASE_URL
  ? String(import.meta.env.VITE_API_BASE_URL)
  : '';

// Helper function to safely get token from localStorage (client-side only)
const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  try {
    return localStorage.getItem('admin_auth_token');
  } catch {
    return null;
  }
};

interface AuditLog {
  _id: string;
  tenantId?: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  actionType: 'create' | 'update' | 'delete' | 'bulk_create' | 'bulk_update' | 'bulk_delete' | 'login' | 'logout' | 'export' | 'import' | 'other';
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  details: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  status: 'success' | 'failure' | 'warning';
  createdAt: string;
  updatedAt: string;
}


interface AdminActivityLogProps {
  tenantId?: string;
}

const AdminActivityLog: React.FC<AdminActivityLogProps> = ({ tenantId }) => {
  const [token, setToken] = useState<string | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [expandedLogId, setExpandedLogId] = useState<string | null>(null);
  
  // Get token on client side only
  useEffect(() => {
    const storedToken = getStoredToken();
    setToken(storedToken);
  }, []);
  
  // Filters
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [resourceTypeFilter, setResourceTypeFilter] = useState<string>('all');
  const [actionTypeFilter, setActionTypeFilter] = useState<string>('all');
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  
  // Dropdown states
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showActionDropdown, setShowActionDropdown] = useState(false);
  const [showItemsDropdown, setShowItemsDropdown] = useState(false);

  const resourceTypes = [
    { value: 'all', label: 'All Type' },
    { value: 'product', label: 'Product' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'order', label: 'Order' },
    { value: 'category', label: 'Category' },
    { value: 'user', label: 'User' },
    { value: 'gallery', label: 'Gallery' },
    { value: 'carousel', label: 'Carousel' },
    { value: 'popup', label: 'Popup' },
    { value: 'campaign', label: 'Campaign' },
    { value: 'expense', label: 'Expense' },
    { value: 'income', label: 'Income' },
    { value: 'due', label: 'Due' },
    { value: 'review', label: 'Review' },
    { value: 'settings', label: 'Settings' },
    { value: 'other', label: 'Other' },
  ];

  const actionTypes = [
    { value: 'all', label: 'All Actions' },
    { value: 'create', label: 'Create' },
    { value: 'update', label: 'Update' },
    { value: 'delete', label: 'Delete' },
    { value: 'bulk_create', label: 'Bulk Create' },
    { value: 'bulk_update', label: 'Bulk Update' },
    { value: 'bulk_delete', label: 'Bulk Delete' },
    { value: 'login', label: 'Login' },
    { value: 'logout', label: 'Logout' },
    { value: 'export', label: 'Export' },
    { value: 'import', label: 'Import' },
    { value: 'other', label: 'Other' },
  ];

  const itemsPerPageOptions = [5, 10, 20, 50, 100];

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', itemsPerPage.toString());
      if (tenantId) params.append('tenantId', tenantId);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (resourceTypeFilter !== 'all') params.append('resourceType', resourceTypeFilter);
      if (actionTypeFilter !== 'all') params.append('actionType', actionTypeFilter);

      const response = await fetch(`${API_BASE_URL}/api/audit-logs?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setLogs(data.data || []);
        const paginationData = data.pagination || { page: 1, limit: 10, total: 0, pages: 0 };
        setTotalPages(paginationData.pages);
        setTotalItems(paginationData.total);
      } else {
        console.error('Failed to fetch activity logs');
        setLogs([]);
      }
    } catch (error) {
      console.error('Error fetching activity logs:', error);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchLogs();
    }
  }, [currentPage, itemsPerPage, startDate, endDate, resourceTypeFilter, actionTypeFilter, token, tenantId]);

  const clearFilters = () => {
    setStartDate('');
    setEndDate('');
    setResourceTypeFilter('all');
    setActionTypeFilter('all');
    setItemsPerPage(10);
    setCurrentPage(1);
  };

  const getActionIcon = (actionType: string, resourceType: string) => {
    const iconStyle = { width: '12px', height: '12px' };
    
    // Special icon for inventory
    if (resourceType === 'inventory') {
      return <Edit style={{ ...iconStyle, color: '#ff6a00' }} />;
    }
    
    switch (actionType) {
      case 'create':
      case 'bulk_create':
        return <Plus style={{ ...iconStyle, color: '#22c55e' }} />;
      case 'update':
      case 'bulk_update':
        return <Edit style={{ ...iconStyle, color: '#6366f1' }} />;
      case 'delete':
      case 'bulk_delete':
        return <Trash2 style={{ ...iconStyle, color: '#ef4444' }} />;
      case 'login':
        return <LogIn style={{ ...iconStyle, color: '#a855f7' }} />;
      case 'logout':
        return <LogOut style={{ ...iconStyle, color: '#ff6a00' }} />;
      case 'export':
        return <Download style={{ ...iconStyle, color: '#06b6d4' }} />;
      case 'import':
        return <Upload style={{ ...iconStyle, color: '#6366f1' }} />;
      default:
        return <Activity style={{ ...iconStyle, color: '#6b7280' }} />;
    }
  };

  // Get icon background color based on Figma design
  const getActionIconBg = (actionType: string, resourceType: string): string => {
    if (resourceType === 'inventory') {
      return '#ffefd8'; // Orange background for inventory
    }
    if (resourceType === 'admin' || resourceType === 'user') {
      return '#d8ffe8'; // Green background for admin/user
    }
    if (resourceType === 'order') {
      if (actionType === 'delete' || actionType === 'bulk_delete') {
        return '#ffd8d8'; // Red background for delete
      }
      return '#d8f0ff'; // Light blue for order status
    }
    switch (actionType) {
      case 'create':
      case 'bulk_create':
        return '#d8ffe8'; // Green
      case 'update':
      case 'bulk_update':
        return '#ded8ff'; // Purple
      case 'delete':
      case 'bulk_delete':
        return '#ffd8d8'; // Red
      case 'login':
      case 'logout':
        return '#ded8ff'; // Purple
      default:
        return '#ded8ff'; // Default purple
    }
  };

  // Format action label for display
  const formatActionLabel = (actionType: string, resourceType: string): string => {
    const resource = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
    const action = actionType.replace('bulk_', '');
    return `${resource}_${action}`;
  };

  const getResourceIcon = (resourceType: string) => {
    const iconClass = "w-4 h-4 text-gray-400";
    
    switch (resourceType) {
      case 'product':
        return <Package className={iconClass} />;
      case 'inventory':
        return <Boxes className="w-4 h-4 text-emerald-500" />;
      case 'order':
        return <ShoppingCart className={iconClass} />;
      case 'user':
        return <User className={iconClass} />;
      case 'category':
        return <Database className={iconClass} />;
      case 'gallery':
        return <Image className={iconClass} />;
      case 'settings':
        return <Settings className={iconClass} />;
      case 'notification':
        return <Bell className={iconClass} />;
      case 'support_ticket':
        return <MessageSquare className={iconClass} />;
      default:
        return <FileText className={iconClass} />;
    }
  };

  const formatActionType = (actionType: string) => {
    return actionType.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const getActionBadgeColor = (actionType: string, resourceType?: string) => {
    // Special badge for inventory
    if (resourceType === 'inventory') {
      return 'bg-emerald-100 text-emerald-700';
    }
    
    switch (actionType) {
      case 'create':
        return 'bg-green-100 text-green-700';
      case 'update':
        return 'bg-blue-100 text-blue-700';
      case 'delete':
        return 'bg-red-100 text-red-700';
      case 'bulk_create':
        return 'bg-green-100 text-green-700';
      case 'bulk_update':
        return 'bg-blue-100 text-blue-700';
      case 'bulk_delete':
        return 'bg-red-100 text-red-700';
      case 'login':
        return 'bg-purple-100 text-purple-700';
      case 'logout':
        return 'bg-orange-100 text-orange-700';
      case 'export':
        return 'bg-cyan-100 text-cyan-700';
      case 'import':
        return 'bg-indigo-100 text-indigo-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const isBulkAction = (actionType: string) => {
    return actionType.startsWith('bulk_');
  };

  // Render inventory change details
  const renderInventoryDetails = (log: AuditLog) => {
    const metadata = log.metadata || {};
    const previousStock = metadata.previousStock;
    const newStock = metadata.newStock;
    const productName = metadata.productName || log.resourceName;
    const stockChange = (newStock !== undefined && previousStock !== undefined) 
      ? newStock - previousStock 
      : null;

    if (log.resourceType !== 'inventory' || previousStock === undefined) {
      return <p className="text-sm text-gray-600 truncate">{log.details}</p>;
    }

    return (
      <div className="space-y-1">
        <p className="text-sm text-gray-700 font-medium">{productName}</p>
        <div className="flex items-center gap-2 text-sm">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded font-mono">
            {previousStock}
          </span>
          <ArrowRight className="w-4 h-4 text-gray-400" />
          <span className={`px-2 py-0.5 rounded font-mono ${
            stockChange && stockChange > 0 
              ? 'bg-green-100 text-green-700' 
              : stockChange && stockChange < 0 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-600'
          }`}>
            {newStock}
          </span>
          {stockChange !== null && (
            <span className={`flex items-center gap-1 text-xs font-medium ${
              stockChange > 0 ? 'text-green-600' : stockChange < 0 ? 'text-red-600' : 'text-gray-500'
            }`}>
              {stockChange > 0 ? (
                <>
                  <TrendingUp className="w-3 h-3" />
                  +{stockChange}
                </>
              ) : stockChange < 0 ? (
                <>
                  <TrendingDown className="w-3 h-3" />
                  {stockChange}
                </>
              ) : (
                'No change'
              )}
            </span>
          )}
        </div>
      </div>
    );
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.dropdown-container')) {
        setShowTypeDropdown(false);
        setShowActionDropdown(false);
        setShowItemsDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={figmaStyles.container}>
      {/* Main Content */}
      <div style={figmaStyles.mainContent}>
        {/* Header Row */}
        <div style={figmaStyles.headerRow}>
          <h1 style={figmaStyles.title}>Activity Log</h1>
          
          <div style={figmaStyles.filtersRow}>
            {/* Date Range */}
            <div style={figmaStyles.dateRangeGroup}>
              <div style={{ position: 'relative' }} className="dropdown-container">
                <button
                  style={figmaStyles.filterButton}
                  onClick={() => {}}
                >
                  <span style={figmaStyles.filterButtonText}>
                    {startDate || '01-01-2025'}
                  </span>
                  <ChevronDown style={{ width: '10px', height: '10px', transform: 'rotate(0deg)', color: '#000' }} />
                </button>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
              </div>
              <span style={figmaStyles.filterToText}>To</span>
              <div style={{ position: 'relative' }} className="dropdown-container">
                <button
                  style={figmaStyles.filterButton}
                  onClick={() => {}}
                >
                  <span style={figmaStyles.filterButtonText}>
                    {endDate || '01-01-2026'}
                  </span>
                  <ChevronDown style={{ width: '10px', height: '10px', transform: 'rotate(0deg)', color: '#000' }} />
                </button>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  style={{ position: 'absolute', opacity: 0, top: 0, left: 0, width: '100%', height: '100%', cursor: 'pointer' }}
                />
              </div>
            </div>

            {/* Type Dropdown */}
            <div style={{ position: 'relative' }} className="dropdown-container">
              <button
                style={figmaStyles.filterButton}
                onClick={() => {
                  setShowTypeDropdown(!showTypeDropdown);
                  setShowActionDropdown(false);
                  setShowItemsDropdown(false);
                }}
              >
                <span style={figmaStyles.filterButtonText}>
                  {resourceTypes.find(t => t.value === resourceTypeFilter)?.label || 'All Type'}
                </span>
                <ChevronDown style={{ width: '10px', height: '10px', transform: showTypeDropdown ? 'rotate(180deg)' : 'rotate(0deg)', color: '#000', transition: 'transform 0.2s' }} />
              </button>
              {showTypeDropdown && (
                <div style={figmaStyles.dropdown}>
                  {resourceTypes.map(type => (
                    <button
                      key={type.value}
                      onClick={() => {
                        setResourceTypeFilter(type.value);
                        setShowTypeDropdown(false);
                        setCurrentPage(1);
                      }}
                      style={{
                        ...figmaStyles.dropdownItem,
                        backgroundColor: resourceTypeFilter === type.value ? '#e0f7fa' : 'transparent',
                      }}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Action Dropdown */}
            <div style={{ position: 'relative' }} className="dropdown-container">
              <button
                style={figmaStyles.filterButton}
                onClick={() => {
                  setShowActionDropdown(!showActionDropdown);
                  setShowTypeDropdown(false);
                  setShowItemsDropdown(false);
                }}
              >
                <span style={figmaStyles.filterButtonText}>
                  {actionTypes.find(a => a.value === actionTypeFilter)?.label || 'All Actions'}
                </span>
                <ChevronDown style={{ width: '10px', height: '10px', transform: showActionDropdown ? 'rotate(180deg)' : 'rotate(0deg)', color: '#000', transition: 'transform 0.2s' }} />
              </button>
              {showActionDropdown && (
                <div style={figmaStyles.dropdown}>
                  {actionTypes.map(action => (
                    <button
                      key={action.value}
                      onClick={() => {
                        setActionTypeFilter(action.value);
                        setShowActionDropdown(false);
                        setCurrentPage(1);
                      }}
                      style={{
                        ...figmaStyles.dropdownItem,
                        backgroundColor: actionTypeFilter === action.value ? '#e0f7fa' : 'transparent',
                      }}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* By Admin Dropdown (items per page) */}
            <div style={{ position: 'relative' }} className="dropdown-container">
              <button
                style={figmaStyles.filterButton}
                onClick={() => {
                  setShowItemsDropdown(!showItemsDropdown);
                  setShowTypeDropdown(false);
                  setShowActionDropdown(false);
                }}
              >
                <span style={figmaStyles.filterButtonText}>By Admin</span>
                <ChevronDown style={{ width: '10px', height: '10px', transform: showItemsDropdown ? 'rotate(180deg)' : 'rotate(0deg)', color: '#000', transition: 'transform 0.2s' }} />
              </button>
              {showItemsDropdown && (
                <div style={figmaStyles.dropdown}>
                  {itemsPerPageOptions.map(option => (
                    <button
                      key={option}
                      onClick={() => {
                        setItemsPerPage(option);
                        setShowItemsDropdown(false);
                        setCurrentPage(1);
                      }}
                      style={{
                        ...figmaStyles.dropdownItem,
                        backgroundColor: itemsPerPage === option ? '#e0f7fa' : 'transparent',
                      }}
                    >
                      {option} Items
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Clear Filter Button */}
            <button
              style={figmaStyles.clearFilterButton}
              onClick={clearFilters}
            >
              <FilterX style={{ width: '24px', height: '24px', color: '#ff6a00' }} />
              <span style={figmaStyles.clearFilterText}>Clear filter</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ backgroundColor: '#ffffff', overflow: 'hidden' }}>
          {loading ? (
            <ActivityLogSkeleton />
          ) : logs.length === 0 ? (
            <div style={{ padding: '48px', textAlign: 'center' }}>
              <Activity style={{ width: '48px', height: '48px', color: '#d1d5db', margin: '0 auto 12px' }} />
              <h3 style={{ ...figmaStyles.entityTitle, marginBottom: '4px' }}>No Activity Logs Found</h3>
              <p style={figmaStyles.entitySubtitle}>No logs match your current filters</p>
            </div>
          ) : (
            <>
              {/* Table Header */}
              <div style={figmaStyles.tableHeader}>
                <span style={figmaStyles.tableHeaderText}>SL</span>
                <span style={figmaStyles.tableHeaderText}>Action</span>
                <span style={figmaStyles.tableHeaderText}>Entity</span>
                <span style={figmaStyles.tableHeaderText}>Description</span>
                <span style={figmaStyles.tableHeaderText}>Name</span>
                <span style={figmaStyles.tableHeaderText}>Date & Time</span>
                <span></span>
              </div>

              {/* Table Rows */}
              {logs.map((log, index) => (
                <div key={log._id} style={figmaStyles.tableRow}>
                  {/* SL */}
                  <span style={figmaStyles.cellText}>
                    {(currentPage - 1) * itemsPerPage + index + 1}
                  </span>

                  {/* Action */}
                  <div style={figmaStyles.actionBadge}>
                    <div style={{
                      ...figmaStyles.actionIcon,
                      backgroundColor: getActionIconBg(log.actionType, log.resourceType),
                    }}>
                      {getActionIcon(log.actionType, log.resourceType)}
                    </div>
                    <span style={figmaStyles.cellText}>
                      {formatActionLabel(log.actionType, log.resourceType)}
                    </span>
                  </div>

                  {/* Entity */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ ...figmaStyles.entityTitle, fontSize: '16px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '120px' }}>
                      {log.resourceName || `${log.resourceType.charAt(0).toUpperCase() + log.resourceType.slice(1)} ${log.resourceId?.slice(-4) || ''}`}
                    </span>
                    <span style={figmaStyles.entitySubtitle}>
                      {log.resourceType.charAt(0).toUpperCase() + log.resourceType.slice(1)}
                    </span>
                  </div>

                  {/* Description */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span style={figmaStyles.cellText}>{log.details}</span>
                    {isBulkAction(log.actionType) && (
                      <div style={figmaStyles.bulkBadge}>
                        <span style={figmaStyles.bulkText}>Bulk</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <span style={figmaStyles.cellText}>{log.userName}</span>

                  {/* Date & Time */}
                  <span style={figmaStyles.cellText}>{formatDateTime(log.createdAt)}</span>

                  {/* Actions Menu */}
                  <MoreVertical style={figmaStyles.dotsIcon} />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={figmaStyles.pagination}>
            <button
              style={figmaStyles.navButton}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft style={{ width: '16px', height: '16px' }} />
              <span>Previous</span>
            </button>

            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    style={{
                      ...figmaStyles.pageButton,
                      ...(currentPage === pageNum ? figmaStyles.pageButtonActive : {}),
                    }}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && currentPage < totalPages - 2 && (
                <>
                  <span style={{ color: '#6b7280' }}>...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    style={figmaStyles.pageButton}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              style={figmaStyles.navButton}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <span>Next</span>
              <ChevronRight style={{ width: '16px', height: '16px' }} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminActivityLog;
