import { useState, useEffect } from 'react';
import { CreditCard, Wallet, Banknote } from 'lucide-react';
import { toast } from 'react-hot-toast'; // Đã thêm import toast

export function CheckoutPage({ onNavigate, cart = [], setCart }) {
  const [paymentMethod, setPaymentMethod] = useState('bank');
  const [checkoutItems, setCheckoutItems] = useState([]);
  const [isDirectCheckout, setIsDirectCheckout] = useState(false);

  // 1. Kiểm tra xem người dùng đang Mua ngay hay mua từ Giỏ hàng
  useEffect(() => {
    const directItem = JSON.parse(localStorage.getItem('directCheckoutItem'));
    
    if (directItem) {
      setCheckoutItems([directItem]); // Nếu có dữ liệu mua ngay, ép vào mảng để hiển thị
      setIsDirectCheckout(true);
    } else if (cart && cart.length > 0) {
      // Nếu không mua ngay, dùng giỏ hàng do App.jsx truyền xuống thông qua biến cart
      setCheckoutItems(cart);
      setIsDirectCheckout(false);
    } else {
      // Trường hợp dự phòng nếu React State chưa kịp load: Đọc thẳng từ localStorage của giỏ hàng
      const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCheckoutItems(localCart);
      setIsDirectCheckout(false);
    }

    return () => {
      localStorage.removeItem('directCheckoutItem');
    };
  }, [cart]);

  // 2. Tính toán toàn bộ chi phí dựa trên dữ liệu `checkoutItems` đã phân loại ở trên
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = checkoutItems.length > 0 ? 50000 : 0;
  const total = subtotal + shipping;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!checkoutItems || checkoutItems.length === 0) {
      toast.error('Không có sản phẩm nào để thanh toán!');
      onNavigate('retail'); 
      return;
    }

    const orderData = {
      items: checkoutItems,
      total: total,
      paymentMethod: paymentMethod,
      date: new Date().toISOString(),
    };

    try {
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, orderData]));
      
      // 3. Phân nhánh xóa dữ liệu sau khi đặt hàng thành công
      if (isDirectCheckout) {
        localStorage.removeItem('directCheckoutItem');
      } else {
        if (typeof setCart === 'function') {
          setCart([]);
        }
        localStorage.removeItem('cart');
      }

      toast.success('Đặt hàng thành công! Cảm ơn bạn đã tin tưởng chúng tôi.');
      window.scrollTo(0, 0);
      onNavigate('home');
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      toast.error('Đã xảy ra lỗi trong quá trình xử lý đơn hàng. Vui lòng thử lại!');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8 font-bold text-2xl" style={{ color: '#0A2647' }}>
          Thanh toán {isDirectCheckout && <span className="text-sm font-normal text-gray-500">(Chế độ Mua Ngay)</span>}
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* CỘT TRÁI: THÔNG TIN GIAO HÀNG & PHƯƠNG THỨC THANH TOÁN */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Thông tin giao hàng */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-6" style={{ color: '#0A2647' }}>Thông tin giao hàng</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10,11}"
                    className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="0901234567"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="email@example.com"
                />
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">Địa chỉ giao hàng *</label>
                <input
                  type="text"
                  required
                  className="w-full p-3 border rounded-md mb-3 focus:outline-none focus:border-[#00BCD4]"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="Số nhà, tên đường"
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <select required className="p-3 border rounded-md bg-white" style={{ borderColor: '#e5e7eb' }}>
                    <option value="">Chọn Tỉnh/Thành phố</option>
                    <option value="HCM">TP. Hồ Chí Minh</option>
                    <option value="HN">Hà Nội</option>
                    <option value="CM">Cà Mau</option>
                  </select>
                  <select required className="p-3 border rounded-md bg-white" style={{ borderColor: '#e5e7eb' }}>
                    <option value="">Chọn Quận/Huyện</option>
                    <option value="Q1">Quận 1</option>
                    <option value="Q7">Quận 7</option>
                  </select>
                  <select required className="p-3 border rounded-md bg-white" style={{ borderColor: '#e5e7eb' }}>
                    <option value="">Chọn Phường/Xã</option>
                    <option value="P1">Phường 1</option>
                    <option value="P2">Phường 2</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm mb-2">Ghi chú đơn hàng (tuỳ chọn)</label>
                <textarea
                  rows={3}
                  className="w-full p-3 border rounded-md focus:outline-none focus:border-[#00BCD4]"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn."
                />
              </div>
            </div>

            {/* Phương thức thanh toán */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-6" style={{ color: '#0A2647' }}>Phương thức thanh toán</h2>
              <div className="space-y-3">
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'bank' ? 'border-[#00BCD4] bg-blue-50/50 font-medium' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#00BCD4]"
                  />
                  <CreditCard className="w-5 h-5" style={{ color: '#0A2647' }} />
                  <span>Chuyển khoản ngân hàng</span>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'ewallet' ? 'border-[#00BCD4] bg-blue-50/50 font-medium' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="ewallet"
                    checked={paymentMethod === 'ewallet'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#00BCD4]"
                  />
                  <Wallet className="w-5 h-5" style={{ color: '#0A2647' }} />
                  <span>Ví điện tử (Momo, ZaloPay)</span>
                </label>
                <label
                  className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${
                    paymentMethod === 'cod' ? 'border-[#00BCD4] bg-blue-50/50 font-medium' : 'border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-4 h-4 accent-[#00BCD4]"
                  />
                  <Banknote className="w-5 h-5" style={{ color: '#0A2647' }} />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>
              </div>

              {/* Chi tiết chuyển khoản ngân hàng */}
              {paymentMethod === 'bank' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 animate-fadeIn">
                  <p className="text-sm text-gray-600 mb-2">
                    Quý khách vui lòng chuyển khoản theo thông tin sau:
                  </p>
                  <div className="text-sm space-y-1 text-gray-700">
                    <p><strong>Ngân hàng:</strong> Vietcombank - Chi nhánh TP.HCM</p>
                    <p><strong>Số tài khoản:</strong> 1234567890</p>
                    <p><strong>Chủ tài khoản:</strong> Công ty VAM</p>
                    <p><strong>Nội dung:</strong> Thanh toán đơn hàng #[Mã đơn hàng]</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: TÓM TẮT ĐƠN HÀNG */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="text-lg font-medium mb-4" style={{ color: '#0A2647' }}>Đơn hàng của bạn</h3>

              {/* Danh sách sản phẩm hiển thị dựa trên checkoutItems */}
              <div className="space-y-3 mb-4 pb-4 border-b max-h-[300px] overflow-y-auto" style={{ borderColor: '#e5e7eb' }}>
                {checkoutItems.length > 0 ? (
                  checkoutItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm gap-4">
                      <span className="text-gray-600 break-words">
                        {item.name} <span className="text-gray-400 font-medium">x{item.quantity}</span>
                      </span>
                      <span className="whitespace-nowrap font-medium">
                        {(item.price * item.quantity).toLocaleString('vi-VN')}đ
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-400 italic py-2">Không có sản phẩm nào.</p>
                )}
              </div>

              {/* Tính toán tiền hóa đơn */}
              <div className="space-y-2 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tạm tính</span>
                  <span className="font-medium">{subtotal.toLocaleString('vi-VN')}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Phí vận chuyển</span>
                  <span className="font-medium">{shipping.toLocaleString('vi-VN')}đ</span>
                </div>
              </div>

              <div className="flex justify-between mb-6">
                <span className="font-medium" style={{ color: '#0A2647' }}>Tổng cộng</span>
                <span className="text-xl font-bold" style={{ color: '#d4183d' }}>
                  {total.toLocaleString('vi-VN')}đ
                </span>
              </div>

              {/* Nút bấm Submit */}
              <button
                type="submit"
                disabled={checkoutItems.length === 0}
                className="w-full py-3 rounded-md text-white font-medium hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: '#00BCD4' }}
              >
                Xác nhận thanh toán
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}