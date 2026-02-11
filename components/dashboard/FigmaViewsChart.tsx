import React from 'react';

interface BarGroupProps {
  date: string;
  mobileValue: number;
  tabValue: number;
  desktopValue: number;
}

const BarGroup: React.FC<BarGroupProps> = ({ date, mobileValue, tabValue, desktopValue }) => {
  // Height mapping: value 30 = h-20 (80px), scale proportionally
  const getHeightClass = (val: number) => {
    if (val <= 30) return 'h-20';
    if (val <= 35) return 'h-24';
    if (val <= 40) return 'h-32';
    if (val <= 55) return 'h-36';
    if (val <= 60) return 'h-40';
    return 'h-48';
  };

  return (
    <div className="inline-flex flex-col justify-center items-center gap-1">
      <div className="inline-flex justify-start items-end gap-1">
        <div className={`w-6 ${getHeightClass(mobileValue)} relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden`}>
          <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">{mobileValue}</div>
        </div>
        <div className={`w-6 ${getHeightClass(tabValue)} relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden`}>
          <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">{tabValue}</div>
        </div>
        <div className={`w-6 ${getHeightClass(desktopValue)} relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden`}>
          <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">{desktopValue}</div>
        </div>
      </div>
      <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">{date}</div>
    </div>
  );
};

interface FigmaViewsChartProps {
  chartData?: {
    date: string;
    mobile: number;
    tab: number;
    desktop: number;
  }[];
}

const FigmaViewsChart: React.FC<FigmaViewsChartProps> = ({
  chartData = [
    { date: 'Jan 25', mobile: 30, tab: 35, desktop: 40 },
    { date: 'Jan 26', mobile: 30, tab: 35, desktop: 55 },
    { date: 'Jan 27', mobile: 30, tab: 35, desktop: 70 },
    { date: 'Jan 28', mobile: 30, tab: 35, desktop: 55 },
    { date: 'Jan 29', mobile: 30, tab: 35, desktop: 40 },
    { date: 'Jan 30', mobile: 30, tab: 35, desktop: 60 },
    { date: 'Jan 31', mobile: 30, tab: 35, desktop: 40 },
  ]
}) => {
  return (
    <div className="w-full h-72 relative overflow-hidden">
      {/* Y-axis label */}
      <div className="h-48 left-[10px] top-[13px] absolute inline-flex justify-start items-center gap-2">
        <div className="origin-top-left -rotate-90 text-center justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Units of measure</div>
        <div className="w-0 self-stretch outline outline-[0.70px] outline-offset-[-0.35px] outline-stone-300" />
      </div>

      {/* Chart Bars */}
      <div className="left-[47px] right-4 top-[16px] absolute inline-flex justify-between items-end">
        {chartData.map((data, index) => (
          <BarGroup
            key={index}
            date={data.date}
            mobileValue={data.mobile}
            tabValue={data.tab}
            desktopValue={data.desktop}
          />
        ))}
      </div>

      <div className="w-9 h-12 left-[10px] top-[205px] absolute" />

      {/* Legend */}
      <div className="left-0 right-0 top-[238px] absolute inline-flex justify-center items-center gap-6 md:gap-12">
        <div className="flex justify-center items-center gap-2.5">
          <div className="w-5 h-5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-3xl" />
          <div className="text-center justify-start text-neutral-600 text-xs font-medium font-['DM_Sans']">Mobile View</div>
        </div>
        <div className="flex justify-center items-center gap-2.5">
          <div className="w-5 h-5 bg-gradient-to-b from-orange-500 to-amber-500 rounded-3xl" />
          <div className="text-center justify-start text-neutral-600 text-xs font-medium font-['DM_Sans']">Tab View</div>
        </div>
        <div className="flex justify-center items-center gap-2.5">
          <div className="w-5 h-5 bg-gradient-to-b from-violet-400 to-indigo-600 rounded-3xl" />
          <div className="text-center justify-start text-neutral-600 text-xs font-medium font-['DM_Sans']">Desktop View</div>
        </div>
      </div>
    </div>
  );
};

export default FigmaViewsChart;
