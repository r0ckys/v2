import React from 'react';
import FigmaViewsChart from './FigmaViewsChart';

interface FigmaAnalyticsChartProps {
  timeFilter?: string;
  onTimeFilterChange?: (filter: string) => void;
}

const FigmaAnalyticsChart: React.FC<FigmaAnalyticsChartProps> = ({
  timeFilter = 'December 2025',
  onTimeFilterChange = () => {}
}) => {
  return (
    <div className="flex flex-col gap-3 sm:gap-4">
      {/* Filters - Wrap on mobile */}
      <div className="flex flex-wrap justify-end items-center gap-1.5 sm:gap-2">
        <div className="px-2 py-1 bg-white rounded-lg flex justify-center items-center gap-2.5">
          <div className="justify-start text-neutral-400 text-sm font-medium font-['Poppins']">Day</div>
        </div>
        <div className="px-2 py-1 bg-gradient-to-b from-orange-500 to-amber-500 rounded-lg flex justify-center items-center gap-2.5">
          <div className="justify-start text-white text-sm font-medium font-['Poppins']">Month</div>
        </div>
        <div className="px-2 py-1 bg-white rounded-lg flex justify-center items-center gap-2.5">
          <div className="justify-start text-neutral-400 text-sm font-medium font-['Poppins']">Year</div>
        </div>
        <div className="px-2 py-1 bg-white rounded-lg flex justify-center items-center gap-2.5">
          <div className="justify-start text-neutral-400 text-sm font-medium font-['Poppins']">All Time</div>
        </div>
        <div className="px-2 sm:px-3 py-1 sm:py-1.5 bg-gradient-to-r from-sky-400 to-blue-500 rounded-lg flex justify-center items-center gap-1 sm:gap-2">
          <div className="justify-start text-white text-xs sm:text-sm font-normal font-['Lato']">December 2025</div>
          <div className="w-5 h-5 relative">
            <div className="w-4 h-[1.25px] left-[1.88px] top-[5.21px] absolute bg-white" />
            <div className="w-3 h-[1.25px] left-[4.38px] top-[9.38px] absolute bg-white" />
            <div className="w-1 h-[1.25px] left-[7.71px] top-[13.54px] absolute bg-white" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full h-64 sm:h-72 relative bg-white rounded-lg overflow-hidden overflow-x-auto">
        <div className="h-40 sm:h-48 left-[10px] top-[13px] absolute inline-flex justify-start items-center gap-2">
          <div className="origin-top-left -rotate-90 text-center justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Units of measure</div>
          <div className="w-0 self-stretch outline outline-[0.70px] outline-offset-[-0.35px] outline-stone-300" />
        </div>
        <div className="left-[47px] right-[18px] top-[16px] absolute inline-flex justify-between items-end">
          <div className="inline-flex flex-col justify-center items-center gap-1">
            <div className="inline-flex justify-start items-end gap-1">
              <div className="w-6 h-20 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">30</div>
              </div>
              <div className="w-6 h-24 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">35</div>
              </div>
              <div className="w-6 h-32 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">40</div>
              </div>
            </div>
            <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Jan 25</div>
          </div>
          <div className="inline-flex flex-col justify-center items-center gap-1">
            <div className="inline-flex justify-start items-end gap-1">
              <div className="w-6 h-20 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">30</div>
              </div>
              <div className="w-6 h-24 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">35</div>
              </div>
              <div className="w-6 h-36 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">55</div>
              </div>
            </div>
            <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Jan 26</div>
          </div>
          <div className="inline-flex flex-col justify-center items-center gap-1">
            <div className="inline-flex justify-start items-end gap-1">
              <div className="w-6 h-20 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">30</div>
              </div>
              <div className="w-6 h-24 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">35</div>
              </div>
              <div className="w-6 h-48 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">70</div>
              </div>
            </div>
            <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Jan 27</div>
          </div>
          <div className="inline-flex flex-col justify-center items-center gap-1">
            <div className="inline-flex justify-start items-end gap-1">
              <div className="w-6 h-20 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">30</div>
              </div>
              <div className="w-6 h-24 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">35</div>
              </div>
              <div className="w-6 h-36 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">55</div>
              </div>
            </div>
            <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Jan 28</div>
          </div>
          <div className="inline-flex flex-col justify-center items-center gap-1">
            <div className="inline-flex justify-start items-end gap-1">
              <div className="w-6 h-20 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">30</div>
              </div>
              <div className="w-6 h-24 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">35</div>
              </div>
              <div className="w-6 h-32 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">40</div>
              </div>
            </div>
            <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Jan 29</div>
          </div>
          <div className="inline-flex flex-col justify-center items-center gap-1">
            <div className="inline-flex justify-start items-end gap-1">
              <div className="w-6 h-20 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">30</div>
              </div>
              <div className="w-6 h-24 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">35</div>
              </div>
              <div className="w-6 h-40 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">60</div>
              </div>
            </div>
            <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Jan 30</div>
          </div>
          <div className="inline-flex flex-col justify-center items-center gap-1">
            <div className="inline-flex justify-start items-end gap-1">
              <div className="w-6 h-20 relative bg-gradient-to-b from-sky-400 to-blue-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-center justify-start text-white text-base font-semibold font-['Lato']">30</div>
              </div>
              <div className="w-6 h-24 relative bg-gradient-to-b from-amber-500 to-orange-500 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">35</div>
              </div>
              <div className="w-6 h-32 relative bg-gradient-to-b from-violet-400 to-indigo-600 overflow-hidden">
                <div className="left-[2px] top-[5px] absolute origin-top-left -rotate-90 text-right justify-start text-white text-base font-semibold font-['Lato']">40</div>
              </div>
            </div>
            <div className="justify-start text-neutral-600 text-xs font-normal font-['DM_Sans']">Jan 31</div>
          </div>
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
