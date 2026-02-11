import React, { useState, useEffect, useRef } from 'react';
import { ChevronUp, ChevronDown, Plus, Upload, Youtube, Bold, Italic, Underline, AlignLeft, AlignRight, List, ListOrdered, Image, Link, Type, Calendar, Scan, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Product, Category, SubCategory, ChildCategory, Brand, Tag } from '../../types';
import { useAuth } from '../../context/AuthContext';

// Icons
const AddCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
    <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
  </svg>
);

const DraftIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const CheckCircleIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="7" fill={filled ? "#22c55e" : "#e5e7eb"} stroke={filled ? "#22c55e" : "#d1d5db"} strokeWidth="1"/>
    {filled && <path d="M5 8l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>}
  </svg>
);

interface FigmaProductUploadProps {
  categories: Category[];
  subCategories?: SubCategory[];
  childCategories?: ChildCategory[];
  brands: Brand[];
  tags?: Tag[];
  onAddProduct: (product: Product) => void;
  onBack?: () => void;
  onNavigate?: (section: string) => void;
  editProduct?: Product | null;
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
  priority: number;
  unitName: string;
  warranty: string;
  sku: string;
  barcode: string;
  initialSoldCount: number;
  productionStart: string;
  expirationEnd: string;
  variantsMandatory: boolean;
  variants: { title: string; options: { attribute: string; extraPrice: number; image?: string }[] }[];
  brandName: string;
  modelName: string;
  details: { type: string; description: string }[];
  affiliateSource: string;
  sourceProductUrl: string;
  sourceSku: string;
  useDefaultDelivery: boolean;
  deliveryChargeDefault: number;
  deliveryByCity: { city: string; charge: number }[];
  keywords: string;
  seoDescription: string;
  seoTitle: string;
  category: string;
  subCategory: string;
  childCategory: string;
  condition: string;
  tag: string;
  deepSearch: string;
}

// Collapsible Section Component
const Section: React.FC<{ 
  title: string; 
  subtitle?: string;
  defaultOpen?: boolean;
  children: React.ReactNode 
}> = ({ title, subtitle, defaultOpen = true, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="bg-white rounded-lg shadow-[0px_4px_11.4px_-2px_rgba(0,0,0,0.08)] px-4 py-5">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex-1">
          <h2 className="text-[20px] font-medium text-black font-['Lato']">{title}</h2>
          {subtitle && <p className="text-[12px] text-[#a2a2a2] mt-1">{subtitle}</p>}
        </div>
        <div className="w-8 h-8 flex items-center justify-center">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {isOpen && <div className="mt-6">{children}</div>}
    </div>
  );
};

// Input Field Component
const InputField: React.FC<{
  label: string;
  required?: boolean;
  placeholder?: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'textarea';
  rows?: number;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}> = ({ label, required, placeholder, value, onChange, type = 'text', rows = 3, icon, rightIcon }) => (
  <div className="flex flex-col gap-2">
    <label className="text-[16px] text-black font-['Lato']">
      {label}
      {required && <span className="text-[#e30000]">*</span>}
    </label>
    <div className="relative">
      {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2">{icon}</div>}
      {type === 'textarea' ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="w-full bg-[#f9f9f9] rounded-lg px-3 py-3 text-[14px] text-black placeholder:text-[#a2a2a2] outline-none resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full h-10 bg-[#f9f9f9] rounded-lg text-[14px] text-black placeholder:text-[#a2a2a2] outline-none ${icon ? 'pl-9 pr-3' : 'px-3'} ${rightIcon ? 'pr-10' : ''}`}
        />
      )}
      {rightIcon && <div className="absolute right-3 top-1/2 -translate-y-1/2">{rightIcon}</div>}
    </div>
  </div>
);

