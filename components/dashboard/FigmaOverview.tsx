import React, { useState } from 'react';

// Icon URLs
const ICON_URLS = {
  totalProduct: 'https://hdnfltv.com/image/nitimages/streamline-flex_production-belt-time__2_.webp',
  totalOrder: 'https://hdnfltv.com/image/nitimages/lets-icons_order-light__2_.webp',
  lowStock: 'https://hdnfltv.com/image/nitimages/hugeicons_hot-price__5_.webp',
  totalAmount: 'https://hdnfltv.com/image/nitimages/solar_tag-price-linear__2_.webp',
  toReview: 'https://hdnfltv.com/image/nitimages/mage_preview__1_.webp',
  totalStock: 'https://hdnfltv.com/image/nitimages/lets-icons_order-light__2_.webp'
};

interface StatCardProps {
  title: string;
  value: string | number;
  iconUrl: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, iconUrl }) => {
  return (
    <div className="bg-[#f3f4f6] h-16 bg-stone-50 rounded-lg overflow-hidden flex items-center justify-between px-4">
      <div className="flex flex-col justify-center">
        <div className="text-black text-2xl font-medium font-['Poppins']">{value}</div>
        <div className="text-black text-xs font-medium font-['Poppins']">{title}</div>
      </div>
      <div className="w-11 h-11 bg-white rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
        <img src={iconUrl} alt={title} className="w-7 h-7 object-contain" />
      </div>
    </div>
  );
};

// Combined Language and Date display component
const LanguageDateCard: React.FC<{
  currentLang: string;
  onLangChange: (lang: string) => void;
  date: string;
  dayName: string;
}> = ({ currentLang, onLangChange, date, dayName }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full max-w-2xl">
      {/* Language Selector - exact Figma design */}
      <div className="bg-[#f3f4f6] w-32 h-16 relative bg-stone-50 rounded-lg overflow-hidden">
        <div className="left-[16px] top-[10px] absolute justify-start text-black text-xs font-normal font-['Poppins']">Language</div>
        <div className="w-24 h-6 left-[16px] top-[32px] absolute bg-white/0 rounded-3xl outline outline-1 outline-offset-[-1px] outline-gray-300 overflow-hidden">
          <button 
            onClick={() => onLangChange('en')}
            className={`w-11 h-4 left-[4px] top-[4px] absolute rounded-[20px] overflow-hidden transition-all ${
              currentLang === 'en' ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <span className="left-[11px] top-[1px] absolute justify-center text-black text-xs font-normal font-['Poppins']">Eng</span>
          </button>
          <button 
            onClick={() => onLangChange('bn')}
            className={`w-11 h-4 right-[4px] top-[4px] absolute rounded-[20px] overflow-hidden transition-all ${
              currentLang === 'bn' ? 'bg-white' : 'bg-transparent'
            }`}
          >
            <span className="left-[4px] top-[1px] absolute justify-center text-black text-xs font-normal font-['Poppins']">বাংলা</span>
          </button>
        </div>
      </div>
      
      {/* Date Display - exact Figma design */}
      <div className="w-32 h-16 relative bg-stone-50 rounded-lg overflow-hidden">
        <div className="w-40 h-40 left-[26.50px] top-[22px] absolute bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
        <div className="left-[10.50px] top-[10px] absolute justify-start text-black text-base font-medium font-['Poppins']">{date}</div>
        <div className="left-[67.50px] top-[34px] absolute justify-start text-white text-2xl font-medium font-['Poppins']">{dayName}</div>
      </div>
     </div>
     
  );
};

interface NotificationCardProps {
  title: string;
  images?: string[];
}

const NotificationCard: React.FC<NotificationCardProps> = ({ title, images }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Sample notification images if none provided
  const sampleImages = images || [
    'https://hdnfltv.com/image/nitimages/pasted_1770753032030.webp',
  ];

  return (
    <div className="w-full h-full min-h-[144px] relative bg-stone-50 rounded-xl overflow-hidden p-4">
      <div className="text-black text-sm font-medium font-['Poppins'] mb-3">Important Notification</div>
      <div className="w-full h-24 bg-white rounded-lg overflow-hidden flex items-center justify-center">
        <img 
          className="w-full h-full object-contain p-2" 
          src="https://hdnfltv.com/image/nitimages/pasted_1770753032030.webp" 
          alt="Notification"
        />
      </div>
      <div className="flex justify-center items-center gap-1 mt-3">
        <div className="w-5 h-2 bg-gradient-to-r from-sky-400 to-blue-500 rounded-full" />
      </div>
    </div>
  );
};

interface FigmaOverviewProps {
  stats?: {
    totalProducts?: number;
    totalOrders?: number;
    totalAmount?: string;
    lowStock?: number;
    toReview?: number;
    totalStock?: number;
  };
  currentLang?: string;
  onLangChange?: (lang: string) => void;
  notificationImages?: string[];
}

const FigmaOverview: React.FC<FigmaOverviewProps> = ({
  stats = {
    totalProducts: 45,
    totalOrders: 6550,
    totalAmount: '৳8,35,500',
    lowStock: 5,
    toReview: 452,
    totalStock: 1250
  },
  currentLang = 'en',
  onLangChange = () => {},
  notificationImages
}) => {
  const now = new Date();
  const currentDate = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
  const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });

  return (
    <div className="bg-white rounded-2xl mx-2 sm:mx-4 md:mx-6 p-4 sm:p-6 shadow-sm overflow-hidden">
      <h2 className="text-base font-semibold text-black mb-5 font-['Poppins']">Overview</h2>
      
      {/* Main grid - Cards + Notification */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch">
        
        {/* Left side - 2 rows of cards */}
        <div className="flex-1 flex flex-col gap-4 min-w-0">
          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            <StatCard
              title="Total Products"
              value={stats.totalProducts || 45}
              iconUrl={ICON_URLS.totalProduct}
            />
            
            <StatCard
              title="Total Orders"
              value={(stats.totalOrders || 6550).toLocaleString()}
              iconUrl={ICON_URLS.totalOrder}
            />
            
            <LanguageDateCard 
              currentLang={currentLang} 
              onLangChange={onLangChange}
              date={currentDate}
              dayName={currentDay}
            />
          </div>
          
          {/* Row 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-4">
            <StatCard
              title="Low Stock"
              value={stats.lowStock || 5}
              iconUrl={ICON_URLS.lowStock}
            />
            
            <StatCard
              title="Total Amount"
              value={stats.totalAmount || '৳8,35,500'}
              iconUrl={ICON_URLS.totalAmount}
            />
            
            {/* <StatCard
              title="Total Stock"
              value={(stats.totalStock || 1250).toLocaleString()}
              iconUrl={ICON_URLS.totalStock}
            /> */}
            
            <StatCard
              title="To be Reviewed"
              value={stats.toReview || 452}
              iconUrl={ICON_URLS.toReview}
            />
          </div>
        </div>
        
        {/* Right side - Notification card spans full height */}
        <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 self-stretch">
          <NotificationCard title="Important Notification" images={notificationImages} />
        </div>
      </div>
    </div>
  );
};

export default FigmaOverview;
