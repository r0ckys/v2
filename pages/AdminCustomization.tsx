import React, { useState, useRef, useEffect } from 'react';
import { MetricsSkeleton } from '../components/SkeletonLoaders';
import {
  Save,
  Image as ImageIcon,
  Layout,
  Palette,
  Globe,
  Eye,
  Layers,
  Loader2,
  CheckCircle2,
  MessageCircle,
  CalendarDays,
  Settings
} from 'lucide-react';
import toast from 'react-hot-toast';
import { ThemeConfig, WebsiteConfig, Product } from '../types';
import { DataService } from '../services/DataService';
import {
  isBase64Image,
  convertBase64ToUploadedUrl
} from '../services/imageUploadService';

// Import refactored components
import {
  AdminCustomizationProps,
  ColorKey,
  DEFAULT_COLORS,
  DEFAULT_WEBSITE_CONFIG,
  TabButton,
  CarouselTab,
  CampaignTab,
  PopupTab,
  WebsiteInfoTab,
  ChatSettingsTab,
  ThemeViewTab,
  ThemeColorsTab
} from '../components/AdminCustomization';

// ============================================================================
// Main Component
// ============================================================================

const AdminCustomization: React.FC<AdminCustomizationProps> = ({
  tenantId,
  logo,
  onUpdateLogo,
  themeConfig,
  onUpdateTheme,
  websiteConfig,
  onUpdateWebsiteConfig,
  initialTab = 'website_info',
  products = []
}) => {
  // ---------------------------------------------------------------------------
  // Tab State
  // ---------------------------------------------------------------------------
  const [activeTab, setActiveTab] = useState(initialTab);

  // ---------------------------------------------------------------------------
  // Website Configuration State
  // ---------------------------------------------------------------------------
  const [websiteConfiguration, setWebsiteConfiguration] = useState<WebsiteConfig>(
    () => (websiteConfig ? { ...DEFAULT_WEBSITE_CONFIG, ...websiteConfig } : DEFAULT_WEBSITE_CONFIG)
  );

  // ---------------------------------------------------------------------------
  // Theme Colors State
  // ---------------------------------------------------------------------------
  const [themeColors, setThemeColors] = useState({ ...DEFAULT_COLORS });
  const [isDarkMode, setIsDarkMode] = useState(false);

  // ---------------------------------------------------------------------------
  // Save State
  // ---------------------------------------------------------------------------
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // ---------------------------------------------------------------------------
  // Refs for State Management
  // ---------------------------------------------------------------------------
  const prevTenantIdRef = useRef<string>(tenantId);
  const hasLoadedInitialConfig = useRef(false);
  const hasUnsavedChangesRef = useRef(false);
  const prevWebsiteConfigRef = useRef<WebsiteConfig | null>(null);
  const isSavingRef = useRef(false);
  const lastSaveTimestampRef = useRef<number>(0);
  const SAVE_PROTECTION_MS = 3000;

  // ---------------------------------------------------------------------------
  // Effects
  // ---------------------------------------------------------------------------

  // Simulate initial loading state for better UX
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Sync active activeTab with initialTab prop
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Expose unsaved changes flag getter function to prevent data refresh overwrites
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__getAdminCustomizationUnsavedChanges = () => {
        const timeSinceLastSave = Date.now() - lastSaveTimestampRef.current;
        const isWithinProtectionWindow = timeSinceLastSave < SAVE_PROTECTION_MS;
        if (isWithinProtectionWindow) {
          console.log('[AdminCustomization] Within save protection window, blocking refresh');
          return true;
        }
        return hasUnsavedChangesRef.current;
      };
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__getAdminCustomizationUnsavedChanges;
      }
    };
  }, []);

  useEffect(() => {
    // Skip if we're currently saving - this prevents the loop
    if (isSavingRef.current) {
      return;
    }
    
    // On tenant change, reload config from prop
    if (prevTenantIdRef.current !== tenantId) {
      console.log('[AdminCustomization] Tenant changed, reloading config');
      prevTenantIdRef.current = tenantId;
      hasLoadedInitialConfig.current = false;
      hasUnsavedChangesRef.current = false;
      
      if (websiteConfig) {
        setWebsiteConfiguration({
          ...DEFAULT_WEBSITE_CONFIG,
          ...websiteConfig,
          addresses: websiteConfig.addresses || [],
          emails: websiteConfig.emails || [],
          phones: websiteConfig.phones || [],
          socialLinks: websiteConfig.socialLinks || [],
          footerQuickLinks: websiteConfig.footerQuickLinks || [],
          footerUsefulLinks: websiteConfig.footerUsefulLinks || [],
          showFlashSaleCounter: websiteConfig.showFlashSaleCounter ?? true,
          headerLogo: websiteConfig.headerLogo ?? null,
          footerLogo: websiteConfig.footerLogo ?? null,
          campaigns: websiteConfig.campaigns || [],
          carouselItems: websiteConfig.carouselItems || [],
          popups: websiteConfig.popups || [],
          categorySectionStyle: websiteConfig.categorySectionStyle || DEFAULT_WEBSITE_CONFIG.categorySectionStyle
        });
        hasLoadedInitialConfig.current = true;
      }
    } 
    // Initial load if not yet loaded
    else if (!hasLoadedInitialConfig.current && websiteConfig) {
      console.log('[AdminCustomization] Initial config load');
      setWebsiteConfiguration({
        ...DEFAULT_WEBSITE_CONFIG,
        ...websiteConfig,
        addresses: websiteConfig.addresses || [],
        emails: websiteConfig.emails || [],
        phones: websiteConfig.phones || [],
        socialLinks: websiteConfig.socialLinks || [],
        footerQuickLinks: websiteConfig.footerQuickLinks || [],
        footerUsefulLinks: websiteConfig.footerUsefulLinks || [],
        showFlashSaleCounter: websiteConfig.showFlashSaleCounter ?? true,
        headerLogo: websiteConfig.headerLogo ?? null,
        footerLogo: websiteConfig.footerLogo ?? null,
        campaigns: websiteConfig.campaigns || [],
        carouselItems: websiteConfig.carouselItems || [],
        popups: websiteConfig.popups || [],
        categorySectionStyle: websiteConfig.categorySectionStyle || DEFAULT_WEBSITE_CONFIG.categorySectionStyle
      });
      hasLoadedInitialConfig.current = true;
      hasUnsavedChangesRef.current = false;
    }
  }, [tenantId, websiteConfig]);

  // Track local changes to mark as unsaved
  useEffect(() => {
    if (hasLoadedInitialConfig.current && prevWebsiteConfigRef.current) {
      const configChanged = JSON.stringify(websiteConfiguration) !== JSON.stringify(prevWebsiteConfigRef.current);
      if (configChanged) {
        hasUnsavedChangesRef.current = true;
      }
    }
    prevWebsiteConfigRef.current = websiteConfiguration;
  }, [websiteConfiguration]);

  // Auto-convert base64 branding images to uploaded URLs
  useEffect(() => {
    const convertBase64BrandingImages = async () => {
      const updates: Partial<WebsiteConfig> = {};
      let hasUpdates = false;

      if (websiteConfiguration.headerLogo && isBase64Image(websiteConfiguration.headerLogo)) {
        try {
          const uploadedUrl = await convertBase64ToUploadedUrl(websiteConfiguration.headerLogo, tenantId, 'branding');
          updates.headerLogo = uploadedUrl;
          hasUpdates = true;
        } catch (err) {
          console.error('[AdminCustomization] Failed to convert headerLogo:', err);
        }
      }

      if (websiteConfiguration.footerLogo && isBase64Image(websiteConfiguration.footerLogo)) {
        try {
          const uploadedUrl = await convertBase64ToUploadedUrl(websiteConfiguration.footerLogo, tenantId, 'branding');
          updates.footerLogo = uploadedUrl;
          hasUpdates = true;
        } catch (err) {
          console.error('[AdminCustomization] Failed to convert footerLogo:', err);
        }
      }

      if (websiteConfiguration.favicon && isBase64Image(websiteConfiguration.favicon)) {
        try {
          const uploadedUrl = await convertBase64ToUploadedUrl(websiteConfiguration.favicon, tenantId, 'branding');
          updates.favicon = uploadedUrl;
          hasUpdates = true;
        } catch (err) {
          console.error('[AdminCustomization] Failed to convert favicon:', err);
        }
      }

      if (hasUpdates) {
        setWebsiteConfiguration(prev => ({ ...prev, ...updates }));
      }
    };

    if (hasLoadedInitialConfig.current) {
      convertBase64BrandingImages();
    }
  }, [tenantId]);

  // Sync theme colors with prop
  useEffect(() => {
    if (themeConfig) {
      setThemeColors({
        primary: themeConfig.primaryColor,
        secondary: themeConfig.secondaryColor,
        tertiary: themeConfig.tertiaryColor,
        font: themeConfig.fontColor || DEFAULT_COLORS.font,
        hover: themeConfig.hoverColor || DEFAULT_COLORS.hover,
        surface: themeConfig.surfaceColor || DEFAULT_COLORS.surface,
        adminBg: themeConfig.adminBgColor || DEFAULT_COLORS.adminBg,
        adminInputBg: themeConfig.adminInputBgColor || DEFAULT_COLORS.adminInputBg,
        adminBorder: themeConfig.adminBorderColor || DEFAULT_COLORS.adminBorder,
        adminFocus: themeConfig.adminFocusColor || DEFAULT_COLORS.adminFocus
      });
      setIsDarkMode(themeConfig.darkMode);
    }
  }, [themeConfig]);

  // ---------------------------------------------------------------------------
  // Save All Changes Handler
  // ---------------------------------------------------------------------------

  const handleSaveChanges = async (): Promise<void> => {
    if (isSaving) return;

    setIsSaving(true);
    isSavingRef.current = true;
    setIsSaved(false);
    const loadingToast = toast.loading('Saving changes...');
    const startTime = Date.now();

    try {
      if (onUpdateWebsiteConfig) {
        await onUpdateWebsiteConfig(websiteConfiguration);
      }

      if (onUpdateTheme) {
        const themePayload = {
          primaryColor: themeColors.primary,
          secondaryColor: themeColors.secondary,
          tertiaryColor: themeColors.tertiary,
          fontColor: themeColors.font,
          hoverColor: themeColors.hover,
          surfaceColor: themeColors.surface,
          darkMode: isDarkMode,
          adminBgColor: themeColors.adminBg,
          adminInputBgColor: themeColors.adminInputBg,
          adminBorderColor: themeColors.adminBorder,
          adminFocusColor: themeColors.adminFocus
        };
        await onUpdateTheme(themePayload);
      }

      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
      }

      toast.dismiss(loadingToast);
      setIsSaved(true);
      hasUnsavedChangesRef.current = false;
      prevWebsiteConfigRef.current = websiteConfiguration;
      lastSaveTimestampRef.current = Date.now();
      toast.success('Saved successfully!');
      setTimeout(() => setIsSaved(false), 2000);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Save failed:', error);
      toast.error('Save failed. Please try again.');
    } finally {
      setIsSaving(false);
      setTimeout(() => {
        isSavingRef.current = false;
      }, 2000);
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-3 sm:p-4 md:p-6 space-y-4 sm:space-y-6">
      {/* Header - Modern design matching AdminOrders */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-500 flex-shrink-0" />
            <span className="truncate">Customization</span>
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-1 truncate">Manage website appearance, carousel, campaigns and popups</p>
        </div>
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className={`flex items-center gap-2 px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-bold transition-all shadow-lg min-w-[140px] sm:min-w-[160px] justify-center text-sm sm:text-base w-full sm:w-auto ${
            isSaved
              ? 'bg-emerald-500 text-white'
              : isSaving
              ? 'bg-green-500 text-white cursor-wait'
              : 'bg-green-600 text-white hover:from-[#2BAEE8] hover:to-[#1A7FE8]'
          }`}
        >
          {isSaved ? (
            <>
              <CheckCircle2 size={18} className="animate-bounce" />
              Saved!
            </>
          ) : isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} />
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Quick Stats Cards */}
      {isLoading ? (
        <MetricsSkeleton count={4} />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {/* Carousel Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">Carousel Items</p>
                <p className="mt-1 text-xl sm:text-3xl font-bold text-gray-900">{websiteConfiguration.carouselItems?.length || 0}</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                <ImageIcon size={20} className="text-blue-500 sm:hidden" />
                <ImageIcon size={24} className="text-blue-500 hidden sm:block" />
              </div>
            </div>
            <button
              onClick={() => setActiveTab('carousel')}
              className="mt-2 sm:mt-3 flex items-center gap-1 text-xs font-medium text-blue-600 hover:text-blue-700"
            >
              <Eye size={14} />
              Manage
            </button>
          </div>

          {/* Active Campaigns */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">Active Campaigns</p>
                <p className="mt-1 text-xl sm:text-3xl font-bold text-gray-900">
                  {websiteConfiguration.campaigns?.filter(c => c.status === 'Publish').length || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-50 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                <CalendarDays size={20} className="text-emerald-500 sm:hidden" />
                <CalendarDays size={24} className="text-emerald-500 hidden sm:block" />
              </div>
            </div>
            <button
              onClick={() => setActiveTab('campaigns')}
              className="mt-2 sm:mt-3 flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
            >
              <Eye size={14} />
              Manage
            </button>
          </div>

          {/* Active Popups */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">Active Popups</p>
                <p className="mt-1 text-xl sm:text-3xl font-bold text-gray-900">
                  {websiteConfiguration.popups?.filter(p => p.status === 'Publish').length || 0}
                </p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-50 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                <Layers size={20} className="text-purple-500 sm:hidden" />
                <Layers size={24} className="text-purple-500 hidden sm:block" />
              </div>
            </div>
            <button
              onClick={() => setActiveTab('popup')}
              className="mt-2 sm:mt-3 flex items-center gap-1 text-xs font-medium text-purple-600 hover:text-purple-700"
            >
              <Eye size={14} />
              Manage
            </button>
          </div>

          {/* Theme Sections */}
          <div className="bg-white rounded-xl border border-gray-100 p-3 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-gray-500 font-medium truncate">Theme Sections</p>
                <p className="mt-1 text-xl sm:text-3xl font-bold text-gray-900">8</p>
                <p className="mt-1 text-xs text-gray-400 hidden sm:block">Customizable areas</p>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-50 rounded-full flex items-center justify-center flex-shrink-0 ml-2">
                <Palette size={20} className="text-orange-500 sm:hidden" />
                <Palette size={24} className="text-orange-500 hidden sm:block" />
              </div>
            </div>
            <button
              onClick={() => setActiveTab('theme_view')}
              className="mt-2 sm:mt-3 flex items-center gap-1 text-xs font-medium text-orange-600 hover:text-orange-700"
            >
              <Eye size={14} />
              Customize
            </button>
          </div>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-1">
        <TabButton id="carousel" label="Carousel" icon={<ImageIcon size={16} />} activeTab={activeTab} onTabChange={setActiveTab} />
        <TabButton id="campaigns" label="Campaigns" icon={<CalendarDays size={16} />} activeTab={activeTab} onTabChange={setActiveTab} />
        <TabButton id="popup" label="Popups" icon={<Layers size={16} />} activeTab={activeTab} onTabChange={setActiveTab} />
        <TabButton id="website_info" label="Website" icon={<Globe size={16} />} activeTab={activeTab} onTabChange={setActiveTab} />
        <TabButton id="chat_settings" label="Chat" icon={<MessageCircle size={16} />} activeTab={activeTab} onTabChange={setActiveTab} />
        <TabButton id="theme_view" label="Theme" icon={<Layout size={16} />} activeTab={activeTab} onTabChange={setActiveTab} />
        <TabButton id="theme_colors" label="Colors" icon={<Palette size={16} />} activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 md:p-6 min-h-[400px] sm:min-h-[500px]">
        {activeTab === 'carousel' && (
          <CarouselTab
            websiteConfiguration={websiteConfiguration}
            setWebsiteConfiguration={setWebsiteConfiguration}
            tenantId={tenantId}
            onUpdateWebsiteConfig={onUpdateWebsiteConfig}
            isSavingRef={isSavingRef}
            hasUnsavedChangesRef={hasUnsavedChangesRef}
            prevWebsiteConfigRef={prevWebsiteConfigRef}
            lastSaveTimestampRef={lastSaveTimestampRef}
          />
        )}

        {activeTab === 'campaigns' && (
          <CampaignTab
            websiteConfiguration={websiteConfiguration}
            setWebsiteConfiguration={setWebsiteConfiguration}
            tenantId={tenantId}
            products={products}
            onUpdateWebsiteConfig={onUpdateWebsiteConfig}
            hasUnsavedChangesRef={hasUnsavedChangesRef}
            prevWebsiteConfigRef={prevWebsiteConfigRef}
            lastSaveTimestampRef={lastSaveTimestampRef}
          />
        )}

        {activeTab === 'popup' && (
          <PopupTab
            websiteConfiguration={websiteConfiguration}
            setWebsiteConfiguration={setWebsiteConfiguration}
            tenantId={tenantId}
            onUpdateWebsiteConfig={onUpdateWebsiteConfig}
            hasUnsavedChangesRef={hasUnsavedChangesRef}
            prevWebsiteConfigRef={prevWebsiteConfigRef}
            lastSaveTimestampRef={lastSaveTimestampRef}
          />
        )}

        {activeTab === 'website_info' && (
          <WebsiteInfoTab
            websiteConfiguration={websiteConfiguration}
            setWebsiteConfiguration={setWebsiteConfiguration}
            logo={logo}
            onUpdateLogo={onUpdateLogo}
            tenantId={tenantId}
          />
        )}

        {activeTab === 'chat_settings' && (
          <ChatSettingsTab
            websiteConfiguration={websiteConfiguration}
            setWebsiteConfiguration={setWebsiteConfiguration}
          />
        )}

        {activeTab === 'theme_view' && (
          <ThemeViewTab
            websiteConfiguration={websiteConfiguration}
            setWebsiteConfiguration={setWebsiteConfiguration}
          />
        )}

        {activeTab === 'theme_colors' && (
          <ThemeColorsTab
            websiteConfiguration={websiteConfiguration}
            setWebsiteConfiguration={setWebsiteConfiguration}
            themeColors={themeColors}
            setThemeColors={setThemeColors}
          />
        )}
      </div>
    </div>
  );
};

export default AdminCustomization;
