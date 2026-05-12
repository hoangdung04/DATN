import { useEffect, useState } from "react";
import { Table, Tag, Typography, message, Card, Empty, Button } from "antd";
import { getClientOrderHistory } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import BoxHead from "../../../components/BoxHead";

const { Title, Text } = Typography;

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await getClientOrderHistory();
      if (res.data.code === "success") {
        setOrders(res.data.orders || []);
      }
    } catch (error) {
      if (error.response?.status === 401) {
        message.warning("Vui lòng đăng nhập để xem lịch sử");
        navigate("/login");
      } else {
        message.error("Lỗi khi lấy lịch sử đặt tour");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderStatus = (status) => {
    switch (status) {
      case "initial": return <Tag color="blue">Khởi tạo (Chờ duyệt)</Tag>;
      case "paid": return <Tag color="green">Đã thanh toán</Tag>;
      case "completed": return <Tag color="purple">Đã hoàn thành</Tag>;
      case "cancelled": return <Tag color="red">Đã hủy</Tag>;
      default: return <Tag color="default">{status}</Tag>;
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
      key: "code",
      render: (code) => <Text strong>{code}</Text>,
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
      render: (price) => <Text type="danger" strong>{price?.toLocaleString("vi-VN")}đ</Text>,
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
      render: (status) => renderStatus(status),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Button 
          type="link" 
          onClick={() => navigate(`/order/success?orderCode=${record.code}`)}
        >
          Xem chi tiết
        </Button>
      ),
    }
  ];

  return (
    <div style={{ padding: "24px 0", minHeight: "80vh" }}>
      <BoxHead title="Lịch sử đặt tour" subtitle="Danh sách các tour bạn đã đặt" />
      <div className="container" style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Card bordered={false} style={{ borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
          {orders.length === 0 && !loading ? (
            <Empty
              description="Bạn chưa đặt tour nào"
              style={{ padding: "40px 0" }}
            >
              <Button type="primary" onClick={() => navigate("/categories")}>
                Khám phá tour ngay
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={orders}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              scroll={{ x: 800 }}
            />
          )}
        </Card>
      </div>
    </div>
  );
}

export default OrderHistory;
