import { Star, MapPin, ShoppingCart } from 'lucide-react';

export function ProductCard({ 
  image, 
  hoverimage,
  name, 
  price, 
  origin, 
  rating, 
  reviews,
  onClick,
  onAddToCart
}) {
  return (
    <div 
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer border"
      style={{ borderColor: '#e5e7eb' }}
      onClick={onClick}
    >
      {/* Khung chứa ảnh: Giữ cấu trúc tuyệt đối của Code 1 để phục vụ hiệu ứng đổi ảnh */}
      <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-100">
        {/* Ảnh gốc: Sẽ ẩn đi khi hover vào card */}
        <img 
          src={image} 
          alt={name}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        
        {/* Ảnh khi hover: Xuất hiện đè lên ảnh gốc */}
        <img 
          src={hoverimage || image} 
          alt={name}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>

      <div className="p-4">
        {/* Tên sản phẩm */}
        <h3 className="text-sm mb-2 line-clamp-2 min-h-[2.5rem]" style={{ color: '#0A2647' }}>
          {name}
        </h3>
        
        {/* Xuất xứ */}
        <div className="flex items-center gap-1 mb-2">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span className="text-xs text-gray-600">{origin}</span>
        </div>
        
        {/* Đánh giá Stars */}
        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-3 h-3"
              fill={i < rating ? '#FFD700' : 'none'}
              stroke={i < rating ? '#FFD700' : '#D1D5DB'}
            />
          ))}
          <span className="text-xs text-gray-500 ml-1">({reviews})</span>
        </div>
        
        {/* Giá và Nút thêm vào giỏ hàng */}
        <div className="flex items-center justify-between">
          <span className="font-bold" style={{ color: '#d4183d' }}>
            {price}
          </span>
          <button 
            className="p-2 rounded-full hover:opacity-80 transition-opacity"
            style={{ backgroundColor: '#00BCD4' }}
            onClick={(e) => {
              e.stopPropagation(); // Ngăn sự kiện click lan ra thẻ cha (onClick của Card)
              if (onAddToCart) {  // Kiểm tra an toàn trước khi gọi hàm
                onAddToCart();
              }
            }}
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}