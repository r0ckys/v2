import React, { useState } from 'react';
import { Monitor, Smartphone } from 'lucide-react';
import { WebsiteConfig } from './types';
import { THEME_DEMO_IMAGES } from './constants';

// Figma-styled section configuration
const FIGMA_THEME_SECTIONS = [
  { title: 'Header Section', key: 'headerStyle', count: 5, layout: 'full' },
  // { title: 'Showcase Section', key: 'showcaseSectionStyle', count: 5, layout: 'grid' },
  { title: 'Category Section', key: 'categorySectionStyle', count: 5, layout: 'grid' },
  // { title: 'Product Section', key: 'productSectionStyle', count: 5, layout: 'grid' },
  { title: 'Product card', key: 'productCardStyle', count: 5, layout: 'cards' },
  // { title: 'Brand Section', key: 'brandSectionStyle', count: 5, layout: 'grid' },
  { title: 'Footer Section', key: 'footerStyle', count: 5, layout: 'grid' },
  { title: 'Bottom Nav Section', key: 'bottomNavStyle', count: 5, layout: 'grid' },
];

interface CustomThemeSectionsProps {
  websiteConfiguration: WebsiteConfig;
  setWebsiteConfiguration: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
}

// Style option card component
const StyleOptionCard: React.FC<{
  sectionKey: string;
  styleIndex: number;
  isSelected: boolean;
  onSelect: () => void;
  imageUrl?: string;
  layout?: string;
}> = ({ sectionKey, styleIndex, isSelected, onSelect, imageUrl, layout }) => {
  const [imageError, setImageError] = useState(false);

  // Determine card height based on layout type
  const getCardHeight = () => {
    if (layout === 'full') return '113px';
    if (layout === 'cards') return '302px';
    return '113px';
  };

  return (
    <div
      onClick={onSelect}
      style={{
        backgroundColor: 'white',
        border: isSelected ? '1.5px solid #ff6a00' : '1.5px solid #f9f9f9',
        borderRadius: '8px',
        overflow: 'hidden',
        paddingBottom: '8px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', width: '100%' }}>
        {/* Preview Image */}
        <div
          style={{
            width: '100%',
            height: getCardHeight(),
            backgroundColor: '#f0f0f0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={`Style ${styleIndex + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={() => setImageError(true)}
            />
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(135deg, #e0e0e0 0%, #f5f5f5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#999',
              fontFamily: 'Poppins, sans-serif',
              fontSize: '14px',
            }}>
              Style {styleIndex + 1}
            </div>
          )}
        </div>

        {/* Select/Selected Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          style={{
            width: '142px',
            height: '33px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontFamily: '"Lato", sans-serif',
            fontWeight: 700,
            fontSize: '15px',
            letterSpacing: '-0.3px',
            transition: 'all 0.2s ease',
            ...(isSelected
              ? {
                  background: 'linear-gradient(180deg, rgba(255,106,0,0.2) 0%, rgba(255,159,28,0.2) 100%)',
                  color: 'transparent',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundImage: 'linear-gradient(180deg, #ff6a00 0%, #ff9f1c 100%)',
                }
              : {
                  backgroundColor: '#f9f9f9',
                  color: 'black',
                }),
          }}
        >
          {isSelected ? 'Selected' : 'Select'}
        </button>
      </div>
    </div>
  );
};

export const CustomThemeSections: React.FC<CustomThemeSectionsProps> = ({
  websiteConfiguration,
  setWebsiteConfiguration
}) => {
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  // Get the preview image for the currently selected styles
  const getPreviewImage = () => {
    const headerStyle = (websiteConfiguration.headerStyle as string) || 'style1';
    return THEME_DEMO_IMAGES.headerStyle?.[headerStyle] || '';
  };

  const handleStyleSelect = (sectionKey: string, styleValue: string) => {
    setWebsiteConfiguration(prev => ({ ...prev, [sectionKey]: styleValue }));
  };

  return (
    <div style={{ display: 'flex', gap: '24px', position: 'relative' }}>
      {/* Left: Theme Sections */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '40px' }}>
        {FIGMA_THEME_SECTIONS.map((section) => {
          const currentStyle = (websiteConfiguration[section.key as keyof WebsiteConfig] as string) || 'style1';
          const sectionDemos = THEME_DEMO_IMAGES[section.key] || {};

          return (
            <div key={section.key} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Section Title */}
              <h3
                style={{
                  fontFamily: '"Lato", sans-serif',
                  fontWeight: 700,
                  fontSize: '22px',
                  color: '#023337',
                  letterSpacing: '0.11px',
                  margin: 0,
                }}
              >
                {section.title}
              </h3>

              {/* Style Options Grid */}
              {section.layout === 'full' ? (
                // Full-width layout for Header Section
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {Array.from({ length: section.count }).map((_, i) => {
                    const styleValue = `style${i + 1}`;
                    const isSelected = currentStyle === styleValue;
                    const imageUrl = sectionDemos[styleValue];

                    return (
                      <StyleOptionCard
                        key={i}
                        sectionKey={section.key}
                        styleIndex={i}
                        isSelected={isSelected}
                        onSelect={() => handleStyleSelect(section.key, styleValue)}
                        imageUrl={imageUrl}
                        layout={section.layout}
                      />
                    );
                  })}
                </div>
              ) : section.layout === 'cards' ? (
                // Special layout for Product Cards - 3 columns first row, 2 columns second row
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    {Array.from({ length: 3 }).map((_, i) => {
                      const styleValue = `style${i + 1}`;
                      const isSelected = currentStyle === styleValue;
                      const imageUrl = sectionDemos[styleValue];

                      return (
                        <StyleOptionCard
                          key={i}
                          sectionKey={section.key}
                          styleIndex={i}
                          isSelected={isSelected}
                          onSelect={() => handleStyleSelect(section.key, styleValue)}
                          imageUrl={imageUrl}
                          layout={section.layout}
                        />
                      );
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    {Array.from({ length: 2 }).map((_, i) => {
                      const actualIndex = i + 3;
                      const styleValue = `style${actualIndex + 1}`;
                      const isSelected = currentStyle === styleValue;
                      const imageUrl = sectionDemos[styleValue];

                      return (
                        <div key={actualIndex} style={{ width: '209px' }}>
                          <StyleOptionCard
                            sectionKey={section.key}
                            styleIndex={actualIndex}
                            isSelected={isSelected}
                            onSelect={() => handleStyleSelect(section.key, styleValue)}
                            imageUrl={imageUrl}
                            layout={section.layout}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                // Two-column grid layout for other sections
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
                  {Array.from({ length: section.count }).map((_, i) => {
                    const styleValue = `style${i + 1}`;
                    const isSelected = currentStyle === styleValue;
                    const imageUrl = sectionDemos[styleValue];

                    return (
                      <StyleOptionCard
                        key={i}
                        sectionKey={section.key}
                        styleIndex={i}
                        isSelected={isSelected}
                        onSelect={() => handleStyleSelect(section.key, styleValue)}
                        imageUrl={imageUrl}
                        layout={section.layout}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Right: Preview Panel - Sticky */}
      <div
        style={{
          width: '456px',
          position: 'sticky',
          top: '20px',
          alignSelf: 'flex-start',
          height: 'fit-content',
          display: 'none', // Hidden on mobile
        }}
        className="hidden lg:block"
      >
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          }}
        >
          {/* Preview Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '16px 12px',
            }}
          >
            <h4
              style={{
                fontFamily: '"Lato", sans-serif',
                fontWeight: 700,
                fontSize: '20px',
                color: '#023337',
                letterSpacing: '0.1px',
                margin: 0,
              }}
            >
              Preview
            </h4>
            <button
              onClick={() => setPreviewMode(previewMode === 'desktop' ? 'mobile' : 'desktop')}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              title={`Switch to ${previewMode === 'desktop' ? 'mobile' : 'desktop'} view`}
            >
              {previewMode === 'desktop' ? (
                <Monitor size={24} style={{ color: '#023337' }} />
              ) : (
                <Smartphone size={24} style={{ color: '#023337' }} />
              )}
            </button>
          </div>

          {/* Preview Content */}
          <div
            style={{
              width: '100%',
              height: '677px',
              overflow: 'hidden',
              backgroundColor: '#f5f5f5',
            }}
          >
            {getPreviewImage() ? (
              <img
                src={getPreviewImage()}
                alt="Theme Preview"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'top',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#999',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '16px',
                }}
              >
                No preview available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomThemeSections;
