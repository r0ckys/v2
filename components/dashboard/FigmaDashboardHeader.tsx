import React from 'react';
import {
  Globe,
  PlayCircle,
  Search,
  Moon,
  MessageCircle,
  Bell,
  ChevronDown
} from 'lucide-react';
import { DashboardHeaderProps } from './types';

const FigmaDashboardHeader: React.FC<DashboardHeaderProps> = ({
  tenantId,
  user,
  searchQuery,
  onSearchChange,
  onSearch
}) => {
  return (
    <div className="w-full bg-white border-b border-gray-100 px-2 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4">
      <div className="flex items-center justify-between gap-2">
        {/* Welcome Section - Hidden on very small screens */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <h1 className="text-sm sm:text-lg md:text-xl font-semibold text-gray-900 truncate font-['Poppins']">
            Welcome back, {user?.name || 'Yuvraj'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-1 hidden md:block font-['Poppins']">
            Monitor your business analytics and statistics.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 sm:gap-2 md:gap-3 flex-1 sm:flex-none justify-end">
          {/* View Website Button */}
          <a
            href={tenantId ? `/${tenantId}` : '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 sm:gap-2 bg-gradient-to-r from-sky-400 to-blue-500 text-white px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:opacity-90 transition-opacity shadow-sm"
          >
            <Globe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium hidden xs:inline font-['Poppins']">View Website</span>
          </a>

          {/* Tutorials Button */}
          <button className="flex items-center gap-1 sm:gap-2 bg-gray-100 text-gray-700 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg hover:bg-gray-200 transition-colors">
            <PlayCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
            <span className="text-xs sm:text-sm font-medium hidden sm:inline font-['Poppins']">Tutorials</span>
          </button>

          {/* Search Bar */}
          <div className="relative hidden md:flex items-center bg-gray-50 rounded-md sm:rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 w-40 lg:w-64 xl:w-72 border border-gray-100">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery || ''}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="bg-transparent flex-1 text-xs sm:text-sm text-gray-700 placeholder-gray-400 focus:outline-none font-['Poppins']"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-0.5 sm:gap-1 md:gap-2">
            <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md sm:rounded-lg transition-all">
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md sm:rounded-lg transition-all relative">
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-[8px] sm:text-[10px] rounded-full flex items-center justify-center">3</span>
            </button>
            <button className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md sm:rounded-lg transition-all relative">
              <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 text-white text-[8px] sm:text-[10px] rounded-full flex items-center justify-center">5</span>
            </button>
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 ml-1 sm:ml-2 pl-2 sm:pl-3 md:pl-4 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <div className="text-[10px] sm:text-xs text-gray-400 font-['Poppins']">Admin</div>
              <div className="text-xs sm:text-sm font-medium text-gray-900 truncate max-w-[60px] sm:max-w-[80px] md:max-w-none font-['Poppins']">{user?.name || 'Yuvraj'}</div>
            </div>
            <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-xs sm:text-sm font-bold text-white">
                  {(user?.name || 'Y').charAt(0).toUpperCase()}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaDashboardHeader;
