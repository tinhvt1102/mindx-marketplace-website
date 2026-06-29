import { useState } from 'react';
import { Edit, Send, Trash2, Eye, AlertCircle, CheckCircle, Clock, XCircle, Package, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

export function ListingManagementPage({ onNavigate }) {
  const [listings, setListings] = useState([
    { id: '1', name: 'Tôm sú tươi size 20-25', type: 'supply', datePosted: '2026-06-05', status: 'approved', views: 234 },
    { id: '2', name: 'Cá Tra phi lê chất lượng cao', type: 'product', datePosted: '2026-06-04', status: 'pending', views: 0 },
    { id: '3', name: 'Tôm thẻ chân trắng size 40-50', type: 'supply', datePosted: '2026-06-03', status: 'approved', views: 189 },
    { id: '4', name: 'Cua biển tươi sống', type: 'product', datePosted: '2026-06-02', status: 'draft', views: 0 },
    { id: '5', name: 'Mực khô cao cấp', type: 'product', datePosted: '2026-06-01', status: 'rejected', views: 0 },
    { id: '6', name: 'Cá Basa nguyên con', type: 'supply', datePosted: '2026-05-30', status: 'out_of_stock', views: 145 }
  ]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Nháp',
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      out_of_stock: 'Hết hàng'
    };
    return labels[status] || status;
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: { bg: '#F3F4F6', text: '#6B7280', icon: Edit },
      pending: { bg: '#FEF3C7', text: '#D97706', icon: Clock },
      approved: { bg: '#D1FAE5', text: '#059669', icon: CheckCircle },
      rejected: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle },
      out_of_stock: { bg: '#E5E7EB', text: '#374151', icon: AlertCircle }
    };
    return colors[status] || { bg: '#F3F4F6', text: '#6B7280', icon: Edit };
  };

  const handleEdit = (id) => {
    onNavigate('seller-center');
  };

  const handleResubmit = (id) => {
    setListings(listings.map(listing =>
      listing.id === id ? { ...listing, status: 'pending' } : listing
    ));
    toast.success('Đã gửi lại bài đăng để xét duyệt thành công!');
  };

  const handleDelete = (id) => {
    const targetListing = listings.find(l => l.id === id);
    const listingName = targetListing ? targetListing.name : 'bài đăng';

    toast((t) => (
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-gray-900">
          Bạn có chắc chắn muốn xóa <strong>{listingName}</strong>?
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
              setListings(prev => prev.filter(listing => listing.id !== id));
              toast.error('Đã xóa bài đăng khỏi hệ thống!');
            }}
            className="px-2.5 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Xác nhận xóa
          </button>
        </div>
      </div>
    ), {
      duration: 5000,
      position: 'top-center',
    });
  };

  const handleViewDetails = (id) => {
    const targetListing = listings.find(l => l.id === id);
    toast.loading(`Đang tải chi tiết: ${targetListing?.name || id}...`, {
      duration: 1500
    });
  };

  const filteredListings = listings.filter(listing => {
    if (statusFilter !== 'all' && listing.status !== statusFilter) return false;
    if (typeFilter !== 'all' && listing.type !== typeFilter) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0A2647' }}>Quản lý bài đăng</h1>
          <p className="text-gray-600">Quản lý tất cả bài đăng sản lượng và sản phẩm của bạn</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium" style={{ color: '#0A2647' }}>Lọc:</span>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="draft">Nháp</option>
              <option value="pending">Chờ duyệt</option>
              <option value="approved">Đã duyệt</option>
              <option value="rejected">Từ chối</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-md text-sm outline-none"
              style={{ borderColor: '#e5e7eb' }}
            >
              <option value="all">Tất cả loại</option>
              <option value="supply">Sản lượng</option>
              <option value="product">Sản phẩm</option>
            </select>

            <div className="ml-auto">
              <button
                onClick={() => onNavigate('seller-center')}
                className="px-6 py-2 rounded-md text-white font-medium hover:opacity-90 transition-opacity"
                style={{ backgroundColor: '#00BCD4' }}
              >
                + Tạo bài đăng mới
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng bài đăng</p>
                <h3 className="text-2xl font-bold" style={{ color: '#0A2647' }}>{listings.length}</h3>
              </div>
              <Package className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#E0F7FA', color: '#00BCD4' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Đã duyệt</p>
                <h3 className="text-2xl font-bold" style={{ color: '#059669' }}>{listings.filter(l => l.status === 'approved').length}</h3>
              </div>
              <CheckCircle className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#D1FAE5', color: '#059669' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Chờ duyệt</p>
                <h3 className="text-2xl font-bold" style={{ color: '#D97706' }}>{listings.filter(l => l.status === 'pending').length}</h3>
              </div>
              <Clock className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#FEF3C7', color: '#D97706' }} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Tổng lượt xem</p>
                <h3 className="text-2xl font-bold" style={{ color: '#0A2647' }}>{listings.reduce((sum, l) => sum + l.views, 0)}</h3>
              </div>
              <Eye className="w-10 h-10 p-2 rounded-full" style={{ backgroundColor: '#E5E7EB', color: '#6B7280' }} />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b" style={{ borderColor: '#e5e7eb' }}>
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Tên bài đăng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Loại</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Ngày đăng</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Trạng thái</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Lượt xem</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold" style={{ color: '#0A2647' }}>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                      Không có bài đăng nào
                    </td>
                  </tr> /* Đã sửa lỗi thẻ đóng ở đây */
                ) : (
                  filteredListings.map((listing) => {
                    const statusConfig = getStatusColor(listing.status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr key={listing.id} className="border-b hover:bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
                        <td className="px-6 py-4">
                          <span className="font-medium" style={{ color: '#0A2647' }}>{listing.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 rounded-full text-xs text-white inline-block" style={{ backgroundColor: listing.type === 'supply' ? '#2C5F8D' : '#00BCD4' }}>
                            {listing.type === 'supply' ? 'Sản lượng' : 'Sản phẩm'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(listing.datePosted).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-full" style={{ backgroundColor: statusConfig.bg }}>
                              <StatusIcon className="w-4 h-4" style={{ color: statusConfig.text }} />
                            </div>
                            <span className="text-sm font-medium" style={{ color: statusConfig.text }}>
                              {getStatusLabel(listing.status)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4 text-gray-400" />
                            {listing.views}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {(listing.status === 'draft' || listing.status === 'rejected') && (
                              <button
                                onClick={() => handleEdit(listing.id)}
                                className="p-2 hover:bg-blue-50 rounded-md transition-colors"
                                style={{ color: '#00BCD4' }}
                                title="Chỉnh sửa"
                              >
                                <Edit className="w-5 h-5" />
                              </button>
                            )}
                            {(listing.status === 'rejected' || listing.status === 'draft') && (
                              <button
                                onClick={() => handleResubmit(listing.id)}
                                className="p-2 hover:bg-green-50 rounded-md transition-colors"
                                style={{ color: '#059669' }}
                                title="Gửi lại duyệt"
                              >
                                <Send className="w-5 h-5" />
                              </button>
                            )}
                            <button
                              onClick={() => handleViewDetails(listing.id)}
                              className="p-2 hover:bg-gray-100 rounded-md text-gray-600 transition-colors"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(listing.id)}
                              className="p-2 hover:bg-red-50 rounded-md text-red-500 transition-colors"
                              title="Xóa"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-base font-semibold mb-3 flex items-center gap-2" style={{ color: '#0A2647' }}>
            <AlertCircle className="w-5 h-5" style={{ color: '#00BCD4' }} />
            Trạng thái bài đăng
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm">
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Nháp:</strong>
              <p className="text-gray-600">Bài đăng chưa được gửi để xét duyệt</p>
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Chờ duyệt:</strong>
              <p className="text-gray-600">Đang chờ Admin xem xét và phê duyệt</p>
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Đã duyệt:</strong>
              <p className="text-gray-600">Đã được phê duyệt và hiển thị công khai</p>
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Từ chối:</strong>
              <p className="text-gray-600">Bị từ chối, cần chỉnh sửa và gửi lại</p>
            </div>
            <div>
              <strong className="block mb-1" style={{ color: '#0A2647' }}>Hết hàng:</strong>
              <p className="text-gray-600">Sản phẩm đã hết hàng tạm thời</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}