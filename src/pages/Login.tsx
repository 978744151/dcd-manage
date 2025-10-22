import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, SafetyOutlined } from '@ant-design/icons';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { sendVerificationCode } from '../services/auth';
import './Login.css';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [codeLoading, setCodeLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { login, emailLogin } = useAuth();
  const navigate = useNavigate();

  // 密码登录
  const onPasswordLogin = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const success = await login(values.email, values.password);
      if (success) {
        navigate('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // 邮箱验证码登录
  const onEmailLogin = async (values: { email: string; code: string }) => {
    setLoading(true);
    try {
      const success = await emailLogin(values.email, values.code);
      if (success) {
        navigate('/admin/dashboard');
      }
    } finally {
      setLoading(false);
    }
  };

  // 发送验证码
  const sendCode = async (email: string) => {
    if (!email) {
      message.error('请先输入邮箱地址');
      return;
    }

    setCodeLoading(true);
    try {
      await sendVerificationCode(email, 'login');
      message.success('验证码已发送到您的邮箱');

      // 开始倒计时
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: any) {
      message.error(error.response?.data?.message || '发送验证码失败');
    } finally {
      setCodeLoading(false);
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

            <Tabs defaultActiveKey="password" centered>
              <TabPane tab="密码登录" key="password">
                <Form
                  name="passwordLogin"
                  onFinish={onPasswordLogin}
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
              </TabPane>

              <TabPane tab="验证码登录" key="email">
                <Form
                  name="emailLogin"
                  onFinish={onEmailLogin}
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
                      prefix={<MailOutlined />}
                      placeholder="邮箱"
                    />
                  </Form.Item>

                  <Form.Item
                    name="code"
                    rules={[
                      { required: true, message: '请输入验证码!' },
                      { len: 6, message: '验证码为6位数字!' }
                    ]}
                  >
                    <Input
                      prefix={<SafetyOutlined />}
                      placeholder="验证码"
                      maxLength={6}
                      suffix={
                        <Button
                          type="link"
                          size="small"
                          loading={codeLoading}
                          disabled={countdown > 0}
                          onClick={() => {
                            const form = document.querySelector('form[name="emailLogin"]') as HTMLFormElement;
                            const emailInput = form?.querySelector('input[placeholder="邮箱"]') as HTMLInputElement;
                            sendCode(emailInput?.value);
                          }}
                          style={{ padding: 0, height: 'auto' }}
                        >
                          {countdown > 0 ? `${countdown}s` : '获取验证码'}
                        </Button>
                      }
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
              </TabPane>
            </Tabs>

            {/* <div className="login-footer">
              <Space direction="vertical" size="small">
                <Text type="secondary">默认管理员账号</Text>
                <Text code>admin@dcd.com / admin123</Text>
                <Text type="secondary">
                  还没有账户？ <Link to="/register">立即注册</Link>
                </Text>
              </Space>
            </div> */}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;