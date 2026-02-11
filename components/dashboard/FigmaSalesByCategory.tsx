import React from 'react';

interface CategoryData {
  name: string;
  percentage: number;
  color: string;
  bgColor: string;
  textColor: string;
}

interface FigmaSalesByCategoryProps {
  categories?: CategoryData[];
}

const FigmaSalesByCategory: React.FC<FigmaSalesByCategoryProps> = ({
  categories = [
    { name: 'Hair care', percentage: 15, color: '#4F46E5', bgColor: 'bg-indigo-600', textColor: 'text-indigo-600' },
    { name: 'Serum', percentage: 15, color: '#FB923C', bgColor: 'bg-orange-400', textColor: 'text-orange-400' },
    { name: 'Cream', percentage: 15, color: '#FCA5A5', bgColor: 'bg-red-300', textColor: 'text-red-300' },
    { name: 'Home & kitchen', percentage: 15, color: '#EF4444', bgColor: 'bg-red-500', textColor: 'text-red-500' },
    { name: 'Lip care', percentage: 15, color: '#A3E635', bgColor: 'bg-lime-400', textColor: 'text-lime-400' },
    { name: 'Air Conditioner', percentage: 15, color: '#38BDF8', bgColor: 'bg-sky-400', textColor: 'text-slate-600' },
    { name: 'Skin care', percentage: 15, color: '#A21CAF', bgColor: 'bg-fuchsia-700', textColor: 'text-fuchsia-700' }
  ]
}) => {
  // Calculate angles for pie chart
  let currentAngle = 0;
  const segments = categories.map((category) => {
    const angle = (category.percentage / 100) * 360;
    const segment = {
      ...category,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
      angle
    };
    currentAngle += angle;
    return segment;
  });

  // Function to create SVG path for pie segment
  const createPath = (startAngle: number, endAngle: number, outerRadius: number, innerRadius: number = 0) => {
    const start = polarToCartesian(100, 100, outerRadius, endAngle);
    const end = polarToCartesian(100, 100, outerRadius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
    
    if (innerRadius > 0) {
      const innerStart = polarToCartesian(100, 100, innerRadius, endAngle);
      const innerEnd = polarToCartesian(100, 100, innerRadius, startAngle);
      return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", innerEnd.x, innerEnd.y,
        "A", innerRadius, innerRadius, 0, largeArcFlag, 1, innerStart.x, innerStart.y,
        "Z"
      ].join(" ");
    } else {
      return [
        "M", start.x, start.y,
        "A", outerRadius, outerRadius, 0, largeArcFlag, 0, end.x, end.y,
        "L", 100, 100,
        "Z"
      ].join(" ");
    }
  };

  const polarToCartesian = (centerX: number, centerY: number, radius: number, angleInDegrees: number) => {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  };

  return (
    <div className="w-full h-auto min-h-[350px] sm:h-96 p-4 sm:p-5 bg-white rounded-[10px] shadow-[0px_1px_6px_1px_rgba(0,0,0,0.25)] overflow-hidden flex flex-col">
      {/* Title */}
      <div className="mb-3 sm:mb-4">
        <div className="text-zinc-800 text-base sm:text-lg font-bold font-['Lato']">Sale By Category</div>
      </div>

      {/* Pie Chart - Donut style */}
      <div className="flex-shrink-0 w-36 h-36 sm:w-48 sm:h-48 mx-auto overflow-hidden">
        <svg width="100%" height="100%" viewBox="0 0 200 200" className="transform -rotate-90">
          {segments.map((segment, index) => (
            <path
              key={index}
              d={createPath(segment.startAngle, segment.endAngle, 90, 50)}
              fill={segment.color}
            />
          ))}
        </svg>
      </div>

      {/* Legend - Responsive grid */}
      <div className="mt-4 sm:mt-6 grid grid-cols-2 gap-x-2 gap-y-1.5 sm:gap-x-4 sm:gap-y-2.5">
        {categories.map((category, index) => (
          <div key={index} className="flex justify-start items-center gap-1.5 sm:gap-2.5">
            <div className={`w-2.5 h-2.5 sm:w-3 sm:h-3 ${category.bgColor} rounded-full flex-shrink-0`} />
            <div className="justify-start truncate">
              <span className="text-black text-xs sm:text-sm font-medium font-['Satoshi']">{category.name}(</span>
              <span className={`${category.textColor} text-xs sm:text-sm font-medium font-['Satoshi']`}>{category.percentage}%</span>
              <span className="text-black text-xs sm:text-sm font-medium font-['Satoshi']">)</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaSalesByCategory;
