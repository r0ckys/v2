import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Globe, FileText, Tag, TrendingDown, Package, Star, Search, Bell, Calendar,
  ChevronDown, Monitor, Tablet, Smartphone, MoreVertical, ArrowUpRight, ArrowDownRight,
  ShoppingCart, Truck, CheckCircle, Clock, XCircle, RotateCcw, ChevronRight, BarChart3
} from 'lucide-react';
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

interface StatCard {
  id: string;
  label: string;
  value: number | string;
  icon: React.ReactNode;
  iconBg: string;
}

interface OrderStatus {
  id: string;
  label: string;
  count: number;
  color: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  sold: number;
  image: string;
}

interface AdminDashboardProps {
  orders?: any[];
  products?: any[];
  tenantId?: string;
  user?: any;
}

const visitorData = [
  { date: 'Jan 25', mobile: 850, tablet: 450, desktop: 650 },
  { date: 'Jan 26', mobile: 920, tablet: 480, desktop: 720 },
  { date: 'Jan 27', mobile: 780, tablet: 520, desktop: 680 },
  { date: 'Jan 28', mobile: 1100, tablet: 600, desktop: 850 },
  { date: 'Jan 29', mobile: 950, tablet: 550, desktop: 780 },
  { date: 'Jan 30', mobile: 880, tablet: 490, desktop: 710 },
  { date: 'Jan 31', mobile: 1020, tablet: 580, desktop: 820 },
];

const salesData = [
  { month: 'Jan', sales: 2400 },
  { month: 'Feb', sales: 4200 },
  { month: 'Mar', sales: 3100 },
  { month: 'Apr', sales: 5800 },
  { month: 'May', sales: 4200 },
  { month: 'Jun', sales: 6100 },
  { month: 'Jul', sales: 5200 },
];

const categoryData = [
  { name: 'Electronics', value: 35, color: '#6366f1' },
  { name: 'Clothing', value: 25, color: '#22c55e' },
  { name: 'Accessories', value: 20, color: '#eab308' },
  { name: 'Home & Garden', value: 12, color: '#ec4899' },
  { name: 'Others', value: 8, color: '#94a3b8' },
];

const bestSellingProducts: Product[] = [
  { id: '1', name: 'iPhone 15 Pro', sku: 'IPH15P-001', price: 999, sold: 245, image: '' },
  { id: '2', name: 'Samsung Galaxy S24', sku: 'SGS24-002', price: 899, sold: 189, image: '' },
  { id: '3', name: 'MacBook Air M3', sku: 'MBA-M3-003', price: 1299, sold: 156, image: '' },
  { id: '4', name: 'AirPods Pro 2', sku: 'APP2-004', price: 249, sold: 312, image: '' },
  { id: '5', name: 'iPad Pro 12.9', sku: 'IPDP-005', price: 1099, sold: 98, image: '' },
];

const topProducts = [
  { id: '1', name: 'Wireless Earbuds', price: 79.99, rating: 4.8 },
  { id: '2', name: 'Smart Watch Pro', price: 199.99, rating: 4.7 },
  { id: '3', name: 'USB-C Hub', price: 49.99, rating: 4.6 },
  { id: '4', name: 'Phone Case Premium', price: 29.99, rating: 4.9 },
  { id: '5', name: 'Charging Cable 3-Pack', price: 19.99, rating: 4.5 },
];

const OrderAnalyticsCard: React.FC<StatCard> = ({ label, value, icon, iconBg }) => (
  <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-gray-100 hover:shadow-md transition-shadow">
    <div className="flex items-center sm:items-start gap-2 sm:gap-0 sm:justify-between">
      <div className={`w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-md sm:rounded-lg ${iconBg} flex items-center justify-center shrink-0`}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4 sm:w-5 sm:h-5' })}
      </div>
      <div className="sm:hidden flex-1 min-w-0">
        <p className="text-lg font-bold text-gray-900 truncate">{value}</p>
        <p className="text-xs text-gray-500 truncate">{label}</p>
      </div>
    </div>
    <div className="hidden sm:block mt-2 md:mt-3">
      <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs sm:text-sm text-gray-500 mt-0.5 md:mt-1 truncate">{label}</p>
    </div>
  </div>
);

