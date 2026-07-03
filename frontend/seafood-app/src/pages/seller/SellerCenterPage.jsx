import { useState } from 'react';
import { Upload, Save, Send, Package, Fish, AlertCircle, BarChart3, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

const emptySupplyForm = {
  seafoodType: '',
  category: '',
  size: '',
  quantity: '',
  unit: 'kg',
  harvestDate: '',
  proposedPrice: '',
  location: '',
  province: '',
  certifications: [],
  image: '',
  description: '',
};

const emptyProductForm = {
  name: '',
  category: '',
  seafoodType: '',
  price: '',
  originalPrice: '',
  stock: '',
  unit: 'kg',
  origin: '',
  size: '',
  harvestDate: '',
  image: '',
  description: '',
};

export function SellerCenterPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [supplyForm, setSupplyForm] = useState(emptySupplyForm);
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [loading, setLoading] = useState(false);

  const certificationOptions = ['VietGAP', 'ASC', 'GlobalG.A.P', 'BAP', 'MSC'];
  const seafoodTypes = ['Tôm sú', 'Tôm thẻ', 'Cá Tra', 'Cá Basa', 'Cua biển', 'Mực', 'Ghẹ'];
  const categoryOptions = ['Tôm', 'Cá', 'Cua/Ghẹ', 'Mực', 'Hải sản khác'];
  const unitOptions = ['kg', 'tấn', 'con', 'hộp', 'thùng'];

  const checkLogin = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Bạn cần đăng nhập trước khi đăng bài!');
      onNavigate?.('login');
      return false;
    }
    return true;
  };

  const handleCertificationChange = (cert) => {
    setSupplyForm((prev) => {
      const exists = prev.certifications.includes(cert);
      return {
        ...prev,
        certifications: exists
          ? prev.certifications.filter((item) => item !== cert)
          : [...prev.certifications, cert],
      };
    });
  };

  const createSupply = async (status = 'approved') => {
    if (!checkLogin()) return;

    if (!supplyForm.seafoodType || !supplyForm.size || !supplyForm.quantity || !supplyForm.harvestDate || !supplyForm.proposedPrice || !supplyForm.location) {
      toast.error('Vui lòng điền đầy đủ thông tin sản lượng bắt buộc!');
      return;
    }

    try {
      setLoading(true);

      await apiClient.post(ENDPOINTS.SUPPLIES.CREATE, {
        seafoodType: supplyForm.seafoodType,
        species: supplyForm.seafoodType,
        category: supplyForm.category || supplyForm.seafoodType,
        size: supplyForm.size,
        quantity: Number(supplyForm.quantity),
        unit: supplyForm.unit || 'kg',
        harvestDate: supplyForm.harvestDate,
        proposedPrice: Number(supplyForm.proposedPrice),
        price: Number(supplyForm.proposedPrice),
        priceText: `${Number(supplyForm.proposedPrice).toLocaleString('vi-VN')}đ/${supplyForm.unit || 'kg'}`,
        location: supplyForm.location,
        province: supplyForm.province || supplyForm.location,
        origin: supplyForm.province || supplyForm.location,
        description: supplyForm.description,
        image: supplyForm.image || 'https://i.postimg.cc/jqQJf57k/tom-hum-bong.png',
        images: supplyForm.image ? [supplyForm.image] : [],
        certifications: supplyForm.certifications,
        status,
      });

      toast.success(status === 'draft' ? 'Đã lưu nháp sản lượng lên MongoDB!' : 'Đã đăng sản lượng lên MongoDB!');
      setSupplyForm(emptySupplyForm);
      onNavigate?.('listing-management');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Không thể đăng sản lượng');
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (status = 'approved') => {
    if (!checkLogin()) return;

    if (!productForm.name || !productForm.category || !productForm.price || !productForm.stock) {
      toast.error('Vui lòng điền đầy đủ thông tin sản phẩm bắt buộc!');
      return;
    }

    try {
      setLoading(true);

      await apiClient.post(ENDPOINTS.PRODUCTS.CREATE, {
        name: productForm.name,
        category: productForm.category,
        seafoodType: productForm.seafoodType || productForm.name,
        description: productForm.description,
        image: productForm.image || 'https://i.postimg.cc/jqQJf57k/tom-hum-bong.png',
        images: productForm.image ? [productForm.image] : [],
        price: Number(productForm.price),
        originalPrice: Number(productForm.originalPrice || productForm.price),
        unit: productForm.unit || 'kg',
        stock: Number(productForm.stock),
        origin: productForm.origin,
        size: productForm.size,
        harvestDate: productForm.harvestDate,
        productType: 'retail',
        status,
      });

      toast.success(status === 'draft' ? '' : '');
      setProductForm(emptyProductForm);
      onNavigate?.('listing-management');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Không thể đăng sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: ' sản phẩm', value: '', icon: Package },
    { label: ' sản lượng', value: '', icon: Fish },
    { label: 'database', value: '', icon: BarChart3 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <Toaster position="top-right" />
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h1 className="text-3xl mb-2" style={{ color: '#0A2A4D', fontWeight: 700 }}>
            Trung tâm người bán
          </h1>
          <p className="text-gray-600">
            Đăng sản phẩm mua lẻ hoặc sản lượng B2B
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-2 mb-8 flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-md ${activeTab === 'overview' ? 'text-white' : 'text-gray-700'}`}
            style={{ backgroundColor: activeTab === 'overview' ? '#0A2A4D' : 'transparent' }}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setActiveTab('supply')}
            className={`px-6 py-3 rounded-md ${activeTab === 'supply' ? 'text-white' : 'text-gray-700'}`}
            style={{ backgroundColor: activeTab === 'supply' ? '#0A2A4D' : 'transparent' }}
          >
            Đăng sản lượng
          </button>
          <button
            onClick={() => setActiveTab('product')}
            className={`px-6 py-3 rounded-md ${activeTab === 'product' ? 'text-white' : 'text-gray-700'}`}
            style={{ backgroundColor: activeTab === 'product' ? '#0A2A4D' : 'transparent' }}
          >
            Đăng sản phẩm
          </button>
        </div>

        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              {stats.map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="bg-white rounded-lg shadow-sm p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#E0F7FA' }}>
                        <Icon size={24} style={{ color: '#00BCD4' }} />
                      </div>
                      <div>
                        <p className="text-gray-600 text-sm">{item.label}</p>
                        <p className="font-semibold" style={{ color: '#0A2A4D' }}>{item.value}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <div className="flex gap-3">
                <AlertCircle style={{ color: '#0A2A4D' }} />
                <div>
                  <h3 className="font-semibold mb-2" style={{ color: '#0A2A4D' }}></h3>
                  <p className="text-gray-700">
                     <b>Chờ admin duyệt</b>  <b></b>.
                   
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'supply' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl mb-6 flex items-center gap-2" style={{ color: '#0A2A4D', fontWeight: 700 }}>
              <Fish size={28} />
              Đăng sản lượng B2B
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Loại hải sản *</label>
                <select
                  value={supplyForm.seafoodType}
                  onChange={(e) => setSupplyForm({ ...supplyForm, seafoodType: e.target.value })}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Chọn loại hải sản</option>
                  {seafoodTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Danh mục</label>
                <select
                  value={supplyForm.category}
                  onChange={(e) => setSupplyForm({ ...supplyForm, category: e.target.value })}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Chọn danh mục</option>
                  {categoryOptions.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Kích cỡ *</label>
                <input
                  type="text"
                  value={supplyForm.size}
                  onChange={(e) => setSupplyForm({ ...supplyForm, size: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: 20-25 con/kg"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Số lượng *</label>
                <input
                  type="number"
                  value={supplyForm.quantity}
                  onChange={(e) => setSupplyForm({ ...supplyForm, quantity: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: 5"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Đơn vị</label>
                <select
                  value={supplyForm.unit}
                  onChange={(e) => setSupplyForm({ ...supplyForm, unit: e.target.value })}
                  className="w-full p-3 border rounded-md"
                >
                  {unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Ngày thu hoạch *</label>
                <input
                  type="date"
                  value={supplyForm.harvestDate}
                  onChange={(e) => setSupplyForm({ ...supplyForm, harvestDate: e.target.value })}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Giá đề xuất *</label>
                <input
                  type="number"
                  value={supplyForm.proposedPrice}
                  onChange={(e) => setSupplyForm({ ...supplyForm, proposedPrice: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: 420000"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Địa điểm *</label>
                <input
                  type="text"
                  value={supplyForm.location}
                  onChange={(e) => setSupplyForm({ ...supplyForm, location: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: Đầm Dơi, Cà Mau"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Tỉnh/Thành</label>
                <input
                  type="text"
                  value={supplyForm.province}
                  onChange={(e) => setSupplyForm({ ...supplyForm, province: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: Cà Mau"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Link hình ảnh</label>
                <input
                  type="text"
                  value={supplyForm.image}
                  onChange={(e) => setSupplyForm({ ...supplyForm, image: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium">Chứng nhận</label>
              <div className="flex flex-wrap gap-3">
                {certificationOptions.map((cert) => (
                  <label key={cert} className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer">
                    <input
                      type="checkbox"
                      checked={supplyForm.certifications.includes(cert)}
                      onChange={() => handleCertificationChange(cert)}
                    />
                    <span>{cert}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium">Mô tả</label>
              <textarea
                value={supplyForm.description}
                onChange={(e) => setSupplyForm({ ...supplyForm, description: e.target.value })}
                rows={4}
                className="w-full p-3 border rounded-md"
                placeholder="Mô tả chi tiết nguồn cung..."
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => createSupply('draft')}
                disabled={loading}
                className="px-6 py-3 border rounded-md flex items-center gap-2"
              >
                <Save size={20} />
                Lưu nháp
              </button>
              <button
                onClick={() => createSupply('approved')}
                disabled={loading}
                className="px-6 py-3 text-white rounded-md flex items-center gap-2"
                style={{ backgroundColor: '#00BCD4' }}
              >
                <Send size={20} />
                {loading ? 'Đang gửi...' : 'Đăng sản lượng'}
              </button>
            </div>
          </div>
        )}

        {activeTab === 'product' && (
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl mb-6 flex items-center gap-2" style={{ color: '#0A2A4D', fontWeight: 700 }}>
              <Package size={28} />
              Đăng sản phẩm mua lẻ
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block mb-2 font-medium">Tên sản phẩm *</label>
                <input
                  type="text"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: Tôm càng xanh tươi sống"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Danh mục *</label>
                <select
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                  className="w-full p-3 border rounded-md"
                >
                  <option value="">Chọn danh mục</option>
                  {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Loại hải sản</label>
                <input
                  type="text"
                  value={productForm.seafoodType}
                  onChange={(e) => setProductForm({ ...productForm, seafoodType: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: Tôm càng xanh"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Giá bán *</label>
                <input
                  type="number"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: 380000"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Giá gốc</label>
                <input
                  type="number"
                  value={productForm.originalPrice}
                  onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: 450000"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Tồn kho *</label>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: 80"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Đơn vị</label>
                <select
                  value={productForm.unit}
                  onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                  className="w-full p-3 border rounded-md"
                >
                  {unitOptions.map((unit) => <option key={unit} value={unit}>{unit}</option>)}
                </select>
              </div>

              <div>
                <label className="block mb-2 font-medium">Xuất xứ</label>
                <input
                  type="text"
                  value={productForm.origin}
                  onChange={(e) => setProductForm({ ...productForm, origin: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: Cà Mau"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Kích cỡ</label>
                <input
                  type="text"
                  value={productForm.size}
                  onChange={(e) => setProductForm({ ...productForm, size: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="VD: 10-15 con/kg"
                />
              </div>

              <div>
                <label className="block mb-2 font-medium">Ngày thu hoạch</label>
                <input
                  type="date"
                  value={productForm.harvestDate}
                  onChange={(e) => setProductForm({ ...productForm, harvestDate: e.target.value })}
                  className="w-full p-3 border rounded-md"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block mb-2 font-medium">Link hình ảnh</label>
                <input
                  type="text"
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="w-full p-3 border rounded-md"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div className="mt-6">
              <label className="block mb-2 font-medium">Mô tả</label>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                rows={4}
                className="w-full p-3 border rounded-md"
                placeholder="Mô tả chi tiết sản phẩm..."
              />
            </div>

            <div className="flex gap-4 mt-8">
              <button
                onClick={() => createProduct('draft')}
                disabled={loading}
                className="px-6 py-3 border rounded-md flex items-center gap-2"
              >
                <Save size={20} />
                Lưu nháp
              </button>
              <button
                onClick={() => createProduct('approved')}
                disabled={loading}
                className="px-6 py-3 text-white rounded-md flex items-center gap-2"
                style={{ backgroundColor: '#00BCD4' }}
              >
                <Send size={20} />
                {loading ? 'Đang gửi...' : 'Đăng sản phẩm'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
