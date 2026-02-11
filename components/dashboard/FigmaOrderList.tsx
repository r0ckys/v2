import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Plus, Search, SlidersHorizontal, MoreVertical, ChevronLeft, ChevronRight, X, Printer, Truck, Package2, Mail, AlertTriangle, CheckCircle2, Send, Loader2, Trash2, ShieldCheck, ShieldAlert, Copy, ZoomIn, Edit3, ArrowLeftCircle } from 'lucide-react';
import { DonutChart } from '../modern-dashboard/OrderSummaryChart';
import { TrendChart } from './order/TrendChart';
import GmvStats from './order/GmvStats';
import { toast } from 'react-hot-toast';
import { Order, CourierConfig, PathaoConfig } from '../../types';
import { CourierService, FraudCheckResult } from '../../services/CourierService';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';
import { printInvoice } from '../InvoicePrintTemplate';

// Status colors for badges
const STATUS_COLORS: Record<Order['status'], string> = {
  Pending: 'text-orange-600 bg-orange-50 border border-orange-200',
  Confirmed: 'text-blue-600 bg-blue-50 border border-blue-200',
  'On Hold': 'text-amber-600 bg-amber-50 border border-amber-200',
  Processing: 'text-cyan-600 bg-cyan-50 border border-cyan-200',
  Shipped: 'text-indigo-600 bg-indigo-50 border border-indigo-200',
  'Sent to Courier': 'text-purple-600 bg-purple-50 border border-purple-200',
  Delivered: 'text-emerald-600 bg-emerald-50 border border-emerald-200',
  Cancelled: 'text-red-600 bg-red-50 border border-red-200',
  Return: 'text-yellow-600 bg-yellow-50 border border-yellow-200',
  Refund: 'text-pink-600 bg-pink-50 border border-pink-200',
  'Returned Receive': 'text-slate-600 bg-slate-50 border border-slate-200'
};

const STATUSES: Order['status'][] = ['Pending', 'Confirmed', 'On Hold', 'Processing', 'Shipped', 'Sent to Courier', 'Delivered', 'Cancelled', 'Return', 'Refund', 'Returned Receive'];

const formatCurrency = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT', maximumFractionDigits: 0 }).format(value);

const getCourierId = (order: Order) => {
  if (order.trackingId) return order.trackingId;
  if (order.courierMeta) {
    return (
      (order.courierMeta.tracking_id as string) ||
      (order.courierMeta.trackingCode as string) ||
      (order.courierMeta.consignment_id as string) ||
      (order.courierMeta.invoice as string)
    );
  }
  return undefined;
};

interface FigmaOrderListProps {
  orders?: Order[];
  courierConfig?: CourierConfig;
  onUpdateOrder?: (orderId: string, updates: Partial<Order>) => void;
  onAddOrder?: () => void;
}

