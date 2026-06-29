import { Globe, Mail, Phone, MapPin } from 'lucide-react';
import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="bg-white border-t mt-16" style={{ borderColor: '#e5e7eb' }}>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <Logo className="mb-4" />
            <p className="text-gray-600 text-sm">
              Nền tảng kết nối người nuôi, doanh nghiệp và thị trường hải sản Việt Nam
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="p-2 rounded-full hover:bg-gray-100">
               <Globe className="w-5 h-5" style={{ color: '#0A2647' }} />
              </a>
              <a href="#" className="p-2 rounded-full hover:bg-gray-100">
                <Mail className="w-5 h-5" style={{ color: '#0A2647' }} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-4" style={{ color: '#0A2647' }}>Liên kết nhanh</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Giới thiệu</a></li>
              <li><a href="#" className="hover:text-gray-900">Cách hoạt động</a></li>
              <li><a href="#" className="hover:text-gray-900">Điều khoản sử dụng</a></li>
              <li><a href="#" className="hover:text-gray-900">Chính sách bảo mật</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4" style={{ color: '#0A2647' }}>Dịch vụ</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:text-gray-900">Tìm nguồn hải sản</a></li>
              <li><a href="#" className="hover:text-gray-900">Đăng bán sản lượng</a></li>
              <li><a href="#" className="hover:text-gray-900">Mua lẻ hải sản</a></li>
              <li><a href="#" className="hover:text-gray-900">Hỗ trợ logistics</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4" style={{ color: '#0A2647' }}>Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#00BCD4' }} />
                <span>1900 xxxx</span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#00BCD4' }} />
                <span>support@vam.vn</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-1 flex-shrink-0" style={{ color: '#00BCD4' }} />
                <span>Tp. Hồ Chí Minh, Việt Nam</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-gray-600">
          <p>&copy; 2026 VAM Seafood Marketplace. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
