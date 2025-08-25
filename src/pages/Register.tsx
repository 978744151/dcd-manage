import React, { useState } from 'react';
import { Form, Input, Button, Card, Typography, Space, Select, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const { Title, Text } = Typography;
const { Option } = Select;

const Register: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const onFinish = async (values: any) => {
        setLoading(true);
        try {
            const success = await register(values.username, values.email, values.password, values.role);
            if (success) {
                message.success('注册成功！请登录');
                navigate('/login');
            }
        } catch (error: any) {
            message.error('注册失败');
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
                                用户注册
                            </Title>
                            <Text type="secondary">创建新账户</Text>
                        </div>

                        <Form
                            name="register"
                            onFinish={onFinish}
                            autoComplete="off"
                            size="large"
                            initialValues={{ role: 'user' }}
                        >
                            <Form.Item
                                name="username"
                                rules={[
                                    { required: true, message: '请输入用户名!' },
                                    { min: 3, message: '用户名至少3位!' },
                                    { max: 30, message: '用户名最多30位!' }
                                ]}
                            >
                                <Input
                                    prefix={<UserOutlined />}
                                    placeholder="用户名"
                                />
                            </Form.Item>

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

                            <Form.Item
                                name="confirmPassword"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: '请确认密码!' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('两次输入的密码不一致!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined />}
                                    placeholder="确认密码"
                                />
                            </Form.Item>

                            <Form.Item
                                name="role"
                                rules={[{ required: true, message: '请选择角色!' }]}
                            >
                                <Select placeholder="选择角色">
                                    <Option value="user">普通用户</Option>
                                    <Option value="admin">管理员</Option>
                                </Select>
                            </Form.Item>

                            <Form.Item>
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    loading={loading}
                                    block
                                    className="login-button"
                                >
                                    注册
                                </Button>
                            </Form.Item>
                        </Form>

                        <div className="login-footer">
                            <Space direction="vertical" size="small">
                                <Text type="secondary">
                                    已有账户？ <Link to="/login">立即登录</Link>
                                </Text>
                            </Space>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Register;