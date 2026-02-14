import React, { useMemo } from 'react';
import { Order } from '../../types';

interface ChartData {
  day: number;
  placedOrder: number;
  delivered: number;
  canceled: number;
}

interface FigmaSalesPerformanceProps {
  orders?: Order[];
  data?: ChartData[];
}

const FigmaSalesPerformance: React.FC<FigmaSalesPerformanceProps> = ({
  orders = [],
  data: propData
}) => {
  // Calculate chart data from orders if not provided
  const data = useMemo(() => {
    if (propData && propData.length > 0) return propData;
    
    // Get current month's days
    const now = new Date();
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    
    // Initialize data for each day
    const dailyData: ChartData[] = Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      placedOrder: 0,
      delivered: 0,
      canceled: 0
    }));

    // Process orders
    orders.forEach(order => {
      const orderDate = order.createdAt ? new Date(order.createdAt) : null;
      if (!orderDate || orderDate.getMonth() !== now.getMonth() || orderDate.getFullYear() !== now.getFullYear()) return;
      
      const dayIndex = orderDate.getDate() - 1;
      if (dayIndex >= 0 && dayIndex < daysInMonth) {
        dailyData[dayIndex].placedOrder++;
        if (order.status === 'Delivered') dailyData[dayIndex].delivered++;
        if (order.status === 'Cancelled') dailyData[dayIndex].canceled++;
      }
    });

    // Convert to cumulative for smooth chart
    let cumulativePlaced = 0;
    let cumulativeDelivered = 0;
    let cumulativeCanceled = 0;
    
    return dailyData.map(d => {
      cumulativePlaced += d.placedOrder;
      cumulativeDelivered += d.delivered;
      cumulativeCanceled += d.canceled;
      return {
        day: d.day,
        placedOrder: cumulativePlaced,
        delivered: cumulativeDelivered,
        canceled: cumulativeCanceled
      };
    });
  }, [orders, propData]);

  // Use calculated data or fallback
  const chartData = data.length > 0 ? data : [
    { day: 1, placedOrder: 0, delivered: 0, canceled: 0 },
    { day: 2, placedOrder: 5, delivered: 3, canceled: 0 },
    { day: 3, placedOrder: 8, delivered: 5, canceled: 0 },
    { day: 4, placedOrder: 10, delivered: 8, canceled: 0 },
    { day: 5, placedOrder: 18, delivered: 15, canceled: 0 },
    { day: 6, placedOrder: 20, delivered: 18, canceled: 0 },
    { day: 7, placedOrder: 20, delivered: 18, canceled: 0 },
    { day: 8, placedOrder: 22, delivered: 15, canceled: 0 },
    { day: 9, placedOrder: 25, delivered: 15, canceled: 0 },
    { day: 10, placedOrder: 28, delivered: 15, canceled: 0 },
    { day: 11, placedOrder: 30, delivered: 15, canceled: 0 },
    { day: 12, placedOrder: 35, delivered: 18, canceled: 2 },
    { day: 13, placedOrder: 38, delivered: 22, canceled: 3 },
    { day: 14, placedOrder: 42, delivered: 28, canceled: 3 },
    { day: 15, placedOrder: 48, delivered: 32, canceled: 5 },
    { day: 16, placedOrder: 52, delivered: 35, canceled: 5 },
    { day: 17, placedOrder: 55, delivered: 35, canceled: 5 },
    { day: 18, placedOrder: 35, delivered: 25, canceled: 0 },
    { day: 19, placedOrder: 32, delivered: 25, canceled: 0 },
    { day: 20, placedOrder: 35, delivered: 30, canceled: 0 },
    { day: 21, placedOrder: 40, delivered: 32, canceled: 0 },
    { day: 22, placedOrder: 45, delivered: 35, canceled: 0 },
    { day: 23, placedOrder: 50, delivered: 38, canceled: 0 },
    { day: 24, placedOrder: 55, delivered: 42, canceled: 0 },
    { day: 25, placedOrder: 58, delivered: 45, canceled: 0 },
    { day: 26, placedOrder: 62, delivered: 50, canceled: 0 },
    { day: 27, placedOrder: 65, delivered: 55, canceled: 0 },
    { day: 28, placedOrder: 70, delivered: 60, canceled: 0 },
    { day: 29, placedOrder: 72, delivered: 62, canceled: 0 },
    { day: 30, placedOrder: 75, delivered: 65, canceled: 0 },
    { day: 31, placedOrder: 78, delivered: 68, canceled: 0 },
  ];

  const maxValue = Math.max(100, ...chartData.map(d => Math.max(d.placedOrder, d.delivered, d.canceled)));
  
  // Creates sharp angular lines (not smooth curves)
  const createSharpPath = (values: number[], chartWidth: number, chartHeight: number) => {
    const points = values.map((value, index) => ({
      x: (index / (values.length - 1)) * chartWidth,
      y: chartHeight - (value / maxValue) * chartHeight
    }));
    if (points.length < 2) return '';
    let path = `M ${points[0].x},${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      path += ` L ${points[i].x},${points[i].y}`;
    }
    return path;
  };

  // Year selection state
  const [selectedYear, setSelectedYear] = React.useState<number>(new Date().getFullYear());
  const [showYearDropdown, setShowYearDropdown] = React.useState(false);
  const [customMode, setCustomMode] = React.useState(false);

  // Last 5 years for custom selection
  const last5Years = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 5 }, (_, i) => current - i);
  }, []);

  return (
    <div className="w-full h-80 sm:h-96 p-3 sm:p-4 bg-white dark:bg-gray-800 rounded-xl border border-zinc-200 dark:border-gray-700 flex flex-col justify-start items-start gap-2 overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-between items-center gap-2.5">
        <div className="text-zinc-800 dark:text-white text-lg font-bold font-['Lato']">Sale Performance</div>
        {/* Year/Custom Selector */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full text-sm font-medium ${!customMode ? 'bg-orange-400 text-white border border-orange-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
            onClick={() => setCustomMode(false)}
          >
            Year
          </button>
          <div className="relative">
            <button
              className={`px-3 py-1 rounded-full text-sm font-medium ${customMode ? 'bg-orange-400 text-white border border-orange-500' : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'}`}
              onClick={() => { setCustomMode(true); setShowYearDropdown((v) => !v); }}
            >
              Custom
            </button>
            {customMode && showYearDropdown && (
              <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border border-zinc-200 dark:border-gray-700 rounded shadow-lg z-10">
                {last5Years.map((year) => (
                  <div
                    key={year}
                    className={`px-4 py-2 cursor-pointer hover:bg-orange-100 dark:hover:bg-gray-700 ${selectedYear === year ? 'font-bold text-orange-500' : ''}`}
                    onClick={() => { setSelectedYear(year); setShowYearDropdown(false); }}
                  >
                    {year}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Legend - Wrap on mobile */}
      <div className="flex flex-wrap justify-start items-center gap-3 sm:gap-6">
        <div className="text-sky-400 text-sm font-bold font-['Poppins']">Placed Order</div>
        <div className="text-orange-500 text-sm font-bold font-['Poppins']">Order Delivered</div>
        <div className="text-red-600 text-sm font-bold font-['Poppins']">Order Cancel</div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full flex overflow-x-auto">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full pr-2">
          {[100, 75, 50, 25, 0].map((val) => (
            <div key={val} className="w-6 h-9 opacity-50 text-right text-neutral-900 dark:text-gray-300 text-[10px] font-medium font-['Poppins'] flex items-center justify-end">
              {val}
            </div>
          ))}
        </div>

        {/* Chart */}
        <div className="flex-1 relative">
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <div 
              key={i} 
              className="absolute w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-300 dark:outline-gray-600" 
              style={{ top: `${i * 25}%` }} 
            />
          ))}
          {/* Line chart */}
          <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 700 180" preserveAspectRatio="none">
            {/* Placed Order (sky-400) */}
            <path
              d={createSharpPath(chartData.map(d => d.placedOrder), 700, 180)}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            {/* Order Delivered (orange-500) */}
            <path
              d={createSharpPath(chartData.map(d => d.delivered), 700, 180)}
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
            />
            {/* Order Cancel (red-700) */}
            <path
              d={createSharpPath(chartData.map(d => d.canceled), 700, 180)}
              fill="none"
              stroke="#B91C1C"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>

      {/* X-axis labels */}
      <div className="w-full pl-8 inline-flex justify-between items-center">
        {Array.from({ length: 31 }, (_, i) => (
          <div key={i} className="opacity-50 text-neutral-900 dark:text-gray-300 text-[10px] font-medium font-['Poppins']">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaSalesPerformance;
