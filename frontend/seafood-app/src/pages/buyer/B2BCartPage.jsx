import { useState } from 'react';
import { Trash2, Heart, MessageCircle, User, Star, MapPin, BadgeCheck, ShoppingCart, TrendingUp, Package } from 'lucide-react';

export function B2BCartPage({ onNavigate }) {
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      productName: 'Tôm sú tươi',
      supplierName: 'Hộ nuôi Nguyễn Văn A',
      supplierId: 'sup1',
      image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHNocmltcCUyMHNlYWZvb2R8ZW58MXx8fHwxNzcyNjA3NzAwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      region: 'Cà Mau',
      size: '20-25 con/kg',
      availableStock: 5000,
      suggestedPrice: 420000,
      quantity: 500,
      certifications: ['VietGAP', 'ASC'],
      rating: 4.8
    },
    {
      id: '2',
      productName: 'Tôm thẻ chân trắng',
      supplierName: 'Hộ nuôi Nguyễn Văn A',
      supplierId: 'sup1',
      image: 'https://images.unsplash.com/photo-1633202329775-c7e440dfe77b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw2fHxzaHJpbXAlMjBmYXJtfGVufDF8fHx8MTc3MjYzNTQxMXww&ixlib=rb-4.1.0&q=80&w=1080',
      region: 'Cà Mau',
      size: '40-50 con/kg',
      availableStock: 3000,
      suggestedPrice: 280000,
      quantity: 300,
      certifications: ['VietGAP', 'ASC'],
      rating: 4.8
    },
    {
      id: '3',
      productName: 'Cá Tra phi lê',
      supplierName: 'Công ty TNHH Thủy sản Mekong',
      supplierId: 'sup2',
      image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaXNoJTIwZnJlc2glMjBtYXJrZXR8ZW58MXx8fHwxNzcyNzExNTQ3fDA&ixlib=rb-4.1.0&q=80&w=1080',
      region: 'An Giang',
      size: '800-1000g/con',
      availableStock: 8000,
      suggestedPrice: 75000,
      quantity: 1000,
      certifications: ['GlobalG.A.P', 'BAP'],
      rating: 4.9
    },
    {
      id: '4',
      productName: 'Cá Basa nguyên con',
      supplierName: 'Công ty TNHH Thủy sản Mekong',
      supplierId: 'sup2',
      image: 'https://images.unsplash.com/photo-1544943910-4c1dc44aab44?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwzfHxmaXNoJTIwZmFybXxlbnwxfHx8fDE3NzI2MzU0NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      region: 'An Giang',
      size: '1-1.5kg/con',
      availableStock: 6000,
      suggestedPrice: 68000,
      quantity: 800,
      certifications: ['GlobalG.A.P', 'BAP'],
      rating: 4.9
    },
    {
      id: '5',
      productName: 'Cua biển tươi sống',
      supplierName: 'HTX Thủy sản Kiên Giang',
      supplierId: 'sup3',
      image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcmFiJTIwc2VhZm9vZCUyMGZyZXNofGVufDF8fHx8MTc3MjYzNTMzM3ww&ixlib=rb-4.1.0&q=80&w=1080',
      region: 'Kiên Giang',
      size: '300-500g/con',
      availableStock: 2000,
      suggestedPrice: 350000,
      quantity: 200,
      certifications: ['VietGAP'],
      rating: 4.7
    }
  ]);

  const [rfqForm, setRfqForm] = useState({
    deliveryDate: '',
    deliveryAddress: '',
    qualityRequirements: '',
    additionalNotes: ''
  });

  const [showRFQForm, setShowRFQForm] = useState(false);

  // Group items by supplier
  const groupedBySupplier = cartItems.reduce((acc, item) => {
    if (!acc[item.supplierId]) {
      acc[item.supplierId] = {
        supplier: {
          id: item.supplierId,
          name: item.supplierName,
          certifications: item.certifications,
          rating: item.rating,
          region: item.region
        },
        items: []
      };
    }
    acc[item.supplierId].items.push(item);
    return acc;
  }, {});

  const updateQuantity = (id, newQuantity) => {
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const totalProducts = cartItems.length;
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cartItems.reduce((sum, item) => sum + item.suggestedPrice * item.quantity, 0);
  const estimatedShipping = 500000;
  const total = subtotal + estimatedShipping;

  const handleSubmitRFQ = () => {
    alert('Yêu cầu báo giá đã được gửi! Nhà cung cấp sẽ liên hệ với bạn trong thời gian sớm nhất.');
    setShowRFQForm(false);
  };

  const handleProceedToPayment = () => {
    onNavigate('checkout');
  };

  // Mock recommended suppliers
  const recommendedSuppliers = [
    {
      id: 'rec1',
      name: 'Công ty CP Thủy sản Minh Phú',
      image: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw0fHxzaHJpbXAlMjBmYXJtfGVufDF8fHx8MTc3MjYzNTQxMXww&ixlib=rb-4.1.0&q=80&w=1080',
      availableStock: '10,000 kg tôm sú',
      rating: 5.0,
      certifications: ['GlobalG.A.P', 'ASC', 'BAP']
    },
    {
      id: 'rec2',
      name: 'HTX Thủy sản Sóc Trăng',
      image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHw1fHxzaHJpbXAlMjBmYXJtfGVufDF8fHx8MTc3MjYzNTQxMXww&ixlib=rb-4.1.0&q=80&w=1080',
      availableStock: '5,000 kg cá Tra',
      rating: 4.8,
      certifications: ['VietGAP', 'BAP']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="mb-2" style={{ color: '#0A2647' }}>Giỏ hàng doanh nghiệp</h1>
          <p className="text-gray-600">
            Quản lý các nguồn hải sản đã lựa chọn trước khi gửi yêu cầu mua hoặc tiến hành giao dịch.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="mb-2" style={{ color: '#0A2647' }}>Giỏ hàng trống</h3>
            <p className="text-gray-600 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <button
              onClick={() => onNavigate('suppliers')}
              className="px-6 py-3 rounded-md text-white"
              style={{ backgroundColor: '#00BCD4' }}
            >
              Khám phá nhà cung cấp
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Grouped by Supplier */}
              {Object.values(groupedBySupplier).map(({ supplier, items }) => (
                <div key={supplier.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Supplier Header */}
                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <User className="w-10 h-10 p-2 rounded-full bg-white" style={{ color: '#0A2647' }} />
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 style={{ color: '#0A2647' }}>{supplier.name}</h3>
                            <BadgeCheck className="w-5 h-5" style={{ color: '#00BCD4' }} />
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <div className="flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              <span>{supplier.region}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="w-4 h-4" fill="#FFD700" stroke="#FFD700" />
                              <span>{supplier.rating}</span>
                            </div>
                            <div className="flex gap-1">
                              {supplier.certifications.map((cert, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded text-xs text-white"
                                  style={{ backgroundColor: '#2C5F8D' }}
                                >
                                  {cert}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          className="px-4 py-2 border rounded-md hover:bg-gray-50 transition-colors text-sm"
                          style={{ borderColor: '#0A2647', color: '#0A2647' }}
                          onClick={() => onNavigate('farm-profile')}
                        >
                          Xem hồ sơ
                        </button>
                        <button
                          className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity text-sm flex items-center gap-2"
                          style={{ backgroundColor: '#00BCD4' }}
                        >
                          <MessageCircle className="w-4 h-4" />
                          Liên hệ
                        </button>
                        <button
                          className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity text-sm"
                          style={{ backgroundColor: '#2C5F8D' }}
                        >
                          Thương lượng giá
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Products Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b" style={{ borderColor: '#e5e7eb' }}>
                        <tr>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Hình ảnh</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Loại hải sản</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Khu vực nuôi</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Size</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Sản lượng khả dụng</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Giá đề xuất</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Số lượng đặt</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Thành tiền</th>
                          <th className="px-4 py-3 text-left text-sm text-gray-600">Thao tác</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                            <td className="px-4 py-4">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                  src={item.image}
                                  alt={item.productName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>
                            <td className="px-4 py-4">
                              <span className="font-medium" style={{ color: '#0A2647' }}>{item.productName}</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{item.region}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{item.size}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{item.availableStock.toLocaleString('vi-VN')} kg</td>
                            <td className="px-4 py-4 text-sm font-medium" style={{ color: '#d4183d' }}>
                              {item.suggestedPrice.toLocaleString('vi-VN')}đ/kg
                            </td>
                            <td className="px-4 py-4">
                              <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                                className="w-24 px-3 py-2 border rounded-md text-sm"
                                style={{ borderColor: '#e5e7eb' }}
                                min="1"
                                max={item.availableStock}
                              />
                              <span className="text-xs text-gray-500 block mt-1">kg</span>
                            </td>
                            <td className="px-4 py-4 font-medium" style={{ color: '#0A2647' }}>
                              {(item.suggestedPrice * item.quantity).toLocaleString('vi-VN')}đ
                            </td>
                            <td className="px-4 py-4">
                              <div className="flex gap-2">
                                <button
                                  className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                                  title="Lưu nhà cung cấp yêu thích"
                                >
                                  <Heart className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => removeItem(item.id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-md"
                                  title="Xóa khỏi giỏ hàng"
                                >
                                  <Trash2 className="w-5 h-5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}

              {/* Recommended Suppliers */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0A2647' }}>
                  <TrendingUp className="w-5 h-5" />
                  Nhà cung cấp được đề xuất
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recommendedSuppliers.map((rec) => (
                    <div
                      key={rec.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <div className="flex gap-4">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={rec.image}
                            alt={rec.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="mb-1 line-clamp-1" style={{ color: '#0A2647' }}>{rec.name}</h4>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="w-4 h-4" fill="#FFD700" stroke="#FFD700" />
                            <span className="text-sm">{rec.rating}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-2">
                            {rec.certifications.map((cert, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-xs text-white"
                                style={{ backgroundColor: '#2C5F8D' }}
                              >
                                {cert}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{rec.availableStock}</p>
                          <button
                            className="w-full py-2 rounded-md text-white text-sm hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#00BCD4' }}
                          >
                            Thêm vào giỏ hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Procurement Summary */}
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
                <h3 className="mb-4 flex items-center gap-2" style={{ color: '#0A2647' }}>
                  <Package className="w-5 h-5" />
                  Tóm tắt đơn hàng
                </h3>

                <div className="space-y-3 mb-4 pb-4 border-b" style={{ borderColor: '#e5e7eb' }}>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng số sản phẩm</span>
                    <span className="font-medium" style={{ color: '#0A2647' }}>{totalProducts}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tổng sản lượng</span>
                    <span className="font-medium" style={{ color: '#0A2647' }}>{totalQuantity.toLocaleString('vi-VN')} kg</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Giá trị tạm tính</span>
                    <span>{subtotal.toLocaleString('vi-VN')}đ</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Phí vận chuyển dự kiến</span>
                    <span>{estimatedShipping.toLocaleString('vi-VN')}đ</span>
                  </div>
                </div>

                <div className="flex justify-between mb-6">
                  <span className="font-medium" style={{ color: '#0A2647' }}>Tổng thanh toán dự kiến</span>
                  <span className="text-xl font-bold" style={{ color: '#d4183d' }}>
                    {total.toLocaleString('vi-VN')}đ
                  </span>
                </div>

                <button
                  onClick={() => setShowRFQForm(!showRFQForm)}
                  className="w-full py-3 border rounded-md hover:bg-gray-50 transition-colors mb-3"
                  style={{ borderColor: '#2C5F8D', color: '#2C5F8D' }}
                >
                  Gửi yêu cầu báo giá
                </button>

                <button
                  onClick={handleProceedToPayment}
                  className="w-full py-3 rounded-md text-white hover:opacity-90 transition-opacity"
                  style={{ backgroundColor: '#00BCD4' }}
                >
                  Tiến hành thanh toán
                </button>
              </div>

              {/* RFQ Form */}
              {showRFQForm && (
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="mb-4" style={{ color: '#0A2647' }}>Yêu cầu báo giá (RFQ)</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-2" style={{ color: '#0A2647' }}>
                        Ngày nhận hàng mong muốn
                      </label>
                      <input
                        type="date"
                        value={rfqForm.deliveryDate}
                        onChange={(e) => setRfqForm({ ...rfqForm, deliveryDate: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ color: '#0A2647' }}>
                        Địa điểm giao hàng
                      </label>
                      <input
                        type="text"
                        value={rfqForm.deliveryAddress}
                        onChange={(e) => setRfqForm({ ...rfqForm, deliveryAddress: e.target.value })}
                        placeholder="Nhập địa chỉ giao hàng"
                        className="w-full px-3 py-2 border rounded-md"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ color: '#0A2647' }}>
                        Yêu cầu chất lượng
                      </label>
                      <textarea
                        value={rfqForm.qualityRequirements}
                        onChange={(e) => setRfqForm({ ...rfqForm, qualityRequirements: e.target.value })}
                        placeholder="Mô tả yêu cầu về chất lượng sản phẩm"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md resize-none"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-2" style={{ color: '#0A2647' }}>
                        Ghi chú bổ sung
                      </label>
                      <textarea
                        value={rfqForm.additionalNotes}
                        onChange={(e) => setRfqForm({ ...rfqForm, additionalNotes: e.target.value })}
                        placeholder="Thông tin bổ sung khác"
                        rows={3}
                        className="w-full px-3 py-2 border rounded-md resize-none"
                        style={{ borderColor: '#e5e7eb' }}
                      />
                    </div>

                    <button
                      onClick={handleSubmitRFQ}
                      className="w-full py-3 rounded-md text-white hover:opacity-90 transition-opacity"
                      style={{ backgroundColor: '#2C5F8D' }}
                    >
                      Gửi yêu cầu báo giá
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}