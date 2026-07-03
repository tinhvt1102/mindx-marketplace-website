import { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { SupplierCard } from '../../components/SupplierCard';
import { suppliersApi } from '../../api/suppliers';

const fallbackSuppliers = [
  {
    id: '1',
    name: 'Hộ nuôi Hải Sản Phát Đạt',
    image: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    location: 'Cà Mau',
    rating: 5,
    reviews: 128,
    certifications: ['VietGAP', 'GlobalGAP'],
    availableSupply: 'Tôm sú, Tôm thẻ - 20 tấn/tháng',
    verified: true,
    type: 'Hộ nuôi cá nhân',
  },
];

const normalizeSupplier = (supplier) => ({
  ...supplier,
  id: supplier.id || supplier._id || supplier.legacyId,
  name: supplier.name || supplier.farmName || supplier.ownerName || 'Nhà cung cấp',
  image: supplier.image || supplier.avatar || supplier.coverImage || 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?q=80&w=1080',
  location: supplier.location || supplier.province || supplier.region || 'Đang cập nhật',
  rating: Math.round(supplier.rating || 5),
  reviews: supplier.reviews || supplier.totalReviews || 0,
  certifications: supplier.certifications || [],
  availableSupply: supplier.availableSupply || supplier.availableSupplyText || 'Đang cập nhật sản lượng',
  verified: supplier.verified ?? supplier.isVerified ?? false,
  type: supplier.supplierType || supplier.type || 'Hộ nuôi cá nhân',
});

export function SuppliersPage({ onNavigate }) {
  const [showFilters] = useState(true);
  const [selectedSupplierTypes, setSelectedSupplierTypes] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Tất cả tỉnh thành');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [suppliers, setSuppliers] = useState(fallbackSuppliers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSuppliers = async () => {
      setLoading(true);
      try {
        const response = await suppliersApi.list();
        const data = (response.data || []).map(normalizeSupplier);
        if (data.length > 0) setSuppliers(data);
      } catch (error) {
        console.warn('Không tải được suppliers từ backend:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSuppliers();
  }, []);

  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchType = selectedSupplierTypes.length === 0 || selectedSupplierTypes.includes(s.type);
      const matchCert = selectedCerts.length === 0 || selectedCerts.some(c => s.certifications.includes(c));
      const matchLocation = selectedLocation === 'Tất cả tỉnh thành' || s.location === selectedLocation;
      const matchVerified = !onlyVerified || s.verified === true;
      return matchType && matchCert && matchLocation && matchVerified;
    });
  }, [suppliers, selectedSupplierTypes, selectedCerts, selectedLocation, onlyVerified]);

  const locations = useMemo(() => ['Tất cả tỉnh thành', ...new Set(suppliers.map(s => s.location).filter(Boolean))], [suppliers]);

  const toggleFilter = (list, setList, item) => {
    setList(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#0A2647' }}>Tìm nguồn hải sản</h1>
          <p className="text-gray-600">Kết nối với các hộ nuôi và doanh nghiệp cung cấp hải sản uy tín</p>
        </div>

        <div className="flex gap-6">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="flex items-center gap-2 mb-4" style={{ color: '#0A2647' }}><Filter className="w-5 h-5" /> Bộ lọc</h3>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 font-medium">Loại nhà cung cấp</label>
                  <div className="space-y-2">
                    {['Hộ nuôi cá nhân', 'company', 'cooperative', 'farm'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded text-[#00BCD4]" checked={selectedSupplierTypes.includes(type)} onChange={() => toggleFilter(selectedSupplierTypes, setSelectedSupplierTypes, type)} />
                        {type === 'company' ? 'Doanh nghiệp' : type === 'cooperative' ? 'Hợp tác xã' : type === 'farm' ? 'Trang trại' : type}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Chứng nhận</label>
                  <div className="space-y-2">
                    {['VietGAP', 'GlobalGAP', 'ASC', 'BAP'].map((cert) => (
                      <label key={cert} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" className="rounded text-[#00BCD4]" checked={selectedCerts.includes(cert)} onChange={() => toggleFilter(selectedCerts, setSelectedCerts, cert)} />
                        {cert}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Địa điểm</label>
                  <select className="w-full p-2 border rounded-md text-sm focus:ring-[#00BCD4]" style={{ borderColor: '#e5e7eb' }} value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                    {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer font-medium">
                    <input type="checkbox" className="rounded text-[#00BCD4]" checked={onlyVerified} onChange={(e) => setOnlyVerified(e.target.checked)} />
                    Chỉ hiện đã xác thực
                  </label>
                </div>

                <button onClick={() => { setSelectedSupplierTypes([]); setSelectedCerts([]); setSelectedLocation('Tất cả tỉnh thành'); setOnlyVerified(false); }} className="w-full py-2 rounded-md text-sm border hover:bg-gray-50 transition-colors" style={{ color: '#0A2647', borderColor: '#0A2647' }}>
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">{loading ? 'Đang tải...' : <>Tìm thấy <span className="font-medium text-[#00BCD4]">{filteredSuppliers.length}</span> nhà cung cấp</>}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSuppliers.length > 0 ? filteredSuppliers.map((supplier) => (
                <SupplierCard key={supplier.id} {...supplier} onClick={() => onNavigate('farm-profile', supplier.id)} />
              )) : (
                <div className="col-span-full py-20 text-center bg-white rounded-lg border-2 border-dashed border-gray-200"><p className="text-gray-400">Không tìm thấy nhà cung cấp nào phù hợp.</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
