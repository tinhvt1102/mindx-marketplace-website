import { Phone, Mail, MapPin, Send } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="mb-4" style={{ color: '#0A2647' }}>Liên hệ với chúng tôi</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với chúng tôi qua các kênh dưới đây hoặc gửi tin nhắn trực tiếp.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#0A2647' }}>
              <Phone className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2" style={{ color: '#0A2647' }}>Điện thoại</h3>
            <p className="text-gray-600 mb-2">Gọi cho chúng tôi</p>
            <a href="tel:1900xxxx" className="font-medium" style={{ color: '#00BCD4' }}>
              1900 xxxx
            </a>
            <p className="text-sm text-gray-500 mt-2">
              T2 - T7: 8:00 - 18:00<br />
              CN: 8:00 - 12:00
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#2C5F8D' }}>
              <Mail className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2" style={{ color: '#0A2647' }}>Email</h3>
            <p className="text-gray-600 mb-2">Gửi email cho chúng tôi</p>
            <a href="mailto:support@vam.vn" className="font-medium" style={{ color: '#00BCD4' }}>
              support@vam.vn
            </a>
            <p className="text-sm text-gray-500 mt-2">
              Phản hồi trong vòng 24h
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: '#00BCD4' }}>
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <h3 className="mb-2" style={{ color: '#0A2647' }}>Địa chỉ</h3>
            <p className="text-gray-600 mb-2">Ghé thăm văn phòng</p>
            <p className="font-medium" style={{ color: '#0A2647' }}>
              Tp. Hồ Chí Minh
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Việt Nam
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-sm p-8">
            <h2 className="mb-6" style={{ color: '#0A2647' }}>Gửi tin nhắn</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success('Gửi tin nhắn thành công! Chúng tôi sẽ phản hồi sớm nhất.');
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-2">Họ và tên *</label>
                  <input
                    type="text"
                    className="w-full p-3 border rounded-md"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="Nguyễn Văn A"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm mb-2">Số điện thoại *</label>
                  <input
                    type="tel"
                    className="w-full p-3 border rounded-md"
                    style={{ borderColor: '#e5e7eb' }}
                    placeholder="0901234567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm mb-2">Email *</label>
                <input
                  type="email"
                  className="w-full p-3 border rounded-md"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="email@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm mb-2">Chủ đề *</label>
                <select
                  className="w-full p-3 border rounded-md"
                  style={{ borderColor: '#e5e7eb' }}
                  required
                >
                  <option value="">Chọn chủ đề</option>
                  <option>Tư vấn mua hàng</option>
                  <option>Hỗ trợ kỹ thuật</option>
                  <option>Đăng ký bán hàng</option>
                  <option>Hợp tác kinh doanh</option>
                  <option>Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm mb-2">Nội dung *</label>
                <textarea
                  rows={5}
                  className="w-full p-3 border rounded-md"
                  style={{ borderColor: '#e5e7eb' }}
                  placeholder="Nhập nội dung tin nhắn của bạn..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-md text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                style={{ backgroundColor: '#00BCD4' }}
              >
                <Send className="w-5 h-5" />
                Gửi tin nhắn
              </button>
            </form>
          </div>

          {/* Map & Additional Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-8">
              <h3 className="mb-4" style={{ color: '#0A2647' }}>Câu hỏi thường gặp</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="mb-2" style={{ color: '#0A2647' }}>Làm thế nào để đăng ký bán hàng?</h4>
                  <p className="text-sm text-gray-600">
                    Bạn có thể đăng ký tài khoản người bán và hoàn thiện hồ sơ để bắt đầu đăng bán sản phẩm trên nền tảng VAM.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2" style={{ color: '#0A2647' }}>Thời gian giao hàng là bao lâu?</h4>
                  <p className="text-sm text-gray-600">
                    Thời gian giao hàng phụ thuộc vào khu vực và sản phẩm, thường từ 1-3 ngày làm việc.
                  </p>
                </div>
                <div>
                  <h4 className="mb-2" style={{ color: '#0A2647' }}>Có chính sách đổi trả không?</h4>
                  <p className="text-sm text-gray-600">
                    Chúng tôi có chính sách đổi trả trong vòng 24h nếu sản phẩm không đúng chất lượng cam kết.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-200">
                <img
                  src="https://images.unsplash.com/photo-1611794501034-13369f948303?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvY2VhbiUyMHdhdmVzJTIwYmx1ZXxlbnwxfHx8fDE3NzI2MzU4MTB8MA&ixlib=rb-4.1.0&q=80&w=1080"
                  alt="Map placeholder"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