const VisitorStatCard: React.FC<{ label: string; value: string; change: string; isPositive: boolean }> = ({
  label, value, change, isPositive
}) => (
  <div className="bg-white rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 border border-gray-100">
    <div className="flex items-center justify-between gap-2">
      <p className="text-xs sm:text-sm text-gray-500 truncate">{label}</p>
      <span className={`flex items-center text-xs font-medium shrink-0 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
        {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {change}
      </span>
    </div>
    <p className="text-base sm:text-lg md:text-xl font-bold text-gray-900 mt-1 sm:mt-2">{value}</p>
  </div>
);

const OrderStatusPill: React.FC<OrderStatus> = ({ label, count, color }) => (
  <div className={`px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 rounded-lg sm:rounded-xl text-center ${color}`}>
    <p className="text-sm sm:text-base md:text-lg font-bold">{count}</p>
    <p className="text-[11px] sm:text-xs mt-0.5 sm:mt-1 truncate">{label}</p>
  </div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders = [], products = [], tenantId, user }) => {
  const [timePeriod, setTimePeriod] = useState<'day' | 'month' | 'year' | 'all'>('month');
  const [language, setLanguage] = useState<'en' | 'bn'>('en');
  const [currentDate] = useState(new Date());
  
  const totalProducts = products?.length || 4;
  const totalOrders = orders?.length || 65;
  const lowStockCount = products?.filter((p: any) => (p.stock || 0) < 10)?.length || 45;
  const pendingReviews = orders?.filter((o: any) => o.status === 'pending')?.length || 452;
  
  const analyticsCards: StatCard[] = [
    { id: '1', label: 'Products on Hands', value: totalProducts, icon: <Globe className="w-5 h-5 text-blue-600" />, iconBg: 'bg-blue-100' },
    { id: '2', label: 'Total Orders', value: totalOrders, icon: <FileText className="w-5 h-5 text-purple-600" />, iconBg: 'bg-purple-100' },
    { id: '3', label: 'Reserved Price', value: 35, icon: <Tag className="w-5 h-5 text-green-600" />, iconBg: 'bg-green-100' },
    { id: '4', label: 'Low Stock', value: lowStockCount, icon: <TrendingDown className="w-5 h-5 text-orange-600" />, iconBg: 'bg-orange-100' },
    { id: '5', label: 'To be Reviewed', value: pendingReviews, icon: <Package className="w-5 h-5 text-pink-600" />, iconBg: 'bg-pink-100' },
  ];

  const orderStatuses: OrderStatus[] = [
    { id: 'today', label: 'Today', count: orders?.filter((o: any) => new Date(o.createdAt).toDateString() === new Date().toDateString())?.length || 35, color: 'bg-blue-50 text-blue-700' },
    { id: 'courier', label: 'Courier', count: orders?.filter((o: any) => o.status === 'courier')?.length || 35, color: 'bg-indigo-50 text-indigo-700' },
    { id: 'confirmed', label: 'Confirmed', count: orders?.filter((o: any) => o.status === 'confirmed')?.length || 35, color: 'bg-green-50 text-green-700' },
    { id: 'pending', label: 'Pending', count: orders?.filter((o: any) => o.status === 'pending')?.length || 35, color: 'bg-yellow-50 text-yellow-700' },
    { id: 'cancelled', label: 'Cancelled', count: orders?.filter((o: any) => o.status === 'cancelled')?.length || 35, color: 'bg-red-50 text-red-700' },
    { id: 'returns', label: 'Returns', count: orders?.filter((o: any) => o.status === 'returned')?.length || 35, color: 'bg-gray-100 text-gray-700' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-3 sm:p-4 md:p-5 lg:p-6">
      {/* Order Analytics Section */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 xs:gap-3 mb-3 sm:mb-4">
          <h2 className="text-base sm:text-lg font-semibold text-gray-900">Order Analytics</h2>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="flex items-center bg-gray-100 rounded-md sm:rounded-lg p-0.5 sm:p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors ${language === 'en' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              >Eng</button>
              <button
                onClick={() => setLanguage('bn')}
                className={`px-2 py-1 sm:px-3 sm:py-1.5 text-xs sm:text-sm rounded-md transition-colors ${language === 'bn' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'}`}
              >বাংলা</button>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-600">
              <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{currentDate.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' })}</span>
              <span className="text-gray-400 hidden xs:inline">|</span>
              <span className="hidden xs:inline">{currentDate.toLocaleDateString('en-US', { weekday: 'short' })}</span>
            </div>
          </div>
        </div>
        
        {/* Analytics Cards Grid - Responsive */}
        <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {analyticsCards.map((card) => (
            <OrderAnalyticsCard key={card.id} {...card} />
          ))}
          <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg sm:rounded-xl p-2.5 sm:p-3 md:p-4 text-white">
            <div className="flex items-center justify-between mb-1 sm:mb-2">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-[11px] sm:text-xs bg-white/20 px-1.5 sm:px-2 py-0.5 rounded-full">New</span>
            </div>
            <p className="text-xs sm:text-sm font-medium">Important</p>
            <p className="text-[11px] sm:text-xs opacity-80 mt-0.5 sm:mt-1">Notification</p>
          </div>
        </div>
      </div>

      {/* Visitor Stats Section */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-5 md:mb-6">
        {/* Visitor Stat Cards - Stack on mobile, inline on larger */}
        <div className="col-span-12 md:col-span-3 grid grid-cols-3 md:grid-cols-1 gap-2 sm:gap-3 md:gap-4">
          <VisitorStatCard label="Online Now" value="127" change="+12%" isPositive={true} />
          <VisitorStatCard label="Today visitors" value="1,842" change="+8%" isPositive={true} />
          <VisitorStatCard label="Total visitors" value="45,231" change="+15%" isPositive={true} />
        </div>
        
        {/* Chart Area */}
        <div className="col-span-12 md:col-span-9 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Units of Measure</h3>
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full" />
                <span className="text-gray-600">Mobile</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full" />
                <span className="text-gray-600">Tab</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full" />
                <span className="text-gray-600">Desktop</span>
              </div>
            </div>
          </div>
          <div className="h-40 sm:h-48 md:h-52 lg:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorData} barGap={2}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} stroke="#94a3b8" interval="preserveStartEnd" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" width={30} />
                <Tooltip />
                <Bar dataKey="mobile" fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="tablet" fill="#22c55e" radius={[2, 2, 0, 0]} />
                <Bar dataKey="desktop" fill="#8b5cf6" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Order Status Section */}
      <div className="mb-4 sm:mb-5 md:mb-6">
        <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">Order</h3>
        <div className="grid grid-cols-3 xs:grid-cols-6 gap-1.5 sm:gap-2 md:gap-3 lg:gap-4">
          {orderStatuses.map((status) => (
            <OrderStatusPill key={status.id} {...status} />
          ))}
        </div>
      </div>

      {/* Sales Performance and Category Section */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6 mb-4 sm:mb-5 md:mb-6">
        {/* Sales Performance Chart */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Sale Performance</h3>
            <div className="flex items-center bg-gray-100 rounded-md sm:rounded-lg p-0.5 sm:p-1 overflow-x-auto">
              {['Day', 'Month', 'Year', 'All'].map((period) => (
                <button
                  key={period}
                  onClick={() => setTimePeriod(period.toLowerCase() as any)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs rounded-md transition-colors whitespace-nowrap ${timePeriod === period.toLowerCase() ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >{period}</button>
              ))}
            </div>
          </div>
          <div className="h-44 sm:h-52 md:h-60 lg:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 11 }} stroke="#94a3b8" width={35} />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#6366f1" strokeWidth={2} dot={{ fill: '#6366f1', strokeWidth: 2, r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Sales By Category Pie Chart */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
          <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2 sm:mb-3 md:mb-4">Sale By Category</h3>
          <div className="h-36 sm:h-44 md:h-48 lg:h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={2} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-1.5 sm:space-y-2 mt-2 sm:mt-3 md:mt-4">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                  <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-600 truncate">{cat.name}</span>
                </div>
                <span className="font-medium text-gray-900 ml-2">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Best Selling & Top Products Section */}
      <div className="grid grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Best Selling Products Table */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Best Selling Product</h3>
            <div className="flex items-center bg-gray-100 rounded-md sm:rounded-lg p-0.5 sm:p-1 overflow-x-auto">
              {['Day', 'Month', 'Year', 'All'].map((period) => (
                <button key={period} className="px-2 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs rounded-md text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">{period}</button>
              ))}
            </div>
          </div>
          <div className="overflow-x-auto -mx-3 sm:-mx-4 md:-mx-5 lg:-mx-6">
            <div className="min-w-[400px] px-3 sm:px-4 md:px-5 lg:px-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="text-left py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 text-xs sm:text-sm font-medium text-gray-500">Product</th>
                    <th className="text-left py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 text-xs sm:text-sm font-medium text-gray-500 hidden xs:table-cell">SKU</th>
                    <th className="text-right py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 text-xs sm:text-sm font-medium text-gray-500">Price</th>
                    <th className="text-right py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 text-xs sm:text-sm font-medium text-gray-500">Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {(products?.slice(0, 5) || bestSellingProducts).map((product: any) => (
                    <tr key={product.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4">
                        <div className="flex items-center gap-2 sm:gap-3">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gray-100 rounded-md sm:rounded-lg flex items-center justify-center shrink-0">
                            <Package className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-gray-400" />
                          </div>
                          <span className="font-medium text-gray-900 text-xs sm:text-sm truncate max-w-[100px] sm:max-w-[150px] md:max-w-none">{product.name}</span>
                        </div>
                      </td>
                      <td className="py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 text-xs sm:text-sm text-gray-500 hidden xs:table-cell">{product.sku || `SKU-${product.id}`}</td>
                      <td className="py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 text-right font-medium text-gray-900 text-xs sm:text-sm">৳{product.price || product.selling_price || 0}</td>
                      <td className="py-2 sm:py-2.5 md:py-3 px-2 sm:px-3 md:px-4 text-right text-gray-600 text-xs sm:text-sm">{product.sold || product.totalSold || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        {/* Top Products List */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-gray-100">
          <div className="flex items-center justify-between gap-2 mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900">Top Products</h3>
            <div className="relative">
              <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 absolute left-2 sm:left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search..." className="pl-7 sm:pl-9 pr-2 sm:pr-4 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 rounded-md sm:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-24 sm:w-32" />
            </div>
          </div>
          <div className="space-y-2 sm:space-y-3">
            {(products?.slice(0, 5) || topProducts).map((product: any, index: number) => (
              <div key={product.id} className="flex items-center justify-between p-2 sm:p-2.5 md:p-3 rounded-md sm:rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold shrink-0">{index + 1}</span>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">{product.name}</p>
                    <p className="text-[11px] sm:text-xs text-gray-500">৳{product.price || product.selling_price || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-0.5 sm:gap-1 shrink-0 ml-2">
                  <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs sm:text-sm font-medium text-gray-700">{product.rating || 4.5}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
