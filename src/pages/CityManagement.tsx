import React, { useState, useEffect } from 'react';
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
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { cityApi, provinceApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;

interface City {
  _id: string;
  name: string;
  code: string;
  province: {
    _id: string;
    name: string;
  };
  brandCount: number;
  mallCount: number;
  districtCount: number;
  isActive: boolean;
}

interface Province {
  _id: string;
  name: string;
}

const CityManagement: React.FC = () => {
  const [cities, setCities] = useState<City[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCities();
    fetchProvinces();
  }, []);

  useEffect(() => {
    fetchCities();
  }, [selectedProvince, searchText]);

  const fetchCities = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (selectedProvince) {
        params.provinceId = selectedProvince;
      }
      if (searchText) {
        params.search = searchText;
      }
      const response = await cityApi.getCities({ ...params, limit: 0 });
      setCities(response.data.data.cities);
    } catch (error) {
      message.error('获取城市列表失败');
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

  const handleAdd = () => {
    setEditingCity(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: City) => {
    setEditingCity(record);
    form.setFieldsValue({
      ...record,
      province: record.province._id,
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await cityApi.deleteCity(id);
      message.success('删除成功');
      fetchCities();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingCity) {
        await cityApi.updateCity(editingCity._id, values);
        message.success('更新成功');
      } else {
        await cityApi.createCity(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchCities();
    } catch (error) {
      message.error(editingCity ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '城市名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: City, b: City) => a.name.localeCompare(b.name),
    },
    {
      title: '城市代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '所属省份',
      dataIndex: ['province', 'name'],
      key: 'province',
      sorter: (a: City, b: City) => a.province.name.localeCompare(b.province.name),
    },
    {
      title: '品牌数',
      dataIndex: 'brandCount',
      key: 'brandCount',
      sorter: (a: City, b: City) => a.brandCount - b.brandCount,
    },
    {
      title: '商场数',
      dataIndex: 'mallCount',
      key: 'mallCount',
      sorter: (a: City, b: City) => a.mallCount - b.mallCount,
    },
    {
      title: '区县数',
      dataIndex: 'districtCount',
      key: 'districtCount',
      sorter: (a: City, b: City) => a.districtCount - b.districtCount,
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
      render: (_: any, record: City) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个城市吗？"
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

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>城市管理</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加城市
          </Button>
        </Col>
      </Row>

      <Card>
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Select
              placeholder="选择省份筛选"
              value={selectedProvince || undefined}
              onChange={(value) => setSelectedProvince(value || '')}
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
          <Col span={8}>
            <Input.Search
              placeholder="搜索城市名称"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={() => fetchCities()}
              allowClear
              style={{ width: '100%' }}
            />
          </Col>
          <Col span={8}>
            <Space>
              <Button onClick={() => {
                setSelectedProvince('');
                setSearchText('');
              }}>
                重置筛选
              </Button>
              <Button type="primary" onClick={fetchCities}>
                刷新数据
              </Button>
            </Space>
          </Col>
        </Row>
        <Table
          columns={columns}
          dataSource={cities}
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
        title={editingCity ? '编辑城市' : '添加城市'}
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
                label="城市名称"
                rules={[{ required: true, message: '请输入城市名称' }]}
              >
                <Input placeholder="请输入城市名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="城市代码"
                rules={[{ required: true, message: '请输入城市代码' }]}
              >
                <Input placeholder="请输入城市代码" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="province"
            label="所属省份"
            rules={[{ required: true, message: '请选择所属省份' }]}
          >
            <Select placeholder="请选择所属省份">
              {provinces.map(province => (
                <Option key={province._id} value={province._id}>
                  {province.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="brandCount"
                label="品牌数"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="mallCount"
                label="商场数"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="districtCount"
                label="区县数"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          {editingCity && (
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
                {editingCity ? '更新' : '创建'}
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

export default CityManagement;