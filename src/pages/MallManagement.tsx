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
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { mallApi, provinceApi, cityApi, districtApi } from '../services/api';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

const MallManagement: React.FC = () => {
  const [malls, setMalls] = useState<Mall[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMall, setEditingMall] = useState<Mall | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchMalls();
    fetchProvinces();

  }, []);

  const fetchMalls = async () => {
    try {
      setLoading(true);
      const response = await mallApi.getMalls();
      setMalls(response.data.data.malls);
    } catch (error) {
      message.error('获取商场列表失败');
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

  const fetchDistricts = async (cityId: string) => {
    try {
      const response = await districtApi.getDistricts({ cityId });
      setDistricts(response.data.data.districts);
    } catch (error) {
      message.error('获取区县列表失败');
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    form.setFieldsValue({ city: undefined, district: undefined });
    if (provinceId) {
      fetchCities(provinceId);
    } else {
      setCities([]);
      setDistricts([]);
    }
  };

  const handleCityChange = (cityId: string) => {
    form.setFieldsValue({ district: undefined });
    if (cityId) {
      fetchDistricts(cityId);
    } else {
      setDistricts([]);
    }
  };

  const handleAdd = () => {
    setEditingMall(null);
    form.resetFields();
    form.setFieldsValue({ province: '68a282e76e1688af0d5ca7cf' });
    fetchCities('68a282e76e1688af0d5ca7cf');

    setModalVisible(true);
  };

  const handleEdit = (record: Mall) => {
    setEditingMall(record);
    form.setFieldsValue({
      ...record,
      province: record.province?._id,
      city: record.city?._id,
      district: record.district?._id,
    });
    fetchCities(record.province?._id);
    if (record.city?._id) {
      fetchDistricts(record.city?._id);
    }
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await mallApi.deleteMall(id);
      message.success('删除成功');
      fetchMalls();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingMall) {
        await mallApi.updateMall(editingMall._id, values);
        message.success('更新成功');
      } else {
        await mallApi.createMall(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchMalls();
    } catch (error) {
      message.error(editingMall ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '商场名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Mall, b: Mall) => a.name.localeCompare(b.name),
    },
    {
      title: '商场代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '省份',
      dataIndex: ['province', 'name'],
      key: 'province',
    },
    {
      title: '城市',
      dataIndex: ['city', 'name'],
      key: 'city',
    },
    {
      title: '区县',
      dataIndex: ['district', 'name'],
      key: 'district',
    },
    {
      title: '楼层数',
      dataIndex: 'floorCount',
      key: 'floorCount',
    },
    {
      title: '总面积(㎡)',
      dataIndex: 'totalArea',
      key: 'totalArea',
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
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Mall) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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

  return (
    <div>
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Title level={2}>商场管理</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加商场
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={malls}
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
        title={editingMall ? '编辑商场' : '添加商场'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
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
                label="商场代码"
                rules={[{ required: true, message: '请输入商场代码' }]}
              >
                <Input placeholder="请输入商场代码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="website"
                label="官方网站"
              >
                <Input placeholder="请输入官方网站" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="openingHours"
                label="营业时间"
              >
                <Input placeholder="如: 10:00-22:00" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="province"
                label="所属省份"
                rules={[{ required: true, message: '请选择所属省份' }]}
              >
                <Select
                  placeholder="请选择所属省份"
                  optionFilterProp="label"
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
            <Col span={8}>
              <Form.Item
                name="city"
                label="所属城市"
                rules={[{ required: true, message: '请选择所属城市' }]}
              >
                <Select
                  placeholder="请选择所属城市"
                  onChange={handleCityChange}
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
                label="所属区县"
              >
                <Select placeholder="请选择所属区县">
                  {districts.map(district => (
                    <Option key={district._id} value={district._id}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="floorCount"
                label="楼层数"
                initialValue={1}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="totalArea"
                label="总面积(㎡)"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="parkingSpaces"
                label="停车位数量"
                initialValue={0}
              >
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

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

          <Form.Item
            name="address"
            label="详细地址"
          >
            <Input placeholder="请输入详细地址" />
          </Form.Item>

          <Form.Item
            name="description"
            label="商场描述"
          >
            <TextArea rows={3} placeholder="请输入商场描述" />
          </Form.Item>

          {editingMall && (
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
                {editingMall ? '更新' : '创建'}
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

export default MallManagement; 