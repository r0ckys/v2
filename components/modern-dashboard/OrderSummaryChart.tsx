
interface OrderStatus {
  label: string;
  percentage: number;
  color: string;
  bgColor: string;
}

interface DonutChartProps {
  data: OrderStatus[];
  total: number;
}

/**
 * A dynamic Donut Chart component that renders based on percentage values.
 */
export const DonutChart = ({ data }: DonutChartProps) => {
  let cumulativePercentage = 0;
  const radius = 40;
  const strokeWidth = 12;
  const center = 50;
  const circumference = 2 * Math.PI * radius;

  return (
    <svg 
      viewBox="0 0 100 100" 
      className="w-full h-full transform -rotate-90"
    >
      {data.map((item, index) => {
        const strokeDasharray = `${(item.percentage * circumference) / 100} ${circumference}`;
        const strokeDashoffset = -(cumulativePercentage * circumference) / 100;
        cumulativePercentage += item.percentage;

        return (
          <circle
            key={index}
            cx={center}
            cy={center}
            r={radius}
            fill="transparent"
            stroke={item.color}
            strokeWidth={strokeWidth}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-500 ease-in-out"
          />
        );
      })}
    </svg>
  );
};

/**
 * OrderSummaryChart Component
 */
function OrderSummaryChart() {
  const orderStatuses = [
    {
      label: "Pending",
      percentage: 31,
      color: "#26007e",
      bgColor: "bg-[#26007e]",
    },
    {
      label: "Confirmed",
      percentage: 20,
      color: "#7ad100",
      bgColor: "bg-[#7ad100]",
    },
    {
      label: "Delivered",
      percentage: 14,
      color: "#1883ff",
      bgColor: "bg-[#1883ff]",
    },
    {
      label: "Canceled",
      percentage: 11,
      color: "#fab300",
      bgColor: "bg-[#fab300]",
    },
    {
      label: "Paid Returned",
      percentage: 15,
      color: "#c71cb6",
      bgColor: "bg-[#c71cb6]",
    },
    {
      label: "Returned",
      percentage: 9,
      color: "#da0000",
      bgColor: "bg-[#da0000]",
    },
  ];

  const totalOrders = 1250;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <section
        className="flex flex-col w-full max-w-[408px] h-auto min-h-[310px] items-start gap-5 px-6 py-6 bg-white rounded-xl shadow-sm overflow-hidden"
        aria-labelledby="order-summary-title"
      >
        <header className="w-full border-b border-gray-50 pb-2">
          <h2
            id="order-summary-title"
            className="text-[#23272e] font-bold text-lg tracking-tight"
          >
            Order Summary
          </h2>
        </header>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-8 w-full">
          {/* Chart Container */}
          <div className="relative w-[180px] h-[180px] flex-shrink-0">
            <DonutChart data={orderStatuses} total={totalOrders} />
            
            {/* Center Text Overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Total</span>
              <span className="text-black font-extrabold text-3xl leading-none my-0.5">
                {totalOrders}
              </span>
              <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Orders</span>
            </div>
          </div>

          {/* Legend Section */}
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <ul className="grid grid-cols-1 gap-2.5" role="list">
              {orderStatuses.map((status, index) => (
                <li
                  key={index}
                  className="flex items-center gap-3"
                >
                  <span
                    className={`flex-shrink-0 w-2.5 h-2.5 ${status.bgColor} rounded-full`}
                    aria-hidden="true"
                  />
                  <p className="text-sm font-semibold whitespace-nowrap">
                    <span className="text-slate-700">{status.label} </span>
                    <span className="text-gray-400 font-normal ml-0.5">(</span>
                    <span style={{ color: status.color }}>
                      {status.percentage}%
                    </span>
                    <span className="text-gray-400 font-normal">)</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}

export default OrderSummaryChart;