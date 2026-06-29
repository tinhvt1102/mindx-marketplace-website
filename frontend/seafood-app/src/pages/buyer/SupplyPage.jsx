import { useState, useMemo } from 'react'; // Sử dụng useMemo để tối ưu hiệu năng lọc
import { Filter, SlidersHorizontal } from 'lucide-react';
import { SupplyCard } from '../../components/SupplyCard';

export function SupplyPage({ onNavigate }) {
  const [showFilters, setShowFilters] = useState(true);

  // --- 1. State quản lý bộ lọc ---
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Tất cả tỉnh thành');
  const [minQuantity, setMinQuantity] = useState('');

  const supplyData = [
    { id: '1', species: 'Tôm sú', type: 'Tôm', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', size: '20-25 con/kg', harvestTime: '15/03/2026', quantity: 5, location: 'Cà Mau', farmerName: 'Nguyễn Văn A' },
    { id: '2', species: 'Cá Tra', type: 'Cá', image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', size: '0.8-1.2 kg/con', harvestTime: '20/03/2026', quantity: 10, location: 'An Giang', farmerName: 'Trần Thị B' },
    { id: '3', species: 'Tôm thẻ chân trắng', type: 'Tôm', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', size: '60-70 con/kg', harvestTime: '10/03/2026', quantity: 3, location: 'Bạc Liêu', farmerName: 'Lê Văn C' },
    { id: '4', species: 'Cua biển', type: 'Cua', image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', size: '300-400g/con', harvestTime: '12/03/2026', quantity: 2, location: 'Kiên Giang', farmerName: 'Phạm Văn D' },
  ];

  // --- 2. Logic lọc dữ liệu ---
  const filteredData = useMemo(() => {
    return supplyData.filter(item => {
      // Lọc theo loại hải sản (Tôm, Cá, Cua...)
      const matchType = selectedTypes.length === 0 || selectedTypes.includes(item.type);

      // Lọc theo tỉnh thành
      const matchLocation = selectedLocation === 'Tất cả tỉnh thành' || item.location === selectedLocation;

      // Lọc theo sản lượng tối thiểu
      const matchQuantity = minQuantity === '' || item.quantity >= parseFloat(minQuantity);

      return matchType && matchLocation && matchQuantity;
    });
  }, [selectedTypes, selectedLocation, minQuantity]);

  // Hàm xử lý khi check/uncheck loại hải sản
  const handleTypeChange = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#0A2647' }}>Sản lượng hải sản</h1>
          <p className="text-gray-600">Tìm nguồn hải sản chất lượng từ các hộ nuôi uy tín</p>
        </div>

        <div className="flex gap-6">
          {/* Sidebar Filter */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="flex items-center gap-2 mb-4" style={{ color: '#0A2647' }}>
                <Filter className="w-5 h-5" /> Bộ lọc
              </h3>

              <div className="space-y-6">
                {/* Lọc theo loại */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Loại hải sản</label>
                  <div className="space-y-2">
                    {['Tôm', 'Cá', 'Cua', 'Mực', 'Khác'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTypes.includes(type)}
                          onChange={() => handleTypeChange(type)}
                          className="rounded text-[#00BCD4] focus:ring-[#00BCD4]"
                        />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Lọc theo địa điểm */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Địa điểm</label>
                  <select
                    className="w-full p-2 border rounded-md text-sm"
                    value={selectedLocation}
                    onChange={(e) => setSelectedLocation(e.target.value)}
                  >
                    <option>Tất cả tỉnh thành</option>
                    <option>Cà Mau</option>
                    <option>An Giang</option>
                    <option>Bạc Liêu</option>
                    <option>Kiên Giang</option>
                  </select>
                </div>

                {/* Lọc theo sản lượng */}
                <div>
                  <label className="block text-sm mb-2 font-medium">Sản lượng tối thiểu (tấn)</label>
                  <input
                    type="number"
                    // 1. Thêm thuộc tính min để chặn nút bấm tăng giảm xuống dưới 0
                    min="0"
                    placeholder="Nhập số tấn"
                    className="w-full p-2 border rounded-md text-sm"
                    value={minQuantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      // 2. Logic chặn: Nếu giá trị nhỏ hơn 0 thì đưa về 0 hoặc chuỗi rỗng
                      if (val < 0) {
                        setMinQuantity(0);
                      } else {
                        setMinQuantity(val);
                      }
                    }}
                    // 3. Chặn phím '-' trực tiếp từ bàn phím
                    onKeyDown={(e) => {
                      if (e.key === '-') {
                        e.preventDefault();
                      }
                    }}
                    style={{ borderColor: '#e5e7eb' }}
                  />
                </div>

                <button
                  onClick={() => { setSelectedTypes([]); setSelectedLocation('Tất cả tỉnh thành'); setMinQuantity(''); }}
                  className="w-full py-2 rounded-md text-sm border hover:bg-gray-50 transition-colors"
                  style={{ color: '#0A2647', borderColor: '#0A2647' }}
                >
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">
                Tìm thấy <span className="font-medium text-[#00BCD4]">{filteredData.length}</span> sản lượng
              </p>
              {/* Nút lọc cho mobile và Sort giữ nguyên */}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.length > 0 ? (
                filteredData.map((supply) => (
                  <SupplyCard key={supply.id} {...supply} />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-white rounded-lg border-2 border-dashed">
                  <p className="text-gray-400">Không tìm thấy sản lượng phù hợp với bộ lọc.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}