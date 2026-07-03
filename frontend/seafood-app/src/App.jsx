import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Homepage, retailProducts as mockRetailProducts } from './pages/common/Homepage';
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
import { productsApi } from './api/products';
import { cartApi } from './api/cart';

const formatPriceText = (price, unit = 'kg') => {
  if (typeof price === 'string') return price;
  const numeric = Number(price || 0);
  return `${numeric.toLocaleString('vi-VN')}đ/${unit || 'kg'}`;
};

const normalizeProduct = (product) => ({
  ...product,
  id: product.id || product._id || product.legacyId || product.productCode,
  _id: product._id,
  price: typeof product.price === 'number' ? product.price : Number(String(product.price || '').replace(/[^0-9]/g, '')),
  priceText: product.priceText || formatPriceText(product.price, product.unit),
  image: product.image || product.images?.[0] || '',
  hoverimage: product.hoverimage || product.hoverImage || product.images?.[1] || product.image || product.images?.[0] || '',
  reviews: product.reviews ?? product.totalReviews ?? 0,
  rating: product.rating || 5,
});

const normalizeCartItem = (item) => ({
  ...item,
  id: item._id || item.id || item.productId || item.supplyId,
  cartItemId: item._id || item.cartItemId,
  productId: item.productId,
  supplyId: item.supplyId,
  price: Number(item.price || 0),
  quantity: Number(item.quantity || 1),
  image: item.image || '',
});

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [pageData, setPageData] = useState({});
  const [user, setUser] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState(mockRetailProducts.map(normalizeProduct));

  const isLoggedIn = Boolean(user && localStorage.getItem('token'));

  const saveLocalCart = (items, currentUser = user) => {
    const cartKey = currentUser ? `cart_${currentUser.id || currentUser._id || currentUser.email}` : 'cart_guest';
    localStorage.setItem(cartKey, JSON.stringify(items));
  };

  const loadLocalCart = (currentUser = user) => {
    const cartKey = currentUser ? `cart_${currentUser.id || currentUser._id || currentUser.email}` : 'cart_guest';
    return JSON.parse(localStorage.getItem(cartKey) || '[]');
  };

  const refreshCart = useCallback(async () => {
    if (!localStorage.getItem('token')) {
      const localCart = loadLocalCart();
      setCartItems(localCart);
      return localCart;
    }

    try {
      const response = await cartApi.get();
      const items = (response.data?.cart?.items || []).map(normalizeCartItem);
      setCartItems(items);
      return items;
    } catch (error) {
      console.error('Không tải được giỏ hàng backend:', error);
      return [];
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        localStorage.removeItem('currentUser');
      }
    }
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const response = await productsApi.getRetail({ limit: 100 });
        const apiProducts = (response.data || []).map(normalizeProduct);
        if (apiProducts.length > 0) setProducts(apiProducts);
      } catch (error) {
        console.warn('Không tải được products từ backend, dùng mock data:', error.message);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (user) {
      refreshCart();
    } else {
      const localCart = loadLocalCart(null);
      setCartItems(localCart);
    }
  }, [user, refreshCart]);

  useEffect(() => {
    const handleAuthExpired = () => {
      setUser(null);
      setCartItems(loadLocalCart(null));
      toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      setCurrentPage('login');
    };

    window.addEventListener('auth-expired', handleAuthExpired);
    return () => window.removeEventListener('auth-expired', handleAuthExpired);
  }, []);

  const handleAddToCart = async (product, quantity = 1) => {
    const normalizedProduct = normalizeProduct(product);

    if (localStorage.getItem('token')) {
      try {
        await cartApi.add({
          itemType: 'product',
          productId: normalizedProduct._id || normalizedProduct.id || normalizedProduct.productId,
          quantity: Number(quantity) || 1,
        });
        await refreshCart();
        toast.success(`Đã thêm ${quantity} ${normalizedProduct.unit || 'kg'} ${normalizedProduct.name} vào giỏ hàng!`);
        return;
      } catch (error) {
        toast.error(error.message || 'Không thể thêm sản phẩm vào giỏ hàng backend');
        return;
      }
    }

    setCartItems(prevItems => {
      const productKey = normalizedProduct._id || normalizedProduct.id;
      const existing = prevItems.find(item => String(item.productId || item.id) === String(productKey));
      let nextItems;

      if (existing) {
        nextItems = prevItems.map(item =>
          String(item.productId || item.id) === String(productKey)
            ? { ...item, quantity: item.quantity + Number(quantity || 1) }
            : item
        );
      } else {
        nextItems = [
          ...prevItems,
          {
            id: productKey,
            productId: normalizedProduct._id || normalizedProduct.id,
            name: normalizedProduct.name,
            image: normalizedProduct.image,
            price: normalizedProduct.price,
            origin: normalizedProduct.origin,
            quantity: Number(quantity || 1),
            unit: normalizedProduct.unit || 'kg',
            supplierId: normalizedProduct.sellerId || normalizedProduct.supplierId || '',
            supplierName: normalizedProduct.supplier?.name || normalizedProduct.supplierName || 'Nhà cung cấp',
          },
        ];
      }

      saveLocalCart(nextItems);
      return nextItems;
    });

    toast.success(`Đã thêm ${quantity} ${normalizedProduct.unit || 'kg'} ${normalizedProduct.name} vào giỏ hàng!`);
  };

  const handleUpdateCartItem = async (itemId, quantity) => {
    if (quantity < 1) return;

    if (localStorage.getItem('token')) {
      try {
        await cartApi.update(itemId, { quantity });
        await refreshCart();
      } catch (error) {
        toast.error(error.message || 'Không thể cập nhật giỏ hàng');
      }
      return;
    }

    setCartItems(items => {
      const nextItems = items.map(item => String(item.id) === String(itemId) ? { ...item, quantity } : item);
      saveLocalCart(nextItems);
      return nextItems;
    });
  };

  const handleRemoveCartItem = async (itemId) => {
    if (localStorage.getItem('token')) {
      try {
        await cartApi.remove(itemId);
        await refreshCart();
        toast.error('Đã xóa sản phẩm khỏi giỏ hàng!');
      } catch (error) {
        toast.error(error.message || 'Không thể xóa sản phẩm khỏi giỏ hàng');
      }
      return;
    }

    setCartItems(items => {
      const nextItems = items.filter(item => String(item.id) !== String(itemId));
      saveLocalCart(nextItems);
      return nextItems;
    });
    toast.error('Đã xóa sản phẩm khỏi giỏ hàng!');
  };

  const handleBuyNow = (product, quantity = 1) => {
    const normalizedProduct = normalizeProduct(product);
    const directItem = {
      id: normalizedProduct._id || normalizedProduct.id,
      productId: normalizedProduct._id || normalizedProduct.id,
      name: normalizedProduct.name,
      price: normalizedProduct.price,
      image: normalizedProduct.image,
      origin: normalizedProduct.origin,
      quantity: Number(quantity || 1),
      unit: normalizedProduct.unit || 'kg',
      supplierId: normalizedProduct.sellerId || normalizedProduct.supplierId || '',
      supplierName: normalizedProduct.supplier?.name || normalizedProduct.supplierName || 'Nhà cung cấp',
    };

    localStorage.setItem('directCheckoutItem', JSON.stringify(directItem));
    handleNavigate('checkout');
  };

  const handleLoginSuccess = () => {
    const savedUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(savedUser);
    setCurrentPage('home');
    window.scrollTo(0, 0);
  };

  const handleNavigate = (page, id) => {
    setCurrentPage(page);
    setPageData({ id });
    window.scrollTo(0, 0);
  };

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
        return ['home', 'supply', 'dashboard', 'listing-management', 'seller-center', 'contact'].includes(page);
      case 'business':
        return ['home', 'supply', 'suppliers', 'contact', 'farm-profile', 'b2b-cart'].includes(page);
      default:
        return ['home', 'contact'].includes(page);
    }
  };

  const renderPage = () => {
    if (!canAccess(currentPage)) {
      return <Homepage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }

    switch (currentPage) {
      case 'home':
        return <Homepage onAddToCart={handleAddToCart} onNavigate={handleNavigate} />;
      case 'retail':
        return <RetailPage allProducts={products} onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
      case 'product-detail':
        return (
          <ProductDetailPage
            productId={pageData.id}
            onNavigate={handleNavigate}
            allProducts={products}
            onAddToCart={handleAddToCart}
            onBuyNow={handleBuyNow}
          />
        );
      case 'farm-profile':
        return <FarmProfilePage farmId={pageData.id} />;
      case 'cart':
        return (
          <CartPage
            cartItems={cartItems}
            setCartItems={setCartItems}
            onNavigate={handleNavigate}
            onUpdateQuantity={handleUpdateCartItem}
            onRemoveItem={handleRemoveCartItem}
          />
        );
      case 'supply':
        return <SupplyPage onNavigate={handleNavigate} />;
      case 'suppliers':
        return <SuppliersPage onNavigate={handleNavigate} />;
      case 'checkout': {
        const directItem = JSON.parse(localStorage.getItem('directCheckoutItem') || 'null');
        return (
          <CheckoutPage
            onNavigate={handleNavigate}
            cart={directItem ? [directItem] : cartItems}
            setCart={setCartItems}
            refreshCart={refreshCart}
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
        return <Homepage onNavigate={handleNavigate} onAddToCart={handleAddToCart} />;
    }
  };

  const totalCartCount = cartItems.reduce((sum, item) => sum + Number(item.quantity || 0), 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Toaster position="top-right" reverseOrder={false} />
      <Navbar user={user} currentPage={currentPage} onNavigate={handleNavigate} cartCount={totalCartCount} />
      <main className="flex-1">{renderPage()}</main>
      <Footer />
    </div>
  );
}
