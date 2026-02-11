import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';
import FigmaViewsChart from './FigmaViewsChart';
import CustomDateRangePicker, { DateRange } from './CustomDateRangePicker';

type DateRangeType = 'day' | 'month' | 'year' | 'all' | 'custom';

interface ChartDataPoint {
  date: string;
  mobile: number;
  tablet: number;
  desktop: number;
}

interface FigmaAnalyticsChartProps {
  timeFilter?: string;
  onTimeFilterChange?: (filter: string) => void;
  onDateRangeChange?: (range: { start: Date; end: Date }) => void;
  tenantId?: string;
  chartData?: ChartDataPoint[];
}

const FigmaAnalyticsChart: React.FC<FigmaAnalyticsChartProps> = ({
  timeFilter = 'December 2025',
  onTimeFilterChange = () => {},
  onDateRangeChange,
  tenantId,
  chartData: propChartData
}) => {
  const [dateRange, setDateRange] = useState<DateRangeType>('month');
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [customDateRange, setCustomDateRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);

  const dateRangeOptions = [
    { id: 'day' as DateRangeType, label: 'Day' },
    { id: 'month' as DateRangeType, label: 'Month' },
    { id: 'year' as DateRangeType, label: 'Year' },
    { id: 'all' as DateRangeType, label: 'All Time' },
  ];

  // Fetch visitor chart data
  useEffect(() => {
    if (propChartData) {
      setChartData(propChartData);
      setLoading(false);
      return;
    }

    const fetchChartData = async () => {
      const activeTenantId = tenantId || localStorage.getItem('activeTenantId');
      if (!activeTenantId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001';
        
        let url = `${apiUrl}/api/visitors/${activeTenantId}/stats`;
        const params = new URLSearchParams();

        if (dateRange === 'custom' && customDateRange.startDate && customDateRange.endDate) {
          params.set('startDate', customDateRange.startDate.toISOString());
          params.set('endDate', customDateRange.endDate.toISOString());
        } else if (dateRange === 'month') {
          params.set('month', String(selectedMonth.getMonth() + 1));
          params.set('year', String(selectedMonth.getFullYear()));
        } else {
          params.set('period', dateRange);
        }

        const response = await fetch(`${url}?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          setChartData(data.chartData || []);
        }
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [propChartData, tenantId, dateRange, selectedMonth, customDateRange]);

  // Get display data - last 7 entries or fill with empty
  const displayData = useMemo(() => {
    if (chartData.length === 0) {
      // Generate last 7 days as fallback
      const days = [];
      for (let i = 6; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        days.push({
          date: date.toISOString().split('T')[0],
          mobile: 0,
          tablet: 0,
          desktop: 0
        });
      }
      return days;
    }
    return chartData.slice(-7);
  }, [chartData]);

  // Calculate max value for scaling bars
  const maxValue = useMemo(() => {
    return Math.max(
      100,
      ...displayData.flatMap(d => [d.mobile, d.tablet, d.desktop])
    );
  }, [displayData]);

  // Format date for display
  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { month: 'short', day: 'numeric' });
  };

  // Calculate bar height (max 192px for h-48)
  const getBarHeight = (value: number) => {
    return Math.max(20, Math.round((value / maxValue) * 192));
  };

  const handleDateRangeClick = (rangeType: DateRangeType) => {
    setDateRange(rangeType);
    setShowCustomPicker(false);
    onTimeFilterChange(rangeType);
  };

  const handleMonthChange = (direction: 'prev' | 'next') => {
    const newMonth = new Date(selectedMonth);
    newMonth.setMonth(newMonth.getMonth() + (direction === 'next' ? 1 : -1));
    setSelectedMonth(newMonth);
    onTimeFilterChange(newMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' }));
  };

  const handleCustomApply = (range: DateRange) => {
    setCustomDateRange(range);
    setDateRange('custom');
    setShowCustomPicker(false);
    if (range.startDate && range.endDate && onDateRangeChange) {
      onDateRangeChange({ start: range.startDate, end: range.endDate });
    }
  };

  const formatCustomRange = () => {
    if (!customDateRange.startDate || !customDateRange.endDate) return 'Custom';
    const formatDate = (d: Date) => d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return `${formatDate(customDateRange.startDate)} - ${formatDate(customDateRange.endDate)}`;
  };

  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Filters - Wrap on mobile */}
      <div className="flex flex-wrap justify-end items-center gap-1.5 sm:gap-2 relative">
        {dateRangeOptions.map((option) => (
          <button
            key={option.id}
            onClick={() => handleDateRangeClick(option.id)}
            className={`px-2 py-1 rounded-lg flex justify-center items-center gap-2.5 cursor-pointer transition-all ${
              dateRange === option.id
                ? 'bg-gradient-to-b from-orange-500 to-amber-500'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className={`text-sm font-medium font-['Poppins'] ${
              dateRange === option.id ? 'text-white' : 'text-neutral-400'
            }`}>
              {option.label}
            </span>
          </button>
        ))}

        {/* Month Selector - shown when Month is selected */}
        {dateRange === 'month' && (
          <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex justify-center items-center gap-1 sm:gap-2">
            <button 
              onClick={() => handleMonthChange('prev')}
              className="text-white hover:opacity-80"
            >
              <ChevronLeft size={14} />
            </button>
            <span className="text-white text-xs sm:text-sm font-normal font-['Lato'] min-w-[100px] text-center">
              {selectedMonth.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
            </span>
            <button 
              onClick={() => handleMonthChange('next')}
              className="text-white hover:opacity-80"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        )}

        {/* Custom Date Range Display */}
        {dateRange === 'custom' && customDateRange.startDate && (
          <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex justify-center items-center gap-1">
            <span className="text-white text-xs sm:text-sm font-normal font-['Lato']">
              {formatCustomRange()}
            </span>
          </div>
        )}

        {/* Custom Button with Dropdown */}
        <div className="relative">
          <button
            onClick={() => {
              if (dateRange === 'custom') {
                setShowCustomPicker(!showCustomPicker);
              } else {
                setShowCustomPicker(true);
              }
            }}
            className={`px-2 py-1 rounded-lg flex justify-center items-center gap-1.5 cursor-pointer transition-all ${
              dateRange === 'custom'
                ? 'bg-gradient-to-b from-orange-500 to-amber-500'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            <span className={`text-sm font-medium font-['Poppins'] ${
              dateRange === 'custom' ? 'text-white' : 'text-neutral-400'
            }`}>
              Custom
            </span>
            <ChevronDown size={14} className={`${dateRange === 'custom' ? 'text-white' : 'text-neutral-400'} ${showCustomPicker ? 'rotate-180' : ''} transition-transform`} />
          </button>
          
          <CustomDateRangePicker
            isOpen={showCustomPicker}
            onClose={() => setShowCustomPicker(false)}
            onApply={handleCustomApply}
            initialDateRange={customDateRange}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-72 relative bg-white rounded-lg overflow-hidden overflow-x-auto">
        <div className="h-40 sm:h-48 left-[10px] top-[13px] absolute inline-flex justify-start items-center gap-2">
          <div className="origin-top-left -rotate-90 text-center justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Units of measure</div>
          <div className="w-0 self-stretch outline outline-[0.70px] outline-offset-[-0.35px] outline-stone-300" />
        </div>
        
        {/* Dynamic bars */}
        <div className="left-[47px] right-[18px] top-[16px] absolute inline-flex justify-between items-end">
          {loading ? (
            // Loading skeleton
            Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="inline-flex flex-col justify-center items-center gap-1">
                <div className="inline-flex justify-start items-end gap-1">
                  <div className="w-6 h-20 bg-gray-200 animate-pulse" />
                  <div className="w-6 h-24 bg-gray-200 animate-pulse" />
                  <div className="w-6 h-28 bg-gray-200 animate-pulse" />
                </div>
                <div className="w-10 h-3 bg-gray-200 animate-pulse rounded" />
              </div>
            ))
          ) : (
            displayData.map((day, index) => (
              <div key={index} className="inline-flex flex-col justify-center items-center gap-1">
                <div className="inline-flex justify-start items-end gap-1">
                  {/* Mobile - Blue */}
                  <div 
                    className="w-6 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden transition-all duration-300"
                    style={{ height: `${getBarHeight(day.mobile)}px` }}
                  >
                    {day.mobile > 0 && (
                      <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center text-white text-base font-semibold font-['Lato']">
                        {day.mobile}
                      </div>
                    )}
                  </div>
                  {/* Tablet - Orange */}
                  <div 
                    className="w-6 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden transition-all duration-300"
                    style={{ height: `${getBarHeight(day.tablet)}px` }}
                  >
                    {day.tablet > 0 && (
                      <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right text-white text-base font-semibold font-['Lato']">
                        {day.tablet}
                      </div>
                    )}
                  </div>
                  {/* Desktop - Purple */}
                  <div 
                    className="w-6 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden transition-all duration-300"
                    style={{ height: `${getBarHeight(day.desktop)}px` }}
                  >
                    {day.desktop > 0 && (
                      <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right text-white text-base font-semibold font-['Lato']">
                        {day.desktop}
                      </div>
                    )}
                  </div>
                </div>
                <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">
                  {formatDateLabel(day.date)}
                </div>
              </div>
            ))
          )}
        </div>
        
        <div className="w-9 h-12 left-[10px] top-[205px] absolute" />
        <div className="left-0 right-0 top-[200px] sm:top-[238px] absolute inline-flex flex-wrap justify-center items-center gap-3 sm:gap-6 md:gap-12 px-2">
          <div className="flex justify-center items-center gap-1.5 sm:gap-2.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-3xl" />
            <div className="text-center justify-start text-neutral-600 text-[10px] sm:text-xs font-medium font-['DM_Sans']">Mobile View</div>
          </div>
          <div className="flex justify-center items-center gap-1.5 sm:gap-2.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-3xl" />
            <div className="text-center justify-start text-neutral-600 text-[10px] sm:text-xs font-medium font-['DM_Sans']">Tab View</div>
          </div>
          <div className="flex justify-center items-center gap-1.5 sm:gap-2.5">
            <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-b from-violet-400 to-indigo-600 rounded-3xl" />
            <div className="text-center justify-start text-neutral-600 text-[10px] sm:text-xs font-medium font-['DM_Sans']">Desktop View</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaAnalyticsChart;
