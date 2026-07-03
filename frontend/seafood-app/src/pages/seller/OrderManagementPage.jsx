import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle, Package, Truck, DollarSign, Eye, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

const formatCurrency = (value) => `${Number(value || 0).toLocaleString('vi-VN')}đ`;

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

const getBuyerName = (order) => {
  return order.shippingInfo?.fullName || order.buyerName || 'Người mua';
};

const getItemsText = (order) => {
  if (!order.items || order.items.length === 0) return 'Không có sản phẩm';
  return order.items.map((item) => `${item.name} (${item.quantity} ${item.unit || ''})`).join(', ');
};

export function OrderManagementPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('new');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadOrders = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Bạn cần đăng nhập để xem đơn hàng');
      onNavigate?.('login');
      return;
    }

    try {
      setLoading(true);
      const response = await apiClient.get(ENDPOINTS.ORDERS.SELLER_ORDERS);
      setOrders(response.data || []);
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Không tải được đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const getStatusLabel = (status) => {
    const labels = {
      new: 'Đơn mới',
      processing: 'Đang xử lý',
      shipping: 'Đang giao',
      completed: 'Hoàn thành',
      cancelled: 'Đã hủy',
      rejected: 'Từ chối',
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      new: { bg: '#FEF3C7', text: '#D97706', icon: Clock },
      processing: { bg: '#DBEAFE', text: '#2563EB', icon: Package },
      shipping: { bg: '#E0F2FE', text: '#0284C7', icon: Truck },
      completed: { bg: '#D1FAE5', text: '#059669', icon: CheckCircle },
      cancelled: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle },
      rejected: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle },
    };
    return colors[status] || { bg: '#F3F4F6', text: '#6B7280', icon: AlertCircle };
  };

  const updateOrderStatus = async (order, status) => {
    try {
      await apiClient.patch(ENDPOINTS.ORDERS.UPDATE_STATUS(order._id || order.orderCode), { status });
      toast.success(`Đã cập nhật trạng thái: ${getStatusLabel(status)}`);
      await loadOrders();
    } catch (error) {
      toast.error(error.message || 'Không thể cập nhật đơn hàng');
    }
  };

  const filteredOrders = useMemo(() => {
    if (activeTab === 'all') return orders;
    return orders.filter((order) => order.status === activeTab);
  }, [orders, activeTab]);

  const tabs = [
    { id: 'all', label: 'Tất cả', count: orders.length },
    { id: 'new', label: 'Đơn mới', count: orders.filter((o) => o.status === 'new').length },
    { id: 'processing', label: 'Đang xử lý', count: orders.filter((o) => o.status === 'processing').length },
    { id: 'shipping', label: 'Đang giao', count: orders.filter((o) => o.status === 'shipping').length },
    { id: 'completed', label: 'Hoàn thành', count: orders.filter((o) => o.status === 'completed').length },
  ];

  const stats = {
    newOrders: orders.filter((o) => o.status === 'new').length,
    processing: orders.filter((o) => o.status === 'processing').length,
    shipping: orders.filter((o) => o.status === 'shipping').length,
    revenue: orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + Number(o.totalAmount || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-start gap-4">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: '#0A2A4D', fontWeight: 700 }}>
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600">Đơn hàng lấy từ backend qua API seller-orders.</p>
          </div>
          <button
            onClick={loadOrders}
            disabled={loading}
            className="px-4 py-2 bg-white border rounded-md flex items-center gap-2"
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Tải lại
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Clock size={28} style={{ color: '#D97706' }} className="mb-4" />
            <p className="text-2xl font-bold" style={{ color: '#0A2A4D' }}>{stats.newOrders}</p>
            <p className="text-sm text-gray-600">Đơn mới</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Package size={28} style={{ color: '#2563EB' }} className="mb-4" />
            <p className="text-2xl font-bold" style={{ color: '#0A2A4D' }}>{stats.processing}</p>
            <p className="text-sm text-gray-600">Đang xử lý</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <Truck size={28} style={{ color: '#0284C7' }} className="mb-4" />
            <p className="text-2xl font-bold" style={{ color: '#0A2A4D' }}>{stats.shipping}</p>
            <p className="text-sm text-gray-600">Đang giao</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <DollarSign size={28} style={{ color: '#059669' }} className="mb-4" />
            <p className="text-2xl font-bold" style={{ color: '#0A2A4D' }}>{formatCurrency(stats.revenue)}</p>
            <p className="text-sm text-gray-600">Doanh thu hoàn tất</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-2 mb-6 flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-3 rounded-md ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}
              style={{ backgroundColor: activeTab === tab.id ? '#0A2A4D' : 'transparent' }}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500">Đang tải đơn hàng...</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-10 text-center text-gray-500">Chưa có đơn hàng nào trong trạng thái này.</div>
          ) : (
            <div className="divide-y">
              {filteredOrders.map((order) => {
                const statusStyle = getStatusColor(order.status);
                const StatusIcon = statusStyle.icon;
                return (
                  <div key={order._id || order.orderCode} className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-semibold text-lg" style={{ color: '#0A2A4D' }}>
                          {order.orderCode}
                        </h3>
                        <p className="text-sm text-gray-600">Người mua: {getBuyerName(order)}</p>
                        <p className="text-sm text-gray-600">Ngày đặt: {formatDate(order.createdAt)}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold" style={{ color: '#0A2A4D' }}>{formatCurrency(order.totalAmount)}</p>
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm mt-2"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          <StatusIcon size={16} />
                          {getStatusLabel(order.status)}
                        </span>
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-600">Sản phẩm:</p>
                      <p className="font-medium">{getItemsText(order)}</p>
                      <p className="text-sm text-gray-600 mt-2">
                        Giao tới: {order.shippingInfo?.address}, {order.shippingInfo?.ward}, {order.shippingInfo?.district}, {order.shippingInfo?.province}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                      {order.status === 'new' && (
                        <>
                          <button
                            onClick={() => updateOrderStatus(order, 'processing')}
                            className="px-4 py-2 text-white rounded-md"
                            style={{ backgroundColor: '#00BCD4' }}
                          >
                            Xác nhận đơn
                          </button>
                          <button
                            onClick={() => updateOrderStatus(order, 'rejected')}
                            className="px-4 py-2 text-red-600 border border-red-200 rounded-md"
                          >
                            Từ chối
                          </button>
                        </>
                      )}

                      {order.status === 'processing' && (
                        <button
                          onClick={() => updateOrderStatus(order, 'shipping')}
                          className="px-4 py-2 text-white rounded-md"
                          style={{ backgroundColor: '#0A2A4D' }}
                        >
                          Chuyển sang giao hàng
                        </button>
                      )}

                      {order.status === 'shipping' && (
                        <button
                          onClick={() => updateOrderStatus(order, 'completed')}
                          className="px-4 py-2 text-white bg-green-600 rounded-md"
                        >
                          Hoàn thành
                        </button>
                      )}

                      <button className="px-4 py-2 border rounded-md flex items-center gap-2">
                        <Eye size={16} />
                        Xem chi tiết
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
