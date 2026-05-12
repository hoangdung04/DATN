import { useState, useEffect } from "react";
import { Form, Input, Button, Card, Select, message, Typography, Space, Row, Col } from "antd";
import { ArrowLeftOutlined, SaveOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { createAdminAccount, getAdminRoles } from "../../../services/api";

const { Title } = Typography;

function AdminAccountCreate() {
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const res = await getAdminRoles();
        setRoles(res.data.roles || []);
      } catch (error) {
        message.error("Lỗi lấy danh sách chức danh");
      }
    };
    fetchRoles();
  }, []);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const res = await createAdminAccount(values);
      if (res.data.code === "success") {
        message.success("Tạo tài khoản thành công!");
        navigate("/admin/accounts");
      } else {
        message.error(res.data.message || "Có lỗi xảy ra");
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi kết nối đến máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 20 }}>
        <Button icon={<ArrowLeftOutlined />} onClick={() => navigate("/admin/accounts")}>
          Quay lại
        </Button>
        <Title level={3} style={{ margin: 0 }}>Thêm mới tài khoản</Title>
      </Space>

      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{ status: "active" }}
        >
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input placeholder="Nhập họ và tên..." size="large" />
              </Form.Item>

              <Form.Item
                label="Email"
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" }
                ]}
              >
                <Input placeholder="Nhập email..." size="large" />
              </Form.Item>

              <Form.Item
                label="Mật khẩu"
                name="password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu!" },
                  { min: 6, message: "Mật khẩu ít nhất 6 ký tự!" }
                ]}
              >
                <Input.Password placeholder="Nhập mật khẩu..." size="large" />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Số điện thoại" name="phone">
                <Input placeholder="Nhập số điện thoại..." size="large" />
              </Form.Item>

              <Form.Item label="Phân quyền (Vai trò)" name="role_id">
                <Select size="large" placeholder="-- Chọn vai trò --" allowClear>
                  {roles.map(role => (
                    <Select.Option key={role.id} value={role.id}>
                      {role.title}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item label="Trạng thái" name="status">
                <Select size="large">
                  <Select.Option value="active">Hoạt động</Select.Option>
                  <Select.Option value="inactive">Bị khóa</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item style={{ marginTop: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              icon={<SaveOutlined />}
              loading={loading}
              size="large"
            >
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default AdminAccountCreate;
