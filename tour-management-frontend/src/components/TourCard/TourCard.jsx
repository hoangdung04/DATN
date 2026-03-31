import { Card, Tag, Button, Typography, Space } from "antd";
import {
  EyeOutlined,
  FireOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./TourCard.css";

const { Text, Title } = Typography;

function TourCard({ item }) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      className="tour-card"
      cover={
        <div className="tour-card-img-wrapper">
          <img
            src={item.image || "https://placehold.co/400x220?text=Tour"}
            alt={item.title}
            className="tour-card-img"
          />
          {item.discount > 0 && (
            <Tag color="red" className="tour-card-discount-badge" icon={<FireOutlined />}>
              Giảm {item.discount}%
            </Tag>
          )}
        </div>
      }
      actions={[
        <Button
          key="detail"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/tours/detail/${item.slug}`)}
          block
        >
          Xem chi tiết
        </Button>,
      ]}
    >
      <Card.Meta
        title={<Title level={5} style={{ margin: 0 }} ellipsis>{item.title}</Title>}
        description={
          <Space direction="vertical" size={2} style={{ width: "100%" }}>
            <Space>
              <DollarOutlined style={{ color: "#00b96b" }} />
              <Text strong style={{ color: "#00b96b", fontSize: 16 }}>
                {item.price_special?.toLocaleString("vi-VN")}đ
              </Text>
              <Text delete type="secondary" style={{ fontSize: 13 }}>
                {item.price?.toLocaleString("vi-VN")}đ
              </Text>
            </Space>
          </Space>
        }
      />
    </Card>
  );
}

export default TourCard;
