import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, Table, Typography, Spin } from 'antd';
import {
  EnvironmentOutlined,
  ShopOutlined,
  BankOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { statisticsApi } from '../services/api';
import { Line, Pie } from '@ant-design/plots';

const { Title } = Typography;

interface DashboardData {
  totalProvinces: number;
  totalBrands: number;
  totalMalls: number;
  totalDistricts: number;
  provinces: Array<{
    id: string;
    name: string;
    brandCount: number;
    mallCount: number;
    districtCount: number;
  }>;
}

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await statisticsApi.getNationalData();
      setData(response.data.data);
    } catch (error) {
      console.error('获取仪表盘数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const provinceColumns = [
    {
      title: '省份',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '品牌数',
      dataIndex: 'brandCount',
      key: 'brandCount',
      sorter: (a: any, b: any) => a.brandCount - b.brandCount,
    },
    {
      title: '商场数',
      dataIndex: 'mallCount',
      key: 'mallCount',
      sorter: (a: any, b: any) => a.mallCount - b.mallCount,
    },
    {
      title: '区县数',
      dataIndex: 'districtCount',
      key: 'districtCount',
      sorter: (a: any, b: any) => a.districtCount - b.districtCount,
    },
  ];

  const pieData = data?.provinces.slice(0, 10).map(province => ({
    type: province.name,
    value: province.brandCount,
  })) || [];

  const lineData = data?.provinces.slice(0, 10).map(province => ({
    province: province.name,
    brands: province.brandCount,
    malls: province.mallCount,
  })) || [];

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>数据概览</Title>
      
      {/* 统计卡片 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="省份总数"
              value={data?.totalProvinces || 0}
              prefix={<EnvironmentOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="品牌总数"
              value={data?.totalBrands || 0}
              prefix={<ShopOutlined />}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="商场总数"
              value={data?.totalMalls || 0}
              prefix={<BankOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="区县总数"
              value={data?.totalDistricts || 0}
              prefix={<GlobalOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 图表区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="品牌分布（前10省份）" style={{ height: 400 }}>
            <Pie
              data={pieData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: 'outer',
                content: '{name} {percentage}',
              }}
              interactions={[
                {
                  type: 'element-active',
                },
              ]}
            />
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="品牌与商场数量对比（前10省份）" style={{ height: 400 }}>
            <Line
              data={lineData}
              xField="province"
              yField="value"
              seriesField="type"
              smooth
              point={{
                size: 5,
                shape: 'diamond',
              }}
              label={{
                style: {
                  fill: '#aaa',
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 省份数据表格 */}
      <Card title="省份数据详情">
        <Table
          columns={provinceColumns}
          dataSource={data?.provinces || []}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>
    </div>
  );
};

export default Dashboard; 