const FigmaOrderList: React.FC<FigmaOrderListProps> = ({
  orders: propOrders = [],
  courierConfig = { apiKey: '', secretKey: '', instruction: '' },
  onUpdateOrder,
  onAddOrder
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [draftOrder, setDraftOrder] = useState<Order | null>(null);
  const [showCourierModal, setShowCourierModal] = useState(false);
  const [courierModalOrderId, setCourierModalOrderId] = useState<string | null>(null);
  const [detailsOrder, setDetailsOrder] = useState<Order | null>(null);
  const [showStatusMenu, setShowStatusMenu] = useState<string | null>(null);

  // Loading states
  const [isSaving, setIsSaving] = useState(false);
  const [isFraudChecking, setIsFraudChecking] = useState(false);
  const [isSendingToSteadfast, setIsSendingToSteadfast] = useState(false);
  const [isSendingToPathao, setIsSendingToPathao] = useState(false);
  const [fraudResult, setFraudResult] = useState<FraudCheckResult | null>(null);
  const [pathaoConfig, setPathaoConfig] = useState<PathaoConfig | null>(null);

  const ordersPerPage = 8;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openDropdownId || showStatusMenu) {
        const target = event.target as HTMLElement;
        if (!target.closest('[data-dropdown]')) {
          setOpenDropdownId(null);
          setShowStatusMenu(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId, showStatusMenu]);

  // Load Pathao config
  useEffect(() => {
    const loadPathaoConfig = async () => {
      try {
        const tenantId = localStorage.getItem('activeTenantId') || '';
        if (!tenantId) return; // Don't call API without tenantId
        const config = await CourierService.loadPathaoConfig(tenantId);
        if (config) setPathaoConfig(config);
      } catch (e) { /* ignore */ }
    };
    loadPathaoConfig();
  }, []);

  const orders = propOrders;

  // Filter orders based on tab
  const filteredOrders = useMemo(() => {
    let filtered = orders;
    
    if (activeTab !== 'all') {
      if (activeTab === 'pending') filtered = filtered.filter(o => o.status === 'Pending');
      else if (activeTab === 'delivered') filtered = filtered.filter(o => o.status === 'Delivered');
      else if (activeTab === 'canceled') filtered = filtered.filter(o => o.status === 'Cancelled');
      else if (activeTab === 'returned') filtered = filtered.filter(o => o.status === 'Return' || o.status === 'Returned Receive');
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(o => 
        o.id?.toLowerCase().includes(query) ||
        o.customer?.toLowerCase().includes(query) ||
        o.phone?.toLowerCase().includes(query) ||
        o.productName?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [orders, activeTab, searchQuery]);

  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (currentPage - 1) * ordersPerPage;
    return filteredOrders.slice(start, start + ordersPerPage);
  }, [filteredOrders, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery]);

  // Order summary calculations
  const orderSummary = useMemo(() => {
    const total = orders.length || 1;
    const pending = orders.filter(o => o.status === 'Pending').length;
    const confirmed = orders.filter(o => o.status === 'Confirmed').length;
    const delivered = orders.filter(o => o.status === 'Delivered').length;
    const canceled = orders.filter(o => o.status === 'Cancelled').length;
    const returned = orders.filter(o => o.status === 'Return' || o.status === 'Returned Receive').length;
    const paidReturned = orders.filter(o => o.status === 'Refund').length;

    return {
      total,
      pending: { count: pending, percent: Math.round((pending / total) * 100) },
      confirmed: { count: confirmed, percent: Math.round((confirmed / total) * 100) },
      delivered: { count: delivered, percent: Math.round((delivered / total) * 100) },
      canceled: { count: canceled, percent: Math.round((canceled / total) * 100) },
      paidReturned: { count: paidReturned, percent: Math.round((paidReturned / total) * 100) },
      returned: { count: returned, percent: Math.round((returned / total) * 100) }
    };
  }, [orders]);

  const tabCounts = useMemo(() => ({
    all: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    canceled: orders.filter(o => o.status === 'Cancelled').length,
    returned: orders.filter(o => o.status === 'Return' || o.status === 'Returned Receive').length
  }), [orders]);

  const tabs = [
    { id: 'all', label: 'All order', count: tabCounts.all },
    { id: 'pending', label: 'Pending', count: tabCounts.pending },
    { id: 'delivered', label: 'Delivered', count: tabCounts.delivered },
    { id: 'canceled', label: 'Canceled', count: tabCounts.canceled },
    { id: 'returned', label: 'Returned', count: tabCounts.returned }
  ];

  // Modal handlers
  const openOrderModal = useCallback((order: Order) => {
    setSelectedOrder(order);
    setDraftOrder({ ...order });
    setFraudResult(null);
    setOpenDropdownId(null);
  }, []);

  const closeOrderModal = useCallback(() => {
    setSelectedOrder(null);
    setDraftOrder(null);
    setIsSaving(false);
    setIsFraudChecking(false);
    setFraudResult(null);
  }, []);

  const handleDraftChange = <K extends keyof Order>(field: K, value: Order[K]) => {
    setDraftOrder((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleSaveOrder = async () => {
    if (!selectedOrder || !draftOrder || !onUpdateOrder) return;
    setIsSaving(true);
    try {
      const { id, ...updates } = draftOrder;
      onUpdateOrder(selectedOrder.id, updates);
      toast.success('Order updated');
      closeOrderModal();
    } catch (error) {
      toast.error('Unable to update order');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFraudCheck = async (order: Order) => {
    if (!courierConfig.apiKey || !courierConfig.secretKey) {
      toast.error('Please configure Steadfast API credentials first.');
      return;
    }
    setIsFraudChecking(true);
    try {
      const result = await CourierService.checkFraudRisk(order, courierConfig);
      setFraudResult(result);
      toast.success('Fraud check completed');
    } catch (error) {
      toast.error('Fraud check failed');
    } finally {
      setIsFraudChecking(false);
    }
  };

  const handleSendToSteadfast = async (order: Order) => {
    if (!courierConfig.apiKey || !courierConfig.secretKey) {
      toast.error('Configure Steadfast API in Courier Settings first.');
      return;
    }
    if (!order.phone) {
      toast.error('Customer phone is required.');
      return;
    }
    if (order.courierProvider === 'Steadfast' && order.trackingId) {
      toast.error('Already sent to Steadfast.');
      return;
    }

    setIsSendingToSteadfast(true);
    try {
      const result = await CourierService.sendToSteadfast(order, courierConfig);
      const updates: Partial<Order> = {
        trackingId: result.trackingId,
        courierProvider: 'Steadfast',
        courierMeta: result.response,
        status: 'Sent to Courier'
      };
      onUpdateOrder?.(order.id, updates);
      setDraftOrder((prev) => prev ? { ...prev, ...updates } : prev);
      toast.success(`Sent to Steadfast! Tracking: ${result.trackingId}`);
    } catch (error) {
      toast.error('Failed to send to Steadfast');
    } finally {
      setIsSendingToSteadfast(false);
    }
  };

  const handleSendToPathao = async (order: Order) => {
    if (!pathaoConfig?.apiKey) {
      toast.error('Configure Pathao API in Courier Settings first.');
      return;
    }
    if (!order.phone) {
      toast.error('Customer phone is required.');
      return;
    }
    if (order.courierProvider === 'Pathao' && order.trackingId) {
      toast.error('Already sent to Pathao.');
      return;
    }

    setIsSendingToPathao(true);
    try {
      const result = await CourierService.sendToPathao(order, pathaoConfig);
      const updates: Partial<Order> = {
        trackingId: result.trackingId,
        courierProvider: 'Pathao',
        courierMeta: result.response,
        status: 'Sent to Courier'
      };
      onUpdateOrder?.(order.id, updates);
      setDraftOrder((prev) => prev ? { ...prev, ...updates } : prev);
      toast.success(`Sent to Pathao! Tracking: ${result.trackingId}`);
    } catch (error) {
      toast.error('Failed to send to Pathao');
    } finally {
      setIsSendingToPathao(false);
    }
  };

  const handlePrintInvoice = (order: Order) => {
    const courierId = getCourierId(order) || '';
    printInvoice({
      order,
      courierProvider: order.courierProvider || '',
      consignmentId: courierId,
      // Shop info can be passed from props or fetched from config
      shopName: 'Your Shop',
      shopWebsite: '',
      shopEmail: '',
      shopPhone: '',
      shopAddress: '',
    });
  };

  const handleDuplicateOrder = (order: Order) => {
    toast.success('Order duplicated (placeholder)');
    setOpenDropdownId(null);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm('Delete this order?')) {
      toast.success('Order deleted');
      setOpenDropdownId(null);
    }
  };

  const handleOpenDetails = (order: Order) => {
    setDetailsOrder(order);
    setOpenDropdownId(null);
  };

  const handleStatusChange = (orderId: string, newStatus: Order['status']) => {
    if (onUpdateOrder) {
      onUpdateOrder(orderId, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
    }
    setShowStatusMenu(null);
    setOpenDropdownId(null);
  };

  const handleAssignCourier = (orderId: string, courierName: string) => {
    if (!onUpdateOrder) return;
    onUpdateOrder(orderId, {
      courierProvider: courierName as Order['courierProvider'],
      status: 'Sent to Courier'
    });
    toast.success(`Courier assigned: ${courierName}`);
    setShowCourierModal(false);
    setCourierModalOrderId(null);
  };

  const getFraudBadge = (result: FraudCheckResult | null) => {
    if (!result) return null;
    const status = (result.status || '').toLowerCase();
    if (['pass', 'safe', 'low'].some(c => status.includes(c))) {
      return { label: result.status, color: 'text-emerald-600', icon: <ShieldCheck size={16} /> };
    }
    if (['review', 'medium', 'warn'].some(c => status.includes(c))) {
      return { label: result.status, color: 'text-amber-600', icon: <AlertTriangle size={16} /> };
    }
    return { label: result.status, color: 'text-rose-600', icon: <ShieldAlert size={16} /> };
  };

  const fraudBadge = getFraudBadge(fraudResult);

  const orderStatusData = [
    { label: "Pending", percentage: orderSummary.pending.percent, color: "#26007e", bgColor: "bg-[#26007e]" },
    { label: "Confirmed", percentage: orderSummary.confirmed.percent, color: "#7ad100", bgColor: "bg-[#7ad100]" },
    { label: "Delivered", percentage: orderSummary.delivered.percent, color: "#1883ff", bgColor: "bg-[#1883ff]" },
    { label: "Canceled", percentage: orderSummary.canceled.percent, color: "#fab300", bgColor: "bg-[#fab300]" },
    { label: "Paid Returned", percentage: orderSummary.paidReturned.percent, color: "#c71cb6", bgColor: "bg-[#c71cb6]" },
    { label: "Returned", percentage: orderSummary.returned.percent, color: "#da0000", bgColor: "bg-[#da0000]" },
  ];

  const getPaymentBadge = (order: Order) => {
    const method = (order as any).paymentMethod || '';
    const isPaid = method.match(/bKash|Nagad|Card|Paid/i);
    return isPaid ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600';
  };

  const COURIERS = [
    { id: 'steadfast', name: 'Steadfast', logo: '/icons/steadfast.png' },
    { id: 'pathao', name: 'Pathao', logo: '/icons/pathao.png' },
    { id: 'redx', name: 'RedX', logo: '/icons/redx.png' },
  ];

  return (
    <div className="bg-white rounded-2xl mx-2 sm:mx-4 md:mx-6 p-4 sm:p-6 shadow-sm font-['Poppins']">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-gray-900">Order List</h1>
        <button 
          onClick={onAddOrder}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white rounded-lg text-sm font-medium hover:from-sky-500 hover:to-blue-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          Add Order
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* Order Summary */}
        <div className="bg-gray-50 rounded-xl p-5 flex flex-col h-full">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Order Summary</h3>
          <div className="flex items-center justify-center gap-6 flex-1">
            <div className="relative w-[180px] h-[180px] flex-shrink-0">
              <DonutChart data={orderStatusData} total={orderSummary.total} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Total</span>
                <span className="text-black font-extrabold text-3xl leading-none my-1">{orders.length}</span>
                <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Orders</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-sm">
              {orderStatusData.map((status, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${status.bgColor}`}></span>
                  <span className="text-slate-700 font-medium">{status.label}</span>
                  <span style={{ color: status.color }}>({status.percentage}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-5 flex flex-col h-full">
          <div className="flex items-center gap-4 mb-3">
            <span className="flex items-center gap-1 text-xs font-semibold text-[#FF8A00]">
              <span className="w-2 h-2 rounded-full bg-[#FF8A00]"></span>
              Visitors
            </span>
            <span className="flex items-center gap-1 text-xs font-semibold text-[#38BDF8]">
              <span className="w-2 h-2 rounded-full bg-[#38BDF8]"></span>
              Orders
            </span>
          </div>
          <div className="flex-1 min-h-[180px]">
            <TrendChart />
          </div>
        </div>
        
        <GmvStats />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
          />
        </div>
        <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <SlidersHorizontal className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Order ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Product</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Customer</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Price</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Payment</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedOrders.length > 0 ? paginatedOrders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">#{order.id?.slice(-6)}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {order.productImage ? (
                      <img src={normalizeImageUrl(order.productImage)} alt="" className="w-8 h-8 rounded object-cover" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center">
                        <Package2 size={14} className="text-gray-400" />
                      </div>
                    )}
                    <span className="text-gray-700 truncate max-w-[150px]">{order.productName || 'Custom Order'}</span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="text-gray-900 font-medium">{order.customer}</div>
                  <div className="text-xs text-gray-500">{order.phone || 'No phone'}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">
                  {order.date ? new Date(order.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '-'}
                </td>
                <td className="px-4 py-3 font-medium text-gray-900">{formatCurrency(order.amount)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getPaymentBadge(order)}`}>
                    {(order as any).paymentMethod?.match(/bKash|Nagad|Card|Paid/i) ? 'Paid' : 'COD'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4.25 3.75H13.5C14.4665 3.75 15.25 4.53351 15.25 5.5V6.88965H17.2041C17.7848 6.88978 18.3279 7.1782 18.6533 7.65918L21.1992 11.4238C21.395 11.7132 21.4999 12.0549 21.5 12.4043V17.25H22C22.1381 17.25 22.25 17.3619 22.25 17.5C22.25 17.6381 22.1381 17.75 22 17.75H19.6621L19.5869 18.1582C19.3651 19.3485 18.3198 20.2498 17.0654 20.25C15.8109 20.25 14.7657 19.3487 14.5439 18.1582L14.4678 17.75H9.91211L9.83691 18.1582C9.61515 19.3485 8.56978 20.2498 7.31543 20.25C6.06089 20.25 5.01579 19.3487 4.79395 18.1582L4.71777 17.75H4.25C3.28351 17.75 2.5 16.9665 2.5 16V5.5C2.5 4.5335 3.2835 3.75 4.25 3.75ZM7.31543 15.6201C6.17509 15.6201 5.25023 16.5443 5.25 17.6846C5.25 18.825 6.17495 19.75 7.31543 19.75C8.45571 19.7498 9.37988 18.8249 9.37988 17.6846C9.37965 16.5445 8.45557 15.6203 7.31543 15.6201ZM17.0654 15.6201C15.9251 15.6201 15.0002 16.5443 15 17.6846C15 18.825 15.925 19.75 17.0654 19.75C18.2057 19.7498 19.1299 18.8249 19.1299 17.6846C19.1297 16.5445 18.2055 15.6203 17.0654 15.6201ZM4.25 4.25C3.55965 4.25 3 4.80965 3 5.5V16C3 16.6903 3.55964 17.25 4.25 17.25H4.75977L4.87109 16.9023C5.20208 15.8679 6.17245 15.1201 7.31543 15.1201C8.45822 15.1203 9.42782 15.868 9.75879 16.9023L9.87012 17.25H14.5098L14.6211 16.9023C14.6466 16.8227 14.6762 16.7448 14.709 16.6689L14.75 16.5742V5.5C14.75 4.80964 14.1903 4.25 13.5 4.25H4.25ZM15.25 15.707L15.9648 15.3672C16.2977 15.2089 16.6707 15.1201 17.0654 15.1201C18.2082 15.1203 19.1779 15.8681 19.5088 16.9023L19.6201 17.25H21V12.1953H15.25V15.707ZM15.25 11.6953H20.7793L20.251 10.915L18.2393 7.93945C18.0068 7.5959 17.6189 7.38978 17.2041 7.38965H15.25V11.6953Z" stroke="#26007F"/>
                      <path d="M12 10C12 11.6569 10.6569 13 9 13C7.34315 13 6 11.6569 6 10C6 8.34315 7.34315 7 9 7C9.47068 7 9.91605 7.1084 10.3125 7.30159M11.4375 8.125L8.8125 10.75L8.0625 10" stroke="#26007F" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center relative">
                  <div data-dropdown>
                    <button 
                      onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)} 
                      className="p-1 hover:bg-gray-200 rounded transition-colors"
                    >
                      <MoreVertical className="w-4 h-4 text-gray-600" />
                    </button>
                    {openDropdownId === order.id && (
                      <div className="absolute right-0 top-full mt-1 z-50">
                        <div style={{ width: '169px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', overflow: 'hidden', padding: '8px 0' }}>
                          {/* Edit */}
                          <button 
                            onClick={() => openOrderModal(order)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <Edit3 size={24} color="black" />
                            Edit
                          </button>
                          {/* Print Invoice */}
                          <button 
                            onClick={() => { handlePrintInvoice(order); setOpenDropdownId(null); }}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <Printer size={24} color="black" />
                            Print Invoice
                          </button>
                          {/* Details - Highlighted */}
                          <button 
                            onClick={() => handleOpenDetails(order)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: '#f4f4f4', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#eaeaea'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f4f4f4'}
                          >
                            <ZoomIn size={24} color="black" />
                            Details
                          </button>
                          {/* Duplicate */}
                          <button 
                            onClick={() => handleDuplicateOrder(order)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <Copy size={24} color="black" />
                            Duplicate
                          </button>
                          {/* Order Status */}
                          <div style={{ position: 'relative' }}>
                            <button 
                              onClick={() => setShowStatusMenu(showStatusMenu === order.id ? null : order.id)}
                              style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: 'black' }}
                              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                            >
                              <ArrowLeftCircle size={24} color="black" />
                              Order Status
                            </button>
                            {showStatusMenu === order.id && (
                              <div style={{ position: 'absolute', left: '100%', top: 0, width: '160px', backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)', padding: '8px 0', zIndex: 60 }}>
                                {STATUSES.map(status => (
                                  <button
                                    key={status}
                                    onClick={() => handleStatusChange(order.id, status)}
                                    style={{ display: 'block', width: '100%', padding: '8px 16px', textAlign: 'left', backgroundColor: order.status === status ? '#f0f0f0' : 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontSize: '14px', color: 'black' }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f4f4f4'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = order.status === status ? '#f0f0f0' : 'white'}
                                  >
                                    {status}
                                  </button>
                                ))}
                              </div>
                            )}
                          </div>
                          {/* Delete */}
                          <button 
                            onClick={() => handleDeleteOrder(order.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px', width: '100%', height: '48px', padding: '0 24px', backgroundColor: 'white', border: 'none', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '16px', color: '#da0000' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9f9f9'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                          >
                            <Trash2 size={24} color="#da0000" />
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
                <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                  <Package2 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">No orders found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > ordersPerPage && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <p className="text-sm text-gray-500">
            Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 py-1.5 text-sm font-medium">{currentPage} / {totalPages}</span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 border rounded-md text-sm disabled:opacity-50"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Courier Selection Modal */}
      {showCourierModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-lg font-bold text-gray-900">Select Courier</h3>
              <p className="text-sm text-gray-500">Choose a delivery partner</p>
            </div>
            <div className="p-2">
              {COURIERS.map((courier) => (
                <button
                  key={courier.id}
                  onClick={() => courierModalOrderId && handleAssignCourier(courierModalOrderId, courier.name)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-white border flex items-center justify-center">
                      <Truck size={20} className="text-gray-400" />
                    </div>
                    <span className="font-medium text-gray-900">{courier.name}</span>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </button>
              ))}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button 
                onClick={() => { setShowCourierModal(false); setCourierModalOrderId(null); }}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {selectedOrder && draftOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b bg-gray-50">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-bold text-gray-900">Edit Order</h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-gray-200 text-gray-700 text-xs font-mono">#{selectedOrder.id?.slice(-6)}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Update order details and send to courier</p>
              </div>
              <button onClick={closeOrderModal} className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-full">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Form Fields */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-blue-600 rounded-full"></div> Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Customer Name</span>
                        <input 
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          value={draftOrder.customer} 
                          onChange={(e) => handleDraftChange('customer', e.target.value)}
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Phone</span>
                        <input 
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          value={draftOrder.phone || ''} 
                          onChange={(e) => handleDraftChange('phone', e.target.value)}
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Email</span>
                        <input 
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          value={draftOrder.email || ''} 
                          onChange={(e) => handleDraftChange('email', e.target.value)}
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Division</span>
                        <input 
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                          value={draftOrder.division || ''} 
                          onChange={(e) => handleDraftChange('division', e.target.value)}
                        />
                      </label>
                    </div>
                    <label className="block space-y-1.5 mt-4">
                      <span className="text-xs font-semibold text-gray-500 uppercase">Delivery Address</span>
                      <textarea
                        rows={2}
                        className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none resize-none"
                        value={draftOrder.location} 
                        onChange={(e) => handleDraftChange('location', e.target.value)}
                      />
                    </label>
                  </div>

                  {/* Order Settings */}
                  <div className="bg-gray-50 p-6 rounded-xl border">
                    <h3 className="text-base font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <div className="w-1 h-5 bg-emerald-600 rounded-full"></div> Order Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Amount (BDT)</span>
                        <input 
                          type="number"
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          value={draftOrder.amount} 
                          onChange={(e) => handleDraftChange('amount', Number(e.target.value))}
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Delivery Charge</span>
                        <input 
                          type="number"
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          value={draftOrder.deliveryCharge || 0} 
                          onChange={(e) => handleDraftChange('deliveryCharge', Number(e.target.value))}
                        />
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Status</span>
                        <select 
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          value={draftOrder.status} 
                          onChange={(e) => handleDraftChange('status', e.target.value as Order['status'])}
                        >
                          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Courier Provider</span>
                        <select 
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          value={draftOrder.courierProvider || ''} 
                          onChange={(e) => handleDraftChange('courierProvider', (e.target.value || undefined) as Order['courierProvider'])}
                        >
                          <option value="">Not Assigned</option>
                          <option value="Steadfast">Steadfast</option>
                          <option value="Pathao">Pathao</option>
                        </select>
                      </label>
                      <label className="block space-y-1.5">
                        <span className="text-xs font-semibold text-gray-500 uppercase">Tracking ID</span>
                        <input
                          className="w-full px-3 py-2 bg-white border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                          value={draftOrder.trackingId || ''}
                          onChange={(e) => handleDraftChange('trackingId', e.target.value)}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="space-y-6">
                  {/* Order Snapshot */}
                  <div className="bg-gray-900 text-gray-300 p-6 rounded-xl">
                    <div className="flex items-center gap-2 mb-4 text-white font-semibold border-b border-gray-700 pb-2">
                      <Package2 size={18} /> Order Snapshot
                    </div>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center gap-3"><Mail size={16} className="text-gray-500" /> <span className="text-gray-200">{draftOrder.productName || 'Custom'}</span></div>
                      <div className="flex items-center gap-3"><AlertTriangle size={16} className="text-gray-500" /> <span>Qty: <span className="text-white font-medium">{draftOrder.quantity || 1}</span></span></div>
                      <div className="flex items-center gap-3"><Truck size={16} className="text-gray-500" /> <span className="truncate">ID: {getCourierId(draftOrder) || 'Pending'}</span></div>
                    </div>
                  </div>

                  {/* Fraud Check Card */}
                  <div className="border rounded-xl p-5 bg-white">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <p className="font-bold text-gray-900">Fraud Check</p>
                        <p className="text-xs text-gray-500">Powered by Steadfast</p>
                      </div>
                      {fraudBadge && (
                        <div className={`flex items-center gap-1.5 text-xs font-bold px-2 py-1 rounded border bg-gray-50 ${fraudBadge.color}`}>
                          {fraudBadge.icon}
                          <span className="uppercase">{fraudBadge.label}</span>
                        </div>
                      )}
                    </div>
                    {fraudResult && (
                      <div className="mb-4 p-3 bg-gray-50 rounded text-sm">
                        <p>Score: <span className="font-bold">{fraudResult.riskScore ?? 'N/A'}</span></p>
                        {fraudResult.remarks && <p className="text-gray-600 text-xs mt-1">{fraudResult.remarks}</p>}
                      </div>
                    )}
                    <button
                      onClick={() => handleFraudCheck(draftOrder)}
                      disabled={isFraudChecking}
                      className="w-full py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold uppercase"
                    >
                      {isFraudChecking ? 'Checking...' : 'Run Analysis'}
                    </button>
                  </div>

                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Quick Actions</p>
                    
                    {draftOrder.courierProvider === 'Steadfast' && draftOrder.trackingId ? (
                      <div className="w-full p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} /> Sent to Steadfast
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendToSteadfast(draftOrder)}
                        disabled={isSendingToSteadfast || !courierConfig.apiKey}
                        className="w-full p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                      >
                        {isSendingToSteadfast ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        Send to Steadfast
                      </button>
                    )}

                    {draftOrder.courierProvider === 'Pathao' && draftOrder.trackingId ? (
                      <div className="w-full p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                        <CheckCircle2 size={18} /> Sent to Pathao
                      </div>
                    ) : (
                      <button
                        onClick={() => handleSendToPathao(draftOrder)}
                        disabled={isSendingToPathao || !pathaoConfig?.apiKey}
                        className="w-full p-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                      >
                        {isSendingToPathao ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        Send to Pathao
                      </button>
                    )}

                    <button
                      onClick={() => handlePrintInvoice(draftOrder)}
                      className="w-full p-3 border hover:bg-gray-50 text-gray-700 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Printer size={18} /> Print Invoice
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button onClick={closeOrderModal} className="px-5 py-2.5 rounded-lg border text-gray-700 font-medium hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={handleSaveOrder}
                disabled={isSaving}
                className="px-5 py-2.5 rounded-lg bg-gray-900 text-white font-medium hover:bg-gray-800 disabled:opacity-70 flex items-center gap-2"
              >
                {isSaving && <Loader2 size={18} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {detailsOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div style={{ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 24px', borderBottom: '1px solid #e5e5e5', backgroundColor: '#f9fafb' }}>
              <div>
                <h2 style={{ fontFamily: '"Lato", sans-serif', fontWeight: 700, fontSize: '20px', color: '#111827', margin: 0 }}>Order Details</h2>
                <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Order #{detailsOrder.id?.slice(-6)}</p>
              </div>
              <button 
                onClick={() => setDetailsOrder(null)} 
                style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', borderRadius: '8px' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={24} color="#6b7280" />
              </button>
            </div>

            {/* Content */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {/* Status Badge */}
              <div style={{ marginBottom: '24px' }}>
                <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${STATUS_COLORS[detailsOrder.status] || 'bg-gray-100 text-gray-600'}`}>
                  {detailsOrder.status}
                </span>
              </div>

              {/* Customer Info */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: '"Lato", sans-serif', fontWeight: 700, fontSize: '16px', color: '#374151', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '20px', backgroundColor: '#3b82f6', borderRadius: '2px' }}></div>
                  Customer Information
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Name</p>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', color: '#111827', fontWeight: 500 }}>{detailsOrder.customer || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Phone</p>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', color: '#111827', fontWeight: 500 }}>{detailsOrder.phone || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Email</p>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', color: '#111827', fontWeight: 500 }}>{detailsOrder.email || 'N/A'}</p>
                  </div>
                  <div>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Division</p>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', color: '#111827', fontWeight: 500 }}>{detailsOrder.division || 'N/A'}</p>
                  </div>
                </div>
                <div style={{ marginTop: '16px' }}>
                  <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Delivery Address</p>
                  <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', color: '#111827', fontWeight: 500 }}>{detailsOrder.location || 'N/A'}</p>
                </div>
              </div>

              {/* Product Info */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
                <h3 style={{ fontFamily: '"Lato", sans-serif', fontWeight: 700, fontSize: '16px', color: '#374151', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '20px', backgroundColor: '#10b981', borderRadius: '2px' }}></div>
                  Product Details
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  {detailsOrder.productImage && (
                    <img 
                      src={normalizeImageUrl(detailsOrder.productImage)} 
                      alt={detailsOrder.productName} 
                      style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #e5e7eb' }}
                    />
                  )}
                  <div style={{ flex: 1 }}>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '16px', fontWeight: 600, color: '#111827' }}>{detailsOrder.productName || 'N/A'}</p>
                    <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Qty: {detailsOrder.quantity || 1}</p>
                  </div>
                </div>
              </div>

              {/* Order Summary */}
              <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px' }}>
                <h3 style={{ fontFamily: '"Lato", sans-serif', fontWeight: 700, fontSize: '16px', color: '#374151', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '4px', height: '20px', backgroundColor: '#f59e0b', borderRadius: '2px' }}></div>
                  Order Summary
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '14px', color: '#6b7280' }}>Subtotal</span>
                    <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', fontWeight: 600, color: '#111827' }}>{formatCurrency(detailsOrder.amount || 0)}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '14px', color: '#6b7280' }}>Delivery Charge</span>
                    <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', fontWeight: 600, color: '#111827' }}>{formatCurrency(detailsOrder.deliveryCharge || 0)}</span>
                  </div>
                  <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '16px', fontWeight: 700, color: '#111827' }}>Total</span>
                    <span style={{ fontFamily: '"Lato", sans-serif', fontSize: '18px', fontWeight: 700, color: '#059669' }}>{formatCurrency((detailsOrder.amount || 0) + (detailsOrder.deliveryCharge || 0))}</span>
                  </div>
                </div>
              </div>

              {/* Courier Info if available */}
              {detailsOrder.courierProvider && (
                <div style={{ backgroundColor: '#f9fafb', borderRadius: '12px', padding: '20px', marginTop: '16px' }}>
                  <h3 style={{ fontFamily: '"Lato", sans-serif', fontWeight: 700, fontSize: '16px', color: '#374151', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '4px', height: '20px', backgroundColor: '#8b5cf6', borderRadius: '2px' }}></div>
                    Courier Information
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                    <div>
                      <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Provider</p>
                      <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', color: '#111827', fontWeight: 500 }}>{detailsOrder.courierProvider}</p>
                    </div>
                    <div>
                      <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '12px', fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', marginBottom: '4px' }}>Tracking ID</p>
                      <p style={{ fontFamily: '"Lato", sans-serif', fontSize: '15px', color: '#111827', fontWeight: 500 }}>{getCourierId(detailsOrder) || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div style={{ padding: '16px 24px', borderTop: '1px solid #e5e5e5', backgroundColor: '#f9fafb', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => { handlePrintInvoice(detailsOrder); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: 'white', border: '1px solid #d1d5db', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '14px', color: '#374151' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                <Printer size={18} />
                Print Invoice
              </button>
              <button
                onClick={() => { setDetailsOrder(null); openOrderModal(detailsOrder); }}
                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', backgroundColor: '#111827', border: 'none', borderRadius: '8px', cursor: 'pointer', fontFamily: '"Lato", sans-serif', fontWeight: 600, fontSize: '14px', color: 'white' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#1f2937'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#111827'}
              >
                <Edit3 size={18} />
                Edit Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FigmaOrderList;
