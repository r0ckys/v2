import React from 'react';

interface GeneralInformationSectionProps {
  data: any;
  onChange: (data: any) => void;
}

const GeneralInformationSection: React.FC<GeneralInformationSectionProps> = ({ data, onChange }) => {
  const handleNameChange = (name: string) => {
    let slug = name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
    onChange({
      name,
      slug: data.autoSlug ? slug : data.slug
    });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">General Information</h2>

      <div className="space-y-4">
        {/* Item Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Item Name <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={data.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter product name"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
            <label className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
              <input
                type="checkbox"
                checked={data.autoSlug}
                onChange={(e) => onChange({ autoSlug: e.target.checked })}
                className="w-4 h-4 text-blue-500 rounded"
              />
              <span className="text-sm text-gray-700">Auto-Slug</span>
            </label>
          </div>
        </div>

        {/* Slug */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
          <input
            type="text"
            value={data.slug}
            onChange={(e) => onChange({ slug: e.target.value })}
            disabled={data.autoSlug}
            placeholder="product-slug"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50 disabled:text-gray-500"
          />
        </div>
      </div>
    </div>
  );
};

export default GeneralInformationSection;
