
interface TrendChartProps {
  visitorData?: number[][];
  orderData?: number[][];
}

export const TrendChart = ({ 
  visitorData = [[0, 0], [5, 32], [10, 32], [16, 68], [22, 45], [31, 88]],
  orderData = [[0, 0], [6, 22], [12, 26], [16, 46], [20, 38], [24, 42], [31, 82]],
}: TrendChartProps) => {

  // Helper to convert data points to SVG path string
  const chartHeight = 100;
  
  const getPath = (data: number[][]) => {
    return data.map((p, i) => {
      const x = (p[0] / 31) * 400;
      const y = chartHeight - (p[1] / 100) * chartHeight;
      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
    }).join(' ');
  };

  const getAreaPath = (linePath: string) => `${linePath} L400,${chartHeight} L0,${chartHeight} Z`;

  const visitorLine = getPath(visitorData);
  const orderLine = getPath(orderData);
  
  const yAxisValues = [100, 75, 50, 25, 0];

  return (
    <div className="w-full h-full flex flex-col">
      {/* Chart Area */}
      <div className="relative flex-1 flex">
        
        {/* Y-Axis Labels */}
        <div className="flex flex-col justify-between h-full w-8 pr-2 flex-shrink-0">
          {yAxisValues.map((val) => (
            <div 
              key={val} 
              className="text-[10px] font-medium text-gray-400 text-right leading-none"
            >
              {val}
            </div>
          ))}
        </div>

        {/* Grid and Data Visualization */}
        <div className="relative flex-1">
          
          {/* Horizontal Grid Lines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
            {yAxisValues.map((_, i) => (
              <div key={i} className="w-full h-px bg-gray-200" />
            ))}
          </div>

          {/* SVG Data Visualization */}
          <svg 
            className="absolute inset-0 w-full h-full overflow-visible" 
            viewBox="0 0 400 100" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="visitorArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="orderArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF8A00" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#FF8A00" stopOpacity="0.1" />
              </linearGradient>
            </defs>

            <path d={getAreaPath(visitorLine)} fill="url(#visitorArea)" />
            <path d={getAreaPath(orderLine)} fill="url(#orderArea)" />

            <path d={visitorLine} fill="none" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="2,2" />
            <path d={orderLine} fill="none" stroke="#FF8A00" strokeWidth="1.5" strokeDasharray="2,2" />
          </svg>
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex justify-between pl-8 pt-1">
        {[1, 8, 15, 22, 31].map((day) => (
          <div key={day} className="text-[9px] font-medium text-gray-400 text-center">
            {day}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrendChart;