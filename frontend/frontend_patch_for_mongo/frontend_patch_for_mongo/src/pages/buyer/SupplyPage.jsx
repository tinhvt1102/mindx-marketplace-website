import { useState, useMemo, useEffect } from 'react';
import { Filter } from 'lucide-react';
import { SupplyCard } from '../../components/SupplyCard';
import { suppliesApi } from '../../api/supplies';

const fallbackSupply = [
  { id: '1', species: 'Tôm sú', type: 'Tôm', image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', size: '20-25 con/kg', harvestTime: '15/03/2026', quantity: 5, location: 'Cà Mau', farmerName: 'Nguyễn Văn A' },
  { id: '2', species: 'Cá Tra', type: 'Cá', image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080', size: '0.8-1.2 kg/con', harvestTime: '20/03/2026', quantity: 10, location: 'An Giang', farmerName: 'Trần Thị B' },
];

const normalizeSupply = (item) => ({
  ...item,
  id: item.id || item._id || item.legacyId || item.supplyCode,
  species: item.species || item.seafoodType || item.name || 'Nguồn cung hải sản',
  type: item.category || item.seafoodType || item.species || 'Khác',
  image: item.image || item.images?.[0] || 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?q=80&w=1080',
  size: item.size || 'Đang cập nhật',
  harvestTime: item.harvestTime || item.harvestDate || 'Đang cập nhật',
  quantity: `${item.quantity || 0} ${item.unit || 'kg'}`,
  quantityNumber: Number(item.quantity || 0),
  location: item.location || item.province || item.origin || 'Đang cập nhật',
  farmerName: item.supplier?.name || item.supplierName || item.farmerName || 'Nhà cung cấp',
});

export function SupplyPage({ onNavigate }) {
  const [showFilters] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('Tất cả tỉnh thành');
  const [minQuantity, setMinQuantity] = useState('');
  const [supplyData, setSupplyData] = useState(fallbackSupply);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadSupplies = async () => {
      setLoading(true);
      try {
        const response = await suppliesApi.list({ limit: 100 });
        const data = (response.data || []).map(normalizeSupply);
        if (data.length > 0) setSupplyData(data);
      } catch (error) {
        console.warn('Không tải được supplies từ backend:', error.message);
      } finally {
        setLoading(false);
      }
    };

    loadSupplies();
  }, []);

  const filteredData = useMemo(() => {
    return supplyData.filter(item => {
      const matchType = selectedTypes.length === 0 || selectedTypes.some(type => String(item.type).toLowerCase().includes(type.toLowerCase()) || String(item.species).toLowerCase().includes(type.toLowerCase()));
      const matchLocation = selectedLocation === 'Tất cả tỉnh thành' || item.location === selectedLocation;
      const matchQuantity = minQuantity === '' || Number(item.quantityNumber || 0) >= parseFloat(minQuantity);
      return matchType && matchLocation && matchQuantity;
    });
  }, [supplyData, selectedTypes, selectedLocation, minQuantity]);

  const locations = useMemo(() => ['Tất cả tỉnh thành', ...new Set(supplyData.map(item => item.location).filter(Boolean))], [supplyData]);

  const handleTypeChange = (type) => {
    setSelectedTypes(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="mb-2" style={{ color: '#0A2647' }}>Sản lượng hải sản</h1>
          <p className="text-gray-600">Tìm nguồn hải sản chất lượng từ các hộ nuôi uy tín</p>
        </div>

        <div className="flex gap-6">
          <div className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-64 flex-shrink-0`}>
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-20">
              <h3 className="flex items-center gap-2 mb-4" style={{ color: '#0A2647' }}><Filter className="w-5 h-5" /> Bộ lọc</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm mb-2 font-medium">Loại hải sản</label>
                  <div className="space-y-2">
                    {['Tôm', 'Cá', 'Cua', 'Mực', 'Khác'].map((type) => (
                      <label key={type} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                        <input type="checkbox" checked={selectedTypes.includes(type)} onChange={() => handleTypeChange(type)} className="rounded text-[#00BCD4] focus:ring-[#00BCD4]" />
                        {type}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Địa điểm</label>
                  <select className="w-full p-2 border rounded-md text-sm" value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)}>
                    {locations.map(location => <option key={location} value={location}>{location}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-sm mb-2 font-medium">Sản lượng tối thiểu</label>
                  <input type="number" min="0" placeholder="Nhập số lượng" className="w-full p-2 border rounded-md text-sm" value={minQuantity} onChange={(e) => setMinQuantity(Number(e.target.value) < 0 ? 0 : e.target.value)} onKeyDown={(e) => { if (e.key === '-') e.preventDefault(); }} style={{ borderColor: '#e5e7eb' }} />
                </div>

                <button onClick={() => { setSelectedTypes([]); setSelectedLocation('Tất cả tỉnh thành'); setMinQuantity(''); }} className="w-full py-2 rounded-md text-sm border hover:bg-gray-50 transition-colors" style={{ color: '#0A2647', borderColor: '#0A2647' }}>
                  Xóa tất cả bộ lọc
                </button>
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-600">{loading ? 'Đang tải...' : <>Tìm thấy <span className="font-medium text-[#00BCD4]">{filteredData.length}</span> sản lượng</>}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.length > 0 ? filteredData.map((supply) => <SupplyCard key={supply.id} {...supply} onClick={() => onNavigate?.('supply')} />) : (
                <div className="col-span-full text-center py-20 bg-white rounded-lg border-2 border-dashed"><p className="text-gray-400">Không tìm thấy sản lượng phù hợp với bộ lọc.</p></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
