import { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Typography, Tag, message } from "antd";
import { 
  DollarOutlined, 
  ShoppingCartOutlined, 
  GlobalOutlined, 
  TeamOutlined 
} from "@ant-design/icons";
import { getAdminDashboard } from "../../../services/api";
import dayjs from "dayjs";

const { Title } = Typography;

function AdminDashboard() {
  const [data, setData] = useState({ statistic: {}, recentOrders: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAdminDashboard();
        setData(res.data);
      } catch (error) {
        message.error("Lỗi lấy dữ liệu thống kê");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const { statistic, recentOrders } = data;

  const renderStatus = (status) => {
    switch (status) {
      case "initial": return <Tag color="blue">Khởi tạo</Tag>;
      case "paid": return <Tag color="green">Đã thanh toán</Tag>;
      case "completed": return <Tag color="purple">Hoàn thành</Tag>;
      case "cancelled": return <Tag color="red">Đã hủy</Tag>;
      default: return <Tag>{status}</Tag>;
    }
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "code", key: "code" },
    { title: "Khách hàng", dataIndex: "fullName", key: "fullName" },
    { title: "Số điện thoại", dataIndex: "phone", key: "phone" },
    { 
      title: "Ngày đặt", 
      dataIndex: "createdAt", 
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm")
    },
    { 
      title: "Trạng thái", 
      dataIndex: "status", 
      key: "status",
      render: renderStatus
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Title level={3} style={{ marginBottom: 24 }}>Tổng quan hệ thống</Title>

      {/* 4 Thẻ Thống kê */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Tổng doanh thu"
              value={statistic.order?.revenue || 0}
              suffix="đ"
              prefix={<DollarOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#ff4d4f", fontWeight: "bold" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Tổng đơn hàng"
              value={statistic.order?.total || 0}
              prefix={<ShoppingCartOutlined style={{ color: "#1890ff" }} />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              Đã hoàn thành: {statistic.order?.completed || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Tổng số Tour"
              value={statistic.tour?.total || 0}
              prefix={<GlobalOutlined style={{ color: "#52c41a" }} />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              Đang hoạt động: {statistic.tour?.active || 0}
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card bordered={false} loading={loading} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
            <Statistic
              title="Tổng tài khoản"
              value={statistic.account?.total || 0}
              prefix={<TeamOutlined style={{ color: "#722ed1" }} />}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: "#888" }}>
              Đang hoạt động: {statistic.account?.active || 0}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bảng Đơn hàng gần đây */}
      <Card title="5 đơn hàng mới nhất" bordered={false} style={{ borderRadius: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <Table
          columns={columns}
          dataSource={recentOrders}
          rowKey="id"
          pagination={false}
          loading={loading}
        />
      </Card>
    </div>
  );
}

export default AdminDashboard;
