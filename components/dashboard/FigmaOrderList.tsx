import React, { useState, useEffect, useRef } from 'react';
import { Plus, Search, SlidersHorizontal, MoreVertical, ChevronLeft, ChevronRight, Headphones } from 'lucide-react';
import { DonutChart } from '../modern-dashboard/OrderSummaryChart';
import { TrendChart } from './order/TrendChart';
import GmvStats from './order/GmvStats';
import { PrevNextBtn } from './order/PrevNextBtn';

interface OrderItem {
  id: string;
  orderId: string;
  productName: string;
  productImage?: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  price: number;
  payment: 'COD' | 'Paid';
  fraudScore: number;
  fraudStatus: 'Safe' | 'Risky' | 'Median';
  status: 'Pending' | 'Confirmed' | 'Delivered' | 'Cancelled' | 'Returned';
}

interface FigmaOrderListProps {
  orders?: OrderItem[];
  onAddOrder?: () => void;
  onViewOrder?: (orderId: string) => void;
}

const FigmaOrderList: React.FC<FigmaOrderListProps> = ({
  orders: propOrders,
  onAddOrder,
  onViewOrder
}) => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownId(null);
      }
    };
    if (openDropdownId) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdownId]);

  // Sample data
  const sampleOrders: OrderItem[] = [
    { id: '1', orderId: '#OR1250', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 80, fraudStatus: 'Safe', status: 'Pending' },
    { id: '2', orderId: '#OR1249', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 20, fraudStatus: 'Risky', status: 'Pending' },
    { id: '3', orderId: '#OR1248', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 50, fraudStatus: 'Median', status: 'Pending' },
    { id: '4', orderId: '#OR1247', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 20, fraudStatus: 'Risky', status: 'Pending' },
    { id: '5', orderId: '#OR1246', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 20, fraudStatus: 'Risky', status: 'Pending' },
    { id: '6', orderId: '#OR1245', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 20, fraudStatus: 'Risky', status: 'Pending' },
    { id: '7', orderId: '#OR1244', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 20, fraudStatus: 'Risky', status: 'Pending' },
    { id: '8', orderId: '#OR1243', productName: 'Wireless Bluetooth Headphones', customerName: 'Imam Hoshen Omob', customerPhone: '+88 01788-888888', date: '01-01-2025', time: '06:32 PM', price: 49.99, payment: 'COD', fraudScore: 20, fraudStatus: 'Risky', status: 'Pending' },
  ];

  const orders = propOrders || sampleOrders;

  // Order summary data
  const orderSummary = {
    total: 1250,
    pending: { count: Math.round(1250 * 0.31), percent: 31 },
    confirmed: { count: Math.round(1250 * 0.20), percent: 20 },
    delivered: { count: Math.round(1250 * 0.14), percent: 14 },
    canceled: { count: Math.round(1250 * 0.11), percent: 11 },
    paidReturned: { count: Math.round(1250 * 0.15), percent: 15 },
    returned: { count: Math.round(1250 * 0.09), percent: 9 }
  };

  // Stats
  const stats = {
    gmv: 240,
    gmvChange: 20,
    avgOrder: 17865,
    avgOrderChange: -5,
    courierReturn: 50,
    demurrageCharges: 500000
  };

  // Tab counts
  const tabCounts = {
    all: 240,
    pending: 240,
    delivered: 240,
    canceled: 240,
    returned: 240
  };

  const tabs = [
    { id: 'all', label: 'All order', count: tabCounts.all },
    { id: 'pending', label: 'Pending', count: tabCounts.pending },
    { id: 'delivered', label: 'Delivered', count: tabCounts.delivered },
    { id: 'canceled', label: 'Canceled', count: tabCounts.canceled },
    { id: 'returned', label: 'Returned', count: tabCounts.returned }
  ];

  const totalPages = 24;

  const getFraudStatusColor = (status: string) => {
    switch (status) {
      case 'Safe': return 'text-emerald-500';
      case 'Risky': return 'text-red-500';
      case 'Median': return 'text-amber-500';
      default: return 'text-gray-500';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses = 'px-2 py-1 rounded text-xs font-medium flex items-center gap-1';
    switch (status) {
      case 'Pending':
        return <span className={`${baseClasses} bg-amber-50 text-amber-600`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          Pending
        </span>;
      case 'Confirmed':
        return <span className={`${baseClasses} bg-blue-50 text-blue-600`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
          Confirmed
        </span>;
      case 'Delivered':
        return <span className={`${baseClasses} bg-emerald-50 text-emerald-600`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Delivered
        </span>;
      case 'Cancelled':
        return <span className={`${baseClasses} bg-red-50 text-red-600`}>
          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
          Cancelled
        </span>;
      case 'Returned':
        return <span className={`${baseClasses} bg-purple-50 text-purple-600`}>
          <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
          Returned
        </span>;
      default:
        return <span className={`${baseClasses} bg-gray-50 text-gray-600`}>{status}</span>;
    }
  };

  // Order status data for pie chart
  const orderStatusData = [
    { label: "Pending", percentage: orderSummary.pending.percent, color: "#26007e", bgColor: "bg-[#26007e]" },
    { label: "Confirmed", percentage: orderSummary.confirmed.percent, color: "#7ad100", bgColor: "bg-[#7ad100]" },
    { label: "Delivered", percentage: orderSummary.delivered.percent, color: "#1883ff", bgColor: "bg-[#1883ff]" },
    { label: "Canceled", percentage: orderSummary.canceled.percent, color: "#fab300", bgColor: "bg-[#fab300]" },
    { label: "Paid Returned", percentage: orderSummary.paidReturned.percent, color: "#c71cb6", bgColor: "bg-[#c71cb6]" },
    { label: "Returned", percentage: orderSummary.returned.percent, color: "#da0000", bgColor: "bg-[#da0000]" },
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
            {/* Donut Chart with center text */}
            <div className="relative w-[180px] h-[180px] flex-shrink-0">
              <DonutChart data={orderStatusData} total={orderSummary.total} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Total</span>
                <span className="text-black font-extrabold text-3xl leading-none my-1">{orderSummary.total}</span>
                <span className="text-gray-400 text-[9px] font-bold uppercase tracking-widest">Orders</span>
              </div>
            </div>
            {/* Legend */}
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

        {/* Visitors/Orders Chart */}
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
          {/* trend chart */}
          <div className="flex-1 min-h-[180px]">
            <TrendChart />
          </div>
        </div>
        {/* order stats */}
        <GmvStats />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200 overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-3 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search orders..."
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
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Fraud</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
              <th className="px-4 py-3 text-center font-semibold text-gray-700">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-900">{order.orderId}</td>
                <td className="px-4 py-3 text-gray-700">{order.productName}</td>
                <td className="px-4 py-3">
                  <div className="text-gray-900 font-medium">{order.customerName}</div>
                  <div className="text-xs text-gray-500">{order.customerPhone}</div>
                </td>
                <td className="px-4 py-3 text-gray-700">{order.date}</td>
                <td className="px-4 py-3 font-medium text-gray-900">${order.price.toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    order.payment === 'COD'
                      ? 'bg-orange-50 text-orange-600'
                      : 'bg-green-50 text-green-600'
                  }`}>
                    {order.payment}
                  </span>
                </td>
                <td className={`px-4 py-3 font-medium ${getFraudStatusColor(order.fraudStatus)}`}>
                  {order.fraudScore}
                </td>
                <td className="px-4 py-3">{getStatusBadge(order.status)}</td>
                <td className="px-4 py-3 text-center relative">
                  <button 
                    onClick={() => setOpenDropdownId(openDropdownId === order.id ? null : order.id)} 
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </button>
                  {openDropdownId === order.id && (
                    <div className="absolute right-0 top-full mt-1 z-50">
                      <div className="w-[200px] bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden py-2">
                        <button 
                          onClick={() => { onViewOrder?.(order.orderId); setOpenDropdownId(null); }}
                          className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700"
                        >
                         
                         <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.4249 4.60509L17.4149 3.6151C18.2351 2.79497 19.5648 2.79497 20.3849 3.6151C21.205 4.43524 21.205 5.76493 20.3849 6.58507L19.3949 7.57506M16.4249 4.60509L9.76558 11.2644C9.25807 11.772 8.89804 12.4078 8.72397 13.1041L8 16L10.8959 15.276C11.5922 15.102 12.228 14.7419 12.7356 14.2344L19.3949 7.57506M16.4249 4.60509L19.3949 7.57506" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                        <path d="M18.9999 13.5C18.9999 16.7875 18.9999 18.4312 18.092 19.5376C17.9258 19.7401 17.7401 19.9258 17.5375 20.092C16.4312 21 14.7874 21 11.4999 21H11C7.22876 21 5.34316 21 4.17159 19.8284C3.00003 18.6569 3 16.7712 3 13V12.5C3 9.21252 3 7.56879 3.90794 6.46244C4.07417 6.2599 4.2599 6.07417 4.46244 5.90794C5.56879 5 7.21252 5 10.5 5" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                          Edit
                        </button>
                        <button className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7.35396 18C5.23084 18 4.16928 18 3.41349 17.5468C2.91953 17.2506 2.52158 16.8271 2.26475 16.3242C1.87179 15.5547 1.97742 14.5373 2.18868 12.5025C2.36503 10.8039 2.45321 9.95455 2.88684 9.33081C3.17153 8.92129 3.55659 8.58564 4.00797 8.35353C4.69548 8 5.58164 8 7.35396 8H16.646C18.4184 8 19.3045 8 19.992 8.35353C20.4434 8.58564 20.8285 8.92129 21.1132 9.33081C21.5468 9.95455 21.635 10.8039 21.8113 12.5025C22.0226 14.5373 22.1282 15.5547 21.7352 16.3242C21.4784 16.8271 21.0805 17.2506 20.5865 17.5468C19.8307 18 18.7692 18 16.646 18" stroke="black" stroke-width="1.5"/>
                        <path d="M17 8V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V8" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                        <path d="M13.9887 16H10.0113C9.32602 16 8.98337 16 8.69183 16.1089C8.30311 16.254 7.97026 16.536 7.7462 16.9099C7.57815 17.1904 7.49505 17.5511 7.32884 18.2724C7.06913 19.3995 6.93928 19.963 7.02759 20.4149C7.14535 21.0174 7.51237 21.5274 8.02252 21.7974C8.40513 22 8.94052 22 10.0113 22H13.9887C15.0595 22 15.5949 22 15.9775 21.7974C16.4876 21.5274 16.8547 21.0174 16.9724 20.4149C17.0607 19.963 16.9309 19.3995 16.6712 18.2724C16.505 17.5511 16.4218 17.1904 16.2538 16.9099C16.0297 16.536 15.6969 16.254 15.3082 16.1089C15.0166 16 14.674 16 13.9887 16Z" stroke="black" stroke-width="1.5" stroke-linejoin="round"/>
                        <path d="M18 12H18.009" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                         Print Invoice
                        </button>
                        <button className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700">
                          Details
                        </button>
                        <button className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700">
                          Duplicate
                        </button>
                        <button className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-gray-700">
                          Order Status
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button className="flex items-center gap-3 w-full h-10 px-4 hover:bg-gray-50 text-sm font-medium text-red-600">
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
       <PrevNextBtn />
    </div>
  );
};

export default FigmaOrderList;
