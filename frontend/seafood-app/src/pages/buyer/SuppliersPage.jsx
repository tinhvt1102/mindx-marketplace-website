import { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { SupplierCard } from '../../components/SupplierCard';

export function SuppliersPage({ onNavigate }) {
  const [showFilters, setShowFilters] = useState(true);

  // --- 1. State quản lý bộ lọc ---
  const [selectedSupplierTypes, setSelectedSupplierTypes] = useState([]);
  const [selectedCerts, setSelectedCerts] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Tất cả tỉnh thành');
  const [onlyVerified, setOnlyVerified] = useState(false);

  const suppliers = [
    {
      id: '1',
      name: 'Hộ nuôi Hải Sản Phát Đạt',
      image: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZhcm0lMjBwb25kfGVufDF8fHx8MTc3MjcxMTU0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      location: 'Cà Mau',
      rating: 5,
      reviews: 128,
      certifications: ['VietGAP', 'GlobalGAP'],
      availableSupply: 'Tôm sú, Tôm thẻ - 20 tấn/tháng',
      verified: true
    },
    {
      id: '2',
      name: 'Hộ nuôi Thủy Sản Miền Tây',
      image: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBmYXJtaW5nJTIwYXNpYXxlbnwxfHx8fDE3NzI3MTE1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      location: 'An Giang',
      rating: 5,
      reviews: 95,
      certifications: ['VietGAP', 'ASC'],
      availableSupply: 'Cá Tra, Cá Basa - 50 tấn/tháng',
      verified: true
    },
    {
      id: '3',
      name: 'Hộ nuôi Hải Phong',
      image: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZhcm0lMjBwb25kfGVufDF8fHx8MTc3MjcxMTU0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      location: 'Bạc Liêu',
      rating: 4,
      reviews: 67,
      certifications: ['VietGAP'],
      availableSupply: 'Tôm thẻ - 15 tấn/tháng',
      verified: false
    },
    {
      id: '4',
      name: 'Hộ nuôi Hải Sản Vạn Phát',
      image: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBmYXJtaW5nJTIwYXNpYXxlbnwxfHx8fDE3NzI3MTE1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      location: 'Sóc Trăng',
      rating: 5,
      reviews: 143,
      certifications: ['VietGAP', 'GlobalGAP', 'ASC'],
      availableSupply: 'Tôm sú - 30 tấn/tháng',
      verified: true
    },
    {
      id: '5',
      name: 'Hộ nuôi Thủy Sản Đồng Bằng',
      image: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcXVhY3VsdHVyZSUyMGZhcm0lMjBwb25kfGVufDF8fHx8MTc3MjcxMTU0Nnww&ixlib=rb-4.1.0&q=80&w=1080',
      location: 'Đồng Tháp',
      rating: 4,
      reviews: 82,
      certifications: ['VietGAP'],
      availableSupply: 'Cá Tra, Cá Basa - 40 tấn/tháng',
      verified: true
    },
    {
      id: '6',
      name: 'Hộ nuôi Hải Sản Nam Bộ',
      image: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzaHJpbXAlMjBmYXJtaW5nJTIwYXNpYXxlbnwxfHx8fDE3NzI3MTE1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080',
      location: 'Kiên Giang',
      rating: 5,
      reviews: 76,
      certifications: ['VietGAP', 'GlobalGAP'],
      availableSupply: 'Cua, Ghẹ - 10 tấn/tháng',
      verified: true
    }
  ];

  // --- 2. Logic lọc dữ liệu ---
  const filteredSuppliers = useMemo(() => {
    return suppliers.filter(s => {
      const matchType = selectedSupplierTypes.length === 0 || selectedSupplierTypes.includes(s.type);
      const matchCert = selectedCerts.length === 0 || selectedCerts.some(c => s.certifications.includes(c));
      const matchLocation = selectedLocation === 'Tất cả tỉnh thành' || s.location === selectedLocation;
      const matchVerified = !onlyVerified || s.verified === true;

      return matchType && matchCert && matchLocation && matchVerified;
    });
  }, [selectedSupplierTypes, selectedCerts, selectedLocation, onlyVerified]);

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
          {/* Sidebar Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="flex items-center gap-2 mb-4" style={{ color: '#0A2647' }}>
                <Filter className="w-5 h-5" /> Bộ lọc
              </h3>

              <div className="space-y-6">
                {/* Loại nhà cung cấp */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Loại nhà cung cấp</label>
                  <div className="space-y-2">
                    {['Hộ nuôi cá nhân', 'Doanh nghiệp', 'Hợp tác xã'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-[#00BCD4]" 
                          checked={selectedSupplierTypes.includes(type)}
                          onChange={() => toggleFilter(selectedSupplierTypes, setSelectedSupplierTypes, type)}
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Chứng nhận */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Chứng nhận</label>
                  <div className="space-y-2">
                    {['VietGAP', 'GlobalGAP', 'ASC', 'BAP'].map((cert) => (
                      <label key={cert} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="rounded text-[#00BCD4]"
                          checked={selectedCerts.includes(cert)}
                          onChange={() => toggleFilter(selectedCerts, setSelectedCerts, cert)}
                        />
                        {cert}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Địa điểm */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Địa điểm</label>
                  <select 
                    className="w-full p-2 border rounded-md text-sm focus:ring-[#00BCD4]" 
                    style={{ borderColor: '#e5e7eb' }}
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option>Tất cả tỉnh thành</option>
                    {['Cà Mau', 'Bạc Liêu', 'Sóc Trăng', 'An Giang', 'Đồng Tháp', 'Kiên Giang'].map(loc => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Xác thực */}
                <div>
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer font-medium">
                    <input 
                      type="checkbox" 
                      className="rounded text-[#00BCD4]" 
                      checked={onlyVerified}
                      onChange={(e) => setOnlyVerified(e.target.checked)}
                    />
                    Chỉ hiện đã xác thực
                  </label>
                </div>

                <button 
                  onClick={() => {
                    setSelectedSupplierTypes([]);
                    setSelectedCerts([]);
                    setSelectedLocation('Tất cả tỉnh thành');
                    setOnlyVerified(false);
                  }}
                  className="w-full py-2 rounded-md text-sm border hover:bg-gray-50 transition-colors"
                  style={{ color: '#0A2647', borderColor: '#0A2647' }}
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-medium text-[#00BCD4]">{filteredSuppliers.length}</span> nhà cung cấp
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSuppliers.length > 0 ? (
                filteredSuppliers.map((supplier) => (
                  <SupplierCard 
                    key={supplier.id} 
                    {...supplier} 
                    onClick={() => onNavigate('farm-profile', supplier.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-20 text-center bg-white rounded-lg border-2 border-dashed border-gray-200">
                  <p className="text-gray-400">Không tìm thấy nhà cung cấp nào phù hợp.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}