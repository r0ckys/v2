import React from 'react';

interface ModernKpiCardProps {
  title: string;
  value: string | number;
  iconUrl?: string;
}

const ModernKpiCard: React.FC<ModernKpiCardProps> = ({
  title,
  value,
  iconUrl = "https://hdnfltv.com/image/nitimages/streamline-flex_production-belt-time__2_.webp",
}) => (
  <div className="relative w-full h-[100px] bg-[#F9F9F9] rounded-lg overflow-hidden">
    <div className="absolute left-4 top-[42px] text-black text-xs font-medium font-poppins">{title}</div>
    <div className="absolute left-4 top-[6px] text-black text-2xl font-medium font-poppins">{value}</div>
    <div className="absolute left-[206px] top-3 w-11 h-11 bg-white rounded-lg overflow-hidden flex items-center justify-center">
      <img src={iconUrl} alt={title} className="w-8 h-8 object-contain" />
    </div>
  </div>
);

export default ModernKpiCard;
