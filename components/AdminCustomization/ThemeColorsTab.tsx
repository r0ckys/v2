import React, { useState, useEffect } from 'react';
import { Search, Globe, Palette } from 'lucide-react';
import { WebsiteConfig, ColorKey } from './types';
import { DEFAULT_COLORS, COLOR_GUIDE_CONFIG, normalizeHexColor } from './constants';

interface ThemeColorsTabProps {
  websiteConfiguration: WebsiteConfig;
  setWebsiteConfiguration: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
  themeColors: Record<ColorKey, string>;
  setThemeColors: React.Dispatch<React.SetStateAction<Record<ColorKey, string>>>;
}

export const ThemeColorsTab: React.FC<ThemeColorsTabProps> = ({
  websiteConfiguration,
  setWebsiteConfiguration,
  themeColors,
  setThemeColors
}) => {
  const [colorDrafts, setColorDrafts] = useState({ ...DEFAULT_COLORS });

  // Sync color drafts with theme colors
  useEffect(() => {
    setColorDrafts(themeColors);
  }, [themeColors]);

  const updateThemeColor = (colorKey: ColorKey, value: string): void => {
    const normalized = normalizeHexColor(value);
    if (normalized) {
      setThemeColors((prev) => ({ ...prev, [colorKey]: normalized }));
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 max-w-4xl mx-auto">
      {/* Theme Colors Header */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-indigo-100">
        <h3 className="font-bold text-lg sm:text-2xl text-gray-800 mb-1 sm:mb-2">🎨 Theme Colors</h3>
        <p className="text-gray-500 text-xs sm:text-sm">Customize your storefront and admin panel color palette to match your brand.</p>
      </div>

      {/* Colors Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {COLOR_GUIDE_CONFIG.map(f => (
          <div 
            key={f.key} 
            className="group relative bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-3 sm:p-5 shadow-sm hover:shadow-lg hover:border-indigo-200 transition-all duration-300"
          >
            {/* Color Preview Header */}
            <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
              <div className="relative flex-shrink-0">
                <input 
                  type="color" 
                  value={themeColors[f.key]} 
                  onChange={e => updateThemeColor(f.key, e.target.value)} 
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-lg sm:rounded-xl border-2 border-gray-200 shadow-md cursor-pointer hover:scale-105 transition-transform duration-200"
                  style={{ backgroundColor: themeColors[f.key] }}
                />
                <div 
                  className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-gray-200 shadow flex items-center justify-center"
                  style={{ backgroundColor: themeColors[f.key] }}
                >
                  <Palette size={10} className="text-white drop-shadow sm:hidden" />
                  <Palette size={12} className="text-white drop-shadow hidden sm:block" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm sm:text-base">{f.label}</p>
                <p className="text-xs text-gray-500 mt-0.5 sm:mt-1 leading-relaxed line-clamp-2">{f.helper}</p>
              </div>
            </div>

            {/* Hex Input */}
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 rounded-md border border-gray-200" style={{ backgroundColor: themeColors[f.key] }}></div>
              <input 
                type="text" 
                value={colorDrafts[f.key]} 
                onChange={e => setColorDrafts(p => ({ ...p, [f.key]: e.target.value }))} 
                onBlur={() => updateThemeColor(f.key, colorDrafts[f.key])} 
                className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border border-gray-200 rounded-lg sm:rounded-xl font-mono text-xs sm:text-sm uppercase bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 transition-all"
                placeholder="#000000"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Search Hints Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow flex-shrink-0">
            <Search size={14} className="text-white sm:hidden" />
            <Search size={18} className="text-white hidden sm:block" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg text-gray-800">Search Hints</h3>
            <p className="text-xs text-gray-500 truncate sm:whitespace-normal">Suggest keywords to help customers find products</p>
          </div>
        </div>
        <input 
          type="text" 
          value={websiteConfiguration.searchHints || ''} 
          onChange={e => setWebsiteConfiguration(p => ({ ...p, searchHints: e.target.value }))} 
          className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-gray-200 rounded-lg sm:rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-200 focus:border-amber-400 transition-all text-sm sm:text-base" 
          placeholder="gadget, gift, toy, electronics..."
        />
      </div>

      {/* Order Language Section */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-3 sm:mb-4">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center shadow flex-shrink-0">
            <Globe size={14} className="text-white sm:hidden" />
            <Globe size={18} className="text-white hidden sm:block" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-bold text-base sm:text-lg text-gray-800">Order Language</h3>
            <p className="text-xs text-gray-500 truncate sm:whitespace-normal">Choose the language for order notifications and invoices</p>
          </div>
        </div>
        <div className="grid grid-cols-1 xs:grid-cols-2 gap-2 sm:gap-3">
          {['English', 'Bangla'].map(l => (
            <label 
              key={l} 
              className={`flex items-center gap-2 sm:gap-3 border-2 p-3 sm:p-4 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-200 ${
                websiteConfiguration.orderLanguage === l 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
              }`}
            >
              <input 
                type="radio" 
                name="lang" 
                className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 focus:ring-green-500 flex-shrink-0" 
                checked={websiteConfiguration.orderLanguage === l} 
                onChange={() => setWebsiteConfiguration(p => ({ ...p, orderLanguage: l }))}
              />
              <span className={`font-semibold text-sm sm:text-base ${websiteConfiguration.orderLanguage === l ? 'text-green-700' : 'text-gray-700'}`}>
                {l === 'Bangla' ? '🇧🇩 ' : '🇬🇧 '}{l}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ThemeColorsTab;
