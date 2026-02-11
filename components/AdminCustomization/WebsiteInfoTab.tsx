import React, { useRef } from 'react';
import {
  Image as ImageIcon,
  Globe,
  Plus,
  Trash2
} from 'lucide-react';
import { WebsiteConfig, SocialLink, FooterLink, FooterLinkField, ImageUploadType } from './types';
import { SOCIAL_PLATFORM_OPTIONS, FOOTER_LINK_SECTIONS } from './constants';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';
import { convertFileToWebP, dataUrlToFile } from '../../services/imageUtils';
import { uploadPreparedImageToServer } from '../../services/imageUploadService';
import { ActionButton } from './shared/TabButton';

interface WebsiteInfoTabProps {
  websiteConfiguration: WebsiteConfig;
  setWebsiteConfiguration: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
  logo: string | null;
  onUpdateLogo: (logo: string | null) => void;
  tenantId: string;
}

export const WebsiteInfoTab: React.FC<WebsiteInfoTabProps> = ({
  websiteConfiguration,
  setWebsiteConfiguration,
  logo,
  onUpdateLogo,
  tenantId
}) => {
  // File Input Refs
  const logoInputRef = useRef<HTMLInputElement>(null);
  const faviconInputRef = useRef<HTMLInputElement>(null);
  const headerLogoInputRef = useRef<HTMLInputElement>(null);
  const footerLogoInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    imageType: 'logo' | 'favicon' | 'headerLogo' | 'footerLogo'
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    const MAX_FILE_SIZE = 2 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      alert('File too large. Max 2MB.');
      event.target.value = '';
      return;
    }

    try {
      const convertedImage = await convertFileToWebP(file, {
        quality: imageType === 'favicon' ? 0.9 : 0.82,
        maxDimension: imageType === 'favicon' ? 512 : 2000
      });

      const filename = `${imageType}-${Date.now()}.webp`;
      const webpFile = dataUrlToFile(convertedImage, filename);
      const uploadedUrl = await uploadPreparedImageToServer(webpFile, tenantId, 'branding');
      
      if (imageType === 'logo') {
        onUpdateLogo(uploadedUrl);
      } else if (imageType === 'favicon') {
        setWebsiteConfiguration((prev) => ({ ...prev, favicon: uploadedUrl }));
      } else if (imageType === 'headerLogo') {
        setWebsiteConfiguration((prev) => ({ ...prev, headerLogo: uploadedUrl }));
      } else if (imageType === 'footerLogo') {
        setWebsiteConfiguration((prev) => ({ ...prev, footerLogo: uploadedUrl }));
      }
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to process image.');
    } finally {
      event.target.value = '';
    }
  };

  const handleRemoveImage = (imageType: 'logo' | 'favicon' | 'headerLogo' | 'footerLogo'): void => {
    if (imageType === 'logo') {
      onUpdateLogo(null);
      if (logoInputRef.current) logoInputRef.current.value = '';
    } else if (imageType === 'favicon') {
      setWebsiteConfiguration((prev) => ({ ...prev, favicon: null }));
      if (faviconInputRef.current) faviconInputRef.current.value = '';
    } else if (imageType === 'headerLogo') {
      setWebsiteConfiguration((prev) => ({ ...prev, headerLogo: null }));
      if (headerLogoInputRef.current) headerLogoInputRef.current.value = '';
    } else {
      setWebsiteConfiguration((prev) => ({ ...prev, footerLogo: null }));
      if (footerLogoInputRef.current) footerLogoInputRef.current.value = '';
    }
  };

  const addContactItem = (field: 'addresses' | 'emails' | 'phones'): void => {
    setWebsiteConfiguration((prev) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const updateContactItem = (
    field: 'addresses' | 'emails' | 'phones',
    index: number,
    value: string
  ): void => {
    setWebsiteConfiguration((prev) => {
      const updated = [...prev[field]];
      updated[index] = value;
      return { ...prev, [field]: updated };
    });
  };

  const removeContactItem = (field: 'addresses' | 'emails' | 'phones', index: number): void => {
    setWebsiteConfiguration((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addSocialLink = (): void => {
    setWebsiteConfiguration((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { id: Date.now().toString(), platform: 'Facebook', url: '' }
      ]
    }));
  };

  const updateSocialLink = (index: number, key: keyof SocialLink, value: string): void => {
    setWebsiteConfiguration((prev) => {
      const updated = [...prev.socialLinks];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, socialLinks: updated };
    });
  };

  const removeSocialLink = (index: number): void => {
    setWebsiteConfiguration((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const addFooterLink = (field: FooterLinkField): void => {
    setWebsiteConfiguration((prev) => ({
      ...prev,
      [field]: [
        ...((prev[field] as FooterLink[]) || []),
        { id: Date.now().toString(), label: '', url: '' }
      ]
    }));
  };

  const updateFooterLink = (
    field: FooterLinkField,
    index: number,
    key: keyof FooterLink,
    value: string
  ): void => {
    setWebsiteConfiguration((prev) => {
      const updated = [...((prev[field] as FooterLink[]) || [])];
      updated[index] = { ...updated[index], [key]: value };
      return { ...prev, [field]: updated };
    });
  };

  const removeFooterLink = (field: FooterLinkField, index: number): void => {
    setWebsiteConfiguration((prev) => ({
      ...prev,
      [field]: ((prev[field] as FooterLink[]) || []).filter((_, i) => i !== index)
    }));
  };

  const logoConfigs = [
    { r: logoInputRef, l: logo, t: 'logo' as const, n: 'Primary Store Logo (Fallback)' },
    { r: headerLogoInputRef, l: websiteConfiguration.headerLogo, t: 'headerLogo' as const, n: 'Header Logo Override' },
    { r: footerLogoInputRef, l: websiteConfiguration.footerLogo, t: 'footerLogo' as const, n: 'Footer Logo Override' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="space-y-6">
        {logoConfigs.map(x => (
          <div key={x.n} className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
            <div className="flex flex-col items-center gap-3">
              <ImageIcon size={32} className="text-gray-400" />
              <p className="text-sm font-bold text-gray-700">{x.n}</p>
              {x.l ? (
                <img src={normalizeImageUrl(x.l)} alt="" className="h-12 max-w-[200px] object-contain my-2 border rounded p-1 bg-gray-50" />
              ) : (
                <p className="text-xs text-gray-400">No logo uploaded</p>
              )}
              <div className="flex gap-2">
                <button onClick={() => x.r.current?.click()} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded font-bold">Select Image</button>
                {x.l && <button onClick={() => handleRemoveImage(x.t)} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded font-bold">Remove</button>}
              </div>
              <input type="file" ref={x.r} onChange={e => handleImageUpload(e, x.t)} className="hidden" accept="image/*" />
            </div>
          </div>
        ))}
        
        {/* Favicon */}
        <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
          <div className="flex flex-col items-center gap-3">
            <Globe size={32} className="text-gray-400" />
            <p className="text-sm font-bold text-gray-700">Favicon (32x32px)</p>
            {websiteConfiguration.favicon && <img src={websiteConfiguration.favicon} alt="Favicon" className="w-8 h-8 object-contain my-2" />}
            <div className="flex gap-2">
              <button onClick={() => faviconInputRef.current?.click()} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded font-bold">Select Image</button>
              {websiteConfiguration.favicon && <button onClick={() => handleRemoveImage('favicon')} className="text-xs bg-red-500 text-white px-3 py-1.5 rounded font-bold">Remove</button>}
            </div>
            <input type="file" ref={faviconInputRef} onChange={e => handleImageUpload(e, 'favicon')} className="hidden" accept="image/*" />
          </div>
        </div>
        
        {/* Text Fields */}
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Website Name*</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" value={websiteConfiguration.websiteName} onChange={e => setWebsiteConfiguration(p => ({ ...p, websiteName: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Short Description</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" value={websiteConfiguration.shortDescription} onChange={e => setWebsiteConfiguration(p => ({ ...p, shortDescription: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Whatsapp Number</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" value={websiteConfiguration.whatsappNumber} onChange={e => setWebsiteConfiguration(p => ({ ...p, whatsappNumber: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Notice Text</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" placeholder="e.g., Easy return policy..." value={websiteConfiguration.adminNoticeText || ''} onChange={e => setWebsiteConfiguration(p => ({ ...p, adminNoticeText: e.target.value }))} />
            <p className="text-xs text-gray-500 mt-1">Scrolling ticker at top of store header.</p>
          </div>
          <div className="pt-3 border-t mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">Custom Domain</label>
            <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-1 focus:ring-green-500" placeholder="e.g., mystore.com" value={websiteConfiguration.customDomain || ""} onChange={e => setWebsiteConfiguration(p => ({ ...p, customDomain: e.target.value.toLowerCase().trim() }))} />
            <p className="text-xs text-gray-500 mt-1">Your custom domain for the storefront. Configure DNS A record to point to 159.198.47.126</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Contact Items (addresses, emails, phones) */}
        {(['addresses', 'emails', 'phones'] as const).map(f => (
          <div key={f} className="space-y-2">
            <ActionButton onClick={() => addContactItem(f)} variant="bg-green-600 text-white w-full flex items-center justify-center gap-2">
              <Plus size={16} />Add New {f.slice(0, -1)}
            </ActionButton>
            {websiteConfiguration[f].map((v, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={v} onChange={e => updateContactItem(f, i, e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
                <button onClick={() => removeContactItem(f, i)} className="bg-red-500 text-white p-2 rounded-lg">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        ))}
        
        {/* Social Links */}
        <div className="space-y-2">
          <ActionButton onClick={addSocialLink} variant="bg-green-600 text-white w-full flex items-center justify-center gap-2">
            <Plus size={16} />Add Social Link
          </ActionButton>
          {websiteConfiguration.socialLinks.map((l, i) => (
            <div key={l.id} className="bg-gray-50 border p-3 rounded-lg space-y-2 relative">
              <div className="flex gap-2">
                <select value={l.platform} onChange={e => updateSocialLink(i, 'platform', e.target.value)} className="w-1/3 text-sm border rounded px-2 py-1">
                  {SOCIAL_PLATFORM_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
                <input type="text" value={l.url} onChange={e => updateSocialLink(i, 'url', e.target.value)} className="flex-1 text-sm border rounded px-2 py-1" placeholder="URL" />
              </div>
              <button onClick={() => removeSocialLink(i)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
        
        {/* Footer Links */}
        <div className="space-y-4">
          {FOOTER_LINK_SECTIONS.map(s => (
            <div key={s.field} className="border rounded-xl p-4 space-y-3 bg-white/60">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-gray-800">{s.title}</p>
                  <p className="text-xs text-gray-500">{s.helper}</p>
                </div>
                <button onClick={() => addFooterLink(s.field)} className="text-xs bg-green-600 text-white px-3 py-1.5 rounded font-bold flex items-center gap-1 self-start">
                  <Plus size={14} />Add Link
                </button>
              </div>
              {((websiteConfiguration[s.field] as FooterLink[]) || []).length === 0 && <p className="text-xs text-gray-400">No links yet.</p>}
              {((websiteConfiguration[s.field] as FooterLink[]) || []).map((l, i) => (
                <div key={l.id} className="grid grid-cols-1 md:grid-cols-[1fr,1fr,auto] gap-2">
                  <input type="text" value={l.label} onChange={e => updateFooterLink(s.field, i, 'label', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" placeholder="Label" />
                  <input type="text" value={l.url} onChange={e => updateFooterLink(s.field, i, 'url', e.target.value)} className="px-3 py-2 border rounded-lg text-sm" placeholder="https://" />
                  <button onClick={() => removeFooterLink(s.field, i)} className="bg-red-500 text-white px-3 py-2 rounded-lg text-sm font-bold">Remove</button>
                </div>
              ))}
            </div>
          ))}
        </div>
        
        {/* Toggles */}
        <div className="space-y-3 pt-4 border-t">
          {[
            { k: 'showMobileHeaderCategory', l: 'isShowMobileHeaderCategoryMenu' },
            { k: 'showNewsSlider', l: 'Is Show News Slider' },
            { k: 'hideCopyright', l: 'Hide Copyright Section' },
            { k: 'hideCopyrightText', l: 'Hide Copyright Text' },
            { k: 'showPoweredBy', l: 'Powered by SystemNext IT' }
          ].map(x => (
            <label key={x.k} className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-green-600 rounded" 
                checked={websiteConfiguration[x.k as keyof WebsiteConfig] as boolean} 
                onChange={e => setWebsiteConfiguration(p => ({ ...p, [x.k]: e.target.checked }))} 
              />
              <span className="text-sm font-medium">{x.l}</span>
            </label>
          ))}
          
          {websiteConfiguration.showNewsSlider && (
            <div className="ml-8 border rounded p-2 text-sm bg-gray-50">
              <p className="text-xs text-gray-500 mb-1">Header Slider Text</p>
              <textarea className="w-full bg-transparent outline-none resize-none" rows={2} value={websiteConfiguration.headerSliderText} onChange={e => setWebsiteConfiguration(p => ({ ...p, headerSliderText: e.target.value }))} />
            </div>
          )}
          
          <div className="flex items-center justify-between gap-3 rounded-xl border border-sky-100 bg-sky-50/70 px-4 py-3">
            <div>
              <p className="text-sm font-semibold text-gray-800">Flash Sale Counter</p>
              <p className="text-xs text-gray-500">Show countdown pill beside Flash Sales.</p>
            </div>
            <button 
              type="button" 
              onClick={() => setWebsiteConfiguration(p => ({ ...p, showFlashSaleCounter: !p.showFlashSaleCounter }))} 
              className={`relative inline-flex items-center rounded-full border px-1 py-0.5 text-xs font-bold ${websiteConfiguration.showFlashSaleCounter ? 'bg-emerald-500/10 text-emerald-700 border-emerald-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
            >
              <span className={`px-3 py-1 rounded-full ${websiteConfiguration.showFlashSaleCounter ? 'bg-white shadow' : 'opacity-50'}`}>
                {websiteConfiguration.showFlashSaleCounter ? 'On' : 'Off'}
              </span>
            </button>
          </div>
          
          <div className="pt-2">
            <label className="block text-xs text-gray-500 mb-1">Branding Text</label>
            <input type="text" className="w-full px-3 py-2 border rounded text-sm" value={websiteConfiguration.brandingText} onChange={e => setWebsiteConfiguration(p => ({ ...p, brandingText: e.target.value }))} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebsiteInfoTab;
