import { useState, useEffect } from 'react';
import { Search, TrendingUp, Users, Truck, X } from 'lucide-react';
import { CategoryCard } from '../../components/CategoryCard';
import { ProductCard } from '../../components/ProductCard';
import { SupplierCard } from '../../components/SupplierCard';
import { SupplyCard } from '../../components/SupplyCard';

export const retailProducts = [
    { id: 'r-1', name: 'Tôm sú tươi sống size 20-25', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080', price: '450.000đ/kg', origin: 'Cà Mau', rating: 5, reviews: 42 },
    { id: 'r-2', name: 'Cá Tra phi lê tươi', image: 'https://i.postimg.cc/g2wJgkn1/Ca-tra-phi-le-tuoi.png', price: '85.000đ/kg', origin: 'An Giang', rating: 5, reviews: 156 },
    { id: 'r-3', name: 'Cua biển tươi sống', image: 'https://i.postimg.cc/jqQJf57k/cua-bien.png', price: '320.000đ/kg', origin: 'Kiên Giang', rating: 4, reviews: 38 },
    { id: 'r-4', name: 'Mực tươi', image: 'https://i.postimg.cc/XNw9gLTH/muc.png', price: '180.000đ/kg', origin: 'Vũng Tàu', rating: 5, reviews: 29 },
    { id: 'r-5', name: 'Tôm thẻ chân trắng size 60-70', image: 'https://i.postimg.cc/ydy2mcB1/tom-the-chan-trang.png', price: '280.000đ/kg', origin: 'Bạc Liêu', rating: 5, reviews: 73 },
    { id: 'r-6', name: 'Hải sản tổng hợp', image: 'https://images.unsplash.com/photo-1596563976996-e5dc9a1990c9?q=80&w=1080', price: '550.000đ/combo', origin: 'Nhiều vùng', rating: 5, reviews: 91 },
    { id: 'r-7', name: 'Ghẹ biển', image: 'https://i.postimg.cc/Gp2j7DkR/82eeed2b-b7fd-46db-b76c-c916c1ae3915.png', hoverimage: 'https://i.postimg.cc/wjtvwT18/ghe-xanh.png', price: '800.000đ/kg', origin: 'Cà Mau', rating: 5, reviews: 99 },
    { id: 'r-8', name: 'Tôm hùm bông cao cấp', image: 'https://i.postimg.cc/jqQJf57k/tom-hum-bong.png', price: '1.250.000đ/kg', origin: 'Khánh Hòa', rating: 5, reviews: 18 },
    { id: 'r-9', name: 'Cua gạch đặc sản Nam Bộ', image: 'https://i.postimg.cc/jqQJf57k/cua-gach.png', price: '450.000đ/kg', origin: 'Kiên Giang', rating: 5, reviews: 24 },
    { id: 'r-10', name: 'Ghẹ xanh Phan Thiết', image: 'https://i.postimg.cc/jqQJf57k/ghe-xanh.png', price: '380.000đ/kg', origin: 'Bến Tre', rating: 5, reviews: 29 },
    { id: 'r-11', name: 'Cá mú đỏ tươi sống', image: 'https://i.postimg.cc/jqQJf57k/ca-mu-do.png', price: '650.000đ/kg', origin: 'Quảng Ngãi', rating: 5, reviews: 14 },
    { id: 'r-12', name: 'Cá bớp cắt lát', image: 'https://i.postimg.cc/jqQJf57k/ca-bop.png', price: '240.000đ/kg', origin: 'Phú Quốc', rating: 5, reviews: 56 },
    { id: 'r-13', name: 'Mực ống tươi loại 1', image: 'https://i.postimg.cc/jqQJf57k/muc-ong.png', price: '280.000đ/kg', origin: 'Bình Thuận', rating: 5, reviews: 73 },
    { id: 'r-14', name: 'Hàu sữa tươi sạch vỏ', image: 'https://i.postimg.cc/jqQJf57k/hau-tuoi.png', price: '45.000đ/kg', origin: 'Quảng Ninh', rating: 5, reviews: 91 },
    { id: 'r-15', name: 'Ốc hương thiên nhiên lớn', image: 'https://i.postimg.cc/jqQJf57k/oc-huong.png', price: '350.000đ/kg', origin: 'Vũng Tàu', rating: 5, reviews: 99 },
    { id: 'r-16', name: 'Bào ngư Khánh Hòa hảo hạng', image: 'https://i.postimg.cc/jqQJf57k/bao-ngu.png', price: '850.000đ/kg', origin: 'Khánh Hòa', rating: 5, reviews: 32 }
  ];
export function Homepage({ onNavigate, onAddToCart }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const banners = [
    {
      image: 'https://i.postimg.cc/fLfZBbXS/co-phai-dai-duong-dang-can-kiet-ca-bien.jpg',
      title: 'Kết nối người nuôi – doanh nghiệp – thị trường hải sản Việt Nam',
      subtitle: 'Nền tảng thương mại hải sản hàng đầu'
    },
    {
      image: 'https://images.unsplash.com/photo-1551244072-5d12893278ab?q=80&w=2000',
      title: 'Nguồn cung hải sản tươi sống chất lượng',
      subtitle: 'Trực tiếp từ hộ nuôi'
    },
    {
      image: 'https://i.postimg.cc/Y2gkXbNj/ca-(3)-1683342306.jpg',
      title: 'Giao dịch minh bạch - An toàn - Hiệu quả',
      subtitle: 'Đăng ký ngay hôm nay'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const featuredSupply = [
    // ===== TÔM GỐC & MỚI =====
    { id: '1', species: 'Tôm sú', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080', size: '20-25 con/kg', harvestTime: '15/03/2026', quantity: '5 tấn', location: 'Cà Mau', farmerName: 'Nguyễn Văn A' },
    { id: '2', species: 'Cá Tra', image: 'https://i.postimg.cc/g2wJgkn1/Ca-tra-phi-le-tuoi.png', size: '0.8-1.2 kg/con', harvestTime: '20/03/2026', quantity: '10 tấn', location: 'An Giang', farmerName: 'Trần Thị B' },
    { id: '3', species: 'Tôm thẻ chân trắng', image: 'https://i.postimg.cc/ydy2mcB1/tom-the-chan-trang.png', size: '60-70 con/kg', harvestTime: '10/03/2026', quantity: '3 tấn', location: 'Bạc Liêu', farmerName: 'Lê Văn C' },
    { id: '4', species: 'Ghẹ biển', image: 'https://i.postimg.cc/Gp2j7DkR/82eeed2b-b7fd-46db-b76c-c916c1ae3915.png', hoverimage: 'https://i.postimg.cc/wjtvwT18/ghe-xanh.png', size: '300-400g/con', harvestTime: '12/03/2026', quantity: '2 tấn', location: 'Kiên Giang', farmerName: 'Phạm Văn D' },
    { id: '5', species: 'Cua biển', image: 'https://i.postimg.cc/jqQJf57k/cua-bien.png', size: '300-400g/con', harvestTime: '05/06/2026', quantity: '2 tấn', location: 'Cà mau', farmerName: 'Đoàn Văn Q' },
    { id: '6', species: 'Mực ống', image: 'https://i.postimg.cc/XNw9gLTH/muc.png', size: '100-200g/con', harvestTime: '05/06/2026', quantity: '1 tấn', location: 'Vũng Tàu', farmerName: 'Nguyễn Thanh P' },
    { id: '7', species: 'Tôm hùm bông', image: 'https://i.postimg.cc/jqQJf57k/tom-hum-bong.png', size: '500-700g/con', harvestTime: '08/06/2026', quantity: '500 kg', location: 'Khánh Hòa', farmerName: 'Nguyễn Văn A' },
    { id: '8', species: 'Tôm hùm Alaska', image: 'https://i.postimg.cc/jqQJf57k/tom-hum-alaska.png', size: '600-900g/con', harvestTime: '07/06/2026', quantity: '300 kg', location: 'Đà Nẵng', farmerName: 'Trần Văn B' },
    { id: '9', species: 'Tôm sú', image: 'https://i.postimg.cc/jqQJf57k/tom-su.png', size: '30-50g/con', harvestTime: '07/06/2026', quantity: '2.5 tấn', location: 'Sóc Trăng', farmerName: 'Võ Thị F' },
    { id: '10', species: 'Tôm thẻ chân trắng', image: 'https://i.postimg.cc/jqQJf57k/tom-the.png', size: '10-20g/con', harvestTime: '08/06/2026', quantity: '3 tấn', location: 'Bạc Liêu', farmerName: 'Lê Thị C' },
    { id: '11', species: 'Tôm càng xanh', image: 'https://i.postimg.cc/jqQJf57k/tom-cang-xanh.png', size: '40-70g/con', harvestTime: '06/06/2026', quantity: '1 tấn', location: 'An Giang', farmerName: 'Phạm Văn D' },

    // ===== CUA – GHẸ =====
    { id: '12', species: 'Cua biển', image: 'https://i.postimg.cc/jqQJf57k/cua-bien.png', size: '300-400g/con', harvestTime: '05/06/2026', quantity: '2 tấn', location: 'Cà Mau', farmerName: 'Đoàn Văn Q' },
    { id: '13', species: 'Cua gạch', image: 'https://i.postimg.cc/jqQJf57k/cua-gach.png', size: '400-600g/con', harvestTime: '06/06/2026', quantity: '800 kg', location: 'Kiên Giang', farmerName: 'Huỳnh Văn E' },
    { id: '14', species: 'Ghẹ xanh', image: 'https://i.postimg.cc/jqQJf57k/ghe-xanh.png', size: '200-300g/con', harvestTime: '06/06/2026', quantity: '800 kg', location: 'Bến Tre', farmerName: 'Lê Văn C' },
    { id: '15', species: 'Ghẹ hoa', image: 'https://i.postimg.cc/jqQJf57k/ghe-hoa.png', size: '150-250g/con', harvestTime: '05/06/2026', quantity: '600 kg', location: 'Vũng Tàu', farmerName: 'Ngô Thị G' },
    { id: '16', species: 'Ghẹ sữa', image: 'https://i.postimg.cc/jqQJf57k/ghe-sua.png', size: '100-180g/con', harvestTime: '04/06/2026', quantity: '400 kg', location: 'Tiền Giang', farmerName: 'Bùi Văn H' },

    // ===== CÁ =====
    { id: '17', species: 'Cá mú đỏ', image: 'https://i.postimg.cc/jqQJf57k/ca-mu-do.png', size: '800g-1.2kg/con', harvestTime: '07/06/2026', quantity: '1 tấn', location: 'Quảng Ngãi', farmerName: 'Trần Thị B' },
    { id: '18', species: 'Cá mú chấm', image: 'https://i.postimg.cc/jqQJf57k/ca-mu-cham.png', size: '1-1.5kg/con', harvestTime: '06/06/2026', quantity: '700 kg', location: 'Khánh Hòa', farmerName: 'Đinh Văn I' },
    { id: '19', species: 'Cá chẽm', image: 'https://i.postimg.cc/jqQJf57k/ca-chem.png', size: '500g-1kg/con', harvestTime: '07/06/2026', quantity: '1.2 tấn', location: 'Cần Thơ', farmerName: 'Phan Thị J' },
    { id: '20', species: 'Cá hồng', image: 'https://i.postimg.cc/jqQJf57k/ca-hong.png', size: '600g-1kg/con', harvestTime: '05/06/2026', quantity: '900 kg', location: 'Bình Thuận', farmerName: 'Lý Văn K' },
    { id: '21', species: 'Cá bớp', image: 'https://i.postimg.cc/jqQJf57k/ca-bop.png', size: '1.5-3kg/con', harvestTime: '06/06/2026', quantity: '1.5 tấn', location: 'Phú Quốc', farmerName: 'Võ Văn L' },
    { id: '22', species: 'Cá cam', image: 'https://i.postimg.cc/jqQJf57k/ca-cam.png', size: '1-2kg/con', harvestTime: '04/06/2026', quantity: '800 kg', location: 'Quảng Ninh', farmerName: 'Mai Thị M' },
    { id: '23', species: 'Cá ngừ đại dương', image: 'https://i.postimg.cc/jqQJf57k/ca-ngu.png', size: '5-10kg/con', harvestTime: '03/06/2026', quantity: '2 tấn', location: 'Bình Định', farmerName: 'Cao Văn N' },
    { id: '24', species: 'Cá thu', image: 'https://i.postimg.cc/jqQJf57k/ca-thu.png', size: '300-600g/con', harvestTime: '05/06/2026', quantity: '1.3 tấn', location: 'Quảng Nam', farmerName: 'Đặng Thị O' },

    // ===== MỰC – BẠCH TUỘC =====
    { id: '25', species: 'Mực ống', image: 'https://i.postimg.cc/jqQJf57k/muc-ong.png', size: '150-250g/con', harvestTime: '05/06/2026', quantity: '1.5 tấn', location: 'Bình Thuận', farmerName: 'Phạm Thị D' },
    { id: '26', species: 'Mực nang', image: 'https://i.postimg.cc/jqQJf57k/muc-nang.png', size: '200-400g/con', harvestTime: '06/06/2026', quantity: '1 tấn', location: 'Phú Yên', farmerName: 'Trương Văn P' },
    { id: '27', species: 'Bạch tuộc', image: 'https://i.postimg.cc/jqQJf57k/bach-tuoc.png', size: '400-600g/con', harvestTime: '06/06/2026', quantity: '600 kg', location: 'Phú Quốc', farmerName: 'Ngô Văn G' },

    // ===== HÀU – SÒ – NGHÊU – ĐIỆP =====
    { id: '28', species: 'Hàu tươi', image: 'https://i.postimg.cc/jqQJf57k/hau-tuoi.png', size: '80-120g/con', harvestTime: '08/06/2026', quantity: '3 tấn', location: 'Quảng Ninh', farmerName: 'Hoàng Văn E' },
    { id: '29', species: 'Sò huyết', image: 'https://i.postimg.cc/jqQJf57k/so-huyet.png', size: '20-30g/con', harvestTime: '04/06/2026', quantity: '1.2 tấn', location: 'Tiền Giang', farmerName: 'Đinh Thị H' },
    { id: '30', species: 'Sò lông', image: 'https://i.postimg.cc/jqQJf57k/so-long.png', size: '15-25g/con', harvestTime: '05/06/2026', quantity: '900 kg', location: 'Bến Tre', farmerName: 'Lâm Văn Q' },
    { id: '31', species: 'Nghêu', image: 'https://i.postimg.cc/jqQJf57k/ngheu.png', size: '10-18g/con', harvestTime: '06/06/2026', quantity: '2 tấn', location: 'Long An', farmerName: 'Nguyễn Thị R' },
    { id: '32', species: 'Điệp (Scallop)', image: 'https://i.postimg.cc/jqQJf57k/diep.png', size: '50-80g/con', harvestTime: '07/06/2026', quantity: '500 kg', location: 'Nha Trang', farmerName: 'Huỳnh Văn S' },

    // ===== ỐC =====
    { id: '33', species: 'Ốc hương', image: 'https://i.postimg.cc/jqQJf57k/oc-huong.png', size: '15-25g/con', harvestTime: '03/06/2026', quantity: '700 kg', location: 'Vũng Tàu', farmerName: 'Bùi Văn I' },
    { id: '34', species: 'Ốc len', image: 'https://i.postimg.cc/jqQJf57k/oc-len.png', size: '10-15g/con', harvestTime: '04/06/2026', quantity: '500 kg', location: 'Cà Mau', farmerName: 'Trương Văn J' },
    { id: '35', species: 'Ốc mỡ', image: 'https://i.postimg.cc/jqQJf57k/oc-mo.png', size: '20-35g/con', harvestTime: '05/06/2026', quantity: '400 kg', location: 'Kiên Giang', farmerName: 'Lý Thị K' },
    { id: '36', species: 'Ốc bươu', image: 'https://i.postimg.cc/jqQJf57k/oc-buou.png', size: '50-80g/con', harvestTime: '06/06/2026', quantity: '800 kg', location: 'Đồng Tháp', farmerName: 'Phan Văn L' },
    { id: '37', species: 'Ốc nhảy', image: 'https://i.postimg.cc/jqQJf57k/oc-nhay.png', size: '8-12g/con', harvestTime: '07/06/2026', quantity: '300 kg', location: 'Bình Định', farmerName: 'Đặng Thị M' },
    { id: '38', species: 'Ốc vú nàng', image: 'https://i.postimg.cc/jqQJf57k/oc-vu-nang.png', size: '30-50g/con', harvestTime: '06/06/2026', quantity: '350 kg', location: 'Phú Yên', farmerName: 'Huỳnh Văn N' },
    { id: '39', species: 'Ốc giác', image: 'https://i.postimg.cc/jqQJf57k/oc-giac.png', size: '40-60g/con', harvestTime: '05/06/2026', quantity: '450 kg', location: 'Nha Trang', farmerName: 'Mai Thị O' },
    { id: '40', species: 'Ốc đỏ', image: 'https://i.postimg.cc/jqQJf57k/oc-do.png', size: '12-20g/con', harvestTime: '04/06/2026', quantity: '250 kg', location: 'Quảng Nam', farmerName: 'Cao Văn P' },
    { id: '41', species: 'Bào ngư', image: 'https://i.postimg.cc/jqQJf57k/bao-ngu.png', size: '60-100g/con', harvestTime: '05/06/2026', quantity: '200 kg', location: 'Khánh Hòa', farmerName: 'Vũ Văn T' },
    { id: '42', species: 'Cầu gai (Nhím biển)', image: 'https://i.postimg.cc/jqQJf57k/cau-gai.png', size: '80-150g/con', harvestTime: '06/06/2026', quantity: '150 kg', location: 'Lý Sơn', farmerName: 'Đỗ Thị U' },
    { id: '43', species: 'Tu hài', image: 'https://i.postimg.cc/jqQJf57k/tu-hai.png', size: '100-200g/con', harvestTime: '07/06/2026', quantity: '300 kg', location: 'Vân Đồn', farmerName: 'Lưu Văn V' }
  ];


  const filteredSupply = featuredSupply.filter(item =>
    item.species.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredRetail = retailProducts.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.origin.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Slider */}
      <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-slate-900">
        {banners.map((banner, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
          >
            <div className="absolute inset-0 bg-black/30 z-20" />
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center z-30">
              <div className="text-center text-white px-4 max-w-4xl">
                <h1 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-2xl">{banner.title}</h1>
                <p className="text-lg md:text-xl mb-8 opacity-95 drop-shadow-lg">{banner.subtitle}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => onNavigate('suppliers')} className="px-8 py-3 rounded-md text-white font-semibold hover:scale-105 transition-all shadow-xl active:scale-95" style={{ backgroundColor: '#0A2647' }}>Tìm nguồn hải sản</button>
                  <button onClick={() => onNavigate('supply')} className="px-8 py-3 rounded-md text-white font-semibold hover:scale-105 transition-all shadow-xl active:scale-95" style={{ backgroundColor: '#00BCD4' }}>Đăng bán sản lượng</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search Bar  */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 -mt-10 relative z-50">
        <div className="bg-white rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 border border-gray-50">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Tìm kiếm hải sản / nhà cung cấp / địa điểm..."
                className="w-full pl-12 pr-10 py-4 border border-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00BCD4] bg-gray-50/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 rounded-full"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
            <button className="px-10 py-4 rounded-lg text-white font-bold hover:brightness-110 transition-all shadow-lg" style={{ backgroundColor: '#0A2647' }}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Featured Supply  */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12 bg-gray-50">
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ color: '#0A2647' }}>Sản lượng nổi bật</h2>
          <button onClick={() => onNavigate('supply')} className="text-sm hover:underline" style={{ color: '#00BCD4' }}>Xem tất cả →</button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredSupply.length > 0 ? (
            filteredSupply.map((supply) => (
              <SupplyCard key={supply.id} {...supply} onClick={() => onNavigate('supply')} />
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-400 italic">Không tìm thấy sản lượng phù hợp.</p>
          )}
        </div>
      </section>

      {/* Latest Products  */}
      <section className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 style={{ color: '#0A2647' }}>Sản phẩm mới nhất</h2>
          <button onClick={() => onNavigate('retail')} className="text-sm hover:underline" style={{ color: '#00BCD4' }}>Xem tất cả →</button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {filteredRetail.length > 0 ? (
            filteredRetail.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onClick={() => onNavigate('product-detail', product.id)}
                onAddToCart={() => {
                  const rawPrice = product.price;
                  const cleanPrice = Number(rawPrice.replace(/[^0-9]/g, ''));
                  onAddToCart({
                    ...product,
                    price: cleanPrice 
                  });
                }}
              />
            ))
          ) : (
            <p className="col-span-full text-center py-10 text-gray-400 italic">Không tìm thấy sản phẩm phù hợp.</p>
          )}
        </div>
      </section>
    </div>
  );
}