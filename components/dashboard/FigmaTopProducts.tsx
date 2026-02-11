import React from 'react';

interface TopProduct {
  id: string;
  name: string;
  itemCode: string;
  price: string;
  image?: string;
}

interface FigmaTopProductsProps {
  products?: TopProduct[];
}

const FigmaTopProducts: React.FC<FigmaTopProductsProps> = ({
  products = [
    { id: '1', name: 'Apple iPhone 13', itemCode: '#FXZ-4567', price: '$999.00' },
    { id: '2', name: 'Nike Air Jordan', itemCode: '#FXZ-4567', price: '$72.40' },
    { id: '3', name: 'T-shirt', itemCode: '#FXZ-4567', price: '$35.40' },
    { id: '4', name: 'Assorted Cross Bag', itemCode: '#FXZ-4567', price: '$80.00' },
    { id: '5', name: 'Fur Pom Gloves', itemCode: '#FXZ-4567', price: '$20.00' }
  ]
}) => {
  return (
    <div className="w-full h-full px-3 sm:px-4 py-4 sm:py-5 bg-white rounded-lg shadow-[0px_1px_3px_0px_rgba(0,0,0,0.20)] flex flex-col justify-start items-start gap-3 sm:gap-4 overflow-hidden">
      {/* Header */}
      <div className="w-full flex flex-col justify-start items-start gap-2 sm:gap-3">
        <div className="w-full flex justify-start items-center gap-3">
          <div className="flex-1 justify-start text-zinc-800 text-base sm:text-lg font-bold font-['Lato']">Top Products</div>
          <div className="justify-start text-sky-400 text-xs font-normal font-['Lato'] cursor-pointer hover:underline">All product</div>
        </div>

        {/* Search Bar */}
        <div className="w-full p-2 bg-neutral-50 rounded-lg outline outline-1 outline-offset-[-1px] outline-neutral-200 flex justify-start items-center gap-1.5 overflow-hidden">
          <div className="flex justify-start items-center gap-2">
            <div className="w-4 h-4 sm:w-5 sm:h-5 relative">
              <svg width="100%" height="100%" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="9" cy="9" r="6" stroke="#71717A" strokeWidth="1.67"/>
                <path d="M14 14L17 17" stroke="#71717A" strokeWidth="1.67" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="justify-start text-neutral-500 text-xs sm:text-sm font-normal font-['Lato']">Search</div>
          </div>
        </div>
      </div>

      {/* Products List */}
      <div className="w-full flex-1 flex flex-col justify-start items-start gap-3 sm:gap-4 overflow-y-auto pr-1 sm:pr-2">
        {products.map((product) => (
          <div key={product.id} className="w-full pr-1 sm:pr-2 pb-2 border-b border-neutral-300 flex justify-start items-center gap-2 sm:gap-4">
            {/* Product Image */}
            <div className="w-10 h-10 sm:w-14 sm:h-14 relative rounded-lg sm:rounded-xl overflow-hidden bg-zinc-100 flex items-center justify-center flex-shrink-0">
              {product.image ? (
                <img className="w-full h-full object-cover" src={product.image} alt={product.name} />
              ) : (
                <span className="text-zinc-400 text-sm sm:text-lg font-medium">{product.name.charAt(0)}</span>
              )}
            </div>

            {/* Product Info */}
            <div className="flex-1 flex flex-col justify-center items-start gap-0.5 sm:gap-1 overflow-hidden min-w-0">
              <div className="w-full truncate text-teal-950 text-sm sm:text-base font-medium font-['Lato']">{product.name}</div>
              <div className="text-neutral-400 text-[10px] sm:text-xs font-normal font-['Lato']">Item: {product.itemCode}</div>
            </div>

            {/* Price */}
            <div className="text-right whitespace-nowrap text-teal-950 text-sm sm:text-base font-bold font-['Lato'] leading-5">{product.price}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FigmaTopProducts;
