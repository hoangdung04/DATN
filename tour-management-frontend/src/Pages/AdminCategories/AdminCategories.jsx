// ===================================================
// Admin Categories Page - Ant Design Version
// ===================================================
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Table, 
  Button, 
  Card, 
  Tag, 
  Space, 
  Typography, 
  Image, 
  Tooltip,
  message 
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  EyeOutlined 
} from '@ant-design/icons';
import { getAdminCategories } from '../../services/api';
import './AdminCategories.css';

const { Title } = Typography;

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gọi API: GET /api/admin/categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAdminCategories();
        setCategories(response.data.categories);
      } catch (error) {
        console.error('Lỗi khi lấy danh mục:', error);
        message.error('Không thể lấy danh sách danh mục');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const columns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      render: (text, record, index) => index + 1,
    },
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      width: 120,
      render: (image) => (
        <Image
          src={image}
          alt="category"
          width={100}
          style={{ borderRadius: '8px', objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Hoạt động' : 'Dừng hoạt động'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 150,
      render: (record) => (
        <Space size="middle">
          <Tooltip title="Chi tiết">
            <Link to={`/admin/categories/detail/${record.id}`}>
              <Button type="default" icon={<EyeOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="Sửa">
            <Link to={`/admin/categories/edit/${record.id}`}>
              <Button type="primary" ghost icon={<EditOutlined />} size="small" />
            </Link>
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              danger 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => message.warning('Tính năng xóa đang phát triển')}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-categories-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <Title level={2} style={{ margin: 0 }}>Danh mục tour</Title>
        <Link to="/admin/categories/create">
          <Button type="primary" icon={<PlusOutlined />} size="large">
            Thêm mới danh mục
          </Button>
        </Link>
      </div>

      <Card>
        <Table 
          columns={columns} 
          dataSource={categories} 
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

export default AdminCategories;
