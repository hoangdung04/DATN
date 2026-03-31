import { Layout, Menu, Typography, Space, Button, Avatar } from "antd";
import {
  AppstoreOutlined,
  UnorderedListOutlined,
  TeamOutlined,
  SettingOutlined,
  LogoutOutlined,
  UserOutlined,
  GlobalOutlined,
  TagsOutlined,
} from "@ant-design/icons";
import { Link, useLocation } from "react-router-dom";
import "./AdminSider.css";

const { Sider } = Layout;
const { Text } = Typography;

function AdminSider() {
  const location = useLocation();

  // Xác định key active từ path
  const getSelectedKey = () => {
    if (location.pathname.startsWith("/admin/tours/create")) return "tours-create";
    if (location.pathname.startsWith("/admin/tours")) return "tours";
    if (location.pathname.startsWith("/admin/categories")) return "categories";
    return "tours";
  };

  const menuItems = [
    {
      key: "tours",
      icon: <UnorderedListOutlined />,
      label: <Link to="/admin/tours">Quản lý tour</Link>,
    },
    {
      key: "tours-create",
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/tours/create">Thêm tour mới</Link>,
    },
    {
      key: "categories",
      icon: <TagsOutlined />,
      label: <Link to="/admin/categories">Quản lý danh mục</Link>,
    },
    {
      type: "divider",
    },
    {
      key: "accounts",
      icon: <TeamOutlined />,
      label: "Tài khoản",
      disabled: true,
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt",
      disabled: true,
    },
  ];

  return (
    <Sider width={240} className="admin-sider" theme="dark">
      {/* Logo area */}
      <div className="sider-logo">
        <GlobalOutlined className="sider-logo-icon" />
        <Text strong className="sider-logo-text">TourVN Admin</Text>
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[getSelectedKey()]}
        items={menuItems}
        className="admin-menu"
      />
    </Sider>
  );
}

export default AdminSider;
