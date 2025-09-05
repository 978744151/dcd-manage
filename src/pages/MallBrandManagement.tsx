import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  InputNumber,
  Tabs,
  Tag,
  Avatar,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, ShopOutlined, BankOutlined } from '@ant-design/icons';
import { mallApi, provinceApi, cityApi, districtApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface Mall {
  _id: string;
  name: string;
  code: string;
  description: string;
  website: string;
  province: {
    _id: string;
    name: string;
  };
  city: {
    _id: string;
    name: string;
  };
  district?: {
    _id: string;
    name: string;
  };
  address: string;
  contactPhone: string;
  contactEmail: string;
  floorCount: number;
  totalArea: number;
  parkingSpaces: number;
  openingHours: string;
  isActive: boolean;
}

interface Brand {
  _id: string;
  name: string;
  logo: string;
  category: string;
  description: string;
  sort: number;
  storeCount: number;
  province?: {
    _id: string;
    name: string;
  };
  city?: {
    _id: string;
    name: string;
  };
  district?: {
    _id: string;
    name: string;
  };
}

interface Province {
  _id: string;
  name: string;
}

interface City {
  _id: string;
  name: string;
  province: string;
}

interface District {
  _id: string;
  name: string;
  city: string;
}

const MallBrandManagement: React.FC = () => {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(false);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMall, setEditingMall] = useState<Mall | null>(null);
  const [selectedMall, setSelectedMall] = useState<Mall | null>(null);
  const [activeTab, setActiveTab] = useState('malls');
  const [form] = Form.useForm();

  // 商场查询和分页状态
  const [mallFilters, setMallFilters] = useState({
    search: '',
    provinceId: undefined as string | undefined,
    cityId: undefined as string | undefined,
    districtId: undefined as string | undefined,
  });
  const [mallPagination, setMallPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 品牌查询和分页状态
  const [brandFilters, setBrandFilters] = useState({
    search: '',
  });
  const [brandPagination, setBrandPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取商场列表
  const fetchMalls = async (page = 1, pageSize = 10, filters = mallFilters) => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        search: filters.search || undefined,
        provinceId: filters.provinceId || undefined,
        cityId: filters.cityId || undefined,
        districtId: filters.districtId || undefined,
      };
      
      const response = await mallApi.getMalls(params);
      if (response.data.success) {
        setMalls(response.data.data.malls);
        setMallPagination({
          current: response.data.data.pagination.page,
          pageSize: response.data.data.pagination.limit,
          total: response.data.data.pagination.total,
        });
      }
    } catch (error) {
      message.error('获取商场列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取商场品牌列表
  const fetchMallBrands = async (mallId: string, page = 1, pageSize = 10, filters = brandFilters) => {
    setBrandsLoading(true);
    try {
      const params = {
        page,
        limit: pageSize,
        search: filters.search || undefined,
      };
      
      const response = await mallApi.getMallBrands(mallId, params);
      if (response.data.success) {
        setBrands(response.data.data.brands);
        setBrandPagination({
          current: response.data.data.pagination.page,
          pageSize: response.data.data.pagination.limit,
          total: response.data.data.pagination.total,
        });
      }
    } catch (error) {
      message.error('获取商场品牌列表失败');
    } finally {
      setBrandsLoading(false);
    }
  };

  // 获取省份列表
  const fetchProvinces = async () => {
    try {
      const response = await provinceApi.getProvinces();
      if (response.data.success) {
        setProvinces(response.data.data.provinces);
      }
    } catch (error) {
      message.error('获取省份列表失败');
    }
  };

  // 获取城市列表
  const fetchCities = async (provinceId?: string) => {
    if (!provinceId) {
      setCities([]);
      return;
    }
    try {
      const response = await cityApi.getCities({ provinceId });
      if (response.data.success) {
        setCities(response.data.data.cities);
      }
    } catch (error) {
      message.error('获取城市列表失败');
    }
  };

  // 获取区县列表
  const fetchDistricts = async (cityId?: string) => {
    if (!cityId) {
      setDistricts([]);
      return;
    }
    try {
      const response = await districtApi.getDistricts({ cityId });
      if (response.data.success) {
        setDistricts(response.data.data.districts);
      }
    } catch (error) {
      message.error('获取区县列表失败');
    }
  };

  // 初始化数据
  useEffect(() => {
    fetchMalls();
    fetchProvinces();
  }, []);

  // 监听商场查询条件变化
  useEffect(() => {
    fetchMalls(1, mallPagination.pageSize, mallFilters);
  }, [mallFilters]);

  // 监听选中商场变化
  useEffect(() => {
    if (selectedMall && activeTab === 'brands') {
      fetchMallBrands(selectedMall._id, 1, brandPagination.pageSize, brandFilters);
    }
  }, [selectedMall, brandFilters]);

  // 处理商场搜索
  const handleMallSearch = () => {
    fetchMalls(1, mallPagination.pageSize, mallFilters);
  };

  // 重置商场查询条件
  const resetMallFilters = () => {
    setMallFilters({
      search: '',
      provinceId: undefined,
      cityId: undefined,
      districtId: undefined,
    });
    setCities([]);
    setDistricts([]);
  };

  // 处理品牌搜索
  const handleBrandSearch = () => {
    if (selectedMall) {
      fetchMallBrands(selectedMall._id, 1, brandPagination.pageSize, brandFilters);
    }
  };

  // 重置品牌查询条件
  const resetBrandFilters = () => {
    setBrandFilters({ search: '' });
  };

  // 处理省份变化
  const handleProvinceChange = (value: string) => {
    setMallFilters(prev => ({
      ...prev,
      provinceId: value,
      cityId: undefined,
      districtId: undefined,
    }));
    setCities([]);
    setDistricts([]);
    if (value) {
      fetchCities(value);
    }
  };

  // 处理城市变化
  const handleCityChange = (value: string) => {
    setMallFilters(prev => ({
      ...prev,
      cityId: value,
      districtId: undefined,
    }));
    setDistricts([]);
    if (value) {
      fetchDistricts(value);
    }
  };

  // 处理区县变化
  const handleDistrictChange = (value: string) => {
    setMallFilters(prev => ({
      ...prev,
      districtId: value,
    }));
  };

  // 删除商场
  const handleDelete = async (id: string) => {
    try {
      const response = await mallApi.deleteMall(id);
      if (response.data.success) {
        message.success('删除成功');
        fetchMalls(mallPagination.current, mallPagination.pageSize, mallFilters);
        // 如果删除的是当前选中的商场，清空选中状态
        if (selectedMall && selectedMall._id === id) {
          setSelectedMall(null);
          setBrands([]);
        }
      }
    } catch (error) {
      message.error('删除失败');
    }
  };

  // 提交表单
  const handleSubmit = async (values: any) => {
    try {
      if (editingMall) {
        const response = await mallApi.updateMall(editingMall._id, values);
        if (response.data.success) {
          message.success('更新成功');
        }
      } else {
        const response = await mallApi.createMall(values);
        if (response.data.success) {
          message.success('创建成功');
        }
      }
      setModalVisible(false);
      setEditingMall(null);
      form.resetFields();
      fetchMalls(mallPagination.current, mallPagination.pageSize, mallFilters);
    } catch (error) {
      message.error(editingMall ? '更新失败' : '创建失败');
    }
  };

  // 商场表格列定义
  const mallColumns = [
    {
      title: '商场名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Mall) => (
        <Button 
          type="link" 
          onClick={() => {
            setSelectedMall(record);
            setActiveTab('brands');
          }}
        >
          <BankOutlined /> {text}
        </Button>
      ),
    },
    {
      title: '商场编码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '所在地区',
      key: 'location',
      render: (record: Mall) => {
        const parts = [];
        if (record.province) parts.push(record.province.name);
        if (record.city) parts.push(record.city.name);
        if (record.district) parts.push(record.district.name);
        return parts.join(' / ');
      },
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (record: Mall) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingMall(record);
              form.setFieldsValue({
                ...record,
                province: record.province?._id,
                city: record.city?._id,
                district: record.district?._id,
              });
              if (record.province?._id) {
                fetchCities(record.province._id);
              }
              if (record.city?._id) {
                fetchDistricts(record.city._id);
              }
              setModalVisible(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个商场吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  // 品牌表格列定义
  const brandColumns = [
    {
      title: '品牌Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo: string, record: Brand) => (
        <Avatar 
          src={logo} 
          icon={<ShopOutlined />}
          size={40}
        />
      ),
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '门店数量',
      dataIndex: 'storeCount',
      key: 'storeCount',
      render: (count: number) => (
        <Tag color="blue">{count} 家</Tag>
      ),
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
  ];

  return (
    <div>
      <Title level={2}>商场品牌管理</Title>
      
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'malls',
            label: (
              <span>
                <BankOutlined />
                商场管理
              </span>
            ),
            children: (
              <Card>
                {/* 商场查询区域 */}
                <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#fafafa', borderRadius: 6 }}>
                  <Row gutter={16}>
                    <Col span={6}>
                      <Input
                        placeholder="搜索商场名称"
                        value={mallFilters.search}
                        onChange={(e) => setMallFilters(prev => ({ ...prev, search: e.target.value }))}
                        prefix={<SearchOutlined />}
                      />
                    </Col>
                    <Col span={4}>
                      <Select
                        placeholder="选择省份"
                        value={mallFilters.provinceId}
                        onChange={handleProvinceChange}
                        allowClear
                        style={{ width: '100%' }}
                      >
                        {provinces.map(province => (
                          <Option key={province._id} value={province._id}>
                            {province.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={4}>
                      <Select
                        placeholder="选择城市"
                        value={mallFilters.cityId}
                        onChange={handleCityChange}
                        allowClear
                        disabled={!mallFilters.provinceId}
                        style={{ width: '100%' }}
                      >
                        {cities.map(city => (
                          <Option key={city._id} value={city._id}>
                            {city.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={4}>
                      <Select
                        placeholder="选择区县"
                        value={mallFilters.districtId}
                        onChange={handleDistrictChange}
                        allowClear
                        disabled={!mallFilters.cityId}
                        style={{ width: '100%' }}
                      >
                        {districts.map(district => (
                          <Option key={district._id} value={district._id}>
                            {district.name}
                          </Option>
                        ))}
                      </Select>
                    </Col>
                    <Col span={6}>
                      <Space>
                        <Button type="primary" icon={<SearchOutlined />} onClick={handleMallSearch}>
                          搜索
                        </Button>
                        <Button onClick={resetMallFilters}>
                          重置
                        </Button>
                        <Button
                          type="primary"
                          icon={<PlusOutlined />}
                          onClick={() => {
                            setEditingMall(null);
                            form.resetFields();
                            setModalVisible(true);
                          }}
                        >
                          新增商场
                        </Button>
                      </Space>
                    </Col>
                  </Row>
                </div>

                <Table
                  columns={mallColumns}
                  dataSource={malls}
                  rowKey="_id"
                  loading={loading}
                  pagination={{
                    current: mallPagination.current,
                    pageSize: mallPagination.pageSize,
                    total: mallPagination.total,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `共 ${total} 条记录`,
                    onChange: (page, pageSize) => {
                      fetchMalls(page, pageSize, mallFilters);
                    },
                    onShowSizeChange: (current, size) => {
                      fetchMalls(current, size, mallFilters);
                    },
                  }}
                />
              </Card>
            ),
          },
          {
            key: 'brands',
            label: (
              <span>
                <ShopOutlined />
                商场品牌 {selectedMall && `(${selectedMall.name})`}
              </span>
            ),
            children: (
              <Card>
                {selectedMall ? (
                  <>
                    {/* 商场信息 */}
                    <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#f0f9ff', borderRadius: 6, border: '1px solid #bae7ff' }}>
                      <Row>
                        <Col span={24}>
                          <Title level={4} style={{ margin: 0, color: '#1890ff' }}>
                            <BankOutlined /> {selectedMall.name}
                          </Title>
                          <p style={{ margin: '8px 0 0 0', color: '#666' }}>
                            {selectedMall.address}
                          </p>
                        </Col>
                      </Row>
                    </div>

                    {/* 品牌查询区域 */}
                    <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#fafafa', borderRadius: 6 }}>
                      <Row gutter={16}>
                        <Col span={8}>
                          <Input
                            placeholder="搜索品牌名称"
                            value={brandFilters.search}
                            onChange={(e) => setBrandFilters(prev => ({ ...prev, search: e.target.value }))}
                            prefix={<SearchOutlined />}
                          />
                        </Col>
                        <Col span={16}>
                          <Space>
                            <Button type="primary" icon={<SearchOutlined />} onClick={handleBrandSearch}>
                              搜索
                            </Button>
                            <Button onClick={resetBrandFilters}>
                              重置
                            </Button>
                          </Space>
                        </Col>
                      </Row>
                    </div>

                    <Table
                      columns={brandColumns}
                      dataSource={brands}
                      rowKey="_id"
                      loading={brandsLoading}
                      pagination={{
                        current: brandPagination.current,
                        pageSize: brandPagination.pageSize,
                        total: brandPagination.total,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `共 ${total} 条记录`,
                        onChange: (page, pageSize) => {
                          if (selectedMall) {
                            fetchMallBrands(selectedMall._id, page, pageSize, brandFilters);
                          }
                        },
                        onShowSizeChange: (current, size) => {
                          if (selectedMall) {
                            fetchMallBrands(selectedMall._id, current, size, brandFilters);
                          }
                        },
                      }}
                    />
                  </>
                ) : (
                  <div style={{ textAlign: 'center', padding: '60px 0', color: '#999' }}>
                    <BankOutlined style={{ fontSize: 48, marginBottom: 16 }} />
                    <p>请先在商场管理中选择一个商场查看其品牌信息</p>
                  </div>
                )}
              </Card>
            ),
          },
        ]}
      />

      {/* 商场编辑模态框 */}
      <Modal
        title={editingMall ? '编辑商场' : '新增商场'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingMall(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="商场名称"
                rules={[{ required: true, message: '请输入商场名称' }]}
              >
                <Input placeholder="请输入商场名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="商场编码"
              >
                <Input placeholder="请输入商场编码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="province"
                label="省份"
              >
                <Select
                  placeholder="选择省份"
                  onChange={(value) => {
                    form.setFieldsValue({ city: undefined, district: undefined });
                    setCities([]);
                    setDistricts([]);
                    if (value) {
                      fetchCities(value);
                    }
                  }}
                  allowClear
                >
                  {provinces.map(province => (
                    <Option key={province._id} value={province._id}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="城市"
              >
                <Select
                  placeholder="选择城市"
                  onChange={(value) => {
                    form.setFieldsValue({ district: undefined });
                    setDistricts([]);
                    if (value) {
                      fetchDistricts(value);
                    }
                  }}
                  allowClear
                >
                  {cities.map(city => (
                    <Option key={city._id} value={city._id}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="district"
                label="区县"
              >
                <Select placeholder="选择区县" allowClear>
                  {districts.map(district => (
                    <Option key={district._id} value={district._id}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="详细地址"
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
              >
                <Input placeholder="请输入联系邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="floorCount"
                label="楼层数"
              >
                <InputNumber
                  placeholder="楼层数"
                  min={1}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalArea"
                label="总面积(㎡)"
              >
                <InputNumber
                  placeholder="总面积"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="parkingSpaces"
                label="停车位数量"
              >
                <InputNumber
                  placeholder="停车位数量"
                  min={0}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="website"
            label="官方网站"
          >
            <Input placeholder="请输入官方网站" />
          </Form.Item>

          <Form.Item
            name="openingHours"
            label="营业时间"
          >
            <Input placeholder="请输入营业时间" />
          </Form.Item>

          <Form.Item
            name="description"
            label="商场描述"
          >
            <TextArea rows={3} placeholder="请输入商场描述" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="状态"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingMall ? '更新' : '创建'}
              </Button>
              <Button
                onClick={() => {
                  setModalVisible(false);
                  setEditingMall(null);
                  form.resetFields();
                }}
              >
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MallBrandManagement;