import React from 'react';
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  ChevronDown,
  Palette,
  FileText,
  Bell,
  CreditCard,
  Truck,
  Image,
  Target,
  Boxes,
  ClipboardList,
  Globe,
  Shield,
  Activity,
  GraduationCap
} from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  badge?: string | number;
  hasDropdown?: boolean;
  children?: SidebarItem[];
}

interface DashboardSidebarProps {
  activeItem?: string;
  onNavigate?: (item: string) => void;
  className?: string;
}

const menuItems: SidebarItem[] = [
  // Main Menu
  { id: 'dashboard', label: 'Dashboard', icon: <img src="https://hdnfltv.com/image/nitimages/dashboard-square-01.webp" alt="Dashboard" className="w-5 h-5 object-contain" /> },
  { id: 'orders', label: 'Orders', icon: <img src="https://hdnfltv.com/image/nitimages/invoice.webp" alt="Orders" className="w-5 h-5 object-contain" /> },
  { id: 'products', label: 'Products', icon: <img src="https://hdnfltv.com/image/nitimages/icon-park_ad-product.webp" alt="Products" className="w-5 h-5 object-contain" /> },
  { id: 'catalog', label: 'Catalog', icon: <img src="https://hdnfltv.com/image/nitimages/hugeicons_catalogue.webp" alt="Catalog" className="w-5 h-5 object-contain" />, hasDropdown: true },
  { id: 'inventory', label: 'Inventory', icon: <img src="https://hdnfltv.com/image/nitimages/note.webp" alt="Inventory" className="w-5 h-5 object-contain" /> },
  { id: 'customers_reviews', label: 'Customers & review', icon: <img src="https://hdnfltv.com/image/nitimages/user-group.webp" alt="Customers & review" className="w-5 h-5 object-contain" /> },
  
  // Configuration
  { id: 'customization', label: 'Customization', icon: <img src="https://hdnfltv.com/image/nitimages/arcticons_galaxy-themes.webp" alt="Customization" className="w-5 h-5 object-contain" /> },
  { id: 'website_content', label: 'Website Content', icon: <img src="https://hdnfltv.com/image/nitimages/fluent_content-view-gallery-28-regular.webp" alt="Website Content" className="w-5 h-5 object-contain" />, hasDropdown: true },
  { id: 'gallery', label: 'Gallery', icon: <img src="https://hdnfltv.com/image/nitimages/solar_gallery-linear.webp" alt="Gallery" className="w-5 h-5 object-contain" /> },
  { id: 'business_report', label: 'Business Report', icon: <img src="https://hdnfltv.com/image/nitimages/icon-park_table-report.webp" alt="Business Report" className="w-5 h-5 object-contain" /> },
  
  // System
  { id: 'settings', label: 'Settings', icon: <img src="https://hdnfltv.com/image/nitimages/ci_settings.webp" alt="Settings" className="w-5 h-5 object-contain" /> },
  { id: 'admin_control', label: 'Admin Control', icon:<img src="https://hdnfltv.com/image/nitimages/hugeicons_microsoft-admin.webp" alt="Admin Control" className="w-5 h-5 object-contain" /> },
  { id: 'activity_log', label: 'Activity Log', icon: <img src="https://hdnfltv.com/image/nitimages/transaction-history.webp" alt="Activity Log" className="w-5 h-5 object-contain" /> },
  { id: 'billing', label: 'Billing & Subscription', icon: <img src="https://hdnfltv.com/image/nitimages/solar_card-linear.webp" alt="Billing & Subscription" className="w-5 h-5 object-contain" /> },
  { id: 'support', label: 'Support', icon: <img src="https://hdnfltv.com/image/nitimages/pasted_1770763342068.webp" alt="Support" className="w-5 h-5 object-contain" /> },
  { id: 'tutorial', label: 'Tutorial', icon: <img src="https://hdnfltv.com/image/nitimages/pasted_1770763376612.webp" alt="Tutorial" className="w-5 h-5 object-contain" /> },
];

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeItem = 'dashboard',
  onNavigate,
  className = ''
}) => {
  const handleItemClick = (itemId: string) => {
    onNavigate?.(itemId);
  };

  const renderMenuItem = (item: SidebarItem) => {
    const isActive = activeItem === item.id;
    
    return (
      <button
        key={item.id}
        onClick={() => handleItemClick(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 group font-['Poppins'] ${
          isActive 
            ? 'bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md' 
            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
        }`}
      >
        <span className={isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-700'}>
          {item.icon}
        </span>
        <span className="flex-1 text-left text-sm font-medium">{item.label}</span>
        {item.badge && (
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
            isActive ? 'bg-white/20 text-white' : 'bg-orange-100 text-orange-600'
          }`}>
            {item.badge}
          </span>
        )}
      </button>
    );
  };

  return (
    <nav className={`space-y-1 ${className}`}>
      {/* Main Menu Section */}
      <div className="mb-6">
        <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider font-['Poppins']">
          Main Menu
        </p>
        <div className="space-y-1">
          {menuItems.slice(0, 6).map(renderMenuItem)}
        </div>
      </div>

      {/* Configuration Section */}
      <div className="mb-6">
        <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider font-['Poppins']">
          Configuration
        </p>
        <div className="space-y-1">
          {menuItems.slice(6, 10).map(renderMenuItem)}
        </div>
      </div>

      {/* System Section */}
      <div className="mb-6">
        <p className="px-4 mb-2 text-xs font-semibold text-gray-400 uppercase tracking-wider font-['Poppins']">
          System
        </p>
        <div className="space-y-1">
          {menuItems.slice(10).map(renderMenuItem)}
        </div>
      </div>

      {/* Logout */}
      <div className="pt-4 border-t border-gray-100">
        <button
          onClick={() => handleItemClick('logout')}
          className="w-full flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors font-['Poppins']"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </nav>
  );
};

export default DashboardSidebar;
