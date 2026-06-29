import { useState, useRef, useEffect } from 'react';
import { Menu, X, ShoppingCart, LogOut, ChevronDown } from 'lucide-react';
import { Logo } from './Logo';

// NHẬN prop user trực tiếp từ App.jsx truyền xuống ở đây
export function Navbar({ currentPage, onNavigate, cartCount, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // ĐÃ XÓA: Bỏ hoàn toàn dòng const [user, setUser] = useState(...) gây lỗi lệch state cũ

  const menuItems = [
    { id: 'home', label: 'Trang chủ', roles: ['all'] },
    { id: 'supply', label: 'Sản lượng', roles: ['farmer', 'business', 'admin', 'buyer'] },
    { id: 'suppliers', label: 'Tìm nguồn hải sản', roles: ['business', 'admin'] },
    { id: 'retail', label: 'Mua lẻ', roles: ['buyer', 'guest', 'admin'] },
    { id: 'dashboard', label: 'Quản lý', roles: ['farmer', 'admin'] },
    { id: 'checkout', label: 'Thanh toán', roles: ['buyer', 'admin'] },
    { id: 'b2b-cart', label: 'Giỏ hàng B2B', roles: ['business', 'admin'] },
    { id: 'contact', label: 'Liên hệ', roles: ['all'] },
    { id: 'listing-management', label: 'Quản lý bài đăng', roles: ['farmer', 'admin'] },
    { id: 'order-management', label: 'Lịch sử đơn hàng', roles: ['buyer', 'business', 'farmer', 'admin'] },
    { id: 'seller-center', label: 'Seller Center', roles: ['buyer', 'business', 'farmer', 'admin'] },
  ];

  // Lọc danh sách menu dựa trên prop user động
  const filteredMenu = menuItems.filter(item => {
    if (item.roles.includes('all')) return true;
    if (!user) return item.roles.includes('guest');
    return item.roles.includes(user?.role || '');
  });

  const MAX_VISIBLE_ITEMS = 4;
  const visibleMenu = filteredMenu.slice(0, MAX_VISIBLE_ITEMS);
  const dropdownMenu = filteredMenu.slice(MAX_VISIBLE_ITEMS);

  const isCurrentPageInDropdown = dropdownMenu.some(item => item.id === currentPage);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Đăng xuất gọi hàm chuyển hướng của App để App xóa sạch State user
  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    if (onNavigate) {
      onNavigate('home'); 
    }
    // reload nhẹ hoặc ép đổi trạng thái ở App.jsx
    window.location.reload(); 
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">

          {/* Logo */}
          <button onClick={() => onNavigate?.('home')} className="flex-shrink-0">
            <Logo />
          </button>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-4">
            {visibleMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate?.(item.id)}
                className="px-3 py-2 rounded-md transition-colors whitespace-nowrap text-sm font-medium"
                style={{
                  backgroundColor: currentPage === item.id ? '#0A2647' : 'transparent',
                  color: currentPage === item.id ? 'white' : '#0A2647',
                }}
              >
                {item.label}
              </button>
            ))}

            {/* Dropdown "DANH MỤC" */}
            {dropdownMenu.length > 0 && (
              <div className="relative ml-auto pr-2" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="px-3 py-2 rounded-md transition-all whitespace-nowrap text-sm font-medium flex items-center gap-2 hover:bg-gray-100"
                  style={{
                    backgroundColor: (isCurrentPageInDropdown || isDropdownOpen) ? '#0A2647' : 'transparent',
                    color: (isCurrentPageInDropdown || isDropdownOpen) ? 'white' : '#0A2647',
                  }}
                >
                  <Menu className="w-4 h-4" />
                  <span className="font-semibold">DANH MỤC</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-lg shadow-xl py-2 z-50">
                    {dropdownMenu.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate?.(item.id);
                          setIsDropdownOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-gray-50"
                        style={{
                          color: currentPage === item.id ? '#00BCD4' : '#0A2647',
                          fontWeight: currentPage === item.id ? '600' : '400',
                          backgroundColor: currentPage === item.id ? '#F0F9FF' : 'transparent',
                        }}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Side Icons */}
          <div className="hidden lg:flex items-center gap-4">
            {/* GIỎ HÀNG */}
            <button
              onClick={() => onNavigate?.('cart')}
              className="p-2 hover:bg-gray-100 rounded-full relative"
            >
              <ShoppingCart className="w-6 h-6" style={{ color: '#0A2647' }} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {!user ? (
              <button
                onClick={() => onNavigate?.('login')}
                className="px-4 py-2 rounded-md text-white hover:opacity-90 font-medium text-sm"
                style={{ backgroundColor: '#00BCD4' }}
              >
                Đăng nhập / Đăng ký
              </button>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l">
                <div className="text-right">
                  <p className="text-[10px] text-gray-500 font-bold tracking-wider leading-none">
                    {user.role?.toUpperCase()}
                  </p>
                  <p className="text-sm font-bold text-[#0A2647]">{user.name}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors"
                  title="Đăng xuất"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {filteredMenu.map((item) => (
              <button
                key={item.id}
                onClick={() => { onNavigate?.(item.id); setIsMobileMenuOpen(false); }}
                className="block w-full text-left px-3 py-2 rounded-md font-medium text-base"
                style={{
                  backgroundColor: currentPage === item.id ? '#0A2647' : 'transparent',
                  color: currentPage === item.id ? 'white' : '#0A2647',
                }}
              >
                {item.label}
              </button>
            ))}
            {!user ? (
              <button
                onClick={() => onNavigate?.('login')}
                className="w-full mt-4 py-3 rounded-md text-white font-bold"
                style={{ backgroundColor: '#00BCD4' }}
              >
                Đăng nhập
              </button>
            ) : (
              <button
                onClick={handleLogout}
                className="w-full mt-4 py-3 rounded-md border border-red-500 text-red-500 font-bold"
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}