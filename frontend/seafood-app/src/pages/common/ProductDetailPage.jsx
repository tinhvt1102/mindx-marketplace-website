import { useState, useMemo, useEffect } from 'react';
import { Star, MapPin, ShoppingCart, Minus, Plus, BadgeCheck } from 'lucide-react';
import { ProductCard } from '../../components/ProductCard';

export function ProductDetailPage({ productId, allProducts = [], onNavigate, onAddToCart, onBuyNow }) {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  // Mỗi khi đổi sản phẩm, reset lại ảnh được chọn về ảnh đầu tiên (ảnh index 0)
  useEffect(() => {
    setSelectedImage(0);
    setQuantity(1);
  }, [productId]);

  // 1. CHUẨN HÓA LOGIC TÌM KIẾM: Tìm kiếm sản phẩm thật dựa trên prop allProducts được truyền xuống từ App
  const product = useMemo(() => {
    if (!productId || allProducts.length === 0) return allProducts[0] || null;
    
    return allProducts.find((item) => {
      // Ép kiểu về chuỗi, loại bỏ các ký tự trống hoặc tiền tố để so sánh chính xác nhất
      const cleanItemId = String(item.id).trim();
      const cleanTargetId = String(productId).trim();
      return cleanItemId === cleanTargetId;
    }) || allProducts[0];
  }, [productId, allProducts]);

  // Nếu không có bất kỳ dữ liệu sản phẩm nào, hiển thị trạng thái trống
  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-lg shadow-sm">
        <p className="text-gray-500">Không tìm thấy thông tin sản phẩm.</p>
        <button onClick={() => onNavigate('home')} className="text-[#00BCD4] mt-4 font-medium hover:underline">
          Quay lại trang chủ
        </button>
      </div>
    );
  }

  // 2. LOGIC PHÒNG THỦ DỮ LIỆU: Nếu sản phẩm thật từ Homepage chỉ có trường 'image' đơn, tự tạo mảng images gồm 3 phần tử để giao diện gallery không bị crash
  const productImages = useMemo(() => {
    if (product.images && product.images.length > 0) return product.images;
    if (product.image) return [product.image, product.image, product.image];
    return ['https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080'];
  }, [product]);

  // 3. TẠO DỮ LIỆU NHÀ CUNG CẤP MẶC ĐỊNH: Nếu mảng thật thiếu trường 'supplier', tự sinh để giao diện hiển thị mượt mà
  const supplierInfo = useMemo(() => {
    return product.supplier || {
      name: `Hộ nuôi Hải Sản ${product.origin || 'VietGAP'}`,
      farmId: '1',
      verified: true,
      rating: 5,
      location: product.origin || 'Nhiều vùng'
    };
  }, [product]);

  // 4. LỌC SẢN PHẨM TƯƠNG TỰ: Lọc từ kho dữ liệu thật, bỏ qua sản phẩm hiện tại
  const similarProducts = useMemo(() => {
    return allProducts
      .filter((item) => String(item.id) !== String(product.id))
      .slice(0, 4)
      .map((item) => ({
        id: item.id,
        name: item.name,
        image: item.image,
        hoverimage: item.hoverimage,
        price: item.price, // Giữ nguyên định dạng chuỗi "450.000đ/kg" gốc
        origin: item.origin,
        rating: item.rating || 5,
        reviews: item.reviews || 30
      }));
  }, [product, allProducts]);

  // SỬA LỖI NaN: Hàm bóc tách chuỗi giá và ép về số nguyên sạch (Ví dụ "450.000đ/kg" -> 450000)
  const getCleanProductForCart = () => {
    let numericPrice = 0;
    if (typeof product.price === 'number') {
      numericPrice = product.price;
    } else if (typeof product.price === 'string') {
      numericPrice = parseInt(product.price.replace(/\D/g, ''), 10) || 0;
    }

    return {
      ...product,
      price: numericPrice // Thay thế chuỗi bằng số nguyên để App không bị lỗi tính toán tổng tiền
    };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Image Gallery */}
            <div>
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={productImages[selectedImage] || product.image}
                  alt={product.name}
                  className="w-full h-full object-cover animate-fade-in"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                {productImages.slice(0, 3).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-[#00BCD4] scale-102 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold mb-4" style={{ color: '#0A2647' }}>{product.name}</h1>

              <div className="flex items-center gap-4 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4"
                      fill={i < (product.rating || 5) ? '#FFD700' : 'none'}
                      stroke={i < (product.rating || 5) ? '#FFD700' : '#D1D5DB'}
                    />
                  ))}
                  <span className="text-sm ml-1">{product.rating || 5}</span>
                </div>
                <span className="text-sm text-gray-500">{product.reviews || 42} đánh giá</span>
                <span className="text-sm text-gray-500">{product.sold || 120} đã bán</span>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-3xl font-bold" style={{ color: '#d4183d' }}>
                    {product.price.includes('/kg') ? product.price : `${product.price}/kg`}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">{product.originalPrice}</span>
                  )}
                  <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded">-18%</span>
                </div>
                <p className="text-sm text-gray-600">Giá theo đơn vị niêm yết</p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Xuất xứ:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.origin}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Kích cỡ/Quy cách:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.size || 'Tuyển chọn chất lượng cao'}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">Ngày thu hoạch:</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>{product.harvestDate || 'Vận chuyển tươi sống trong ngày'}</span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm mb-2 font-medium" style={{ color: '#0A2647' }}>Số lượng mua</label>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border rounded-md" style={{ borderColor: '#e5e7eb' }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 text-center border-x py-1 outline-none font-medium"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 hover:bg-gray-50 text-gray-600"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  <span className="text-sm text-gray-500">Sản phẩm sẵn có tại kho</span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    if (typeof onAddToCart === 'function') {
                      // SỬA Ở ĐÂY: Truyền product sạch đã biến đổi giá thành Số Nguyên
                      const cleanProduct = getCleanProductForCart();
                      onAddToCart(cleanProduct, quantity);
                      onNavigate('cart'); 
                    }
                  }}
                  className="flex-1 px-6 py-3 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 font-medium"
                  style={{ borderColor: '#0A2647', color: '#0A2647' }}
                >
                  <ShoppingCart className="w-5 h-5" />
                  Thêm vào giỏ
                </button>

                <button
                  onClick={() => {
                    if (typeof onBuyNow === 'function') {
                      // SỬA Ở ĐÂY: Truyền product sạch đã biến đổi giá thành Số Nguyên
                      const cleanProduct = getCleanProductForCart();
                      onBuyNow(cleanProduct, quantity);
                    }
                  }}
                  className="flex-1 px-6 py-3 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#00BCD4' }}
                >
                  Mua ngay
                </button>
              </div>
            </div>
          </div>

          {/* Product Description */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Mô tả sản phẩm</h3>
            <p className="text-gray-600 leading-relaxed">
              {product.description || `${product.name} được tuyển chọn kỹ lưỡng, đảm bảo độ tươi ngon vượt trội khi giao tới tay khách hàng. Thích hợp chế biến nhiều món ăn ngon cho gia đình.`}
            </p>
          </div>

          {/* Supplier Info */}
          <div className="mt-8 pt-8 border-t" style={{ borderColor: '#e5e7eb' }}>
            <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Thông tin nhà cung cấp</h3>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold" style={{ color: '#0A2647' }}>{supplierInfo.name}</span>
                    {supplierInfo.verified && (
                      <BadgeCheck className="w-4 h-4" style={{ color: '#00BCD4' }} />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Star className="w-3 h-3" fill="#FFD700" stroke="#FFD700" />
                      {supplierInfo.rating}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {supplierInfo.location}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => onNavigate('farm-profile', supplierInfo.farmId)}
                className="px-6 py-2 border rounded-md hover:bg-white transition-colors text-sm font-medium"
                style={{ borderColor: '#0A2647', color: '#0A2647' }}
              >
                Xem hồ sơ
              </button>
            </div>
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-6" style={{ color: '#0A2647' }}>Sản phẩm tương tự</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similarProducts.map((item) => (
                <ProductCard
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  hoverimage={item.hoverimage}
                  price={item.price}
                  origin={item.origin}
                  rating={item.rating}
                  reviews={item.reviews}
                  onClick={() => onNavigate('product-detail', item.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}