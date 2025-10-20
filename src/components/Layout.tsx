import React, { useState } from 'react';
import { Layout as AntLayout, Menu, Button, Avatar, Dropdown, Space, Typography } from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  BankOutlined,
  ShopOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  BookOutlined,
  BarChartOutlined,
  WarningOutlined,
  MessageOutlined,
} from '@ant-design/icons';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Layout.css';

const { Header, Sider, Content } = AntLayout;
const { Text } = Typography;

const Layout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: '/map-data',
      icon: <GlobalOutlined />,
      label: '地图数据',
    },
    {
      key: '/provinces',
      icon: <EnvironmentOutlined />,
      label: '省份管理',
    },
    {
      key: '/cities',
      icon: <BankOutlined />,
      label: '城市管理',
    },
    {
      key: '/districts',
      icon: <EnvironmentOutlined />,
      label: '区县管理',
    },
    {
      key: '/brands',
      icon: <ShopOutlined />,
      label: '品牌管理',
    },
    {
      key: '/malls',
      icon: <BankOutlined />,
      label: '商场管理',
    },
    {
      key: '/mall-brands',
      icon: <ShopOutlined />,
      label: '商场品牌管理',
    },
    {
      key: '/dictionaries',
      icon: <BankOutlined />,
      label: '字典管理',
    },
    {
      key: '/comparison',
      icon: <BarChartOutlined />,
      label: '商场城市对比',
    },
    {
      key: '/users',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/comments',
      icon: <BookOutlined />,
      label: '评论管理',
    },
    {
      key: '/blogs',
      icon: <BookOutlined />,
      label: '博客管理',
    },
    {
      key: '/reports',
      icon: <WarningOutlined />,
      label: '举报列表',
    },
    {
      key: '/feedback',
      icon: <MessageOutlined />,
      label: '用户反馈',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人资料',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: '设置',
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: () => {
        logout();
        navigate('/login');
      },
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  const selectedKey = location.pathname;

  return (
    <AntLayout className="app-layout">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="app-sider"
      >
        <div className="logo">
          <h2>{collapsed ? 'DCD' : 'DCD管理系统'}</h2>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          className="app-menu"
        />
      </Sider>

      <AntLayout>
        <Header className="app-header">
          <div className="header-left">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              className="trigger-button"
            />
          </div>

          <div className="header-right">
            <Dropdown
              menu={{ items: userMenuItems }}
              placement="bottomRight"
              arrow
            >
              <Space className="user-info">
                <Avatar icon={<UserOutlined />} />
                <div className="user-details">
                  <Text strong>{user?.username}</Text>
                  <Text type="secondary" className="user-role">
                    {user?.role === 'admin' ? '管理员' : '用户'}
                  </Text>
                </div>
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content className="app-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </Content>
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;