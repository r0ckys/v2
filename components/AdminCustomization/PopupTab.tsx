import React, { useRef, useState } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  Layers,
  FolderOpen
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Popup, WebsiteConfig, PopupFilterStatus, ImageUploadType } from './types';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';
import { convertFileToWebP } from '../../services/imageUtils';
import { ActionButton } from './shared/TabButton';
import { GalleryPicker } from '../GalleryPicker';

interface PopupTabProps {
  websiteConfiguration: WebsiteConfig;
  setWebsiteConfiguration: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
  tenantId: string;
  onUpdateWebsiteConfig?: (config: WebsiteConfig) => Promise<void>;
  hasUnsavedChangesRef: React.MutableRefObject<boolean>;
  prevWebsiteConfigRef: React.MutableRefObject<WebsiteConfig | null>;
  lastSaveTimestampRef: React.MutableRefObject<number>;
}

export const PopupTab: React.FC<PopupTabProps> = ({
  websiteConfiguration,
  setWebsiteConfiguration,
  tenantId,
  onUpdateWebsiteConfig,
  hasUnsavedChangesRef,
  prevWebsiteConfigRef,
  lastSaveTimestampRef
}) => {
  const [popupFilterStatus, setPopupFilterStatus] = useState<PopupFilterStatus>('All');
  const [popupSearchQuery, setPopupSearchQuery] = useState('');
  const [isPopupModalOpen, setIsPopupModalOpen] = useState(false);
  const [editingPopup, setEditingPopup] = useState<Popup | null>(null);
  const [popupFormData, setPopupFormData] = useState<Partial<Popup>>({
    name: '',
    image: '',
    url: '',
    urlType: 'Internal',
    priority: 0,
    status: 'Draft'
  });

  // Gallery Picker State
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);

  const popupImageInputRef = useRef<HTMLInputElement>(null);

  const handleGallerySelect = (imageUrl: string) => {
    setPopupFormData(p => ({ ...p, image: imageUrl }));
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
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
      const convertedImage = await convertFileToWebP(file, { quality: 0.82, maxDimension: 2000 });
      setPopupFormData((prev) => ({ ...prev, image: convertedImage }));
    } catch (err) {
      console.error('Failed to upload image:', err);
      alert('Failed to process image.');
    } finally {
      event.target.value = '';
    }
  };

  const openPopupModal = (popup?: Popup): void => {
    if (popup) {
      setEditingPopup(popup);
      setPopupFormData(popup);
    } else {
      setEditingPopup(null);
      setPopupFormData({
        name: '',
        image: '',
        url: '',
        urlType: 'Internal',
        priority: 0,
        status: 'Draft'
      });
    }
    setIsPopupModalOpen(true);
  };

  const handleSavePopup = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    if (!popupFormData.name || !popupFormData.image) {
      toast.error('Please fill all required fields');
      return;
    }

    const loadingToast = toast.loading('Saving popup...');
    const startTime = Date.now();

    try {
      const popup: Popup = {
        id: editingPopup?.id || Date.now(),
        name: popupFormData.name,
        image: popupFormData.image,
        url: popupFormData.url || '',
        urlType: popupFormData.urlType as 'Internal' | 'External',
        priority: Number(popupFormData.priority),
        status: popupFormData.status as 'Draft' | 'Publish',
        createdAt: editingPopup?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const updatedPopups = editingPopup
        ? (websiteConfiguration.popups || []).map((item) =>
            item.id === editingPopup.id ? popup : item
          )
        : [...(websiteConfiguration.popups || []), popup];

      const updatedConfig = { ...websiteConfiguration, popups: updatedPopups };

      if (onUpdateWebsiteConfig) {
        await onUpdateWebsiteConfig(updatedConfig);
      }

      setWebsiteConfiguration(updatedConfig);
      hasUnsavedChangesRef.current = false;
      prevWebsiteConfigRef.current = updatedConfig;
      lastSaveTimestampRef.current = Date.now();

      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
      }

      toast.dismiss(loadingToast);
      toast.success(editingPopup ? 'Popup updated successfully!' : 'Popup added successfully!');
      setIsPopupModalOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Popup save failed:', error);
      toast.error('Failed to save popup');
    }
  };

  const handleDeletePopup = async (popupId: number): Promise<void> => {
    if (confirm('Delete popup?')) {
      const loadingToast = toast.loading('Deleting popup...');
      const startTime = Date.now();

      try {
        const updatedConfig = {
          ...websiteConfiguration,
          popups: (websiteConfiguration.popups || []).filter((item) => item.id !== popupId)
        };

        if (onUpdateWebsiteConfig) {
          await onUpdateWebsiteConfig(updatedConfig);
        }

        setWebsiteConfiguration(updatedConfig);
        hasUnsavedChangesRef.current = false;
        prevWebsiteConfigRef.current = updatedConfig;
        lastSaveTimestampRef.current = Date.now();

        const elapsed = Date.now() - startTime;
        if (elapsed < 1000) {
          await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
        }

        toast.dismiss(loadingToast);
        toast.success('Popup deleted successfully!');
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Delete failed:', error);
        toast.error('Failed to delete popup');
      }
    }
  };

  const handleTogglePopupStatus = async (popup: Popup): Promise<void> => {
    const loadingToast = toast.loading('Updating status...');
    const startTime = Date.now();

    try {
      const updatedPopups = (websiteConfiguration.popups || []).map((item) =>
        item.id === popup.id
          ? {
              ...item,
              status: item.status === 'Draft' ? 'Publish' : 'Draft',
              updatedAt: new Date().toISOString()
            }
          : item
      );

      const updatedConfig = { ...websiteConfiguration, popups: updatedPopups };

      if (onUpdateWebsiteConfig) {
        await onUpdateWebsiteConfig(updatedConfig);
      }

      setWebsiteConfiguration(updatedConfig);
      hasUnsavedChangesRef.current = false;
      prevWebsiteConfigRef.current = updatedConfig;
      lastSaveTimestampRef.current = Date.now();

      const elapsed = Date.now() - startTime;
      if (elapsed < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - elapsed));
      }

      toast.dismiss(loadingToast);
      toast.success('Status updated!');
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Status update failed:', error);
      toast.error('Failed to update status');
    }
  };

  const filteredPopups = (websiteConfiguration.popups || []).filter(
    (popup) =>
      (popupFilterStatus === 'All' || popup.status === popupFilterStatus) &&
      popup.name.toLowerCase().includes(popupSearchQuery.toLowerCase())
  );

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Status Filters */}
          <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-1">
            {['All', 'Publish', 'Draft'].map(s => (
              <button 
                key={s} 
                onClick={() => setPopupFilterStatus(s as PopupFilterStatus)} 
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${popupFilterStatus === s ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {s === 'All' ? 'All Data' : s}
                {s === 'All' && <span className="ml-1 text-xs bg-gray-200 px-1.5 rounded-full">{(websiteConfiguration.popups || []).length}</span>}
              </button>
            ))}
          </div>
          
          {/* Search and Add */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full pl-10 pr-4 py-2 bg-white border rounded-lg text-sm focus:ring-1 focus:ring-green-500" 
                value={popupSearchQuery} 
                onChange={e => setPopupSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            <ActionButton 
              onClick={() => openPopupModal()} 
              variant="bg-green-600 text-white hover:from-[#2BAEE8] hover:to-[#1A7FE8] flex items-center gap-2 justify-center w-full sm:w-auto"
            >
              <Plus size={16} /><span className="hidden xs:inline">Add</span> Popup
            </ActionButton>
          </div>
        </div>
        
        {/* Popup Table - Desktop / Cards - Mobile */}
        <div className="overflow-hidden border rounded-lg shadow-sm">
          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Image</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">URL</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPopups.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400">No popups found</td>
                  </tr>
                ) : filteredPopups.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <img src={p.image} alt={p.name} className="h-12 w-16 object-cover rounded border" />
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 truncate max-w-xs">{p.url || '-'}</td>
                    <td className="px-4 py-3 text-sm text-gray-800">{p.priority || 0}</td>
                    <td className="px-4 py-3">
                      <button 
                        onClick={() => handleTogglePopupStatus(p)} 
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${p.status === 'Publish' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                      >
                        {p.status}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openPopupModal(p)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeletePopup(p.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden divide-y divide-gray-100">
            {filteredPopups.length === 0 ? (
              <div className="px-4 py-12 text-center text-gray-400">No popups found</div>
            ) : filteredPopups.map(p => (
              <div key={p.id} className="p-4 hover:bg-gray-50">
                <div className="flex gap-3">
                  <img src={p.image} alt={p.name} className="h-16 w-20 object-cover rounded border flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-medium text-gray-800 truncate">{p.name}</h4>
                      <button 
                        onClick={() => handleTogglePopupStatus(p)} 
                        className={`px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0 ${p.status === 'Publish' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}
                      >
                        {p.status}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 truncate mt-1">{p.url || 'No URL'}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-400">Priority: {p.priority || 0}</span>
                      <div className="flex gap-2">
                        <button onClick={() => openPopupModal(p)} className="p-1.5 hover:bg-blue-50 rounded text-blue-600">
                          <Edit size={16} />
                        </button>
                        <button onClick={() => handleDeletePopup(p.id)} className="p-1.5 hover:bg-red-50 rounded text-red-600">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Popup Modal */}
      {isPopupModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b bg-gray-50 flex justify-between items-center">
              <h3 className="font-bold text-gray-800">{editingPopup ? 'Edit Popup' : 'Add New Popup'}</h3>
              <button onClick={() => setIsPopupModalOpen(false)}>
                <X size={20} className="text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSavePopup} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Popup Image*</label>
                <input type="file" ref={popupImageInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                <div className="flex gap-2">
                  <div onClick={() => popupImageInputRef.current?.click()} className="flex-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50">
                    {popupFormData.image ? (
                      <img src={normalizeImageUrl(popupFormData.image)} alt="" className="h-28 mx-auto object-contain" />
                    ) : (
                      <div className="text-gray-400">
                        <Upload size={32} className="mx-auto mb-2" />
                        <p className="text-sm">Upload</p>
                      </div>
                    )}
                  </div>
                  <button type="button" onClick={() => setIsGalleryPickerOpen(true)} className="w-24 border-2 border-dashed border-indigo-300 rounded-lg flex flex-col items-center justify-center text-indigo-600 hover:bg-indigo-50 transition">
                    <FolderOpen size={24} className="mb-1" />
                    <span className="text-xs font-medium">Gallery</span>
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name*</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={popupFormData.name} onChange={e => setPopupFormData({ ...popupFormData, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <input type="number" className="w-full px-3 py-2 border rounded-lg text-sm" value={popupFormData.priority} onChange={e => setPopupFormData({ ...popupFormData, priority: Number(e.target.value) })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
                  <input type="text" className="w-full px-3 py-2 border rounded-lg text-sm" value={popupFormData.url} onChange={e => setPopupFormData({ ...popupFormData, url: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">URL Type</label>
                  <select className="w-full px-3 py-2 border rounded-lg text-sm" value={popupFormData.urlType} onChange={e => setPopupFormData({ ...popupFormData, urlType: e.target.value as any })}>
                    <option value="Internal">Internal</option>
                    <option value="External">External</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select className="w-full px-3 py-2 border rounded-lg text-sm" value={popupFormData.status} onChange={e => setPopupFormData({ ...popupFormData, status: e.target.value as any })}>
                  <option value="Publish">Publish</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsPopupModalOpen(false)} className="px-4 py-2 border rounded-lg text-sm hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-gradient-to-r from-[#38BDF8] to-[#1E90FF] text-white rounded-lg text-sm font-bold hover:from-[#2BAEE8] hover:to-[#1A7FE8]">Save Popup</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Picker Modal */}
      <GalleryPicker
        isOpen={isGalleryPickerOpen}
        onClose={() => setIsGalleryPickerOpen(false)}
        onSelect={handleGallerySelect}
        title="Choose Popup Image from Gallery"
      />
    </>
  );
};

export default PopupTab;
