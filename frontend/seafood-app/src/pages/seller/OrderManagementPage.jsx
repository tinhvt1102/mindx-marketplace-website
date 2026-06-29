import { useState } from 'react';
import { CheckCircle, XCircle, Package, Truck, DollarSign, Eye, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function OrderManagementPage({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('new');

  const [orders, setOrders] = useState([
    { id: '1', orderCode: 'ORD-2026-001', buyer: 'Công ty TNHH XNK Thủy sản', items: 'Tôm sú size 20-25 (500kg)', value: 210000000, date: '2026-06-07', status: 'new', paymentStatus: 'pending', paymentMethod: 'Chuyển khoản' },
    { id: '2', orderCode: 'ORD-2026-002', buyer: 'Nhà hàng Hải Sản Ngon', items: 'Cá Tra phi lê (200kg)', value: 15000000, date: '2026-06-06', status: 'new', paymentStatus: 'pending', paymentMethod: 'COD' },
    { id: '3', orderCode: 'ORD-2026-003', buyer: 'Siêu thị Co.op Mart', items: 'Tôm thẻ size 40-50 (300kg)', value: 84000000, date: '2026-06-05', status: 'processing', paymentStatus: 'paid', paymentMethod: 'Chuyển khoản' },
    { id: '4', orderCode: 'ORD-2026-004', buyer: 'Nhà máy chế biến Minh Phát', items: 'Cá Basa nguyên con (800kg)', value: 54400000, date: '2026-06-04', status: 'shipping', paymentStatus: 'paid', paymentMethod: 'Chuyển khoản' },
    { id: '5', orderCode: 'ORD-2026-005', buyer: 'Công ty CP Thực phẩm Sài Gòn', items: 'Cua biển (100kg)', value: 35000000, date: '2026-06-03', status: 'completed', paymentStatus: 'paid', paymentMethod: 'Chuyển khoản' }
  ]);

  const [payments] = useState([
    { id: '1', transactionId: 'TXN-2026-001', buyer: 'Công ty TNHH XNK Thủy sản', amount: 210000000, method: 'Chuyển khoản', status: 'pending', date: '2026-06-07' },
    { id: '2', transactionId: 'TXN-2026-002', buyer: 'Siêu thị Co.op Mart', amount: 84000000, method: 'Chuyển khoản', status: 'paid', date: '2026-06-05' },
    { id: '3', transactionId: 'TXN-2026-003', buyer: 'Nhà máy chế biến Minh Phát', amount: 54400000, method: 'Chuyển khoản', status: 'paid', date: '2026-06-04' },
    { id: '4', transactionId: 'TXN-2026-004', buyer: 'Công ty CP Thực phẩm Sài Gòn', amount: 35000000, method: 'Chuyển khoản', status: 'paid', date: '2026-06-03' }
  ]);

  const handleAcceptOrder = (id) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: 'processing' } : order
    ));
    toast.success('Đã chấp nhận đơn hàng và chuyển sang xử lý!');
  };

  const handleRejectOrder = (id) => {
    const targetOrder = orders.find(o => o.id === id);
    const orderCode = targetOrder ? targetOrder.orderCode : 'đơn hàng';

    // Sử dụng toast custom thay cho confirm() của hệ thống
    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-900">
          Bạn có chắc chắn muốn từ chối đơn hàng <strong>{orderCode}</strong>?
        </span>
        <div className="flex justify-end gap-2 mt-1">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-2.5 py-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded"
          >
            Hủy
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              setOrders(orders.filter(order => order.id !== id));
              toast.error(`Đã từ chối đơn hàng ${orderCode}!`);
            }}
            className="px-2.5 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Từ chối đơn
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const handleUpdateStatus = (id, newStatus) => {
    setOrders(orders.map(order =>
      order.id === id ? { ...order, status: newStatus } : order
    ));
    
    // Đổi câu thông báo linh hoạt theo trạng thái mới
    if (newStatus === 'shipping') {
      toast.success('Đơn hàng đã bắt đầu được vận chuyển!');
    } else if (newStatus === 'completed') {
      toast.success('Chúc mừng! Đơn hàng đã hoàn thành xuất sắc.');
    } else {
      toast.success('Đã cập nhật trạng thái đơn hàng!');
    }
  };

  const handleViewDetails = (orderCode) => {
    toast.loading(`Đang tải dữ liệu đơn hàng ${orderCode}...`, {
      duration: 1000
    });
  };

  const getOrdersByStatus = (status) => orders.filter(order => order.status === status);

  const getPaymentStatusBadge = (status) => {
    const config = {
      pending: { bg: '#FEF3C7', text: '#D97706', label: 'Chờ thanh toán' },
      paid: { bg: '#D1FAE5', text: '#059669', label: 'Đã thanh toán' },
      refunded: { bg: '#E5E7EB', text: '#6B7280', label: 'Hoàn tiền' }
    };
    return config[status] || { bg: '#E5E7EB', text: '#6B7280', label: status };
  };

  const renderOrderTable = (orderList, showActions = true) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b" style={{ borderColor: '#e5e7eb' }}>
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Mã đơn</th>
            <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Người mua</th>
            <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Sản phẩm</th>
            <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Giá trị</th>
            <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Thanh toán</th>
            {showActions && <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Hành động</th>}
          </tr>
        </thead>
        <tbody>
          {orderList.length === 0 ? (
            <tr>
              <td colSpan={showActions ? 6 : 5} className="px-6 py-12 text-center text-gray-500">
                Không có đơn hàng nào
              </td>
            </tr>
          ) : (
            orderList.map((order) => {
              const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
              return (
                <tr key={order.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                  <td className="px-6 py-4">
                    <span className="font-medium" style={{ color: '#0A2647' }}>{order.orderCode}</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.buyer}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{order.items}</td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: '#d4183d' }}>
                    {order.value.toLocaleString('vi-VN')}đ
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 rounded-full text-xs font-medium inline-block" style={{ backgroundColor: paymentBadge.bg, color: paymentBadge.text }}>
                      {paymentBadge.label}
                    </span>
                  </td>
                  {showActions && (
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {order.status === 'new' && (
                          <>
                            <button
                              onClick={() => handleAcceptOrder(order.id)}
                              className="px-3 py-1.5 rounded-md text-white text-sm font-medium hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#059669' }}
                            >
                              Chấp nhận
                            </button>
                            <button
                              onClick={() => handleRejectOrder(order.id)}
                              className="px-3 py-1.5 rounded-md text-white text-sm font-medium hover:opacity-90 transition-opacity"
                              style={{ backgroundColor: '#DC2626' }}
                            >
                              Từ chối
                            </button>
                          </>
                        )}
                        {order.status === 'processing' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'shipping')}
                            className="px-3 py-1.5 rounded-md text-white text-sm font-medium hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#00BCD4' }}
                          >
                            Bắt đầu vận chuyển
                          </button>
                        )}
                        {order.status === 'shipping' && (
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'completed')}
                            className="px-3 py-1.5 rounded-md text-white text-sm font-medium hover:opacity-90 transition-opacity"
                            style={{ backgroundColor: '#059669' }}
                          >
                            Hoàn thành
                          </button>
                        )}
                        <button 
                          onClick={() => handleViewDetails(order.orderCode)}
                          className="p-2 hover:bg-gray-100 rounded-md transition-colors" 
                          title="Xem chi tiết"
                        >
                          <Eye className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0A2647' }}>Quản lý đơn hàng & Thanh toán</h1>
          <p className="text-gray-600">Quản lý tất cả đơn hàng và theo dõi thanh toán từ khách hàng</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đơn mới</p>
                <h3 className="text-2xl font-bold" style={{ color: '#D97706' }}>{getOrdersByStatus('new').length}</h3>
              </div>
              <AlertCircle className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đang xử lý</p>
                <h3 className="text-2xl font-bold" style={{ color: '#00BCD4' }}>{getOrdersByStatus('processing').length}</h3>
              </div>
              <Clock className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#E0F7FA', color: '#00BCD4' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đang vận chuyển</p>
                <h3 className="text-2xl font-bold" style={{ color: '#2C5F8D' }}>{getOrdersByStatus('shipping').length}</h3>
              </div>
              <Truck className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#E3F2FD', color: '#2C5F8D' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hoàn thành</p>
                <h3 className="text-2xl font-bold" style={{ color: '#059669' }}>{getOrdersByStatus('completed').length}</h3>
              </div>
              <CheckCircle className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#059669' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Doanh thu</p>
                <h3 className="text-2xl font-bold" style={{ color: '#0A2647' }}>
                  {(orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.value, 0) / 1000000).toFixed(0)}M
                </h3>
              </div>
              <DollarSign className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#F3E5F5', color: '#9C27B0' }} />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow-sm border-b" style={{ borderColor: '#e5e7eb' }}>
          <div className="flex overflow-x-auto separation-tabs">
            {[
              { id: 'new', label: 'Đơn mới', icon: AlertCircle, count: getOrdersByStatus('new').length },
              { id: 'processing', label: 'Đang xử lý', icon: Package, count: getOrdersByStatus('processing').length },
              { id: 'shipping', label: 'Đang vận chuyển', icon: Truck, count: getOrdersByStatus('shipping').length },
              { id: 'completed', label: 'Hoàn thành', icon: CheckCircle, count: getOrdersByStatus('completed').length },
              { id: 'payment', label: 'Thanh toán', icon: DollarSign, count: payments.length }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 px-6 py-4 border-b-2 transition-colors whitespace-nowrap focus:outline-none"
                  style={{
                    borderBottomColor: isSelected ? '#00BCD4' : 'transparent',
                    color: isSelected ? '#00BCD4' : '#6B7280',
                    backgroundColor: isSelected ? '#F0F9FF' : 'transparent'
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-semibold" style={{
                    backgroundColor: isSelected ? '#00BCD4' : '#E5E7EB',
                    color: isSelected ? 'white' : '#6B7280'
                  }}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-b-lg shadow-sm">
          {activeTab === 'new' && renderOrderTable(getOrdersByStatus('new'))}
          {activeTab === 'processing' && renderOrderTable(getOrdersByStatus('processing'))}
          {activeTab === 'shipping' && renderOrderTable(getOrdersByStatus('shipping'))}
          {activeTab === 'completed' && renderOrderTable(getOrdersByStatus('completed'), false)}
          {activeTab === 'payment' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b" style={{ borderColor: '#e5e7eb' }}>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Mã giao dịch</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Người mua</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Giá trị</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Phương thức thanh toán</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const statusBadge = getPaymentStatusBadge(payment.status);
                    return (
                      <tr key={payment.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                        <td className="px-6 py-4">
                          <span className="font-medium" style={{ color: '#0A2647' }}>{payment.transactionId}</span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.buyer}</td>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: '#d4183d' }}>
                          {payment.amount.toLocaleString('vi-VN')}đ
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{payment.method}</td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs font-medium inline-block" style={{ backgroundColor: statusBadge.bg, color: statusBadge.text }}>
                            {statusBadge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}