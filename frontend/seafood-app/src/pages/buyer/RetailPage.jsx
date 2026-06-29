import { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';

// Nhận prop allProducts từ App.jsx truyền xuống để đồng bộ 100% với Homepage
export function RetailPage({ allProducts = [], onNavigate, onAddToCart }) {
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState('Tất cả');
  const [origin, setOrigin] = useState('Tất cả');
  const [minRating, setMinRating] = useState(0);

  // LOGIC PHÒNG THỦ & CHUẨN HÓA DỮ LIỆU: Biến đổi dữ liệu chuỗi thành số và gán danh mục tự động nếu thiếu
  const processedProducts = useMemo(() => {
    return allProducts.map(product => {
      // 1. Chuẩn hóa giá: Chuyển đổi chuỗi "450.000đ" hoặc "450.000đ/kg" thành số 450000 để chạy bộ lọc logic toán học
      let numericPrice = 0;
      if (typeof product.price === 'number') {
        numericPrice = product.price;
      } else if (typeof product.price === 'string') {
        numericPrice = parseInt(product.price.replace(/\D/g, ''), 10) || 0;
      }

      // 2. Tự động nhận diện category dựa trên tên nếu dữ liệu tổng hợp từ App.jsx không có thuộc tính 'category'
      let category = product.category;
      if (!category && product.name) {
        const nameLower = product.name.toLowerCase();
        if (nameLower.includes('tôm')) category = 'Tôm';
        else if (nameLower.includes('cá')) category = 'Cá';
        else if (nameLower.includes('cua') || nameLower.includes('ghẹ')) category = 'Cua/Ghẹ';
        else if (nameLower.includes('mực')) category = 'Mực';
        else category = 'Hải sản khác';
      }

      return {
        ...product,
        category: category || 'Hải sản khác',
        numericPrice: numericPrice
      };
    });
  }, [allProducts]);

  // LOGIC LỌC SẢN PHẨM: Đã được cập nhật để kiểm tra trên kho dữ liệu động processedProducts
  const filteredProducts = useMemo(() => {
    return processedProducts.filter(product => {
      // 1. Lọc theo danh mục (nhiều lựa chọn cùng lúc)
      if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;

      // 2. Lọc theo vùng xuất xứ
      if (origin !== 'Tất cả' && product.origin !== origin) return false;

      // 3. Lọc theo số sao đánh giá
      if ((product.rating || 5) < minRating) return false;

      // 4. Lọc theo khoảng giá ngân sách (Dựa trên số numericPrice đã chuẩn hóa sạch)
      if (priceRange === 'Dưới 100.000đ' && product.numericPrice >= 100000) return false;
      if (priceRange === '100.000đ - 300.000đ' && (product.numericPrice < 100000 || product.numericPrice > 300000)) return false;
      if (priceRange === '300.000đ - 500.000đ' && (product.numericPrice < 300000 || product.numericPrice > 500000)) return false;
      if (priceRange === 'Trên 500.000đ' && product.numericPrice <= 500000) return false;

      return true;
    });
  }, [processedProducts, selectedCategories, priceRange, origin, minRating]);

  // Trích xuất động danh sách xuất xứ từ chính allProducts để bộ chọn <select> không bị thiếu vùng
  const uniqueOrigins = useMemo(() => {
    const origins = allProducts
      .map(p => p.origin)
      .filter(o => o && o.trim() !== '');
    return ['Tất cả', ...new Set(origins)];
  }, [allProducts]);

  // Handler dọn sạch tất cả trạng thái lọc
  const handleResetFilters = () => {
    setSelectedCategories([]);
    setPriceRange('Tất cả');
    setOrigin('Tất cả');
    setMinRating(0);
  };

  const toggleCategory = (cat) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="mb-2 font-bold text-2xl" style={{ color: '#0A2647' }}>Mua lẻ hải sản</h1>
          <p className="text-gray-600">Hải sản tươi sống giao tận nhà</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <h3 className="flex items-center gap-2 font-medium" style={{ color: '#0A2647' }}>
                  <Filter className="w-5 h-5" />
                  Bộ lọc
                </h3>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-blue-500 hover:underline font-medium"
                >
                  Xóa tất cả
                </button>
              </div>

              <div className="space-y-6">
                {/* Danh mục */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Danh mục</label>
                  <div className="space-y-2">
                    {['Tôm', 'Cá', 'Cua/Ghẹ', 'Mực', 'Hải sản khác'].map((cat) => (
                      <label key={cat} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="rounded border-gray-300 text-[#00BCD4] focus:ring-[#00BCD4] w-4 h-4"
                        />
                        {cat}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Giá cả */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Giá</label>
                  <div className="space-y-2">
                    {['Tất cả', 'Dưới 100.000đ', '100.000đ - 300.000đ', '300.000đ - 500.000đ', 'Trên 500.000đ'].map((range) => (
                      <label key={range} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="price"
                          checked={priceRange === range}
                          onChange={() => setPriceRange(range)}
                          className="text-[#00BCD4] focus:ring-[#00BCD4] w-4 h-4"
                        />
                        {range}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Xuất xứ */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Xuất xứ</label>
                  <select
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full p-2 border rounded-md text-sm outline-none bg-white focus:ring-1 focus:ring-[#00BCD4] focus:border-[#00BCD4]"
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    {uniqueOrigins.map((orig) => (
                      <option key={orig} value={orig}>
                        {orig === 'Tất cả' ? 'Tất cả các vùng' : orig}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Đánh giá */}
                <div>
                  <label className="block text-sm font-bold mb-2" style={{ color: '#0A2647' }}>Đánh giá</label>
                  <div className="space-y-2">
                    {[5, 4, 3].map((stars) => (
                      <label key={stars} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer select-none">
                        <input
                          type="radio"
                          name="rating"
                          checked={minRating === stars}
                          onChange={() => setMinRating(stars)}
                          className="text-[#00BCD4] focus:ring-[#00BCD4] w-4 h-4"
                        />
                        Từ {stars}★ trở lên
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grid hiển thị sản phẩm */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-bold text-[#0A2647]">{filteredProducts.length}</span> sản phẩm
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-md text-sm transition-colors hover:bg-gray-100"
                style={{ borderColor: '#0A2647', color: '#0A2647' }}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc
              </button>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((product) => {
                  const displayPrice = typeof product.price === 'number'
                    ? `${product.price.toLocaleString('vi-VN')}đ/kg`
                    : product.price.includes('/kg') ? product.price : `${product.price}/kg`;

                  return (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      image={product.image}
                      hoverimage={product.hoverimage}
                      origin={product.origin}
                      rating={product.rating || 5}
                      reviews={product.reviews || 30}
                      price={displayPrice}
                      onClick={() => onNavigate('product-detail', product.id)}
                      onAddToCart={() => onAddToCart({
                        ...product,
                        price: product.numericPrice
                      })}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-20 bg-white rounded-lg shadow-sm border border-gray-100">
                <p className="text-gray-400 mb-3">Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
                <button
                  onClick={handleResetFilters}
                  className="text-[#00BCD4] font-medium hover:underline text-sm"
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}