import { Star, MapPin, BadgeCheck, MessageCircle } from 'lucide-react';


export function SupplierCard({
  name,
  image,
  location,
  rating,
  reviews,
  certifications,
  availableSupply,
  verified = false,
  onClick
}) {
  return (
    <div 
      className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border cursor-pointer"
      style={{ borderColor: '#e5e7eb' }}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
            <img 
              src={image} 
              alt={name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="truncate" style={{ color: '#0A2647' }}>{name}</h3>
              {verified && (
                <BadgeCheck className="w-5 h-5 flex-shrink-0" style={{ color: '#00BCD4' }} />
              )}
            </div>
            <div className="flex items-center gap-1 mb-2">
              <MapPin className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{location}</span>
            </div>
            <div className="flex items-center gap-1 mb-3">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="w-4 h-4"
                  fill={i < rating ? '#FFD700' : 'none'}
                  stroke={i < rating ? '#FFD700' : '#D1D5DB'}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">({reviews})</span>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex flex-wrap gap-2 mb-3">
            {certifications.map((cert, index) => (
              <span 
                key={index}
                className="px-2 py-1 rounded text-xs text-white"
                style={{ backgroundColor: '#2C5F8D' }}
              >
                {cert}
              </span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs text-gray-500">Sản lượng khả dụng</span>
              <p className="text-sm mt-1" style={{ color: '#0A2647' }}>{availableSupply}</p>
            </div>
            <button 
              className="px-4 py-2 rounded-md text-white hover:opacity-90 transition-opacity flex items-center gap-2"
              style={{ backgroundColor: '#00BCD4' }}
              onClick={(e) => {
                e.stopPropagation();
                // Contact logic
              }}
            >
              <MessageCircle className="w-4 h-4" />
              Liên hệ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
