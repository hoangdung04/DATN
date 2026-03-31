import { Card, Button, Typography } from "antd";
import { EyeOutlined, EnvironmentOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "./CategoryCard.css";

const { Text, Title } = Typography;

function CategoryCard({ item }) {
  const navigate = useNavigate();

  return (
    <Card
      hoverable
      className="category-card"
      cover={
        <div className="category-card-img-wrapper">
          <img
            src={item.image || "https://placehold.co/400x220?text=Tour"}
            alt={item.title}
            className="category-card-img"
          />
          <div className="category-card-overlay">
            <EnvironmentOutlined className="overlay-icon" />
          </div>
        </div>
      }
      actions={[
        <Button
          key="view"
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/tours/${item.slug}`)}
          block
        >
          Xem tour
        </Button>,
      ]}
    >
      <Card.Meta
        title={<Title level={5} style={{ margin: 0 }}>{item.title}</Title>}
        description={
          <Text type="secondary" ellipsis>
            {item.description || "Khám phá những điểm đến tuyệt vời"}
          </Text>
        }
      />
    </Card>
  );
}

export default CategoryCard;
