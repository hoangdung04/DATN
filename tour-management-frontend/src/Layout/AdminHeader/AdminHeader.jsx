import { Layout, Space, Button, Avatar, Typography, Dropdown } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  BellOutlined,
} from "@ant-design/icons";
import "./AdminHeader.css";

const { Header: AntHeader } = Layout;
const { Text } = Typography;

function AdminHeader() {
  const userMenuItems = [
    { key: "profile", icon: <UserOutlined />, label: "Hồ sơ" },
    { key: "logout", icon: <LogoutOutlined />, label: "Đăng xuất", danger: true },
  ];

  return (
    <AntHeader className="admin-header">
      <div className="admin-header-right">
        <Button
          type="text"
          icon={<BellOutlined style={{ fontSize: 18, color: "rgba(255,255,255,0.75)" }} />}
        />
        <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
          <Space className="admin-user-info" style={{ cursor: "pointer" }}>
            <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#00b96b" }} />
            <Text style={{ color: "rgba(255,255,255,0.85)" }}>Admin</Text>
          </Space>
        </Dropdown>
      </div>
    </AntHeader>
  );
}

export default AdminHeader;
