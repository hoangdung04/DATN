import { Layout, Menu, Badge, Typography } from "antd";
import {
  HomeOutlined,
  AppstoreOutlined,
  ShoppingCartOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { getCartCount } from "../../utils/cart";
import { useState, useEffect } from "react";
import "./Header.css";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

function Header() {
  const [cartCount, setCartCount] = useState(getCartCount());
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const update = () => setCartCount(getCartCount());
    window.addEventListener("storage", update);
    window.addEventListener("cartUpdated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("cartUpdated", update);
    };
  }, []);

  // Xác định menu item active dựa theo path hiện tại
  const selectedKey = () => {
    if (location.pathname.startsWith("/tours")) return "tours";
    if (location.pathname === "/cart") return "cart";
    return "home";
  };

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined />,
      label: <Link to="/">Trang chủ</Link>,
    },
    {
      key: "tours",
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Danh mục</Link>,
    },
    {
      key: "cart",
      icon: (
        <Badge count={cartCount} size="small" offset={[4, -2]}>
          <ShoppingCartOutlined style={{ fontSize: 16, color: "#fff" }} />
        </Badge>
      ),
      label: <Link to="/cart">Giỏ hàng</Link>,
    },
  ];

  return (
    <AntHeader className="client-header">
      {/* Logo */}
      <div className="header-logo" onClick={() => navigate("/")}>
        <GlobalOutlined className="logo-icon" />
        <Text strong className="logo-text">TourVN</Text>
      </div>

      {/* Navigation menu */}
      <Menu
        theme="dark"
        mode="horizontal"
        selectedKeys={[selectedKey()]}
        items={menuItems}
        className="header-menu"
        disabledOverflow
      />
    </AntHeader>
  );
}

export default Header;
