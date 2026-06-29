import { Calendar, MapPin, Package } from 'lucide-react';

export function SupplyCard({
  species,
  image,
  hoverimage,
  size,
  harvestTime,
  quantity,
  location,
  farmerName,
  onClick
}) {
  return (

    <div 
      className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border cursor-pointer"
      style={{ borderColor: '#e5e7eb' }}
      onClick={onClick}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gray-100">
        <img 
          src={image} 
          alt={species}
          className="w-full h-full object-cover transition-opacity duration-500 group-hover:opacity-0"
        />
        <img 
          src={hoverimage || image} 
          alt={species}
          className="absolute inset-0 w-full h-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      </div>

      <div className="p-4">
        <h3 className="mb-3" style={{ color: '#0A2647' }}>{species}</h3>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Package className="w-4 h-4" style={{ color: '#00BCD4' }} />
            <span>Kích cỡ: {size}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" style={{ color: '#00BCD4' }} />
            <span>Thu hoạch: {harvestTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" style={{ color: '#00BCD4' }} />
            <span>{location}</span>
          </div>
        </div>

        <div className="pt-3 border-t" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">Sản lượng</span>
            <span className="font-bold" style={{ color: '#0A2647' }}>{quantity}</span>
          </div>
          <div className="text-sm text-gray-600">
            Người nuôi: <span className="font-medium">{farmerName}</span>
          </div>
        </div>
      </div>
    </div>
  );
}