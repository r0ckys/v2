import React, { useState } from 'react';
import FigmaOverview from './FigmaOverview';
import FigmaOrderStatus from './FigmaOrderStatus';
import FigmaVisitorStats from './FigmaVisitorStats';
import FigmaBestSellingProducts from './FigmaBestSellingProducts';
import FigmaTopProducts from './FigmaTopProducts';
import FigmaSalesPerformance from './FigmaSalesPerformance';
import FigmaSalesByCategory from './FigmaSalesByCategory';
import FigmaAnalyticsChart from './FigmaAnalyticsChart';
import { Order, Product } from '../../types';

interface FigmaDashboardContentProps {
  user?: {
    name?: string;
    email?: string;
    avatar?: string;
  };
  tenantId?: string;
  orders?: Order[];
  products?: Product[];
  onNavigate?: (page: string) => void;
}

const FigmaDashboardContent: React.FC<FigmaDashboardContentProps> = ({
  user = { name: 'User' },
  tenantId = '',
  orders = [],
  products = [],
  onNavigate
}) => {
  const [language, setLanguage] = useState<string>('en');
  const [timeFilter, setTimeFilter] = useState<string>('Month');

  // Calculate stats from real data if available
  const totalProducts = products.length || 45;
  const totalOrders = orders.length || 6550;
  const totalAmount = orders.reduce((sum, o) => sum + (o.amount || 0), 0) || 835500;
  const lowStock = products.filter(p => (p.stock || 0) < 10).length || 5;
  const toReview = orders.filter(o => o.status === 'Pending').length || 452;

  // Order status stats
  const pendingOrders = orders.filter(o => o.status === 'Pending').length || 35;
  const confirmedOrders = orders.filter(o => o.status === 'Confirmed').length || 35;
  const courierOrders = orders.filter(o => o.status === 'Sent to Courier' || o.status === 'Shipped').length || 35;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length || 35;
  const canceledOrders = orders.filter(o => o.status === 'Cancelled').length || 35;
  const returnsOrders = orders.filter(o => o.status === 'Return' || o.status === 'Returned Receive').length || 35;

  // Format currency
  const formattedAmount = '\u09F3' + totalAmount.toLocaleString('en-IN');

  // Best selling products data
  const bestSellingData = products.slice(0, 4).map((p, idx) => ({
    id: String(p.id || idx + 1),
    name: p.name || ['Apple iPhone 13', 'Nike Air Jordan', 'T-shirt', 'Cross Bag'][idx],
    totalOrder: String(Math.floor(Math.random() * 500) + 50),
    status: ((p.stock || 0) > 0 ? 'Stock' : 'Stock out') as 'Stock' | 'Stock out',
    price: '$' + (p.price || 999).toFixed(2),
    image: p.image
  }));

  // Top products data
  const topProductsData = products.slice(0, 5).map((p, idx) => ({
    id: String(p.id || idx + 1),
    name: p.name || ['Apple iPhone 13', 'Nike Air Jordan', 'T-shirt', 'Assorted Cross Bag', 'Fur Pom Gloves'][idx],
    itemCode: '#FXZ-' + (4567 + idx),
    price: '$' + (p.price || [999, 72.4, 35.4, 80, 45][idx]).toFixed(2),
    image: p.image
  }));

  return (
    <div className="space-y-4 sm:space-y-5 md:space-y-6 p-3 sm:p-4 md:p-5 lg:p-6 bg-[#F8FAFC] min-h-full overflow-x-hidden max-w-full">
      {/* Overview Section */}
      <FigmaOverview
        stats={{
          totalProducts,
          totalOrders,
          totalAmount: formattedAmount,
          lowStock,
          toReview
        }}
        currentLang={language}
        onLangChange={setLanguage}
      />

      {/* Visitor Stats + Analytics Bar Chart Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Visitor Stats - Left Side */}
        <div className="lg:col-span-4 h-full">
          <FigmaVisitorStats
            visitorStats={{
              onlineNow: 35,
              todayVisitors: 35,
              totalVisitors: 35
            }}
          />
        </div>

        {/* Analytics Bar Chart - Right Side */}
        <div className="lg:col-span-8">
          <FigmaAnalyticsChart
            timeFilter="December 2025"
            onTimeFilterChange={setTimeFilter}
          />
        </div>
      </div>

      {/* Order Status Row */}
      <FigmaOrderStatus
        orderStats={{
          pending: pendingOrders,
          confirmed: confirmedOrders,
          courier: courierOrders,
          delivered: deliveredOrders,
          canceled: canceledOrders,
          returns: returnsOrders
        }}
      />

      {/* Sales Performance + Sales by Category Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Sales Performance Chart - Left Side */}
        <div className="lg:col-span-8">
          <FigmaSalesPerformance />
        </div>

        {/* Sales by Category Pie Chart - Right Side */}
        <div className="lg:col-span-4">
          <FigmaSalesByCategory />
        </div>
      </div>

      {/* Best Selling Products + Top Products Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
        {/* Best Selling Products Table - Left Side */}
        <div className="lg:col-span-8">
          <FigmaBestSellingProducts products={bestSellingData} />
        </div>

        {/* Top Products List - Right Side */}
        <div className="lg:col-span-4">
          <FigmaTopProducts products={topProductsData} />
        </div>
      </div>
    </div>
  );
};

export default FigmaDashboardContent;
