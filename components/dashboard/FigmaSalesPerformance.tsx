import React from 'react';

interface ChartData {
  day: number;
  placedOrder: number;
  delivered: number;
  canceled: number;
}

interface FigmaSalesPerformanceProps {
  data?: ChartData[];
}

const FigmaSalesPerformance: React.FC<FigmaSalesPerformanceProps> = ({
  data = [
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
  ]
}) => {
  const maxValue = 100;
  
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

  return (
    <div className="w-full h-72 sm:h-80 md:h-96 p-2 sm:p-2.5 bg-white rounded-[10px] outline outline-1 outline-offset-[-0.50px] outline-zinc-200 flex flex-col justify-start items-start gap-1.5 sm:gap-2.5 overflow-hidden">
      {/* Header */}
      <div className="w-full flex justify-start items-center gap-2.5">
        <div className="text-zinc-800 text-base sm:text-lg font-bold font-['Lato']">Sale Performance</div>
      </div>
      
      {/* Legend - Wrap on mobile */}
      <div className="flex flex-wrap justify-start items-center gap-2 sm:gap-4">
        <div className="text-sky-400 text-xs sm:text-sm font-bold font-['Poppins']">Placed Order</div>
        <div className="text-orange-500 text-xs sm:text-sm font-bold font-['Poppins']">Order Delivered</div>
        <div className="text-red-700 text-xs sm:text-sm font-bold font-['Poppins']">Order Cancel</div>
      </div>

      {/* Chart Area */}
      <div className="flex-1 w-full flex overflow-x-auto">
        {/* Y-axis labels */}
        <div className="flex flex-col justify-between h-full pr-2">
          {[100, 75, 50, 25, 0].map((val) => (
            <div key={val} className="w-6 h-9 opacity-50 text-right text-neutral-900 text-[10px] font-medium font-['Poppins'] flex items-center justify-end">
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
              className="absolute w-full h-0 outline outline-1 outline-offset-[-0.50px] outline-zinc-300" 
              style={{ top: `${i * 25}%` }} 
            />
          ))}
          
          {/* Line chart */}
          <svg className="w-full h-full absolute top-0 left-0" viewBox="0 0 700 180" preserveAspectRatio="none">
            {/* Placed Order (sky-400) */}
            <path
              d={createSharpPath(data.map(d => d.placedOrder), 700, 180)}
              fill="none"
              stroke="#38BDF8"
              strokeWidth="2"
            />
            {/* Order Delivered (orange-500) */}
            <path
              d={createSharpPath(data.map(d => d.delivered), 700, 180)}
              fill="none"
              stroke="#F97316"
              strokeWidth="2"
            />
            {/* Order Cancel (red-700) */}
            <path
              d={createSharpPath(data.map(d => d.canceled), 700, 180)}
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
          <div key={i} className="opacity-50 text-neutral-900 text-[10px] font-medium font-['Poppins']">
            {i + 1}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaSalesPerformance;
