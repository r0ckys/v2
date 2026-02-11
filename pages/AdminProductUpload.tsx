import React, { useState, useEffect } from 'react';
import { ChevronRight, Save, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product, Category, SubCategory, ChildCategory, Brand, Tag } from '../types';
import GeneralInformationSection from '../components/ProductUpload/GeneralInformationSection';
import MediaSection from '../components/ProductUpload/MediaSection';
import DescriptionSection from '../components/ProductUpload/DescriptionSection';
import PricingSection from '../components/ProductUpload/PricingSection';
import InventorySection from '../components/ProductUpload/InventorySection';
import VariantsSection from '../components/ProductUpload/VariantsSection';
import BrandDetailsSection from '../components/ProductUpload/BrandDetailsSection';
import AffiliateSection from '../components/ProductUpload/AffiliateSection';
import ShippingSection from '../components/ProductUpload/ShippingSection';
import SEOSection from '../components/ProductUpload/SEOSection';
import PublishSidebar from '../components/ProductUpload/PublishSidebar';
import CatalogSidebar from '../components/ProductUpload/CatalogSidebar';
import { useAuth } from '../context/AuthContext';

interface AdminProductUploadProps {
  categories: Category[];
  subCategories: SubCategory[];
  childCategories: ChildCategory[];
  brands: Brand[];
  tags: Tag[];
  onAddProduct: (product: Product) => void;
  onLogout: () => void;
  onSwitchSection: (section: string) => void;
}

interface FormData {
  name: string;
  slug: string;
  autoSlug: boolean;
  shortDescription: string;
  description: string;
  mainImage: string;
  videoUrl: string;
  galleryImages: string[];
  regularPrice: number;
  salesPrice: number;
  costPrice: number;
  quantity: number;
  quantityAlert: number;
  unitName: string;
  warranty: string;
  sku: string;
  barcode: string;
  initialStock: number;
  stockDate: string;
  locationSlot: string;
  variantsMandatory: boolean;
  variants: any[];
  brand: string;
  details: { title: string; description: string }[];
  affiliateSource: string;
  sourceProductUrl: string;
  sourceSku: string;
  deliveryCharge: number;
  deliveryByCity: { city: string; charge: number }[];
  keywords: string;
  metaDescription: string;
  metaTitle: string;
  category: string;
  subCategory: string;
  childCategory: string;
  condition: string;
  tags: string[];
}

