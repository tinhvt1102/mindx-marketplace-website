import { useState, useRef } from 'react';
import { Upload, Save, Send, Package, Fish, AlertCircle, BarChart3, X } from 'lucide-react';
// 1. Thêm import toast và Toaster
import toast, { Toaster } from 'react-hot-toast';

export function SellerCenterPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');

  // Supply form state
  const [supplyForm, setSupplyForm] = useState({
    seafoodType: '',
    size: '',
    quantity: '',
    harvestDate: '',
    proposedPrice: '',
    location: '',
    certifications: [],
    images: [],
    description: ''
  });

  // Product form state
  const [productForm, setProductForm] = useState({
    productName: '',
    category: '',
    price: '',
    stock: '',
    unit: 'kg',
    images: [],
    description: ''
  });

  // Refs cho các input tệp ẩn
  const supplyImageRef = useRef(null);
  const productImageRef = useRef(null);

  const certificationOptions = ['VietGAP', 'ASC', 'GlobalG.A.P', 'BAP', 'MSC'];
  const seafoodTypes = ['Tôm sú', 'Tôm thẻ', 'Cá Tra', 'Cá Basa', 'Cua biển', 'Mực', 'Ghẹ'];
  const categoryOptions = ['Tôm tươi sống', 'Cá tươi', 'Cá đông lạnh', 'Hải sản chế biến', 'Mực khô', 'Khô hải sản'];
  const unitOptions = ['kg', 'tấn', 'con', 'hộp', 'thùng'];

  // Mock statistics
  const stats = {
    totalListings: 15,
    pendingListings: 3,
    approvedListings: 10,
    rejectedListings: 2
  };

  const handleSaveDraft = (type) => {
    console.log(`Dữ liệu nháp ${type}:`, type === 'supply' ? supplyForm : productForm);
    // 2. Chuyển thành toast.success
    toast.success(`Đã lưu nháp ${type === 'supply' ? 'sản lượng' : 'sản phẩm'} thành công!`);
  };

  const handleSubmitForApproval = (type) => {
    const currentForm = type === 'supply' ? supplyForm : productForm;
    
    // Kiểm tra nhanh validation cơ bản - Chuyển thành toast.error
    if (type === 'supply' && (!supplyForm.seafoodType || !supplyForm.size || !supplyForm.quantity || !supplyForm.harvestDate || !supplyForm.proposedPrice || !supplyForm.location || !supplyForm.description)) {
      toast.error('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)');
      return;
    }
    if (type === 'product' && (!productForm.productName || !productForm.category || !productForm.price || !productForm.stock || !productForm.description)) {
      toast.error('Vui lòng điền đầy đủ các trường thông tin bắt buộc (*)');
      return;
    }

    console.log(`Dữ liệu gửi duyệt ${type}:`, currentForm);
    // 3. Chuyển thành toast.success hoặc thông báo dạng tùy biến
    toast.success(`Đã gửi xét duyệt thành công! Admin sẽ xem xét trong thời gian sớm nhất.`, {
      duration: 4000
    });
    onNavigate('listing-management');
  };

  const handleCertificationToggle = (cert) => {
    setSupplyForm(prev => ({
      ...prev,
      certifications: prev.certifications.includes(cert)
        ? prev.certifications.filter(c => c !== cert)
        : [...prev.certifications, cert]
    }));
  };

  // Trình xử lý tải file lên giả lập
  const handleFileChange = (e, type) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImages = filesArray.map(file => URL.createObjectURL(file));

      if (type === 'supply') {
        if (supplyForm.images.length >= 5) {
          toast.error('Tối đa chỉ được tải lên 5 ảnh sản lượng!');
          return;
        }
        setSupplyForm(prev => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 5)
        }));
      } else {
        if (productForm.images.length >= 8) {
          toast.error('Tối đa chỉ được tải lên 8 ảnh sản phẩm!');
          return;
        }
        setProductForm(prev => ({
          ...prev,
          images: [...prev.images, ...newImages].slice(0, 8)
        }));
      }
    }
  };

  const removeImage = (indexToRemove, type) => {
    if (type === 'supply') {
      setSupplyForm(prev => ({
        ...prev,
        images: prev.images.filter((_, idx) => idx !== indexToRemove)
      }));
    } else {
      setProductForm(prev => ({
        ...prev,
        images: prev.images.filter((_, idx) => idx !== indexToRemove)
      }));
    }
    toast.success('Đã xóa ảnh');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 4. Đặt thẻ Toaster ở đây để hiển thị thông báo lơ lửng trên màn hình */}
      <Toaster position="top-right" reverseOrder={false} />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: '#0A2647' }}>Seller Center</h1>
          <p className="text-gray-600">
            Quản lý và đăng bán sản lượng, sản phẩm hải sản của bạn
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-t-lg shadow-sm border-b" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex">
            <button
              onClick={() => setActiveTab('overview')}
              className="flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors border-b-2"
              style={{
                borderBottomColor: activeTab === 'overview' ? '#00BCD4' : 'transparent',
                color: activeTab === 'overview' ? '#00BCD4' : '#6B7280',
                backgroundColor: activeTab === 'overview' ? '#F0F9FF' : 'transparent'
              }}
            >
              <BarChart3 className="w-5 h-5" />
              <span className="font-medium">Tổng quan</span>
            </button>
            <button
              onClick={() => setActiveTab('supply')}
              className="flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors border-b-2"
              style={{
                borderBottomColor: activeTab === 'supply' ? '#00BCD4' : 'transparent',
                color: activeTab === 'supply' ? '#00BCD4' : '#6B7280',
                backgroundColor: activeTab === 'supply' ? '#F0F9FF' : 'transparent'
              }}
            >
              <Package className="w-5 h-5" />
              <span className="font-medium">Đăng bán sản lượng</span>
            </button>
            <button
              onClick={() => setActiveTab('product')}
              className="flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors border-b-2"
              style={{
                borderBottomColor: activeTab === 'product' ? '#00BCD4' : 'transparent',
                color: activeTab === 'product' ? '#00BCD4' : '#6B7280',
                backgroundColor: activeTab === 'product' ? '#F0F9FF' : 'transparent'
              }}
            >
              <Fish className="w-5 h-5" />
              <span className="font-medium">Đăng bán sản phẩm</span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm p-8">
          {activeTab === 'overview' ? (
            <div className="space-y-8">
              <h2 className="text-xl font-bold" style={{ color: '#0A2647' }}>Seller Overview</h2>

              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border" style={{ borderColor: '#E0F7FA' }}>
                  <p className="text-sm text-gray-600 mb-2">Tổng bài đăng</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: '#0A2647' }}>{stats.totalListings}</p>
                  <p className="text-xs text-gray-500">Tất cả bài đăng</p>
                </div>

                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg p-6 border" style={{ borderColor: '#FEF3C7' }}>
                  <p className="text-sm text-gray-600 mb-2">Chờ duyệt</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: '#D97706' }}>{stats.pendingListings}</p>
                  <p className="text-xs text-gray-500">Đang chờ admin xét duyệt</p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border" style={{ borderColor: '#D1FAE5' }}>
                  <p className="text-sm text-gray-600 mb-2">Đã duyệt</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: '#059669' }}>{stats.approvedListings}</p>
                  <p className="text-xs text-gray-500">Đang hiển thị công khai</p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-lg p-6 border" style={{ borderColor: '#FEE2E2' }}>
                  <p className="text-sm text-gray-600 mb-2">Từ chối</p>
                  <p className="text-3xl font-bold mb-2" style={{ color: '#DC2626' }}>{stats.rejectedListings}</p>
                  <p className="text-xs text-gray-500">Cần chỉnh sửa</p>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-bold mb-4" style={{ color: '#0A2647' }}>Hành động nhanh</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => setActiveTab('supply')}
                    className="p-6 border-2 border-dashed rounded-lg hover:bg-blue-50 transition-colors text-left"
                    style={{ borderColor: '#00BCD4' }}
                  >
                    <Package className="w-8 h-8 mb-3" style={{ color: '#00BCD4' }} />
                    <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Đăng sản lượng mới</h4>
                    <p className="text-sm text-gray-600">Đăng bán sản lượng hải sản từ ao nuôi</p>
                  </button>

                  <button
                    onClick={() => setActiveTab('product')}
                    className="p-6 border-2 border-dashed rounded-lg hover:bg-blue-50 transition-colors text-left"
                    style={{ borderColor: '#00BCD4' }}
                  >
                    <Fish className="w-8 h-8 mb-3" style={{ color: '#00BCD4' }} />
                    <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Đăng sản phẩm mới</h4>
                    <p className="text-sm text-gray-600">Đăng bán sản phẩm hải sản đã chế biến</p>
                  </button>

                  <button
                    onClick={() => onNavigate('listing-management')}
                    className="p-6 border-2 border-dashed rounded-lg hover:bg-blue-50 transition-colors text-left"
                    style={{ borderColor: '#00BCD4' }}
                  >
                    <BarChart3 className="w-8 h-8 mb-3" style={{ color: '#00BCD4' }} />
                    <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Quản lý bài đăng</h4>
                    <p className="text-sm text-gray-600">Xem và quản lý tất cả bài đăng</p>
                  </button>
                </div>
              </div>

              {/* Information Notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <div className="flex gap-4">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" style={{ color: '#00BCD4' }} />
                  <div>
                    <h4 className="font-semibold mb-2" style={{ color: '#0A2647' }}>Lưu ý quan trọng</h4>
                    <ul className="text-sm text-gray-700 space-y-2">
                      <li>• Tất cả bài đăng phải được Admin phê duyệt trước khi hiển thị công khai</li>
                      <li>• Bài đăng được phê duyệt sẽ xuất hiện trên Trang chủ, Marketplace và Kết quả tìm kiếm</li>
                      <li>• Hãy cung cấp đầy đủ thông tin và hình ảnh chất lượng để tăng tỷ lệ phê duyệt</li>
                      <li>• Nếu bài đăng bị từ chối, bạn có thể chỉnh sửa và gửi lại để xét duyệt</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : activeTab === 'supply' ? (
            // Supply Form
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#0A2647' }}>Đăng bán sản lượng</h2>
                <p className="text-gray-600 mt-2">Đăng thông tin sản lượng hải sản từ ao nuôi của bạn</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Loại hải sản <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={supplyForm.seafoodType}
                      onChange={(e) => setSupplyForm({ ...supplyForm, seafoodType: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <option value="">Chọn loại hải sản</option>
                      {seafoodTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Size <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={supplyForm.size}
                      onChange={(e) => setSupplyForm({ ...supplyForm, size: e.target.value })}
                      placeholder="VD: 20-25 con/kg"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Sản lượng (kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={supplyForm.quantity}
                      onChange={(e) => setSupplyForm({ ...supplyForm, quantity: e.target.value })}
                      placeholder="Nhập sản lượng"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Ngày thu hoạch <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={supplyForm.harvestDate}
                      onChange={(e) => setSupplyForm({ ...supplyForm, harvestDate: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Giá đề xuất (VNĐ/kg) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={supplyForm.proposedPrice}
                      onChange={(e) => setSupplyForm({ ...supplyForm, proposedPrice: e.target.value })}
                      placeholder="Nhập giá đề xuất"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Địa điểm nuôi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={supplyForm.location}
                      onChange={(e) => setSupplyForm({ ...supplyForm, location: e.target.value })}
                      placeholder="VD: Cà Mau"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                    Chứng nhận
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {certificationOptions.map(cert => (
                      <label
                        key={cert}
                        className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-gray-50 transition-colors"
                        style={{
                          borderColor: supplyForm.certifications.includes(cert) ? '#00BCD4' : '#e5e7eb',
                          backgroundColor: supplyForm.certifications.includes(cert) ? '#E0F7FA' : 'white'
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={supplyForm.certifications.includes(cert)}
                          onChange={() => handleCertificationToggle(cert)}
                          className="w-4 h-4 hidden"
                        />
                        <span className="text-sm font-medium">{cert}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                    Hình ảnh <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    ref={supplyImageRef} 
                    className="hidden" 
                    onChange={(e) => handleFileChange(e, 'supply')}
                  />
                  <div 
                    onClick={() => supplyImageRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors mb-4" 
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-1">Nhấp để tải lên hoặc kéo thả</p>
                    <p className="text-sm text-gray-400">PNG, JPG tối đa 10MB (Tối đa 5 ảnh)</p>
                  </div>

                  {supplyForm.images.length > 0 && (
                    <div className="grid grid-cols-5 gap-4">
                      {supplyForm.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx, 'supply')}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={supplyForm.description}
                    onChange={(e) => setSupplyForm({ ...supplyForm, description: e.target.value })}
                    placeholder="Mô tả chi tiết về sản lượng hải sản của bạn"
                    rows={5}
                    className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Bài đăng của bạn sẽ được gửi đến Admin để xét duyệt.
                    Sau khi được phê duyệt, sản lượng sẽ hiển thị công khai trên trang "Tìm nguồn hải sản".
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleSaveDraft('supply')}
                    className="flex-1 px-6 py-3 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    style={{ borderColor: '#0A2647', color: '#0A2647' }}
                  >
                    <Save className="w-5 h-5" />
                    Lưu nháp
                  </button>
                  <button
                    onClick={() => handleSubmitForApproval('supply')}
                    className="flex-1 px-6 py-3 rounded-md text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#00BCD4' }}
                  >
                    <Send className="w-5 h-5" />
                    Gửi xét duyệt
                  </button>
                </div>
              </div>
            </div>
          ) : (
            // Product Form
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-2xl font-bold" style={{ color: '#0A2647' }}>Đăng bán sản phẩm</h2>
                <p className="text-gray-600 mt-2">Đăng bán sản phẩm hải sản để bán lẻ</p>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Tên sản phẩm <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={productForm.productName}
                      onChange={(e) => setProductForm({ ...productForm, productName: e.target.value })}
                      placeholder="VD: Tôm sú tươi size 20-25"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Danh mục <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={productForm.category}
                      onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      <option value="">Chọn danh mục</option>
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Giá bán (VNĐ) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                      placeholder="Nhập giá bán"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Tồn kho <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={productForm.stock}
                      onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                      placeholder="Số lượng"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                  </div>

                  <div>
                    <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                      Đơn vị tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={productForm.unit}
                      onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                      style={{ borderColor: '#e5e7eb' }}
                    >
                      {unitOptions.map(unit => (
                        <option key={unit} value={unit}>{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    ref={productImageRef} 
                    className="hidden" 
                    onChange={(e) => handleFileChange(e, 'product')}
                  />
                  <div 
                    onClick={() => productImageRef.current?.click()}
                    className="border-2 border-dashed rounded-lg p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors mb-4" 
                    style={{ borderColor: '#e5e7eb' }}
                  >
                    <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <p className="text-gray-600 mb-1">Nhấp để tải lên hoặc kéo thả</p>
                    <p className="text-sm text-gray-400">PNG, JPG tối đa 10MB (Tối đa 8 ảnh)</p>
                  </div>

                  {productForm.images.length > 0 && (
                    <div className="grid grid-cols-4 gap-4">
                      {productForm.images.map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden border">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => removeImage(idx, 'product')}
                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-medium mb-2" style={{ color: '#0A2647' }}>
                    Mô tả sản phẩm <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Mô tả chi tiết về sản phẩm hải sản của bạn"
                    rows={5}
                    className="w-full px-4 py-2 border rounded-md resize-none focus:outline-none focus:ring-1 focus:ring-[#00BCD4]"
                    style={{ borderColor: '#e5e7eb' }}
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Lưu ý:</strong> Sản phẩm của bạn sẽ được gửi đến Admin để xét duyệt.
                    Sau khi được phê duyệt, sản phẩm sẽ hiển thị trên trang "Mua lẻ", "Trang chủ" và có thể được tìm kiếm.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => handleSaveDraft('product')}
                    className="flex-1 px-6 py-3 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    style={{ borderColor: '#0A2647', color: '#0A2647' }}
                  >
                    <Save className="w-5 h-5" />
                    Lưu nháp
                  </button>
                  <button
                    onClick={() => handleSubmitForApproval('product')}
                    className="flex-1 px-6 py-3 rounded-md text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#00BCD4' }}
                  >
                    <Send className="w-5 h-5" />
                    Gửi xét duyệt
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}