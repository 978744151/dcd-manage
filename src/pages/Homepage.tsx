import React from 'react';
import { Button, Card, Row, Col, Typography, Space, Divider } from 'antd';
import {
  ShopOutlined,
  GlobalOutlined,
  BarChartOutlined,
  TeamOutlined,
  SafetyOutlined,
  RocketOutlined,
  StarOutlined,
  CheckCircleOutlined,
  ArrowRightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Homepage.css';

const { Title, Paragraph, Text } = Typography;

const Homepage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <ShopOutlined style={{ fontSize: '48px', color: '#1890ff' }} />,
      title: '商场管理',
      description: '全面的商场信息管理系统，支持多维度数据分析和可视化展示'
    },
    {
      icon: <GlobalOutlined style={{ fontSize: '48px', color: '#52c41a' }} />,
      title: '品牌监控',
      description: '实时监控品牌动态，智能分析市场趋势，助力商业决策'
    },
    {
      icon: <BarChartOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />,
      title: '数据分析',
      description: '强大的数据分析引擎，提供深度洞察和预测性分析'
    },
    {
      icon: <TeamOutlined style={{ fontSize: '48px', color: '#eb2f96' }} />,
      title: '用户管理',
      description: '完善的用户权限体系，支持多角色协作和精细化管理'
    }
  ];

  const advantages = [
    {
      icon: <SafetyOutlined style={{ fontSize: '32px', color: '#1890ff' }} />,
      title: '安全可靠',
      description: '企业级安全保障，数据加密传输，多重备份机制'
    },
    {
      icon: <RocketOutlined style={{ fontSize: '32px', color: '#52c41a' }} />,
      title: '高效便捷',
      description: '智能化操作流程，一键式数据导入导出，提升工作效率'
    },
    {
      icon: <StarOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />,
      title: '专业服务',
      description: '7x24小时技术支持，专业团队提供定制化解决方案'
    }
  ];

  const stats = [
    { number: '10,000+', label: '服务商场' },
    { number: '50,000+', label: '品牌数据' },
    { number: '1,000,000+', label: '用户信赖' },
    { number: '99.9%', label: '系统稳定性' }
  ];

  return (
    <div className="homepage">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <Title level={1} className="hero-title">
              懂商帝
              <br />
              <span className="hero-subtitle">智慧商业管理平台</span>
            </Title>
            <Paragraph className="hero-description">
              专业的商场品牌管理系统，集数据分析、品牌监控、用户管理于一体，
              为您的商业决策提供强有力的数据支撑和智能化解决方案。
            </Paragraph>
            <Space size="large" className="hero-buttons">
              <Button
                type="primary"
                size="large"
                icon={<RocketOutlined />}
                onClick={() => navigate('/admin')}
                className="cta-button"
              >
                立即体验
              </Button>
              {/* <Button
                size="large"
                ghost
                onClick={() => navigate('/login')}
              >
                免费注册
              </Button> */}
            </Space>
          </div>
          <div className="hero-visual">
            <div className="hero-card">
              <div className="floating-elements">
                <div className="element element-1">
                  <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                </div>
                <div className="element element-2">
                  <BarChartOutlined style={{ fontSize: '20px', color: '#52c41a' }} />
                </div>
                <div className="element element-3">
                  <GlobalOutlined style={{ fontSize: '18px', color: '#fa8c16' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      {/* <section className="stats-section">
        <Row gutter={[32, 32]} justify="center">
          {stats.map((stat, index) => (
            <Col xs={12} sm={6} key={index}>
              <div className="stat-item">
                <Title level={2} className="stat-number">{stat.number}</Title>
                <Text className="stat-label">{stat.label}</Text>
              </div>
            </Col>
          ))}
        </Row>
      </section> */}

      {/* Features Section */}
      <section className="features-section">
        <div className="section-header">
          <Title level={2} className="section-title">核心功能</Title>
          <Paragraph className="section-description">
            全方位的商业管理解决方案，助力企业数字化转型
          </Paragraph>
        </div>
        <Row gutter={[32, 32]}>
          {features.map((feature, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                className="feature-card"
                hoverable
                bordered={false}
              >
                <div className="feature-icon">{feature.icon}</div>
                <Title level={4} className="feature-title">{feature.title}</Title>
                <Paragraph className="feature-description">
                  {feature.description}
                </Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </section>

      {/* Advantages Section */}
      <section className="advantages-section">
        <Row gutter={[48, 48]} align="middle">
          <Col xs={24} lg={12}>
            <div className="advantages-content">
              <Title level={2} className="section-title">为什么选择懂商帝？</Title>
              <Space direction="vertical" size="large" className="advantages-list">
                {advantages.map((advantage, index) => (
                  <div key={index} className="advantage-item">
                    <div className="advantage-icon">{advantage.icon}</div>
                    <div className="advantage-content">
                      <Title level={4} className="advantage-title">{advantage.title}</Title>
                      <Paragraph className="advantage-description">
                        {advantage.description}
                      </Paragraph>
                    </div>
                  </div>
                ))}
              </Space>
            </div>
          </Col>
          <Col xs={24} lg={12}>
            <div className="advantages-visual">
              <div className="visual-grid">
                <div className="grid-item item-1">
                  <CheckCircleOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
                </div>
                <div className="grid-item item-2">
                  <BarChartOutlined style={{ fontSize: '28px', color: '#1890ff' }} />
                </div>
                <div className="grid-item item-3">
                  <SafetyOutlined style={{ fontSize: '30px', color: '#fa8c16' }} />
                </div>
                <div className="grid-item item-4">
                  <RocketOutlined style={{ fontSize: '26px', color: '#eb2f96' }} />
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <Title level={2} className="cta-title">准备开始您的智慧商业之旅？</Title>
          <Paragraph className="cta-description">
            立即注册懂商帝，体验专业的商业管理平台，让数据驱动您的商业决策
          </Paragraph>
          <Space size="large">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              onClick={() => navigate('/register')}
              className="cta-primary"
            >
              免费开始
            </Button>
            <Button
              size="large"
              onClick={() => navigate('/admin')}
            >
              已有账号？立即登录
            </Button>
          </Space>
        </div>
      </section>

      {/* Footer */}
      <footer className="homepage-footer">
        <Divider />
        <div className="footer-content">
          <Text type="secondary">
            © 2024 懂商帝 - 智慧商业管理平台. All rights reserved.
          </Text>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;