import React, { useRef, useState } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Search,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarDays,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Campaign, WebsiteConfig, Product, CampaignFilterStatus } from './types';
import { STATUS_COLORS } from './constants';
import { normalizeImageUrl } from '../../utils/imageUrlHelper';
import { convertFileToWebP, dataUrlToFile } from '../../services/imageUtils';
import { uploadPreparedImageToServer } from '../../services/imageUploadService';
import { ActionButton } from './shared/TabButton';

interface CampaignTabProps {
  websiteConfiguration: WebsiteConfig;
  setWebsiteConfiguration: React.Dispatch<React.SetStateAction<WebsiteConfig>>;
  tenantId: string;
  products: Product[];
  onUpdateWebsiteConfig?: (config: WebsiteConfig) => Promise<void>;
  hasUnsavedChangesRef: React.MutableRefObject<boolean>;
  prevWebsiteConfigRef: React.MutableRefObject<WebsiteConfig | null>;
  lastSaveTimestampRef: React.MutableRefObject<number>;
}

export const CampaignTab: React.FC<CampaignTabProps> = ({
  websiteConfiguration,
  setWebsiteConfiguration,
  tenantId,
  products,
  onUpdateWebsiteConfig,
  hasUnsavedChangesRef,
  prevWebsiteConfigRef,
  lastSaveTimestampRef
}) => {
  const [campaignFilterStatus, setCampaignFilterStatus] = useState<CampaignFilterStatus>('All');
  const [campaignSearchQuery, setCampaignSearchQuery] = useState('');
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [campaignFormData, setCampaignFormData] = useState<Partial<Campaign>>({
    name: '',
    logo: '',
    startDate: '',
    endDate: '',
    url: '',
    status: 'Publish',
    serial: 1,
    productId: ''
  });
  const [campaignCurrentPage, setCampaignCurrentPage] = useState(1);
  const [campaignItemsPerPage, setCampaignItemsPerPage] = useState(10);
  const [campaignActionMenu, setCampaignActionMenu] = useState<string | null>(null);

  const campaignLogoInputRef = useRef<HTMLInputElement>(null);

  const openCampaignModal = (campaign?: Campaign): void => {
    if (campaign) {
      setEditingCampaign(campaign);
      setCampaignFormData({ ...campaign });
    } else {
      setEditingCampaign(null);
      setCampaignFormData({
        name: '',
        logo: '',
        startDate: '',
        endDate: '',
        url: '',
        serial: (websiteConfiguration.campaigns?.length || 0) + 1,
        productId: '',
        status: 'Publish'
      });
    }
    setIsCampaignModalOpen(true);
  };

  const handleSaveCampaign = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault();

    const loadingToast = toast.loading('Saving campaign...');
    const startTime = Date.now();

    try {
      const campaign: Campaign = {
        id: editingCampaign?.id || Date.now().toString(),
        name: campaignFormData.name || 'Untitled',
        logo: campaignFormData.logo || '',
        startDate: campaignFormData.startDate || new Date().toISOString(),
        endDate: campaignFormData.endDate || new Date().toISOString(),
        url: campaignFormData.url || '#',
        serial: Number(campaignFormData.serial),
        status: campaignFormData.status as 'Publish' | 'Draft',
        productId: campaignFormData.productId || ''
      };

      const updatedConfig = {
        ...websiteConfiguration,
        campaigns: editingCampaign
          ? (websiteConfiguration.campaigns || []).map((item) =>
              item.id === editingCampaign.id ? campaign : item
            )
          : [...(websiteConfiguration.campaigns || []), campaign]
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
      toast.success(editingCampaign ? 'Campaign updated!' : 'Campaign added!');
      setIsCampaignModalOpen(false);
    } catch (error) {
      toast.dismiss(loadingToast);
      console.error('Campaign save failed:', error);
      toast.error('Failed to save campaign.');
    }
  };

  const handleDeleteCampaign = async (campaignId: string): Promise<void> => {
    if (confirm('Delete campaign?')) {
      const loadingToast = toast.loading('Deleting campaign...');
      const startTime = Date.now();
      
      try {
        const updatedConfig = {
          ...websiteConfiguration,
          campaigns: (websiteConfiguration.campaigns || []).filter((item) => item.id !== campaignId)
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
        toast.success('Campaign deleted successfully!');
      } catch (error) {
        toast.dismiss(loadingToast);
        console.error('Delete failed:', error);
        toast.error('Failed to delete campaign');
      }
    }
  };

  const handleCampaignLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const convertedImage = await convertFileToWebP(file, {
        quality: 0.85,
        maxDimension: 400
      });
      const webpFile = dataUrlToFile(convertedImage, `campaign-${Date.now()}.webp`);
      const uploadedUrl = await uploadPreparedImageToServer(webpFile, tenantId, 'carousel');
      setCampaignFormData((prev) => ({ ...prev, logo: uploadedUrl }));
    } catch {
      toast.error('Upload failed.');
    }

    if (campaignLogoInputRef.current) {
      campaignLogoInputRef.current.value = '';
    }
  };

  const filteredCampaigns = (websiteConfiguration.campaigns || []).filter(
    (campaign) =>
      (campaignFilterStatus === 'All' || campaign.status === campaignFilterStatus) &&
      campaign.name.toLowerCase().includes(campaignSearchQuery.toLowerCase())
  );

  const campaignTotalPages = Math.ceil(filteredCampaigns.length / campaignItemsPerPage);
  const paginatedCampaigns = filteredCampaigns.slice(
    (campaignCurrentPage - 1) * campaignItemsPerPage,
    campaignCurrentPage * campaignItemsPerPage
  );

  return (
    <>
      <div className="space-y-2 sm:space-y-3">
        {/* Filters and Search */}
        <div className="flex flex-col gap-2 sm:gap-3">
          {/* Status Filters */}
          <div className="flex bg-gray-100 rounded-lg p-1 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-1">
            {(['All', 'Publish', 'Draft'] as CampaignFilterStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => { setCampaignFilterStatus(status); setCampaignCurrentPage(1); }}
                className={`px-3 sm:px-4 py-1.5 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${
                  campaignFilterStatus === status
                    ? 'bg-white text-green-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {status === 'All' ? 'All Status' : status}
              </button>
            ))}
          </div>
          
          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={campaignSearchQuery}
                onChange={(e) => { setCampaignSearchQuery(e.target.value); setCampaignCurrentPage(1); }}
                placeholder="Search Category"
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div className="flex gap-2 sm:gap-3">
              <select
                value={campaignItemsPerPage}
                onChange={(e) => { setCampaignItemsPerPage(Number(e.target.value)); setCampaignCurrentPage(1); }}
                className="border rounded-lg px-2 sm:px-3 py-2 text-sm focus:ring-2 focus:ring-green-500 flex-1 sm:flex-none"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <ActionButton
                onClick={() => openCampaignModal()}
                variant="bg-gradient-to-r from-[#38BDF8] to-[#1E90FF] text-white hover:from-[#2BAEE8] hover:to-[#1A7FE8] flex items-center gap-2 justify-center flex-1 sm:flex-none"
              >
                <Plus size={18} />
                <span className="hidden xs:inline">Add</span> Campaign
              </ActionButton>
            </div>
          </div>
        </div>

        {/* Campaign Table - Desktop / Cards - Mobile */}
        <div className="overflow-hidden border rounded-lg shadow-sm">
          {/* Desktop Table View */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700 font-semibold text-xs uppercase border-b">
                <tr>
                  <th className="px-3 py-2 w-10">
                    <input type="checkbox" className="rounded" />
                  </th>
                  <th className="px-3 py-2">SL</th>
                  <th className="px-3 py-2">Product</th>
                  <th className="px-3 py-2">Campaign Name</th>
                  <th className="px-3 py-2">Start</th>
                  <th className="px-3 py-2">End</th>
                  <th className="px-3 py-2">Status</th>
                  <th className="px-3 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedCampaigns.map((campaign, index) => {
                  const product = products.find(p => p.id === campaign.productId);
                  const rowNumber = (campaignCurrentPage - 1) * campaignItemsPerPage + index + 1;
                  return (
                    <tr key={campaign.id} className="hover:bg-gray-50 group">
                      <td className="px-3 py-2">
                        <input type="checkbox" className="rounded" />
                      </td>
                      <td className="px-3 py-2 font-medium text-gray-800">{campaign.serial || rowNumber}</td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                            {product?.images?.[0] ? (
                              <img
                                src={normalizeImageUrl(product.images[0])}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : campaign.logo ? (
                              <img
                                src={normalizeImageUrl(campaign.logo)}
                                alt={campaign.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImageIcon size={16} />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-gray-800 truncate max-w-[180px]">{product?.name || 'No Product'}</p>
                            {product?.sku && <p className="text-xs text-gray-500">[{product.sku}]</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-2 text-gray-700">{campaign.name}</td>
                      <td className="px-3 py-2 text-gray-500">{new Date(campaign.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</td>
                      <td className="px-3 py-2 text-gray-500">{new Date(campaign.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '-')}</td>
                      <td className="px-3 py-2">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${campaign.status === 'Publish' ? 'bg-green-100 text-green-700' : STATUS_COLORS.Draft}`}>
                          {campaign.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-right relative">
                        <button
                          onClick={() => setCampaignActionMenu(campaignActionMenu === campaign.id ? null : campaign.id)}
                          className="p-1.5 hover:bg-gray-100 rounded-lg transition text-gray-500 hover:text-gray-700"
                        >
                          <MoreVertical size={18} />
                        </button>
                        {campaignActionMenu === campaign.id && (
                          <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-20 min-w-[120px]">
                            <button
                              onClick={() => { openCampaignModal(campaign); setCampaignActionMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-blue-600"
                            >
                              <Edit size={14} /> Edit
                            </button>
                            <button
                              onClick={() => { handleDeleteCampaign(campaign.id); setCampaignActionMenu(null); }}
                              className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 size={14} /> Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {paginatedCampaigns.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center py-8 text-gray-400">
                      <CalendarDays size={28} className="mx-auto mb-2 opacity-50" />
                      No campaigns found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile/Tablet Card View */}
          <div className="lg:hidden divide-y divide-gray-100">
            {paginatedCampaigns.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CalendarDays size={28} className="mx-auto mb-2 opacity-50" />
                No campaigns found.
              </div>
            ) : (
              paginatedCampaigns.map((campaign, index) => {
                const product = products.find(p => p.id === campaign.productId);
                return (
                  <div key={campaign.id} className="p-3 hover:bg-gray-50">
                    <div className="flex gap-2">
                      <div className="w-14 h-14 bg-gray-100 rounded border overflow-hidden flex-shrink-0">
                        {product?.images?.[0] ? (
                          <img
                            src={normalizeImageUrl(product.images[0])}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : campaign.logo ? (
                          <img
                            src={normalizeImageUrl(campaign.logo)}
                            alt={campaign.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ImageIcon size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h4 className="font-medium text-gray-800 truncate">{campaign.name}</h4>
                            <p className="text-xs text-gray-500 truncate">{product?.name || 'No Product'}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0 ${campaign.status === 'Publish' ? 'bg-green-100 text-green-700' : STATUS_COLORS.Draft}`}>
                            {campaign.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <span>{new Date(campaign.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
                          <span>→</span>
                          <span>{new Date(campaign.endDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                          <button
                            onClick={() => openCampaignModal(campaign)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteCampaign(campaign.id)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Pagination */}
        {filteredCampaigns.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 sm:px-3 py-2 border rounded-lg bg-gray-50">
            <p className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
              Showing {((campaignCurrentPage - 1) * campaignItemsPerPage) + 1} to {Math.min(campaignCurrentPage * campaignItemsPerPage, filteredCampaigns.length)} of {filteredCampaigns.length}
            </p>
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                onClick={() => setCampaignCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={campaignCurrentPage === 1}
                className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <ChevronLeft size={16} /> <span className="hidden sm:inline">Prev</span>
              </button>
              {Array.from({ length: Math.min(3, campaignTotalPages) }, (_, i) => {
                let pageNum;
                if (campaignTotalPages <= 3) {
                  pageNum = i + 1;
                } else if (campaignCurrentPage <= 2) {
                  pageNum = i + 1;
                } else if (campaignCurrentPage >= campaignTotalPages - 1) {
                  pageNum = campaignTotalPages - 2 + i;
                } else {
                  pageNum = campaignCurrentPage - 1 + i;
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCampaignCurrentPage(pageNum)}
                    className={`w-8 h-8 text-xs sm:text-sm font-medium rounded-lg transition ${campaignCurrentPage === pageNum
                      ? 'bg-teal-500 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => setCampaignCurrentPage(prev => Math.min(campaignTotalPages, prev + 1))}
                disabled={campaignCurrentPage === campaignTotalPages}
                className="px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1"
              >
                <span className="hidden sm:inline">Next</span> <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Campaign Modal */}
      {isCampaignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 sm:p-4" onClick={() => setIsCampaignModalOpen(false)}>
          <div className="bg-white rounded-xl sm:rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b sticky top-0 bg-white z-10">
              <h3 className="text-lg sm:text-xl font-bold">{editingCampaign ? 'Edit Campaign' : 'Add New Campaign'}</h3>
            </div>
            <form onSubmit={handleSaveCampaign} className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Campaign Name *</label>
                <input type="text" value={campaignFormData.name || ''} onChange={e => setCampaignFormData(p => ({ ...p, name: e.target.value }))} className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-green-500" required />
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Select Product</label>
                <select value={campaignFormData.productId || ''} onChange={e => setCampaignFormData(p => ({ ...p, productId: e.target.value }))} className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-green-500">
                  <option value="">-- Select a Product --</option>
                  {products.map(product => (
                    <option key={product.id} value={product.id}>{product.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Campaign Logo</label>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {campaignFormData.logo ? (
                    <img src={normalizeImageUrl(campaignFormData.logo)} alt="Logo" className="w-16 sm:w-20 h-10 sm:h-12 object-contain border rounded" />
                  ) : (
                    <div className="w-16 sm:w-20 h-10 sm:h-12 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="text-gray-400" size={20} />
                    </div>
                  )}
                  <input type="file" ref={campaignLogoInputRef} accept="image/*" onChange={handleCampaignLogoUpload} className="hidden" />
                  <button type="button" onClick={() => campaignLogoInputRef.current?.click()} className="px-3 sm:px-4 py-1.5 sm:py-2 border rounded-lg hover:bg-gray-50 text-xs sm:text-sm">Upload Logo</button>
                  {campaignFormData.logo && (
                    <button type="button" onClick={() => setCampaignFormData(p => ({ ...p, logo: '' }))} className="text-red-500 hover:text-red-700">
                      <X size={18} />
                    </button>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input type="datetime-local" value={campaignFormData.startDate?.slice(0, 16) || ''} onChange={e => setCampaignFormData(p => ({ ...p, startDate: new Date(e.target.value).toISOString() }))} className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-green-500" required />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input type="datetime-local" value={campaignFormData.endDate?.slice(0, 16) || ''} onChange={e => setCampaignFormData(p => ({ ...p, endDate: new Date(e.target.value).toISOString() }))} className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-green-500" required />
                </div>
              </div>
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Link URL</label>
                <input type="text" value={campaignFormData.url || ''} onChange={e => setCampaignFormData(p => ({ ...p, url: e.target.value }))} className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-green-500" placeholder="https://..." />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Order</label>
                  <input type="number" value={campaignFormData.serial || 1} onChange={e => setCampaignFormData(p => ({ ...p, serial: parseInt(e.target.value) }))} className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-green-500" min={1} />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={campaignFormData.status || 'Publish'} onChange={e => setCampaignFormData(p => ({ ...p, status: e.target.value as 'Publish' | 'Draft' }))} className="w-full border rounded-lg px-3 sm:px-4 py-2 text-sm focus:ring-2 focus:ring-green-500">
                    <option value="Publish">Publish</option>
                    <option value="Draft">Draft</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button type="button" onClick={() => setIsCampaignModalOpen(false)} className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-gradient-to-r from-[#38BDF8] to-[#1E90FF] text-white rounded-lg hover:from-[#2BAEE8] hover:to-[#1A7FE8] font-medium text-sm">{editingCampaign ? 'Update' : 'Create'} Campaign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default CampaignTab;
