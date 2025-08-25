import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  Select,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { districtApi, provinceApi, cityApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

interface District {
  _id: string;
  name: string;
  code: string;
  city: {
    _id: string;
    name: string;
  };
  province: {
    _id: string;
    name: string;
  };
  brandCount: number;
  mallCount: number;
  isActive: boolean;
}

const DistrictManagement: React.FC = () => {
  const [districts, setDistricts] = useState<District[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<District | null>(null);
  const [form] = Form.useForm();

  // Search states
  const [searchDistrict, setSearchDistrict] = useState('');
  const [selectedCityId, setSelectedCityId] = useState<string | undefined>(undefined);
  const [selectedProvinceId, setSelectedProvinceId] = useState<string | undefined>(undefined);
  const [allCities, setAllCities] = useState<any[]>([]);
  const [filteredCities, setFilteredCities] = useState<any[]>([]);

  useEffect(() => {
    fetchDistricts();
    fetchProvinces();
    fetchAllCities();
  }, []);

  const fetchDistricts = async () => {
    try {
      setLoading(true);
      const response = await districtApi.getDistricts();
      setDistricts(response.data.data.districts);
    } catch (error) {
      message.error('获取区县列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await provinceApi.getProvinces();
      setProvinces(response.data.data.provinces);
    } catch (error) {
      message.error('获取省份列表失败');
    }
  };

  const fetchCities = async (provinceId: string) => {
    try {
      const response = await cityApi.getCities({ provinceId });
      setCities(response.data.data.cities);
    } catch (error) {
      message.error('获取城市列表失败');
    }
  };

  const fetchAllCities = async () => {
    try {
      const response = await cityApi.getCities({});
      setAllCities(response.data.data.cities);
      setFilteredCities(response.data.data.cities);
    } catch (error) {
      message.error('获取所有城市列表失败');
    }
  };

  const handleProvinceSelectChange = (provinceId: string | undefined) => {
    setSelectedProvinceId(provinceId);
    setSelectedCityId(undefined); // 清空城市选择

    if (provinceId) {
      // 根据选择的省份过滤城市
      const citiesInProvince = allCities.filter(city => {
        // 处理city.province可能是ObjectId字符串或对象的情况
        const cityProvinceId = typeof city.province === 'string' ? city.province : city.province?._id;
        return cityProvinceId === provinceId;
      });
      setFilteredCities(citiesInProvince);
      console.log('Filtered cities for province:', provinceId, citiesInProvince);
    } else {
      // 如果没有选择省份，显示所有城市
      setFilteredCities(allCities);
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    form.setFieldsValue({ city: undefined });
    if (provinceId) {
      fetchCities(provinceId);
    } else {
      setCities([]);
    }
  };

  const handleAdd = () => {
    setEditingDistrict(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: District) => {
    setEditingDistrict(record);
    form.setFieldsValue({
      ...record,
      province: record.province._id,
      city: record.city._id,
    });
    fetchCities(record.province._id);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await districtApi.deleteDistrict(id);
      message.success('删除成功');
      fetchDistricts();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingDistrict) {
        await districtApi.updateDistrict(editingDistrict._id, values);
        message.success('更新成功');
      } else {
        await districtApi.createDistrict(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchDistricts();
    } catch (error) {
      message.error(editingDistrict ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '区县名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: District, b: District) => a.name.localeCompare(b.name),
    },
    {
      title: '区县代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '所属城市',
      dataIndex: ['city', 'name'],
      key: 'city',
    },
    {
      title: '所属省份',
      dataIndex: ['province', 'name'],
      key: 'province',
    },
    {
      title: '品牌数',
      dataIndex: 'brandCount',
      key: 'brandCount',
      sorter: (a: District, b: District) => a.brandCount - b.brandCount,
    },
    {
      title: '商场数',
      dataIndex: 'mallCount',
      key: 'mallCount',
      sorter: (a: District, b: District) => a.mallCount - b.mallCount,
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: District) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个区县吗？"
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

  // Filtered districts with search and select filters
  const filteredDistricts = useMemo(() => {
    return districts.filter(district => {
      const districtMatch = !searchDistrict ||
        district.name.toLowerCase().includes(searchDistrict.toLowerCase());

      const cityMatch = !selectedCityId ||
        district.city._id === selectedCityId;

      const provinceMatch = !selectedProvinceId ||
        district.province._id === selectedProvinceId;

      return districtMatch && cityMatch && provinceMatch;
    });
  }, [districts, searchDistrict, selectedCityId, selectedProvinceId]);

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>区县管理</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加区县
          </Button>
        </Col>
      </Row>

      {/* Search Section */}
      <Card style={{ marginBottom: 16 }}>
        <Row gutter={16}>

          <Col span={8}>
            <Select
              placeholder="选择省份"
              value={selectedProvinceId}
              onChange={handleProvinceSelectChange}
              allowClear
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ||
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {provinces.map(province => (
                <Option key={province._id} value={province._id}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Select
              placeholder="选择城市"
              value={selectedCityId}
              onChange={setSelectedCityId}
              allowClear
              style={{ width: '100%' }}
              showSearch
              filterOption={(input, option) =>
                (option?.label as string)?.toLowerCase().includes(input.toLowerCase()) ||
                (option?.children as unknown as string)?.toLowerCase().includes(input.toLowerCase())
              }
            >
              {filteredCities.map(city => (
                <Option key={city._id} value={city._id}>
                  {city.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col span={8}>
            <Input
              placeholder="搜索区县名称"
              prefix={<SearchOutlined />}
              value={searchDistrict}
              onChange={(e) => setSearchDistrict(e.target.value)}
              allowClear
            />
          </Col>
        </Row>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={filteredDistricts}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingDistrict ? '编辑区县' : '添加区县'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
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
                label="区县名称"
                rules={[{ required: true, message: '请输入区县名称' }]}
              >
                <Input placeholder="请输入区县名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="区县代码"
                rules={[{ required: true, message: '请输入区县代码' }]}
              >
                <Input placeholder="请输入区县代码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="province"
                label="所属省份"
                rules={[{ required: true, message: '请选择所属省份' }]}
              >
                <Select
                  placeholder="请选择所属省份"
                  onChange={handleProvinceChange}
                >
                  {provinces.map(province => (
                    <Option key={province._id} value={province._id}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="city"
                label="所属城市"
                rules={[{ required: true, message: '请选择所属城市' }]}
              >
                <Select placeholder="请选择所属城市">
                  {cities.map(city => (
                    <Option key={city._id} value={city._id}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="brandCount"
                label="品牌数"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="mallCount"
                label="商场数"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {editingDistrict && (
            <Form.Item
              name="isActive"
              label="状态"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingDistrict ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DistrictManagement;