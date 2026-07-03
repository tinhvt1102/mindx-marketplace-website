import { useEffect, useMemo, useState } from 'react';
import { Edit, Send, Trash2, Eye, AlertCircle, CheckCircle, Clock, XCircle, Package, Filter, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { apiClient } from '../../api/apiClient';
import { ENDPOINTS } from '../../api/endpoints';

const formatDate = (value) => {
  if (!value) return 'N/A';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('vi-VN');
};

const getListingName = (item) => item.name || item.seafoodType || item.species || 'Bài đăng chưa có tên';

const normalizeProduct = (item) => ({
  ...item,
  id: item._id || item.id || item.productCode,
  listingType: 'product',
  type: 'product',
  name: getListingName(item),
  datePosted: item.createdAt || item.harvestDate,
  status: item.isActive === false ? 'out_of_stock' : (item.status || 'approved'),
  views: item.views || item.sold || 0,
});

const normalizeSupply = (item) => ({
  ...item,
  id: item._id || item.id || item.supplyCode,
  listingType: 'supply',
  type: 'supply',
  name: getListingName(item),
  datePosted: item.createdAt || item.harvestDate,
  status: item.isActive === false ? 'out_of_stock' : (item.status || 'approved'),
  views: item.views || 0,
});

export function ListingManagementPage({ onNavigate }) {
  const [listings, setListings] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  const getStatusLabel = (status) => {
    const labels = {
      draft: 'Nháp',
      pending: 'Chờ duyệt',
      approved: 'Đã duyệt',
      rejected: 'Từ chối',
      out_of_stock: 'Hết hàng',
      new: 'Mới',
    };
    return labels[status] || status || 'N/A';
  };

  const getStatusColor = (status) => {
    const colors = {
      draft: { bg: '#F3F4F6', text: '#6B7280', icon: Edit },
      pending: { bg: '#FEF3C7', text: '#D97706', icon: Clock },
      approved: { bg: '#D1FAE5', text: '#059669', icon: CheckCircle },
      rejected: { bg: '#FEE2E2', text: '#DC2626', icon: XCircle },
      out_of_stock: { bg: '#E5E7EB', text: '#374151', icon: AlertCircle },
    };
    return colors[status] || { bg: '#F3F4F6', text: '#6B7280', icon: Edit };
  };

  const loadListings = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Bạn cần đăng nhập để xem bài đăng của mình!');
      onNavigate?.('login');
      return;
    }

    try {
      setLoading(true);

      const [productsRes, suppliesRes] = await Promise.all([
        apiClient.get(ENDPOINTS.PRODUCTS.MY_PRODUCTS),
        apiClient.get(ENDPOINTS.SUPPLIES.MY_SUPPLIES),
      ]);

      const products = (productsRes.data || []).map(normalizeProduct);
      const supplies = (suppliesRes.data || []).map(normalizeSupply);

      setListings([...products, ...supplies].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)));
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Không tải được danh sách bài đăng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, []);

  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      const statusMatch = statusFilter === 'all' || listing.status === statusFilter;
      const typeMatch = typeFilter === 'all' || listing.type === typeFilter;
      return statusMatch && typeMatch;
    });
  }, [listings, statusFilter, typeFilter]);

  const handleEdit = () => {
    toast('Bạn có thể vào Trung tâm người bán để tạo/cập nhật bài đăng mới.');
    onNavigate?.('seller-center');
  };

  const handleResubmit = async (listing) => {
    try {
      if (listing.type === 'product') {
        await apiClient.put(ENDPOINTS.PRODUCTS.UPDATE(listing.id), { status: 'approved', isActive: true });
      } else {
        await apiClient.put(ENDPOINTS.SUPPLIES.UPDATE(listing.id), { status: 'approved', isActive: true });
      }

      toast.success('Đã gửi duyệt/lên lại bài đăng!');
      await loadListings();
    } catch (error) {
      toast.error(error.message || 'Không thể gửi lại bài đăng');
    }
  };

  const handleDelete = async (listing) => {
    const ok = window.confirm(`Bạn có chắc muốn xóa bài "${listing.name}" không?`);
    if (!ok) return;

    try {
      if (listing.type === 'product') {
        await apiClient.delete(ENDPOINTS.PRODUCTS.DELETE(listing.id));
      } else {
        await apiClient.delete(ENDPOINTS.SUPPLIES.DELETE(listing.id));
      }

      toast.success('Đã xóa bài đăng khỏi MongoDB!');
      await loadListings();
    } catch (error) {
      toast.error(error.message || 'Không thể xóa bài đăng');
    }
  };

  const stats = {
    total: listings.length,
    approved: listings.filter((item) => item.status === 'approved').length,
    pending: listings.filter((item) => item.status === 'pending' || item.status === 'draft').length,
    views: listings.reduce((sum, item) => sum + Number(item.views || 0), 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8 flex justify-between gap-4 items-start">
          <div>
            <h1 className="text-3xl mb-2" style={{ color: '#0A2A4D', fontWeight: 700 }}>
              Quản lý bài đăng
            </h1>
            <p className="text-gray-600">
              
            </p>
          </div>
          <button
            onClick={loadListings}
            className="px-4 py-2 border rounded-md flex items-center gap-2 bg-white"
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            Tải lại
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Filter style={{ color: '#0A2A4D' }} />
            <span className="font-medium">Lọc:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="approved">Đã duyệt</option>
              <option value="pending">Chờ duyệt</option>
              <option value="draft">Nháp</option>
              <option value="rejected">Từ chối</option>
              <option value="out_of_stock">Hết hàng</option>
            </select>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border rounded-md"
            >
              <option value="all">Tất cả loại</option>
              <option value="supply">Sản lượng</option>
              <option value="product">Sản phẩm</option>
            </select>
          </div>

          <button
            onClick={() => onNavigate?.('seller-center')}
            className="px-6 py-3 text-white rounded-md"
            style={{ backgroundColor: '#00BCD4' }}
          >
            + Tạo bài đăng mới
          </button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-600 mb-2">Tổng bài đăng</p>
            <p className="text-3xl font-bold" style={{ color: '#0A2A4D' }}>{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-600 mb-2">Đã duyệt</p>
            <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-600 mb-2">Chờ duyệt / Nháp</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5">
            <p className="text-sm text-gray-600 mb-2">Tổng lượt xem</p>
            <p className="text-3xl font-bold" style={{ color: '#0A2A4D' }}>{stats.views}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-10 text-center text-gray-500"></div>
          ) : filteredListings.length === 0 ? (
            <div className="p-10 text-center text-gray-500">
              Chưa có bài đăng nào.
            </div>
          ) : (
            <table className="w-full">
              <thead style={{ backgroundColor: '#F9FAFB' }}>
                <tr>
                  <th className="text-left p-4">Tên bài đăng</th>
                  <th className="text-left p-4">Loại</th>
                  <th className="text-left p-4">Ngày đăng</th>
                  <th className="text-left p-4">Trạng thái</th>
                  <th className="text-left p-4">Lượt xem</th>
                  <th className="text-center p-4">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {filteredListings.map((listing) => {
                  const statusStyle = getStatusColor(listing.status);
                  const StatusIcon = statusStyle.icon;
                  return (
                    <tr key={`${listing.type}-${listing.id}`} className="border-t">
                      <td className="p-4">
                        <div>
                          <p className="font-medium" style={{ color: '#0A2A4D' }}>{listing.name}</p>
                          <p className="text-xs text-gray-500">{listing.productCode || listing.supplyCode}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm text-white"
                          style={{ backgroundColor: listing.type === 'supply' ? '#0A2A4D' : '#00BCD4' }}
                        >
                          {listing.type === 'supply' ? 'Sản lượng' : 'Sản phẩm'}
                        </span>
                      </td>
                      <td className="p-4">{formatDate(listing.datePosted)}</td>
                      <td className="p-4">
                        <span
                          className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm"
                          style={{ backgroundColor: statusStyle.bg, color: statusStyle.text }}
                        >
                          <StatusIcon size={16} />
                          {getStatusLabel(listing.status)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Eye size={16} />
                          {listing.views}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-3">
                          <button onClick={() => handleEdit(listing)} className="text-blue-500 hover:text-blue-700">
                            <Edit size={18} />
                          </button>
                          {(listing.status === 'draft' || listing.status === 'rejected') && (
                            <button onClick={() => handleResubmit(listing)} className="text-green-500 hover:text-green-700">
                              <Send size={18} />
                            </button>
                          )}
                          <button onClick={() => handleDelete(listing)} className="text-red-500 hover:text-red-700">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex gap-3">
            <AlertCircle style={{ color: '#0A2A4D' }} />
            <div>
              <h4 className="font-semibold mb-1" style={{ color: '#0A2A4D' }}></h4>
              <p className="text-sm text-gray-700">
                 <b></b>  
                
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
