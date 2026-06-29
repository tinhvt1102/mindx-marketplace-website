import { Star, MapPin, BadgeCheck, Phone, Mail } from 'lucide-react';
import { SupplyCard } from '../../components/SupplyCard';


export function FarmProfilePage({ farmId }) {
  const farms = [
  {
    id: '1',
    name: 'Hộ nuôi Hải Sản Phát Đạt',
    coverImage: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Huyện Thới Bình, Cà Mau',
    rating: 5,
    reviews: 128,
    verified: true,
    certifications: ['VietGAP', 'GlobalGAP', 'ISO 22000'],
    description: 'Hộ nuôi Hải Sản Phát Đạt là một trong những cơ sở nuôi tôm hàng đầu tại Cà Mau với hơn 15 năm kinh nghiệm. Cơ sở chuyên cung cấp tôm sú và tôm thẻ chất lượng cao.',
    phone: '0901 234 567',
    email: 'phatdat@seafood.vn',
    established: '2010',
    supplies: [
      {
        id: '1',
        species: 'Tôm sú size 20-25',
        image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '20-25 con/kg',
        harvestTime: '15/03/2026',
        quantity: '5 tấn',
        location: 'Cà Mau',
        farmerName: 'Hộ nuôi Phát Đạt'
      },
      {
        id: '2',
        species: 'Tôm thẻ size 60-70',
        image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '60-70 con/kg',
        harvestTime: '10/03/2026',
        quantity: '3 tấn',
        location: 'Cà Mau',
        farmerName: 'Hộ nuôi Phát Đạt'
      }
    ]
  },
  {
    id: '2',
    name: 'Hộ nuôi Thủy Sản Miền Tây',
    coverImage: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'An Giang',
    rating: 5,
    reviews: 95,
    verified: true,
    certifications: ['VietGAP', 'ASC'],
    description: 'Hộ nuôi Thủy Sản Miền Tây chuyên cung cấp cá tra và cá basa từ vùng nuôi An Giang. Sản phẩm phù hợp cho chế biến thực phẩm và xuất khẩu.',
    phone: '0902 345 678',
    email: 'mientay@seafood.vn',
    established: '2012',
    supplies: [
      {
        id: '3',
        species: 'Cá Tra',
        image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '0.8-1.2 kg/con',
        harvestTime: '20/03/2026',
        quantity: '10 tấn',
        location: 'An Giang',
        farmerName: 'Hộ nuôi Miền Tây'
      },
      {
        id: '4',
        species: 'Cá Basa',
        image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '1.0-1.5 kg/con',
        harvestTime: '22/03/2026',
        quantity: '15 tấn',
        location: 'An Giang',
        farmerName: 'Hộ nuôi Miền Tây'
      }
    ]
  },
  {
    id: '3',
    name: 'Hộ nuôi Hải Phong',
    coverImage: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Bạc Liêu',
    rating: 4,
    reviews: 67,
    verified: false,
    certifications: ['VietGAP'],
    description: 'Hộ nuôi Hải Phong là cơ sở nuôi tôm thẻ tại Bạc Liêu, tập trung vào nguồn hàng ổn định và chất lượng cho thị trường nội địa.',
    phone: '0903 456 789',
    email: 'haiphong@seafood.vn',
    established: '2015',
    supplies: [
      {
        id: '5',
        species: 'Tôm thẻ chân trắng',
        image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '60-70 con/kg',
        harvestTime: '10/03/2026',
        quantity: '3 tấn',
        location: 'Bạc Liêu',
        farmerName: 'Hộ nuôi Hải Phong'
      }
    ]
  },
  {
    id: '4',
    name: 'Hộ nuôi Hải Sản Vạn Phát',
    coverImage: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Sóc Trăng',
    rating: 5,
    reviews: 143,
    verified: true,
    certifications: ['VietGAP', 'GlobalGAP', 'ASC'],
    description: 'Hộ nuôi Hải Sản Vạn Phát chuyên cung cấp tôm sú tại Sóc Trăng với sản lượng lớn, phù hợp cho nhà hàng, đại lý và doanh nghiệp thu mua.',
    phone: '0904 567 890',
    email: 'vanphat@seafood.vn',
    established: '2009',
    supplies: [
      {
        id: '6',
        species: 'Tôm sú xuất khẩu',
        image: 'https://images.unsplash.com/photo-1759244566095-d6047dfde9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '15-20 con/kg',
        harvestTime: '18/03/2026',
        quantity: '8 tấn',
        location: 'Sóc Trăng',
        farmerName: 'Hộ nuôi Vạn Phát'
      }
    ]
  },
  {
    id: '5',
    name: 'Hộ nuôi Thủy Sản Đồng Bằng',
    coverImage: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Đồng Tháp',
    rating: 4,
    reviews: 82,
    verified: true,
    certifications: ['VietGAP'],
    description: 'Hộ nuôi Thủy Sản Đồng Bằng cung cấp cá tra và cá basa từ Đồng Tháp, có sản lượng ổn định theo tháng.',
    phone: '0905 678 901',
    email: 'dongbang@seafood.vn',
    established: '2014',
    supplies: [
      {
        id: '7',
        species: 'Cá Tra',
        image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '0.8-1.2 kg/con',
        harvestTime: '24/03/2026',
        quantity: '12 tấn',
        location: 'Đồng Tháp',
        farmerName: 'Hộ nuôi Đồng Bằng'
      },
      {
        id: '8',
        species: 'Cá Basa',
        image: 'https://images.unsplash.com/photo-1674066620888-4878aad91094?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '1.0-1.5 kg/con',
        harvestTime: '26/03/2026',
        quantity: '15 tấn',
        location: 'Đồng Tháp',
        farmerName: 'Hộ nuôi Đồng Bằng'
      }
    ]
  },
  {
    id: '6',
    name: 'Hộ nuôi Hải Sản Nam Bộ',
    coverImage: 'https://images.unsplash.com/photo-1645692396914-4ca9df38cce3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    avatar: 'https://images.unsplash.com/photo-1703756292793-287f082d3a45?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
    location: 'Kiên Giang',
    rating: 5,
    reviews: 76,
    verified: true,
    certifications: ['VietGAP', 'GlobalGAP'],
    description: 'Hộ nuôi Hải Sản Nam Bộ chuyên cung cấp cua và ghẹ tươi sống tại Kiên Giang, nguồn hàng phù hợp cho nhà hàng và chợ đầu mối.',
    phone: '0906 789 012',
    email: 'nambo@seafood.vn',
    established: '2011',
    supplies: [
      {
        id: '9',
        species: 'Cua biển',
        image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '300-400g/con',
        harvestTime: '12/03/2026',
        quantity: '2 tấn',
        location: 'Kiên Giang',
        farmerName: 'Hộ nuôi Nam Bộ'
      },
      {
        id: '10',
        species: 'Ghẹ xanh',
        image: 'https://images.unsplash.com/photo-1609834272245-8ca8337f81f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixlib=rb-4.1.0&q=80&w=1080',
        size: '4-6 con/kg',
        harvestTime: '16/03/2026',
        quantity: '3 tấn',
        location: 'Kiên Giang',
        farmerName: 'Hộ nuôi Nam Bộ'
      }
    ]
  }
];

const farm = farms.find((item) => item.id === farmId) || farms[0];

const supplies = farm.supplies;
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image */}
      <div className="relative h-64 md:h-80 bg-gray-200">
        <img 
          src={farm.coverImage} 
          alt={farm.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Farm Header */}
        <div className="relative -mt-20 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden flex-shrink-0 bg-gray-200 mx-auto md:mx-0">
                <img 
                  src={farm.avatar} 
                  alt={farm.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                  <h1 style={{ color: '#0A2647' }}>{farm.name}</h1>
                  {farm.verified && (
                    <BadgeCheck className="w-6 h-6" style={{ color: '#00BCD4' }} />
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4"
                        fill={i < farm.rating ? '#FFD700' : 'none'}
                        stroke={i < farm.rating ? '#FFD700' : '#D1D5DB'}
                      />
                    ))}
                    <span className="text-sm ml-1">{farm.rating} ({farm.reviews} đánh giá)</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    {farm.location}
                  </div>
                  <div className="text-sm text-gray-600">
                    Thành lập: {farm.established}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                  {farm.certifications.map((cert, index) => (
                    <span 
                      key={index}
                      className="px-3 py-1 rounded text-sm text-white"
                      style={{ backgroundColor: '#2C5F8D' }}
                    >
                      {cert}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
                  <button 
                    className="px-6 py-2 rounded-md text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                    style={{ backgroundColor: '#00BCD4' }}
                  >
                    <Phone className="w-4 h-4" />
                    Liên hệ ngay
                  </button>
                  <button 
                    className="px-6 py-2 border rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                    style={{ borderColor: '#0A2647', color: '#0A2647' }}
                  >
                    <Mail className="w-4 h-4" />
                    Gửi tin nhắn
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="mb-4" style={{ color: '#0A2647' }}>Giới thiệu</h2>
              <p className="text-gray-600 leading-relaxed">{farm.description}</p>
            </div>

            {/* Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="mb-6" style={{ color: '#0A2647' }}>Sản lượng hiện có</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {supplies.map((supply) => (
                  <SupplyCard key={supply.id} {...supply} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="mb-4" style={{ color: '#0A2647' }}>Thông tin liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">{farm.phone}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">{farm.email}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 mt-0.5" style={{ color: '#00BCD4' }} />
                  <span className="text-gray-600">{farm.location}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="mb-4" style={{ color: '#0A2647' }}>Thống kê</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sản phẩm</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>12</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Đơn hàng</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>247</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tỉ lệ phản hồi</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>98%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thời gian phản hồi</span>
                  <span className="font-medium" style={{ color: '#0A2647' }}>2 giờ</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
