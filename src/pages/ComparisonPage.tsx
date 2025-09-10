import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Select,
  message,
  Typography,
  Row,
  Col,
  Radio,
  Spin,
  Tag,
  Statistic,
  Divider,
  Empty
} from 'antd';
import { BarChartOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { mallApi, cityApi, brandApi, comparisonApi } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

interface Mall {
  _id: string;
  name: string;
  city?: { name: string };
  province?: { name: string };
}

interface City {
  _id: string;
  name: string;
  province?: { name: string };
}

interface Brand {
  _id: string;
  name: string;
  category: string;
  code: string;
}

interface ComparisonResult {
  location: {
    id: string;
    name: string;
    type: string;
    city?: string;
    province?: string;
  };
  brands: {
    brand: Brand;
    storeCount: number;
    totalScore: number;
    averageScore: string;
  }[];
  summary: {
    totalBrands: number;
    totalStores: number;
    totalScore: string;
    averageScore: string;
  };
}

const ComparisonPage: React.FC = () => {
  const [comparisonType, setComparisonType] = useState<'mall' | 'city'>('mall');
  const [malls, setMalls] = useState<Mall[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [selectedBrandIds, setSelectedBrandIds] = useState<string[]>([]);
  const [comparisonResults, setComparisonResults] = useState<ComparisonResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);

  // 加载商场数据
  const loadMalls = async () => {
    try {
      setDataLoading(true);
      const response = await mallApi.getMalls({ limit: 0 });
      if (response.data.success) {
        setMalls(response.data.data.malls);
      }
    } catch (error) {
      message.error('加载商场数据失败');
    } finally {
      setDataLoading(false);
    }
  };

  // 加载城市数据
  const loadCities = async () => {
    try {
      setDataLoading(true);
      const response = await cityApi.getCities({ limit: 0 });
      if (response.data.success) {
        setCities(response.data.data.cities);
      }
    } catch (error) {
      message.error('加载城市数据失败');
    } finally {
      setDataLoading(false);
    }
  };

  // 加载品牌数据
  const loadBrands = async () => {
    try {
      const response = await brandApi.getBrands({ limit: 0 });
      if (response.data.success) {
        setBrands(response.data.data.brands);
      }
    } catch (error) {
      message.error('加载品牌数据失败');
    }
  };

  // 执行对比
  const handleCompare = async () => {
    if (selectedIds.length < 2) {
      message.warning('请至少选择2个' + (comparisonType === 'mall' ? '商场' : '城市') + '进行对比');
      return;
    }

    try {
      setLoading(true);
      const response = await comparisonApi.compare({
        type: comparisonType,
        ids: selectedIds,
        brandIds: selectedBrandIds.length > 0 ? selectedBrandIds : undefined
      });

      if (response.data.success) {
        setComparisonResults(response.data.data.results);
        message.success('对比完成');
      } else {
        message.error(response.data.message || '对比失败');
      }
    } catch (error) {
      message.error('对比失败');
    } finally {
      setLoading(false);
    }
  };

  // 重置
  const handleReset = () => {
    setSelectedIds([]);
    setSelectedBrandIds([]);
    setComparisonResults([]);
  };

  // 切换对比类型
  const handleTypeChange = (type: 'mall' | 'city') => {
    setComparisonType(type);
    setSelectedIds([]);
    setComparisonResults([]);
  };

  useEffect(() => {
    loadBrands();
  }, []);

  useEffect(() => {
    if (comparisonType === 'mall') {
      loadMalls();
    } else {
      loadCities();
    }
  }, [comparisonType]);

  // 构建对比表格数据
  const buildTableData = () => {
    if (comparisonResults.length === 0) return [];

    // 获取所有品牌
    const allBrands = new Map<string, Brand>();
    comparisonResults.forEach(result => {
      result.brands.forEach(brandData => {
        allBrands.set(brandData.brand._id, brandData.brand);
      });
    });

    // 构建表格数据
    return Array.from(allBrands.values()).map(brand => {
      const row: any = {
        key: brand._id,
        brandName: brand.name,
        category: brand.category,
        code: brand.code
      };

      // 为每个对比位置添加数据
      comparisonResults.forEach((result, index) => {
        const brandData = result.brands.find(b => b.brand._id === brand._id);
        row[`location_${index}`] = brandData ? {
          storeCount: brandData.storeCount,
          averageScore: brandData.averageScore
        } : { storeCount: 0, averageScore: '0' };
      });

      return row;
    });
  };

  // 构建表格列
  const buildTableColumns = () => {
    const columns: any[] = [
      {
        title: '品牌名称',
        dataIndex: 'brandName',
        key: 'brandName',
        fixed: 'left' as const,
        width: 150
      },
      {
        title: '品牌代号',
        dataIndex: 'code',
        key: 'code',
        width: 120
      }
    ];

    // 为每个对比位置添加列
    comparisonResults.forEach((result, index) => {
      columns.push({
        title: result.location.name,
        key: `location_${index}`,
        width: 150,
        render: (text: any, record: any) => {
          const data = record[`location_${index}`];
          if (data.storeCount === 0) {
            return <span style={{ color: '#999' }}>暂无门店</span>;
          }
          return (
            <div
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: 'white',
                textAlign: 'center',
                fontSize: '12px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ fontWeight: 'bold', marginBottom: '2px' }}>
                {data.storeCount} 家门店
              </div>
              <div style={{ fontSize: '11px', opacity: 0.9 }}>
                平均分: {data.averageScore}
              </div>
            </div>
          );
        }
      });
    });

    return columns;
  };

  return (
    <div style={{ padding: '24px' }}>
      <Title level={2}>
        <BarChartOutlined /> 商场城市对比分析
      </Title>

      <Card style={{ marginBottom: '24px' }}>
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Space>
              <Text strong>对比类型:</Text>
              <Radio.Group
                value={comparisonType}
                onChange={(e) => handleTypeChange(e.target.value)}
              >
                <Radio.Button value="mall">商场对比</Radio.Button>
                <Radio.Button value="city">城市对比</Radio.Button>
              </Radio.Group>
            </Space>
          </Col>

          <Col span={12}>
            <Text strong>选择{comparisonType === 'mall' ? '商场' : '城市'}:</Text>
            <Select
              mode="multiple"
              style={{ width: '100%', marginTop: '8px' }}
              placeholder={`请选择要对比的${comparisonType === 'mall' ? '商场' : '城市'}`}
              value={selectedIds}
              onChange={setSelectedIds}
              loading={dataLoading}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {comparisonType === 'mall'
                ? malls.map(mall => (
                  <Option key={mall._id} value={mall._id}>
                    {mall.name} ({mall.city?.name})
                  </Option>
                ))
                : cities.map(city => (
                  <Option key={city._id} value={city._id}>
                    {city.name} ({city.province?.name})
                  </Option>
                ))
              }
            </Select>
          </Col>

          <Col span={12}>
            <Text strong>品牌筛选 (可选):</Text>
            <Select
              mode="multiple"
              style={{ width: '100%', marginTop: '8px' }}
              placeholder="选择要对比的品牌，不选则对比所有品牌"
              value={selectedBrandIds}
              onChange={setSelectedBrandIds}
              showSearch
              filterOption={(input, option) =>
                option?.children?.toString().toLowerCase().includes(input.toLowerCase())
              }
            >
              {brands.map(brand => (
                <Option key={brand._id} value={brand._id}>
                  {brand.name} ({brand.category})
                </Option>
              ))}
            </Select>
          </Col>

          <Col span={24}>
            <Space>
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleCompare}
                loading={loading}
                disabled={selectedIds.length < 2}
              >
                开始对比
              </Button>
              <Button icon={<ReloadOutlined />} onClick={handleReset}>
                重置
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      {comparisonResults.length > 0 && (
        <>
          {/* 汇总统计 */}
          <Card title="对比汇总" style={{ marginBottom: '24px' }}>
            <Row gutter={[16, 16]}>
              {comparisonResults.map((result, index) => (
                <Col span={24 / comparisonResults.length} key={index}>
                  <Card size="small">
                    <Title level={4}>{result.location.name}</Title>
                    <Row gutter={[8, 8]}>
                      <Col span={12}>
                        <Statistic title="品牌数" value={result.summary.totalBrands} />
                      </Col>
                      <Col span={12}>
                        <Statistic title="门店数" value={result.summary.totalStores} />
                      </Col>
                      <Col span={12}>
                        <Statistic title="总分" value={result.summary.totalScore} />
                      </Col>
                      <Col span={12}>
                        <Statistic title="平均分" value={result.summary.averageScore} />
                      </Col>
                    </Row>
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>

          {/* 详细对比表格 */}
          <Card title="详细对比">
            <Table
              columns={buildTableColumns()}
              dataSource={buildTableData()}
              scroll={{ x: 800 }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 个品牌`
              }}
              summary={() => {
                const tableData = buildTableData();
                if (tableData.length === 0) return null;

                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text strong>综合总分</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}></Table.Summary.Cell>
                    {comparisonResults.map((result, index) => (
                      <Table.Summary.Cell key={index} index={index + 2}>
                        <div
                          style={{
                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                            borderRadius: '6px',
                            padding: '6px 10px',
                            color: 'white',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          {result.summary.totalScore}
                        </div>
                      </Table.Summary.Cell>
                    ))}
                  </Table.Summary.Row>
                );
              }}
            />
          </Card>
        </>
      )}

      {comparisonResults.length === 0 && selectedIds.length >= 2 && (
        <Card>
          <Empty description="暂无对比数据，请点击开始对比" />
        </Card>
      )}
    </div>
  );
};

export default ComparisonPage;