import React from 'react';
import {
  Globe,
  Play,
  Search,
  Settings,
  MessageCircle,
  Bell
} from 'lucide-react';
import { DashboardHeaderProps } from './types';

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  tenantId,
  user,
  searchQuery,
  onSearchChange,
  onSearch
}) => {
  return (
    <div className="w-full bg-white border border-slate-100 rounded-xl p-3 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        {/* Welcome Text */}
        <div className="flex-shrink-0">
          <div className="text-slate-900 text-base sm:text-lg font-bold">
            Welcome back, {user?.name || 'Admin'}
          </div>
          <div className="text-slate-500 text-xs sm:text-sm font-medium">
            Monitor your business analytics and statistics.
          </div>
        </div>
        
        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* View Website Button */}
          <a
            href={`/${tenantId || ''}`}
            target="_blank"
            rel="noopener noreferrer"
            className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-slate-600" />
            <span className="ml-1.5 text-slate-700 text-xs sm:text-sm font-medium">
              View Website
            </span>
          </a>
          
          {/* Tutorials Button */}
          <div className="h-8 px-2.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center cursor-pointer hover:bg-slate-100 hover:border-slate-300 transition-all">
            <Play className="w-3.5 h-3.5 text-red-500" />
            <span className="ml-1.5 text-slate-700 text-xs sm:text-sm font-medium">
              Tutorials
            </span>
          </div>
          
          {/* Search Box */}
          <div className="w-full sm:w-48 md:w-64 h-8 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-2.5 hover:border-blue-300 transition-colors">
            <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                onSearch?.(e.target.value);
              }}
              className="flex-1 bg-transparent text-slate-700 text-xs sm:text-sm font-medium outline-none ml-2 placeholder:text-slate-400"
            />
          </div>
        </div>
        
        {/* Right Side - Icons & Profile */}
        <div className="hidden lg:flex items-center gap-2">
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <Settings className="w-4 h-4 text-slate-600" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <MessageCircle className="w-4 h-4 text-slate-600" />
          </button>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
            <Bell className="w-4 h-4 text-slate-600" />
          </button>
          
          {/* Admin Profile */}
          <div className="flex items-center gap-1.5 ml-2 pl-2.5 border-l border-slate-200">
            <div className="text-right">
              <div className="text-slate-400 text-[10px] font-medium">
                Admin
              </div>
              <div className="text-slate-900 text-xs sm:text-sm font-bold">
                {user?.name || 'Admin'}
              </div>
            </div>
            {user?.avatar ? (
              <img
                className="w-8 h-8 rounded-full object-cover ring-2 ring-slate-100"
                src={user.avatar}
                alt="Admin Avatar"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-md">
                {(user?.name || 'A').charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