const AdminProductUpload: React.FC<AdminProductUploadProps> = ({
  categories,
  subCategories,
  childCategories,
  brands,
  tags,
  onAddProduct,
  onLogout,
  onSwitchSection
}) => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || 'default';

  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    autoSlug: true,
    shortDescription: '',
    description: '',
    mainImage: '',
    videoUrl: '',
    galleryImages: [],
    regularPrice: 0,
    salesPrice: 0,
    costPrice: 0,
    quantity: 0,
    quantityAlert: 0,
    unitName: '',
    warranty: '',
    sku: '',
    barcode: '',
    initialStock: 0,
    stockDate: new Date().toISOString().split('T')[0],
    locationSlot: '',
    variantsMandatory: false,
    variants: [],
    brand: '',
    details: [],
    affiliateSource: '',
    sourceProductUrl: '',
    sourceSku: '',
    deliveryCharge: 0,
    deliveryByCity: [],
    keywords: '',
    metaDescription: '',
    metaTitle: '',
    category: '',
    subCategory: '',
    childCategory: '',
    condition: 'New',
    tags: []
  });

  const [completionPercentage, setCompletionPercentage] = useState(0);

  // Calculate completion percentage
  useEffect(() => {
    const requiredFields = [
      formData.category,
      formData.mainImage,
      formData.name,
      formData.salesPrice,
      formData.brand
    ];
    const completed = requiredFields.filter(field => field).length;
    setCompletionPercentage(Math.round((completed / requiredFields.length) * 100));
  }, [formData.category, formData.mainImage, formData.name, formData.salesPrice, formData.brand]);

  const handleFormChange = (section: string, data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };

  const handleSaveDraft = () => {
    // Save to localStorage
    const drafts = JSON.parse(localStorage.getItem(`drafts_${tenantId}`) || '[]');
    const draftId = `draft_${Date.now()}`;
    drafts.push({
      id: draftId,
      data: formData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    localStorage.setItem(`drafts_${tenantId}`, JSON.stringify(drafts));
    toast.success('Draft saved successfully');
  };

  const handleAddProduct = async () => {
    // Validate required fields
    if (!formData.name || !formData.category || !formData.mainImage || !formData.salesPrice) {
      toast.error('Please fill all required fields');
      return;
    }

    const newProduct: Product = {
      id: Date.now(),
      name: formData.name,
      slug: formData.slug,
      description: formData.description,
      image: formData.mainImage,
      galleryImages: formData.galleryImages,
      price: formData.salesPrice,
      originalPrice: formData.regularPrice,
      costPrice: formData.costPrice,
      category: formData.category,
      subCategory: formData.subCategory,
      childCategory: formData.childCategory,
      brand: formData.brand,
      sku: formData.sku,
      stock: formData.quantity,
      colors: [],
      sizes: [],
      status: 'Active',
      tags: formData.tags
    };

    onAddProduct(newProduct);
    toast.success('Product added successfully');
    // Reset form
    setFormData({
      name: '',
      slug: '',
      autoSlug: true,
      shortDescription: '',
      description: '',
      mainImage: '',
      videoUrl: '',
      galleryImages: [],
      regularPrice: 0,
      salesPrice: 0,
      costPrice: 0,
      quantity: 0,
      quantityAlert: 0,
      unitName: '',
      warranty: '',
      sku: '',
      barcode: '',
      initialStock: 0,
      stockDate: new Date().toISOString().split('T')[0],
      locationSlot: '',
      variantsMandatory: false,
      variants: [],
      brand: '',
      details: [],
      affiliateSource: '',
      sourceProductUrl: '',
      sourceSku: '',
      deliveryCharge: 0,
      deliveryByCity: [],
      keywords: '',
      metaDescription: '',
      metaTitle: '',
      category: '',
      subCategory: '',
      childCategory: '',
      condition: 'New',
      tags: []
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span>Welcome Back, {user?.name}</span>
          <ChevronRight size={16} />
          <span className="text-gray-400">Products</span>
          <ChevronRight size={16} />
          <span className="font-semibold text-gray-900">Product Upload</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-4 gap-6 p-6">
        {/* Left Column - Form (75%) */}
        <div className="col-span-3 space-y-6">
          {/* General Information */}
          <GeneralInformationSection
            data={formData}
            onChange={(data) => handleFormChange('general', data)}
          />

          {/* Media */}
          <MediaSection
            data={formData}
            tenantId={tenantId}
            onChange={(data) => handleFormChange('media', data)}
          />

          {/* Descriptions */}
          <DescriptionSection
            data={formData}
            onChange={(data) => handleFormChange('description', data)}
          />

          {/* Pricing */}
          <PricingSection
            data={formData}
            onChange={(data) => handleFormChange('pricing', data)}
          />

          {/* Inventory */}
          <InventorySection
            data={formData}
            onChange={(data) => handleFormChange('inventory', data)}
          />

          {/* Variants */}
          <VariantsSection
            data={formData}
            onChange={(data) => handleFormChange('variants', data)}
          />

          {/* Brand & Details */}
          <BrandDetailsSection
            data={formData}
            brands={brands}
            onChange={(data) => handleFormChange('brandDetails', data)}
          />

          {/* Affiliate */}
          <AffiliateSection
            data={formData}
            onChange={(data) => handleFormChange('affiliate', data)}
          />

          {/* Shipping */}
          <ShippingSection
            data={formData}
            onChange={(data) => handleFormChange('shipping', data)}
          />

          {/* SEO */}
          <SEOSection
            data={formData}
            onChange={(data) => handleFormChange('seo', data)}
          />
        </div>

        {/* Right Column - Sidebar (25%) */}
        <div className="col-span-1 space-y-6">
          {/* Publish Status */}
          <PublishSidebar
            completionPercentage={completionPercentage}
            onDraft={handleSaveDraft}
            onPublish={handleAddProduct}
          />

          {/* Catalog & Search */}
          <CatalogSidebar
            categories={categories}
            subCategories={subCategories}
            childCategories={childCategories}
            tags={tags}
            data={formData}
            onChange={(data) => handleFormChange('catalog', data)}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminProductUpload;
