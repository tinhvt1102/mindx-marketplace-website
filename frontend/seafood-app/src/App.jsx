import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Homepage, retailProducts } from './pages/common/Homepage';
import { SupplyPage } from './pages/buyer/SupplyPage';
import { SuppliersPage } from './pages/buyer/SuppliersPage';
import { RetailPage } from './pages/buyer/RetailPage';
import { ProductDetailPage } from './pages/common/ProductDetailPage';
import { FarmProfilePage } from './pages/buyer/FarmProfilePage';
import { CartPage } from './pages/buyer/CartPage';
import { CheckoutPage } from './pages/buyer/CheckoutPage';
import { DashboardPage } from './pages/seller/DashboardPage';
import { LoginPage } from './pages/common/LoginPage';
import { ContactPage } from './pages/common/ContactPage';
import { B2BCartPage } from './pages/buyer/B2BCartPage';
import { ListingManagementPage } from './pages/seller/ListingManagementPage';
import { OrderManagementPage } from './pages/seller/OrderManagementPage';
import { SellerCenterPage } from './pages/seller/SellerCenterPage';
import { toast, Toaster } from 'react-hot-toast';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState(() => {
    return JSON.parse(localStorage.getItem('cart')) || [];
  });

  // 1. Tải thông tin User và Giỏ hàng từ LocalStorage khi vào ứng dụng
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const cartKey = user ? `cart_${user.id || user.email}` : 'cart_guest';
    const savedCart = localStorage.getItem(cartKey);

    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      setCartItems([]); // Nếu tài khoản này chưa từng mua gì thì set giỏ hàng rỗng
    }
  }, [user]); // Bắt buộc phải đưa [user] vào đây để mỗi lần đổi acc là nó tự reload lại giỏ hàng tương ứng

  // 3. Tự động đồng bộ Giỏ hàng vào LocalStorage mỗi khi giỏ hàng HOẶC user thay đổi
  useEffect(() => {
    const cartKey = user ? `cart_${user.id || user.email}` : 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, user]);

  // 3. Hàm thêm vào giỏ hàng thông minh (Đã sửa lỗi biến addQty bằng quantity động)
  const handleAddToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const isExist = prevItems.find(item => item.id === product.id);
      if (isExist) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      // Nếu chưa có, thêm mới đầy đủ thông tin sản phẩm
      return [
        ...prevItems,
        {
          id: product.id,
          name: product.name,
          image: product.image,
          price: product.price,
          origin: product.origin,
          quantity: quantity
        }
      ];
    });

    // Thay thế alert thành toast.success tại đây
    toast.success(`Đã thêm ${quantity}kg ${product.name} vào giỏ hàng!`);
  };

  // Hàm Mua ngay thông minh: Chuẩn hóa dữ liệu số trước khi lưu
  const handleBuyNow = (product, quantity = 1) => {
    // Ép kiểu giá tiền về dạng số thuần túy, loại bỏ mọi ký tự lạ nếu có
    const cleanPrice = typeof product.price === 'string'
      ? parseInt(product.price.replace(/[^0-9]/g, ''), 10)
      : Number(product.price);

    const directItem = {
      id: product.id,
      name: product.name,
      price: cleanPrice || 0, // Đảm bảo không bị undefined/NaN
      image: product.image,
      origin: product.origin,
      quantity: Number(quantity)
    };

    localStorage.setItem('directCheckoutItem', JSON.stringify(directItem));
    handleNavigate('checkout');
  };

  // 4. Xử lý đăng nhập thành công
  const handleLoginSuccess = (targetPage) => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser'));
    setUser(savedUser);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  // 5. Điều hướng trang
  const handleNavigate = (page, id) => {
    setCurrentPage(page);
    setPageData({ id });
    window.scrollTo(0, 0);
  };

  // 6. Hệ thống phân quyền truy cập trang (Role-based Authentication)
  const canAccess = (page) => {
    if (!user) {
      return ['home', 'login', 'contact', 'retail', 'product-detail', 'cart', 'checkout'].includes(page);
    }
    const role = user.role?.toLowerCase();
    if (role === 'admin') return true;
    switch (role) {
      case 'buyer':
        return ['home', 'retail', 'product-detail', 'cart', 'checkout', 'supply', 'contact'].includes(page);
      case 'farmer':
        return ['home', 'supply', 'dashboard', 'contact'].includes(page);
      case 'business':
        return ['home', 'supply', 'suppliers', 'contact', 'farm-profile'].includes(page);
      default:
        return ['home', 'contact'].includes(page);
    }
  };

  // 7. Render trang dựa trên phân quyền và trạng thái điều hướng
  const renderPage = () => {
    if (!canAccess(currentPage)) {
      return <Homepage onNavigate={handleNavigate} />;
    }

    switch (currentPage) {
      case 'home':
        return <Homepage onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
      case 'retail':
        return (
          <RetailPage
            allProducts={retailProducts}
            onNavigate={handleNavigate}
            onAddToCart={handleAddToCart}

          />
        );
      case 'product-detail':
        return (
          <ProductDetailPage
            productId={pageData.id}
            onNavigate={handleNavigate}
            allProducts={retailProducts}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        );
      case 'farm-profile':
        return <FarmProfilePage farmId={pageData.id} />;
      case 'cart':
        return <CartPage cartItems={cartItems} setCartItems={setCartItems} onNavigate={handleNavigate} />;
      case 'supply':
        return <SupplyPage onNavigate={handleNavigate} />;
      case 'suppliers':
        return <SuppliersPage onNavigate={handleNavigate} />;
      case 'checkout': {
        const directItem = JSON.parse(localStorage.getItem('directCheckoutItem'));
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
            cart={directItem ? [directItem] : cartItems}
            setCart={setCartItems}
          />
        );
      }
      case 'dashboard':
        return <DashboardPage user={user} onNavigate={handleNavigate} />;
      case 'login':
        return <LoginPage onNavigate={handleLoginSuccess} setCartItems={setCartItems} />;
      case 'contact':
        return <ContactPage />;
      case 'b2b-cart':
        return <B2BCartPage onNavigate={handleNavigate} />;
      case 'listing-management':
        return <ListingManagementPage onNavigate={handleNavigate} />;
      case 'order-management':
        return <OrderManagementPage onNavigate={handleNavigate} />;
      case 'seller-center':
        return <SellerCenterPage onNavigate={handleNavigate} />;
      default:
        return <Homepage onNavigate={handleNavigate} />;
    }
  };

  // 8. Tính tổng số lượng item để hiển thị badge trên Navbar
  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />

      <Navbar
        user={user}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        cartCount={totalCartCount}
      />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}