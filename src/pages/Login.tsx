import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate('/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-content">
          <Card className="login-card">
            <div className="login-header">
              <Title level={2} className="login-title">
                DCD后台管理系统
              </Title>
              <Text type="secondary">数据管理中心</Text>
            </div>

            <Form
              name="login"
              onFinish={onFinish}
              autoComplete="off"
              size="large"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: '请输入邮箱!' },
                  { type: 'email', message: '请输入有效的邮箱地址!' }
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="邮箱"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[
                  { required: true, message: '请输入密码!' },
                  { min: 6, message: '密码至少6位!' }
                ]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="密码"
                />
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  className="login-button"
                >
                  登录
                </Button>
              </Form.Item>
            </Form>

            <div className="login-footer">
              <Space direction="vertical" size="small">
                <Text type="secondary">默认管理员账号</Text>
                <Text code>admin@dcd.com / admin123</Text>
                <Text type="secondary">
                  还没有账户？ <Link to="/register">立即注册</Link>
                </Text>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;