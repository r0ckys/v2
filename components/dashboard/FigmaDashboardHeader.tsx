import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  PlayCircle,
  Search,
  Moon,
  MessageCircle,
  Bell,
  ChevronDown,
  Check,
  CheckCheck,
  Package,
  Star,
  Users,
  AlertCircle,
  Settings
} from 'lucide-react';
import { DashboardHeaderProps } from './types';
import { TutorialVideoSection } from '../TutorialVideoSection';

// Notification icon by type
const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order': return <Package className="w-4 h-4 text-blue-500" />;
    case 'review': return <Star className="w-4 h-4 text-yellow-500" />;
    case 'customer': return <Users className="w-4 h-4 text-green-500" />;
    case 'inventory': return <AlertCircle className="w-4 h-4 text-orange-500" />;
    case 'system': return <Settings className="w-4 h-4 text-gray-500" />;
    default: return <Bell className="w-4 h-4 text-gray-500" />;
  }
};

// Format time ago
const formatTimeAgo = (dateStr: string) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const FigmaDashboardHeader: React.FC<DashboardHeaderProps> = ({
  tenantId,
  user,
  searchQuery,
  onSearchChange,
  onSearch,
  // Notification props
  notificationCount = 0,
  onNotificationClick,
  notifications = [],
  onMarkNotificationRead,
  // Chat props
  unreadChatCount = 0,
  onChatClick
}) => {
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotificationDropdown(false);
      }
    };

    if (showNotificationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotificationDropdown]);

  const handleNotificationBellClick = () => {
    setShowNotificationDropdown(!showNotificationDropdown);
    onNotificationClick?.();
  };

  const handleMarkAllRead = () => {
    onMarkNotificationRead?.();
    setShowNotificationDropdown(false);
  };

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
            
            {/* Chat Button */}
            <button 
              onClick={onChatClick}
              className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md sm:rounded-lg transition-all relative"
              title="Messages"
            >
              <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5" />
              {unreadChatCount > 0 && (
                <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-red-500 text-white text-[8px] sm:text-[10px] rounded-full flex items-center justify-center">
                  {unreadChatCount > 9 ? '9+' : unreadChatCount}
                </span>
              )}
            </button>
            
            {/* Notification Button with Dropdown */}
            <div className="relative" ref={notificationRef}>
              <button 
                onClick={handleNotificationBellClick}
                className="p-1.5 sm:p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md sm:rounded-lg transition-all relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {notificationCount > 0 && (
                  <span className="absolute -top-0.5 sm:-top-1 -right-0.5 sm:-right-1 w-3 h-3 sm:w-4 sm:h-4 bg-blue-500 text-white text-[8px] sm:text-[10px] rounded-full flex items-center justify-center">
                    {notificationCount > 9 ? '9+' : notificationCount}
                  </span>
                )}
              </button>
              
              {/* Notification Dropdown */}
              {showNotificationDropdown && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                  <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-semibold text-gray-900 text-sm">Notifications</h3>
                    {notificationCount > 0 && (
                      <button 
                        onClick={handleMarkAllRead}
                        className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1"
                      >
                        <CheckCheck className="w-3 h-3" />
                        Mark all read
                      </button>
                    )}
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-gray-500 text-sm">
                        <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        No notifications yet
                      </div>
                    ) : (
                      notifications.slice(0, 10).map((notification) => (
                        <div 
                          key={notification._id}
                          className={`p-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.isRead ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => onMarkNotificationRead?.([notification._id])}
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-0.5">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-sm ${!notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">
                                {formatTimeAgo(notification.createdAt)}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-1.5" />
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                  
                  {notifications.length > 10 && (
                    <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
                      <button className="text-xs text-blue-600 hover:text-blue-700">
                        View all notifications
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
