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
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { provinceApi } from '../services/api';

const { Title } = Typography;

interface Province {
  _id: string;
  name: string;
  code: string;
  brandCount: number;
  mallCount: number;
  districtCount: number;
  isActive: boolean;
}

const ProvinceManagement: React.FC = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProvince, setEditingProvince] = useState<Province | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchProvinces = async () => {
    try {
      setLoading(true);
      const response = await provinceApi.getProvinces({ limit: 50 });
      setProvinces(response.data.data.provinces);
    } catch (error) {
      message.error('获取省份列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingProvince(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Province) => {
    setEditingProvince(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await provinceApi.deleteProvince(id);
      message.success('删除成功');
      fetchProvinces();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingProvince) {
        await provinceApi.updateProvince(editingProvince._id, values);
        message.success('更新成功');
      } else {
        await provinceApi.createProvince(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchProvinces();
    } catch (error) {
      message.error(editingProvince ? '更新失败' : '创建失败');
    }
  };

  const columns = [
    {
      title: '省份名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Province, b: Province) => a.name.localeCompare(b.name),
    },
    {
      title: '省份代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '品牌数',
      dataIndex: 'brandCount',
      key: 'brandCount',
      sorter: (a: Province, b: Province) => a.brandCount - b.brandCount,
    },
    {
      title: '商场数',
      dataIndex: 'mallCount',
      key: 'mallCount',
      sorter: (a: Province, b: Province) => a.mallCount - b.mallCount,
    },
    {
      title: '区县数',
      dataIndex: 'districtCount',
      key: 'districtCount',
      sorter: (a: Province, b: Province) => a.districtCount - b.districtCount,
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
      render: (_: any, record: Province) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个省份吗？"
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
          <Title level={2}>省份管理</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加省份
          </Button>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={provinces}
          rowKey="_id"
          loading={loading}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Card>

      <Modal
        title={editingProvince ? '编辑省份' : '添加省份'}
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
                label="省份名称"
                rules={[{ required: true, message: '请输入省份名称' }]}
              >
                <Input placeholder="请输入省份名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="省份代码"
                rules={[{ required: true, message: '请输入省份代码' }]}
              >
                <Input placeholder="请输入省份代码" />
              </Form.Item>
            </Col>
          </Row>

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

          {editingProvince && (
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
                {editingProvince ? '更新' : '创建'}
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

export default ProvinceManagement; 