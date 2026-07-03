import { useEffect, useState } from 'react';
import { Package, FileText, Bell, TrendingUp, DollarSign, RefreshCw, ShoppingCart } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('currentUser') || '{}');
  } catch {
    return {};
  }
};

export function DashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);

  const loadDashboard = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Bạn cần đăng nhập để xem dashboard');
      return;
    }

    const user = getCurrentUser();
    const isAdmin = user?.role === 'admin';

    try {
      setLoading(true);
      const response = await apiClient.get(isAdmin ? ENDPOINTS.DASHBOARD.ADMIN : ENDPOINTS.DASHBOARD.SELLER);
      setDashboard(response.data || {});
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Không tải được dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const recentOrders = dashboard?.recentOrders || [];
  const bestSellingProducts = dashboard?.bestSellingProducts || [];

  const chartData = [
    { month: 'T1', value: Number(dashboard?.totalProducts || 0) },
    { month: 'T2', value: Number(dashboard?.totalSupplies || 0) },
    { month: 'T3', value: Number(dashboard?.totalOrders || 0) },
    { month: 'T4', value: Number(dashboard?.newOrders || 0) },
    { month: 'T5', value: Number(dashboard?.completedOrders || 0) },
    { month: 'T6', value: Number(dashboard?.pendingSupplies || 0) },
  ];

  const tabs = [
    { id: 'orders', label: 'Đơn hàng gần đây', icon: Package },
    { id: 'products', label: 'Sản phẩm nổi bật', icon: FileText },
    { id: 'analytics', label: 'Thống kê', icon: TrendingUp },
    { id: 'notifications', label: 'Thông báo', icon: Bell },
  ];

  const statCards = [
    { label: 'Tổng sản phẩm', value: dashboard?.totalProducts || 0, icon: Package, color: '#00BCD4' },
    { label: 'Tổng sản lượng', value: dashboard?.totalSupplies || 0, icon: FileText, color: '#0A2A4D' },
    { label: 'Tổng đơn hàng', value: dashboard?.totalOrders || 0, icon: ShoppingCart, color: '#F59E0B' },
    { label: 'Doanh thu hoàn tất', value: formatCurrency(dashboard?.totalRevenue), icon: DollarSign, color: '#10B981' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: '#0A2A4D', fontWeight: 700 }}>
              Dashboard
            </h1>
            <p className="text-gray-600"></p>
          </div>
          <button
            onClick={loadDashboard}
            className="px-4 py-2 bg-white border rounded-md flex items-center gap-2"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Tải lại
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon size={28} style={{ color: stat.color }} />
                  <span className="text-xs text-green-600"></span>
                </div>
                <p className="text-2xl font-bold mb-1" style={{ color: '#0A2A4D' }}>{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 rounded-md ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}
                style={{ backgroundColor: activeTab === tab.id ? '#0A2A4D' : 'transparent' }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading && <p className="text-gray-500">Đang tải dữ liệu dashboard...</p>}

          {!loading && activeTab === 'orders' && (
            <div>
              <h2 className="text-2xl mb-4" style={{ color: '#0A2A4D', fontWeight: 700 }}>Đơn hàng gần đây</h2>
              {recentOrders.length === 0 ? (
                <p className="text-gray-500">Chưa có đơn hàng nào.</p>
              ) : (
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order._id || order.orderCode} className="border rounded-lg p-4 flex justify-between gap-4">
                      <div>
                        <p className="font-semibold" style={{ color: '#0A2A4D' }}>{order.orderCode}</p>
                        <p className="text-sm text-gray-600">{order.items?.map((item) => `${item.name} x${item.quantity}`).join(', ')}</p>
                        <p className="text-xs text-gray-500">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{formatCurrency(order.totalAmount)}</p>
                        <span className="text-sm px-3 py-1 rounded-full bg-blue-50 text-blue-700">{order.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'products' && (
            <div>
              <h2 className="text-2xl mb-4" style={{ color: '#0A2A4D', fontWeight: 700 }}>Sản phẩm nổi bật</h2>
              {bestSellingProducts.length === 0 ? (
                <p className="text-gray-500">Chưa có sản phẩm.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {bestSellingProducts.map((product) => (
                    <div key={product._id || product.productCode} className="border rounded-lg p-4 flex gap-4">
                      {product.image && <img src={product.image} alt={product.name} className="w-20 h-20 object-cover rounded-md" />}
                      <div>
                        <p className="font-semibold" style={{ color: '#0A2A4D' }}>{product.name}</p>
                        <p className="text-sm text-gray-600">{product.category}</p>
                        <p className="font-bold">{formatCurrency(product.price)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && activeTab === 'analytics' && (
            <div>
              <h2 className="text-2xl mb-4" style={{ color: '#0A2A4D', fontWeight: 700 }}>Biểu đồ tổng quan</h2>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#00BCD4" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {!loading && activeTab === 'notifications' && (
            <div>
              <h2 className="text-2xl mb-4" style={{ color: '#0A2A4D', fontWeight: 700 }}>Thông báo hệ thống</h2>
              <div className="space-y-4">
                <div className="border-l-4 p-4 bg-blue-50" style={{ borderColor: '#00BCD4' }}>
                  <p className="font-semibold"></p>
                  <p className="text-sm text-gray-600"></p>
                </div>
                <div className="border-l-4 p-4 bg-green-50" style={{ borderColor: '#10B981' }}>
                  <p className="font-semibold"></p>
                  <p className="text-sm text-gray-600"></p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
