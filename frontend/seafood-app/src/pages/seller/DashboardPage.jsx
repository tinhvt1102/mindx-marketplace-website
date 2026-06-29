import { useState } from 'react';
import { Package, MessageSquare, FileText, History, Bell, TrendingUp, DollarSign } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');

  const salesData = [
    { month: 'T1', sales: 120 },
    { month: 'T2', sales: 150 },
    { month: 'T3', sales: 180 },
    { month: 'T4', sales: 160 },
    { month: 'T5', sales: 200 },
    { month: 'T6', sales: 220 },
  ];

  const ordersData = [
    { month: 'T1', sales: 120 },
    { month: 'T2', sales: 150 },
    { month: 'T3', sales: 180 },
    { month: 'T4', sales: 160 },
    { month: 'T5', sales: 200 },
    { month: 'T6', sales: 220 },
  ];

  const orders = [
    {
      id: 'DH001',
      date: '05/03/2026',
      products: 'Tôm sú size 20-25',
      quantity: '5 kg',
      total: '2.250.000đ',
      status: 'Đã giao'
    },
    {
      id: 'DH002',
      date: '04/03/2026',
      products: 'Cá Tra phi lê',
      quantity: '10 kg',
      total: '850.000đ',
      status: 'Đang giao'
    },
    {
      id: 'DH003',
      date: '03/03/2026',
      products: 'Cua biển',
      quantity: '3 kg',
      total: '960.000đ',
      status: 'Đã giao'
    }
  ];

  const negotiations = [
    {
      id: 'TL001',
      supplier: 'Hộ nuôi Phát Đạt',
      product: 'Tôm sú size 15-20',
      quantity: '20 tấn',
      status: 'Đang thương lượng'
    },
    {
      id: 'TL002',
      supplier: 'Hộ nuôi Miền Tây',
      product: 'Cá Tra',
      quantity: '50 tấn',
      status: 'Chờ báo giá'
    }
  ];

  const contracts = [
    {
      id: 'HD001',
      supplier: 'Hộ nuôi Phát Đạt',
      product: 'Tôm sú',
      startDate: '01/03/2026',
      endDate: '01/06/2026',
      status: 'Đang hiệu lực'
    }
  ];

  const tabs = [
    { id: 'orders', label: 'Đơn đã đặt', icon: Package },
    { id: 'negotiations', label: 'Đơn đang thương lượng', icon: MessageSquare },
    { id: 'contracts', label: 'Hợp đồng', icon: FileText },
    { id: 'history', label: 'Lịch sử giao dịch', icon: History },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="mb-8" style={{ color: '#0A2647' }}>Dashboard Quản lý</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Tổng đơn hàng</span>
              <Package className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>127</p>
            <p className="text-xs text-green-600 mt-1">+12% so với tháng trước</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Doanh thu</span>
              <DollarSign className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>245M</p>
            <p className="text-xs text-green-600 mt-1">+18% so với tháng trước</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Đang thương lượng</span>
              <MessageSquare className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>8</p>
            <p className="text-xs text-gray-500 mt-1">Cần phản hồi</p>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Hợp đồng</span>
              <FileText className="w-5 h-5" style={{ color: '#00BCD4' }} />
            </div>
            <p className="text-2xl font-bold" style={{ color: '#0A2647' }}>12</p>
            <p className="text-xs text-gray-500 mt-1">Đang hiệu lực</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="mb-4" style={{ color: '#0A2647' }}>Doanh thu theo tháng</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="sales" stroke="#00BCD4" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="mb-4" style={{ color: '#0A2647' }}>Đơn hàng theo tháng</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={ordersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#0A2647" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="border-b overflow-x-auto" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex min-w-max">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-6 py-4 flex items-center gap-2 whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-b-2'
                        : 'text-gray-500'
                    }`}
                    style={{
                      borderColor: activeTab === tab.id ? '#00BCD4' : 'transparent',
                      color: activeTab === tab.id ? '#0A2647' : undefined
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'orders' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Mã đơn</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Ngày</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Sản phẩm</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Số lượng</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Tổng tiền</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order.id} className="border-b" style={{ borderColor: '#e5e7eb' }}>
                        <td className="py-3 px-4 text-sm">{order.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{order.date}</td>
                        <td className="py-3 px-4 text-sm">{order.products}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{order.quantity}</td>
                        <td className="py-3 px-4 text-sm" style={{ color: '#d4183d' }}>{order.total}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className={`px-2 py-1 rounded text-xs ${
                            order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'negotiations' && (
              <div className="space-y-4">
                {negotiations.map((negotiation) => (
                  <div key={negotiation.id} className="border rounded-lg p-4" style={{ borderColor: '#e5e7eb' }}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="mb-1" style={{ color: '#0A2647' }}>{negotiation.supplier}</h4>
                        <p className="text-sm text-gray-600">{negotiation.product} - {negotiation.quantity}</p>
                      </div>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded text-sm">
                        {negotiation.status}
                      </span>
                    </div>
                    <button 
                      className="mt-3 px-4 py-2 rounded-md text-white text-sm"
                      style={{ backgroundColor: '#00BCD4' }}
                    >
                      Tiếp tục thương lượng
                    </button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'contracts' && (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b" style={{ borderColor: '#e5e7eb' }}>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Mã HĐ</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Nhà cung cấp</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Sản phẩm</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Ngày bắt đầu</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Ngày kết thúc</th>
                      <th className="text-left py-3 px-4 text-sm" style={{ color: '#0A2647' }}>Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contracts.map((contract) => (
                      <tr key={contract.id} className="border-b" style={{ borderColor: '#e5e7eb' }}>
                        <td className="py-3 px-4 text-sm">{contract.id}</td>
                        <td className="py-3 px-4 text-sm">{contract.supplier}</td>
                        <td className="py-3 px-4 text-sm">{contract.product}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{contract.startDate}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{contract.endDate}</td>
                        <td className="py-3 px-4 text-sm">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            {contract.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="text-center py-12 text-gray-500">
                <History className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Lịch sử giao dịch sẽ được hiển thị tại đây</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="text-center py-12 text-gray-500">
                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Không có thông báo mới</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}