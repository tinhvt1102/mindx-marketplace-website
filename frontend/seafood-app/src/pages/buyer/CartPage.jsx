import { useMemo } from 'react';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Đã thêm import toast

export function CartPage({ cartItems = [], setCartItems, onNavigate }) {  
  
  // 1. Tối ưu hàm tăng/giảm số lượng
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return; // Chặn ngay từ đầu nếu số lượng giảm xuống dưới 1
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  // 2. Xóa sản phẩm khỏi giỏ hàng kèm thông báo toast
  const removeItem = (id) => {
    const targetItem = cartItems.find(item => item.id === id);
    const itemName = targetItem ? targetItem.name : 'sản phẩm';

    setCartItems(items => items.filter(item => item.id !== id));
    toast.error(`Đã xóa ${itemName} khỏi giỏ hàng!`);
  };

  const { subtotal, shipping, total } = useMemo(() => {
    const sub = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const ship = sub > 0 ? 50000 : 0; 
    return {
      subtotal: sub,
      shipping: ship,
      total: sub + ship
    };
  }, [cartItems]);

  // Định dạng tiền tệ VND nhanh và chuẩn
  const formatCurrency = (value) => `${value.toLocaleString('vi-VN')}đ`;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 font-bold text-2xl" style={{ color: '#0A2647' }}>Giỏ hàng của bạn</h1>

        {cartItems.length === 0 ? (
          /* Trạng thái giỏ hàng trống */
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2 text-lg font-medium" style={{ color: '#0A2647' }}>Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <button 
              onClick={() => onNavigate('retail')}
              className="px-6 py-3 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: '#00BCD4' }}
            >
              Tiếp tục mua sắm
            </button>
          </div>
        ) : (
          /* Trạng thái giỏ hàng có sản phẩm */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Danh sách sản phẩm (Cart Items) */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    {/* Hình ảnh sản phẩm */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    {/* Thông tin chi tiết */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <h3 className="mb-1 font-medium line-clamp-2" style={{ color: '#0A2647' }}>{item.name}</h3>
                        <p className="text-sm text-gray-500">Xuất xứ: {item.origin}</p>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        <span className="font-bold text-lg" style={{ color: '#d4183d' }}>
                          {formatCurrency(item.price)}
                        </span>
                        
                        {/* Bộ điều khiển số lượng & Nút xóa */}
                        <div className="flex items-center gap-4">
                          <div className="flex items-center border rounded-md bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-2 hover:bg-gray-200 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="px-4 py-2 border-x bg-white font-medium min-w-[40px] text-center" style={{ borderColor: '#e5e7eb' }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 hover:bg-gray-200 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          
                          <button 
                            onClick={() => removeItem(item.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Khối tính tiền (Order Summary) */}
            <div>
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Tổng đơn hàng</h3>
                
                <div className="space-y-3 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tạm tính</span>
                    <span className="font-medium">{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển</span>
                    <span className="font-medium">{formatCurrency(shipping)}</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-medium text-base" style={{ color: '#0A2647' }}>Tổng cộng</span>
                  <span className="text-xl font-bold" style={{ color: '#d4183d' }}>
                    {formatCurrency(total)}
                  </span>
                </div>

                <button 
                  onClick={() => onNavigate('checkout')}
                  className="w-full py-3 rounded-md text-white font-medium hover:opacity-95 bg-cyan-500 shadow-sm shadow-cyan-100 transition-all mb-3"
                  style={{ backgroundColor: '#00BCD4' }}
                >
                  Tiến hành thanh toán
                </button>

                <button 
                  onClick={() => onNavigate('retail')}
                  className="w-full py-3 border rounded-md font-medium hover:bg-gray-50 transition-colors"
                  style={{ borderColor: '#0A2647', color: '#0A2647' }}
                >
                  Tiến hành mua sắm tiếp
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}