// Toggle Switch Component
const Toggle: React.FC<{ 
  label: string; 
  value: boolean; 
  onChange: (value: boolean) => void;
  labelPosition?: 'left' | 'right';
}> = ({ label, value, onChange, labelPosition = 'left' }) => (
  <div className="flex items-center gap-2">
    {labelPosition === 'left' && <span className="text-[16px] text-black font-['Lato']">{label}</span>}
    <button
      onClick={() => onChange(!value)}
      className={`w-[38px] h-5 rounded-full transition-colors ${value ? 'bg-[#ff6a00]' : 'bg-gray-300'} relative`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${value ? 'left-[18px]' : 'left-0.5'}`} />
    </button>
    {labelPosition === 'right' && <span className="text-[16px] text-black font-['Lato']">{label}</span>}
  </div>
);

// Select Dropdown Component
const SelectField: React.FC<{
  label?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}> = ({ label, required, value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className="flex flex-col gap-2" ref={ref}>
      {label && (
        <label className="text-[16px] text-black font-['Lato']">
          {label}
          {required && <span className="text-[#e30000]">*</span>}
        </label>
      )}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 flex items-center justify-between text-[14px] text-black"
        >
          <span className={selectedOption ? 'text-black' : 'text-[#a2a2a2]'}>
            {selectedOption?.label || placeholder || 'Select...'}
          </span>
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border z-50 max-h-60 overflow-auto">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => { onChange(option.value); setIsOpen(false); }}
                className={`w-full px-3 py-2 text-left text-[14px] hover:bg-gray-50 ${value === option.value ? 'bg-blue-50 text-blue-600' : ''}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const FigmaProductUpload: React.FC<FigmaProductUploadProps> = ({
  categories,
  subCategories = [],
  childCategories = [],
  brands,
  tags = [],
  onAddProduct,
  onBack,
  onNavigate,
  editProduct
}) => {
  const { user } = useAuth();
  const tenantId = user?.tenantId || 'default';
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    quantity: 50,
    priority: 0,
    unitName: '',
    warranty: '',
    sku: '',
    barcode: '',
    initialSoldCount: 0,
    productionStart: '',
    expirationEnd: '',
    variantsMandatory: false,
    variants: [{ title: '', options: [{ attribute: '', extraPrice: 0 }] }],
    brandName: '',
    modelName: '',
    details: [{ type: '', description: '' }],
    affiliateSource: 'AliExpress',
    sourceProductUrl: '',
    sourceSku: '',
    useDefaultDelivery: false,
    deliveryChargeDefault: 120,
    deliveryByCity: [{ city: 'Dhaka', charge: 80 }],
    keywords: '',
    seoDescription: '',
    seoTitle: '',
    category: '',
    subCategory: '',
    childCategory: '',
    condition: 'Used',
    tag: '',
    deepSearch: ''
  });

  // Load edit product
  useEffect(() => {
    if (editProduct) {
      setFormData(prev => ({
        ...prev,
        name: editProduct.name || '',
        description: editProduct.description || '',
        mainImage: editProduct.image || '',
        salesPrice: editProduct.price || 0,
        regularPrice: editProduct.originalPrice || 0,
        category: editProduct.category || '',
        brandName: editProduct.brand || '',
        sku: editProduct.sku || '',
        quantity: editProduct.stock || 0
      }));
    }
  }, [editProduct]);

  const updateField = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate completion percentage
  const completionItems = [
    { label: 'Item Name', completed: !!formData.name },
    { label: 'Media', completed: !!formData.mainImage },
    { label: 'Product Description', completed: !!formData.description },
    { label: 'Pricing', completed: formData.salesPrice > 0 },
    { label: 'Inventory', completed: formData.quantity > 0 }
  ];
  const completionPercentage = Math.round((completionItems.filter(i => i.completed).length / completionItems.length) * 100);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    formDataUpload.append('tenantId', tenantId);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload
      });
      const data = await response.json();
      if (data.url) {
        updateField('mainImage', data.url);
        toast.success('Image uploaded');
      }
    } catch (error) {
      toast.error('Failed to upload image');
    }
  };

  const handleSaveDraft = () => {
    const drafts = JSON.parse(localStorage.getItem(`drafts_${tenantId}`) || '[]');
    drafts.push({
      id: `draft_${Date.now()}`,
      data: formData,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem(`drafts_${tenantId}`, JSON.stringify(drafts));
    toast.success('Draft saved!');
  };

  const handlePublish = () => {
    if (!formData.name || !formData.category || !formData.salesPrice) {
      toast.error('Please fill required fields');
      return;
    }

    const newProduct: Product = {
      id: editProduct?.id || Date.now(),
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      description: formData.description,
      image: formData.mainImage,
      galleryImages: formData.galleryImages,
      price: formData.salesPrice,
      originalPrice: formData.regularPrice,
      costPrice: formData.costPrice,
      category: formData.category,
      subCategory: formData.subCategory,
      childCategory: formData.childCategory,
      brand: formData.brandName,
      sku: formData.sku,
      stock: formData.quantity,
      status: 'Active',
      tags: formData.tag ? [formData.tag] : []
    };

    onAddProduct(newProduct);
    toast.success(editProduct ? 'Product updated!' : 'Product added!');
    onBack?.();
  };

  const affiliateSources = [
    { value: 'AliExpress', label: 'AliExpress (marketplace)', color: '#ff6a00' },
    { value: 'Amazon', label: 'Amazon (marketplace)', color: '#ff9900' },
    { value: 'Alibaba', label: 'Alibaba (marketplace)', color: '#ff6a00' },
    { value: 'Other', label: 'Other', color: '#666' }
  ];

  return (
    <div className="min-h-screen bg-[#f9f9f9] pb-8 font-['Lato']">
      {/* Header */}
      <div className="px-6 py-6">
        <h1 className="text-[24px] font-bold text-black">Product Upload</h1>
      </div>

      <div className="px-6 flex gap-6">
        {/* Left Column - Form */}
        <div className="flex-1 space-y-4">
          {/* General Information */}
          <Section title="General Information">
            <div className="space-y-4">
              {/* Item Name */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[16px] text-black">
                    Item Name<span className="text-[#e30000]">*</span>
                  </label>
                  <Toggle 
                    label="Auto Slug" 
                    value={formData.autoSlug} 
                    onChange={(v) => updateField('autoSlug', v)}
                  />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => {
                    updateField('name', e.target.value);
                    if (formData.autoSlug) {
                      updateField('slug', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                    }
                  }}
                  placeholder="Ex: Samsung Galaxy S25 Ultra"
                  className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] placeholder:text-[#a2a2a2] outline-none"
                />
              </div>

              {/* Media */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[16px] font-medium text-black">
                    Media<span className="text-[#da0000]">*</span>
                  </label>
                  <ChevronUp size={20} />
                </div>
                
                {/* Image Upload */}
                <div 
                  className="bg-[#f9f9f9] rounded-lg py-6 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {formData.mainImage ? (
                    <div className="relative">
                      <img src={formData.mainImage} alt="Product" className="w-32 h-32 object-cover rounded-lg" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); updateField('mainImage', ''); }}
                        className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <>
                      <div className="w-[76px] h-[76px] mb-3">
                        <Upload size={76} className="text-[#a2a2a2]" />
                      </div>
                      <p className="text-[16px] text-[#a2a2a2] text-center">
                        Drag and drop image here, or click add image.
                      </p>
                      <p className="text-[12px] text-[#a2a2a2] text-center mt-1">
                        Supported formats: JPG, PNG, Max size: 4MB.<br/>
                        Note: Use images with a 1:1.6 aspect ratio (855×1386 pixels.)
                      </p>
                      <button className="mt-4 bg-[#ff9f1c] text-white px-4 py-2 rounded-lg text-[14px] font-semibold">
                        Add Image
                      </button>
                    </>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Video URL */}
                <div className="relative">
                  <Youtube size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#a2a2a2]" />
                  <input
                    type="text"
                    value={formData.videoUrl}
                    onChange={(e) => updateField('videoUrl', e.target.value)}
                    placeholder="Past YouTube Video Link (Optional)"
                    className="w-full h-10 bg-[#f9f9f9] rounded-lg pl-9 pr-3 text-[14px] placeholder:text-[#a2a2a2] outline-none"
                  />
                </div>
              </div>

              {/* Short Description */}
              <InputField
                label="Short Description"
                value={formData.shortDescription}
                onChange={(v) => updateField('shortDescription', v)}
                placeholder="Ex: Short Description"
                type="textarea"
                rows={3}
              />

              {/* Product Description */}
              <div className="flex flex-col gap-2">
                <label className="text-[16px] text-black">
                  Product Description<span className="text-[#da0000]">*</span>
                </label>
                {/* Rich Text Toolbar */}
                <div className="bg-[#f9f9f9] h-10 rounded-lg flex items-center gap-5 px-3">
                  <span className="text-[14px] font-semibold text-[#4f4d4d]">Normal</span>
                  <ChevronDown size={10} />
                  <Bold size={14} className="text-[#4f4d4d] cursor-pointer" />
                  <Italic size={14} className="text-[#4f4d4d] cursor-pointer" />
                  <Underline size={14} className="text-[#4f4d4d] cursor-pointer" />
                  <span className="text-[14px] text-[#4f4d4d]">"</span>
                  <span className="text-[14px] underline text-[#4f4d4d]">A</span>
                  <AlignLeft size={16} className="text-[#4f4d4d] cursor-pointer" />
                  <AlignRight size={16} className="text-[#4f4d4d] cursor-pointer" />
                  <List size={16} className="text-[#4f4d4d] cursor-pointer" />
                  <ListOrdered size={16} className="text-[#4f4d4d] cursor-pointer" />
                  <Image size={16} className="text-[#4f4d4d] cursor-pointer" />
                  <Link size={16} className="text-[#4f4d4d] cursor-pointer" />
                  <Youtube size={16} className="text-[#4f4d4d] cursor-pointer" />
                  <Type size={16} className="text-[#4f4d4d] cursor-pointer" />
                </div>
                <textarea
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                  placeholder="Ex: Description"
                  rows={5}
                  className="w-full bg-[#f9f9f9] rounded-lg p-3 text-[14px] placeholder:text-[#a2a2a2] outline-none resize-none"
                />
              </div>
            </div>
          </Section>

          {/* Pricing */}
          <Section title="Pricing">
            <div className="grid grid-cols-3 gap-6">
              <InputField
                label="Sell/Current Price"
                required
                value={formData.salesPrice}
                onChange={(v) => updateField('salesPrice', parseFloat(v) || 0)}
                placeholder="0"
                type="number"
              />
              <InputField
                label="Regular/Old Price"
                required
                value={formData.regularPrice}
                onChange={(v) => updateField('regularPrice', parseFloat(v) || 0)}
                placeholder="0"
                type="number"
              />
              <InputField
                label="Cost Price (Optional)"
                value={formData.costPrice}
                onChange={(v) => updateField('costPrice', parseFloat(v) || 0)}
                placeholder="0"
                type="number"
              />
            </div>
          </Section>

          {/* Inventory */}
          <Section title="Inventory">
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-6">
                <InputField
                  label="Product Priority"
                  value={formData.priority}
                  onChange={(v) => updateField('priority', parseFloat(v) || 0)}
                  placeholder="0%"
                  type="number"
                />
                <InputField
                  label="Quantity (Stock)"
                  value={formData.quantity}
                  onChange={(v) => updateField('quantity', parseInt(v) || 0)}
                  placeholder="50"
                  type="number"
                />
                <InputField
                  label="Unit Name"
                  value={formData.unitName}
                  onChange={(v) => updateField('unitName', v)}
                  placeholder="Piece, kg, liter, meter etc."
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <InputField
                  label="Warranty"
                  value={formData.warranty}
                  onChange={(v) => updateField('warranty', v)}
                  placeholder="12 month"
                />
                <InputField
                  label="SKU / Product Code"
                  value={formData.sku}
                  onChange={(v) => updateField('sku', v)}
                  placeholder="ABC-XYZ-123"
                />
                <InputField
                  label="Bar Code"
                  value={formData.barcode}
                  onChange={(v) => updateField('barcode', v)}
                  placeholder="2154645786216"
                  rightIcon={<Scan size={20} className="text-gray-400" />}
                />
              </div>
              <div className="grid grid-cols-3 gap-6">
                <InputField
                  label="Initial Sold Count"
                  value={formData.initialSoldCount}
                  onChange={(v) => updateField('initialSoldCount', parseInt(v) || 0)}
                  placeholder="0"
                  type="number"
                />
                <InputField
                  label="Production Start"
                  value={formData.productionStart}
                  onChange={(v) => updateField('productionStart', v)}
                  placeholder="DD-MM-YYYY"
                  rightIcon={<Calendar size={20} className="text-gray-400" />}
                />
                <InputField
                  label="Expiration End"
                  value={formData.expirationEnd}
                  onChange={(v) => updateField('expirationEnd', v)}
                  placeholder="DD-MM-YYYY"
                  rightIcon={<Calendar size={20} className="text-gray-400" />}
                />
              </div>
            </div>
          </Section>

          {/* Product Variants */}
          <Section title="Product Variants" subtitle="You can add multiple variant for a single product here. Like Size, Color, and Weight etc.">
            <div className="space-y-4">
              {formData.variants.map((variant, vIdx) => (
                <div key={vIdx} className="border border-[#38bdf8] rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-[20px] font-medium">Make this variant mandatory</p>
                      <p className="text-[12px] text-[#a2a2a2]">Toggle this on if you want your customer to select at least one of the variant options</p>
                    </div>
                    <Toggle 
                      label="[No]" 
                      value={formData.variantsMandatory}
                      onChange={(v) => updateField('variantsMandatory', v)}
                    />
                  </div>

                  <InputField
                    label="Title"
                    value={variant.title}
                    onChange={(v) => {
                      const newVariants = [...formData.variants];
                      newVariants[vIdx].title = v;
                      updateField('variants', newVariants);
                    }}
                    placeholder="Enter the name of variant (e.g., Colour, Size, Material)"
                  />

                  {variant.options.map((option, oIdx) => (
                    <div key={oIdx} className="flex items-end gap-2 mt-4">
                      <div className="w-[67px] h-[67px] bg-[#f9f9f9] rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100">
                        <Upload size={32} className="text-gray-400" />
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[16px] text-black">Attribute</label>
                          <input
                            value={option.attribute}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIdx].options[oIdx].attribute = e.target.value;
                              updateField('variants', newVariants);
                            }}
                            placeholder="Enter variant Option (e.g., Red, Large, Cotton)"
                            className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] placeholder:text-[#999] outline-none mt-2"
                          />
                        </div>
                        <div>
                          <label className="text-[16px] text-black">Extra Price</label>
                          <input
                            type="number"
                            value={option.extraPrice}
                            onChange={(e) => {
                              const newVariants = [...formData.variants];
                              newVariants[vIdx].options[oIdx].extraPrice = parseFloat(e.target.value) || 0;
                              updateField('variants', newVariants);
                            }}
                            placeholder="Enter Extra price for this option"
                            className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] placeholder:text-[#999] outline-none mt-2"
                          />
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          const newVariants = [...formData.variants];
                          newVariants[vIdx].options = newVariants[vIdx].options.filter((_, i) => i !== oIdx);
                          updateField('variants', newVariants);
                        }}
                        className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500"
                      >
                        <X size={24} />
                      </button>
                    </div>
                  ))}

                  <button
                    onClick={() => {
                      const newVariants = [...formData.variants];
                      newVariants[vIdx].options.push({ attribute: '', extraPrice: 0 });
                      updateField('variants', newVariants);
                    }}
                    className="mt-4 h-10 bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] text-white rounded-lg px-4 flex items-center gap-3"
                  >
                    <AddCircleIcon />
                    <span className="text-[14px] font-semibold">Add More Option</span>
                  </button>
                </div>
              ))}

              <button
                onClick={() => {
                  updateField('variants', [...formData.variants, { title: '', options: [{ attribute: '', extraPrice: 0 }] }]);
                }}
                className="h-10 bg-[#f4f4f4] rounded-lg px-4 flex items-center gap-3"
              >
                <Plus size={24} />
                <span className="text-[14px] font-semibold text-black">Add a new variant</span>
              </button>
            </div>
          </Section>

          {/* Brand */}
          <Section title="Brand" subtitle="You can add multiple product details for a single product here. Like Brand, Model, Serial Number, Fabric Type, and EMI etc.">
            <div className="flex items-end gap-2">
              <div className="flex-1 grid grid-cols-2 gap-2">
                <InputField
                  label="Brand Name"
                  value={formData.brandName}
                  onChange={(v) => updateField('brandName', v)}
                  placeholder="Samsung"
                />
                <InputField
                  label="Model Name"
                  value={formData.modelName}
                  onChange={(v) => updateField('modelName', v)}
                  placeholder="S25 Ultra"
                />
              </div>
              <button className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500">
                <X size={24} />
              </button>
            </div>
            <button className="mt-4 h-10 bg-[#f4f4f4] rounded-lg px-4 flex items-center gap-3">
              <Plus size={24} />
              <span className="text-[14px] font-semibold text-black">Create a new Brand</span>
            </button>
          </Section>

          {/* Product Details */}
          <Section title="Product Details" subtitle="You can add multiple product details for a single product here. Like Brand, Model, Serial Number, Fabric Type, and EMI etc.">
            {formData.details.map((detail, idx) => (
              <div key={idx} className="flex items-end gap-2 mb-4">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <InputField
                    label="Detail Type"
                    value={detail.type}
                    onChange={(v) => {
                      const newDetails = [...formData.details];
                      newDetails[idx].type = v;
                      updateField('details', newDetails);
                    }}
                    placeholder="Ram"
                  />
                  <InputField
                    label="Detail Description"
                    value={detail.description}
                    onChange={(v) => {
                      const newDetails = [...formData.details];
                      newDetails[idx].description = v;
                      updateField('details', newDetails);
                    }}
                    placeholder="16 GB"
                  />
                </div>
                <button 
                  onClick={() => updateField('details', formData.details.filter((_, i) => i !== idx))}
                  className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center text-red-500"
                >
                  <X size={24} />
                </button>
              </div>
            ))}
            <button
              onClick={() => updateField('details', [...formData.details, { type: '', description: '' }])}
              className="h-10 bg-[#f4f4f4] rounded-lg px-4 flex items-center gap-3"
            >
              <Plus size={24} />
              <span className="text-[14px] font-semibold text-black">Add More</span>
            </button>
          </Section>

          {/* Affiliate */}
          <Section title="Affiliate">
            <div className="space-y-4">
              <SelectField
                label="Product Source (Optional)"
                value={formData.affiliateSource}
                onChange={(v) => updateField('affiliateSource', v)}
                options={affiliateSources}
                placeholder="Select source"
              />
              <p className="text-[12px] text-[#a2a2a2]">Select if this product is sourced from an external supplier or marketplace</p>

              {formData.affiliateSource && (
                <>
                  <div className="bg-[#fff8ef] h-[60px] rounded-lg flex items-center px-4 gap-4">
                    <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center text-orange-500 font-bold">A</div>
                    <div>
                      <p className="text-[14px] font-bold text-black">{formData.affiliateSource}</p>
                      <p className="text-[10px] text-[#009ade]">www.{formData.affiliateSource.toLowerCase()}.com</p>
                    </div>
                    <span className="ml-auto bg-[#ff821c] text-white text-[12px] font-semibold px-3 py-1 rounded-full">Marketplace</span>
                  </div>

                  <div className="bg-[#fff8ef] rounded-lg p-6 space-y-4">
                    <p className="text-[14px] font-bold text-black">Source Product Details (Optional)</p>
                    <div>
                      <InputField
                        label="Source Product URL"
                        value={formData.sourceProductUrl}
                        onChange={(v) => updateField('sourceProductUrl', v)}
                        placeholder="www.xyz.com/product/123"
                      />
                      <p className="text-[12px] text-[#a2a2a2] mt-1">Direct link to this product on the source platform</p>
                    </div>
                    <div>
                      <InputField
                        label="Source SKU / Product Code"
                        value={formData.sourceSku}
                        onChange={(v) => updateField('sourceSku', v)}
                        placeholder="ABC-XYZ-123"
                      />
                      <p className="text-[12px] text-[#a2a2a2] mt-1">Product identifier from the source (SKU, Product ID, etc.)</p>
                    </div>
                    <div className="bg-[#fff0dd] rounded-lg p-3">
                      <p className="text-[12px] text-[#a2a2a2]">
                        💡 Tip: These details help you track and manage products from external sources. You can use the Source URL to quickly access the product page, and the Source SKU for ordering or communication with suppliers.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </Section>

          {/* Shipping */}
          <Section title="Shipping">
            <div className="space-y-4">
              <div>
                <p className="text-[20px] font-medium">Delivery Charge</p>
                <p className="text-[12px] text-[#a2a2a2]">You can add specific delivery charge for this product or use the default charges</p>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-[16px]">Apply default delivery charges</span>
                <Toggle 
                  label={formData.useDefaultDelivery ? "[Applied]" : "[Not Applied]"}
                  value={formData.useDefaultDelivery}
                  onChange={(v) => updateField('useDefaultDelivery', v)}
                />
              </div>

              <InputField
                label="Delivery Charge (Default)"
                value={formData.deliveryChargeDefault}
                onChange={(v) => updateField('deliveryChargeDefault', parseFloat(v) || 0)}
                placeholder="120"
                type="number"
              />

              <div>
                <label className="text-[16px] text-black">Specific Delivery Charge</label>
                <div className="flex gap-2 mt-2">
                  <input
                    value={formData.deliveryByCity[0]?.city || ''}
                    onChange={(e) => {
                      const newDelivery = [...formData.deliveryByCity];
                      if (newDelivery[0]) newDelivery[0].city = e.target.value;
                      else newDelivery.push({ city: e.target.value, charge: 0 });
                      updateField('deliveryByCity', newDelivery);
                    }}
                    placeholder="Dhaka"
                    className="flex-1 h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none"
                  />
                  <input
                    type="number"
                    value={formData.deliveryByCity[0]?.charge || ''}
                    onChange={(e) => {
                      const newDelivery = [...formData.deliveryByCity];
                      if (newDelivery[0]) newDelivery[0].charge = parseFloat(e.target.value) || 0;
                      else newDelivery.push({ city: '', charge: parseFloat(e.target.value) || 0 });
                      updateField('deliveryByCity', newDelivery);
                    }}
                    placeholder="80"
                    className="w-[213px] h-10 bg-[#f9f9f9] rounded-lg px-3 text-[14px] outline-none"
                  />
                </div>
              </div>
            </div>
          </Section>

          {/* SEO Info */}
          <Section title="SEO Info">
            <div className="space-y-4">
              <InputField
                label="Keyword"
                value={formData.keywords}
                onChange={(v) => updateField('keywords', v)}
                placeholder="Seo Keyword"
              />
              <InputField
                label="SEO Description"
                value={formData.seoDescription}
                onChange={(v) => updateField('seoDescription', v)}
                placeholder="Seo Description"
              />
              <InputField
                label="SEO Title"
                value={formData.seoTitle}
                onChange={(v) => updateField('seoTitle', v)}
                placeholder="Seo Title"
              />
            </div>
          </Section>
        </div>

        {/* Right Sidebar */}
        <div className="w-[320px] lg:w-[381px] flex-shrink-0 space-y-4 sticky top-6 self-start">
          {/* Action Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSaveDraft}
              className="flex-1 h-10 bg-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-50"
            >
              <DraftIcon />
              <span className="text-[14px] font-semibold text-[#070606]">Draft</span>
            </button>
            <button
              onClick={handlePublish}
              className="flex-1 h-10 bg-gradient-to-r from-[#38bdf8] to-[#1e90ff] rounded-lg flex items-center justify-center gap-2"
            >
              <AddCircleIcon />
              <span className="text-[14px] font-semibold text-white">{editProduct ? 'Update' : 'Add Product'}</span>
            </button>
          </div>

          {/* Ready To Publish */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Ready To Publish</h3>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-2 bg-[#f9f9f9] rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#085e00] rounded-full transition-all"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-[14px] font-medium">{completionPercentage}%</span>
            </div>
            <div className="space-y-2">
              {completionItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <CheckCircleIcon filled={item.completed} />
                  <span className="text-[12px] font-medium text-black">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Catalog */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Catalog</h3>
            <SelectField
              value={formData.category}
              onChange={(v) => updateField('category', v)}
              options={categories.map(c => ({ value: c.name, label: c.name }))}
              placeholder="Select Category*"
              required
            />
            <button 
              onClick={() => onNavigate?.('catalog_categories')}
              className="mt-4 h-10 bg-[#f4f4f4] rounded-lg px-4 flex items-center gap-2 ml-auto hover:bg-gray-200 transition-colors"
            >
              <Plus size={24} />
              <span className="text-[14px] font-semibold text-[#070606]">Add New Category</span>
            </button>
          </div>

          {/* Tag & Deep Search */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Tag & Deep Search</h3>
            <div className="space-y-2">
              <SelectField
                value={formData.tag}
                onChange={(v) => updateField('tag', v)}
                options={tags.map(t => ({ value: t.name, label: t.name }))}
                placeholder="Select Tag"
              />
              <input
                value={formData.deepSearch}
                onChange={(e) => updateField('deepSearch', e.target.value)}
                placeholder="Deep Search. ex.New Mobile, Popular product"
                className="w-full h-10 bg-[#f9f9f9] rounded-lg px-3 text-[12px] placeholder:text-[#a2a2a2] outline-none"
              />
            </div>
          </div>

          {/* Condition */}
          <div className="bg-white rounded-lg p-4">
            <h3 className="text-[20px] font-medium text-black mb-4">Condition</h3>
            <SelectField
              value={formData.condition}
              onChange={(v) => updateField('condition', v)}
              options={[
                { value: 'New', label: 'New' },
                { value: 'Used', label: 'Used' },
                { value: 'Refurbished', label: 'Refurbished' }
              ]}
              placeholder="Select Condition"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaProductUpload;
