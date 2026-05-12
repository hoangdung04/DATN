import { useEffect, useState } from "react";
import { Table, Select, Tag, Typography, message, Card } from "antd";
import { getAdminOrders, updateAdminOrderStatus } from "../../../services/api";
import dayjs from "dayjs";

const { Title } = Typography;

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getAdminOrders();
      setOrders(res.data.orders || []);
    } catch (error) {
      message.error("Lỗi khi lấy danh sách đơn hàng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateAdminOrderStatus(orderId, newStatus);
      message.success("Cập nhật trạng thái thành công");
      fetchOrders();
    } catch (error) {
      message.error("Cập nhật thất bại");
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
      render: (code) => <b>{code}</b>,
    },
    {
      title: "Khách hàng",
      key: "customer",
      render: (_, record) => (
        <div>
          <div><b>{record.fullName}</b></div>
          <div style={{ fontSize: 12, color: "#888" }}>{record.phone}</div>
        </div>
      ),
    },
    {
      title: "Số Tour",
      dataIndex: "totalTours",
      key: "totalTours",
    },
    {
      title: "Tổng tiền",
      dataIndex: "total_price",
      key: "total_price",
      render: (price) => <span style={{ color: "red", fontWeight: "bold" }}>{price?.toLocaleString()}đ</span>,
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status, record) => (
        <Select
          value={status}
          style={{ width: 140 }}
          onChange={(val) => handleStatusChange(record.id, val)}
          options={[
            { value: 'initial', label: <Tag color="blue">Khởi tạo</Tag> },
            { value: 'paid', label: <Tag color="green">Đã thanh toán</Tag> },
            { value: 'completed', label: <Tag color="purple">Hoàn thành</Tag> },
            { value: 'cancelled', label: <Tag color="red">Đã hủy</Tag> },
          ]}
        />
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 20 }}>
        <Title level={3}>Quản lý Đơn đặt Tour</Title>
      </div>
      <Card>
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </div>
  );
}

export default AdminOrders;
