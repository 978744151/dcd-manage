import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Typography,
  Row,
  Col,
  Statistic,
  Spin,
} from 'antd';
import {
  EnvironmentOutlined,
  ShopOutlined,
  BankOutlined,
  GlobalOutlined,
} from '@ant-design/icons';
import { statisticsApi } from '../services/api';

const { Title } = Typography;

interface MapData {
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

const MapData: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<MapData | null>(null);

  useEffect(() => {
    fetchMapData();
  }, []);

  const fetchMapData = async () => {
    try {
      setLoading(true);
      const response = await statisticsApi.getNationalData();
      setData(response.data.data);
    } catch (error) {
      console.error('获取地图数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const provinceColumns = [
    {
      title: '省份',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: any, b: any) => a.name.localeCompare(b.name),
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

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Title level={2}>地图数据</Title>
      
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

      {/* 地图展示区域 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={24}>
          <Card title="中国地图数据展示">
            <div style={{ 
              height: 400, 
              background: '#f5f5f5', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              borderRadius: 8
            }}>
              <div style={{ textAlign: 'center', color: '#666' }}>
                <GlobalOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                <h3>地图组件展示区域</h3>
                <p>这里可以集成地图组件显示全国品牌和商场分布</p>
                <p>支持省份、城市、区县的层级展示</p>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* 省份数据表格 */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
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
        </Col>
      </Row>
    </div>
  );
};

export default MapData; 