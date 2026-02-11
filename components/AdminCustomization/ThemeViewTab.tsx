import React, { useState } from 'react';
import { Eye, X, Image as ImageIcon } from 'lucide-react';
import { WebsiteConfig } from './types';
import { THEME_VIEW_SECTIONS, THEME_DEMO_IMAGES } from './constants';

interface ThemeViewTabProps {
  websiteConfiguration: WebsiteConfig;
  setWebsiteConfiguration: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
}

export const ThemeViewTab: React.FC<ThemeViewTabProps> = ({
  websiteConfiguration,
  setWebsiteConfiguration
}) => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [demoImage, setDemoImage] = useState<string>('');
  const [demoTitle, setDemoTitle] = useState<string>('');
  const [demoImageError, setDemoImageError] = useState(false);

  const handleShowDemo = (sectionKey: string, styleValue: string, sectionTitle: string): void => {
    const sectionDemos = THEME_DEMO_IMAGES[sectionKey];
    if (sectionDemos) {
      const imageUrl = sectionDemos[styleValue];
      
      setDemoImageError(false);
      
      if (styleValue === 'none' || !imageUrl) {
        setDemoImage('');
      } else {
        setDemoImage(imageUrl);
      }
      
      const styleLabel = styleValue === 'none' ? 'None' : `Style ${styleValue.replace('style', '')}`;
      setDemoTitle(`${sectionTitle} - ${styleLabel} Demo`);
      setDemoModalOpen(true);
    }
  };

  return (
    <div className="relative">
      {/* Theme View Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {THEME_VIEW_SECTIONS.map(s => (
          <div key={s.title} className="space-y-2 sm:space-y-3 bg-gray-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-gray-200">
            <h3 className="font-bold text-gray-800 text-base sm:text-lg border-b pb-2 mb-3 sm:mb-4">{s.title}</h3>
            <div className="space-y-2">
              {s.hasNone && (
                <div className={`border rounded-lg p-2.5 sm:p-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3 hover:bg-white transition-colors cursor-pointer ${!websiteConfiguration[s.key as keyof WebsiteConfig] ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-300 bg-white'}`}>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <input 
                      type="radio" 
                      name={s.title} 
                      className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 cursor-pointer flex-shrink-0" 
                      checked={!websiteConfiguration[s.key as keyof WebsiteConfig]} 
                      onChange={() => setWebsiteConfiguration(p => ({ ...p, [s.key]: '' }))} 
                    />
                    <span className="font-semibold text-gray-700 text-sm sm:text-base">None</span>
                  </div>
                  <button 
                    onClick={() => handleShowDemo(s.key, 'none', s.title)}
                    className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-1 hover:bg-green-700 transition-colors w-full xs:w-auto justify-center"
                  >
                    <Eye size={12} className="sm:hidden" /><Eye size={14} className="hidden sm:block" />
                    <span>View Demo</span>
                  </button>
                </div>
              )}
              {Array.from({ length: s.count }).map((_, i) => { 
                const v = `style${i + 1}`;
                const cur = websiteConfiguration[s.key as keyof WebsiteConfig] || 'style1';
                return (
                  <div key={i} className={`border rounded-lg p-2.5 sm:p-3 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 sm:gap-3 hover:bg-white transition-colors cursor-pointer ${cur === v ? 'border-green-500 bg-green-50 shadow-sm' : 'border-gray-300 bg-white'}`}>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <input 
                        type="radio" 
                        name={s.title} 
                        className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 cursor-pointer flex-shrink-0" 
                        checked={cur === v} 
                        onChange={() => setWebsiteConfiguration(p => ({ ...p, [s.key]: v }))} 
                      />
                      <span className="font-semibold text-gray-700 text-sm sm:text-base">{s.title.split(' ')[0]} {i + 1}</span>
                    </div>
                    <button 
                      onClick={() => handleShowDemo(s.key, v, s.title)}
                      className="bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-md text-xs sm:text-sm font-bold flex items-center gap-1 hover:bg-green-700 transition-colors w-full xs:w-auto justify-center"
                    >
                      <Eye size={12} className="sm:hidden" /><Eye size={14} className="hidden sm:block" />
                      <span>View Demo</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Demo Preview Modal */}
      {demoModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-2 sm:p-4 md:p-6" 
          onClick={() => setDemoModalOpen(false)}
        >
          <div 
            className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl w-full max-w-[95vw] sm:max-w-[90vw] md:max-w-4xl lg:max-w-5xl overflow-hidden animate-in zoom-in-95 duration-200" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-3 sm:p-4 border-b bg-gradient-to-r from-green-50 to-emerald-50 flex justify-between items-center sticky top-0 z-10">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Eye size={16} className="text-green-600 sm:hidden" />
                  <Eye size={20} className="text-green-600 hidden sm:block" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-bold text-gray-800 text-sm sm:text-base md:text-lg truncate">{demoTitle}</h3>
                  <p className="text-xs text-gray-500 hidden sm:block">Preview how this style will look when applied</p>
                </div>
              </div>
              <button 
                onClick={() => setDemoModalOpen(false)} 
                className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                aria-label="Close modal"
              >
                <X size={20} className="text-gray-500 sm:hidden" />
                <X size={24} className="text-gray-500 hidden sm:block" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-3 sm:p-4 md:p-6 max-h-[60vh] sm:max-h-[70vh] md:max-h-[75vh] overflow-y-auto bg-gray-50">
              {demoImage && !demoImageError ? (
                <div className="relative">
                  <div className="flex justify-center gap-2 mb-3 sm:mb-4">
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-white rounded-full text-xs text-gray-500 border shadow-sm">
                      <span className="w-2 h-2 rounded-full bg-green-400"></span>
                      Live Preview
                    </span>
                  </div>
                  
                  <div className="relative rounded-lg sm:rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                    <img 
                      src={demoImage} 
                      alt={demoTitle}
                      loading="lazy"
                      className="w-full h-auto object-contain max-h-[50vh] sm:max-h-[60vh] md:max-h-[65vh]"
                      onError={() => setDemoImageError(true)}
                    />
                  </div>

                  <div className="flex justify-center gap-2 sm:gap-3 mt-3 sm:mt-4">
                    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-full text-xs text-gray-600 border shadow-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden xs:inline">Mobile</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-full text-xs text-gray-600 border shadow-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden xs:inline">Tablet</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 bg-white rounded-full text-xs text-gray-600 border shadow-sm">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="hidden xs:inline">Desktop</span>
                    </div>
                  </div>
                </div>
              ) : demoImageError ? (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-gray-400">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-red-50 flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="opacity-50 text-red-400 sm:hidden" />
                    <ImageIcon size={40} className="opacity-50 text-red-400 hidden sm:block" />
                  </div>
                  <p className="text-sm sm:text-base font-medium text-red-500">Failed to load demo image</p>
                  <p className="text-xs sm:text-sm mt-1">Please try again later</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 sm:py-16 md:py-20 text-gray-400">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ImageIcon size={32} className="opacity-50 sm:hidden" />
                    <ImageIcon size={40} className="opacity-50 hidden sm:block" />
                  </div>
                  <p className="text-sm sm:text-base font-medium">No demo image available</p>
                  <p className="text-xs sm:text-sm mt-1">Demo preview for this style is coming soon</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 sm:p-4 border-t bg-white flex flex-col xs:flex-row justify-between items-center gap-3 sticky bottom-0">
              <p className="text-xs text-gray-500 text-center xs:text-left order-2 xs:order-1">
                <span className="hidden sm:inline">Theme preview may vary slightly based on your content</span>
                <span className="sm:hidden">Preview may vary</span>
              </p>
              <button 
                onClick={() => setDemoModalOpen(false)}
                className="w-full xs:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-sm text-sm sm:text-base order-1 xs:order-2"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeViewTab;
