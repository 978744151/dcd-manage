import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, Popconfirm, message, Card, Tag, InputNumber } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { dictionaryApi } from '../services/api';

interface Dictionary {
  _id: string;
  type: string;
  label: string;
  value: string;
  sort: number;
  description?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface DictionaryFormData {
  type: string;
  label: string;
  value: string;
  sort: number;
  description?: string;
  isActive: boolean;
}

const DictionaryManagement: React.FC = () => {
  const [dictionaries, setDictionaries] = useState<Dictionary[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDictionary, setEditingDictionary] = useState<Dictionary | null>(null);
  const [form] = Form.useForm();
  const [searchType, setSearchType] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0
  });

  // 获取字典列表
  const fetchDictionaries = async (page = 1, limit = 20, type = '', search = '') => {
    setLoading(true);
    try {
      const params: any = { page, limit };
      if (type) params.type = type;
      if (search) params.search = search;

      const response = await dictionaryApi.getDictionaries(params);
      if (response.data.success) {
        setDictionaries(response.data.data.dictionaries);
        setPagination({
          current: response.data.data.pagination.page,
          pageSize: response.data.data.pagination.limit,
          total: response.data.data.pagination.total
        });
      }
    } catch (error) {
      message.error('获取字典列表失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取字典类型列表
  const fetchTypes = async () => {
    try {
      const response = await dictionaryApi.getDictionaryTypes();
      if (response.data.success) {
        setTypes(response.data.data.types);
      }
    } catch (error) {
      message.error('获取字典类型失败');
    }
  };

  useEffect(() => {
    fetchDictionaries();
    fetchTypes();
  }, []);

  // 处理搜索
  const handleSearch = () => {
    fetchDictionaries(1, pagination.pageSize, searchType, searchText);
  };

  // 重置搜索
  const handleReset = () => {
    setSearchType('');
    setSearchText('');
    fetchDictionaries(1, pagination.pageSize);
  };

  // 打开添加/编辑模态框
  const openModal = (dictionary?: Dictionary) => {
    setEditingDictionary(dictionary || null);
    setModalVisible(true);
    if (dictionary) {
      form.setFieldsValue({
        type: dictionary.type,
        label: dictionary.label,
        value: dictionary.value,
        sort: dictionary.sort,
        description: dictionary.description,
        isActive: dictionary.isActive
      });
    } else {
      form.resetFields();
      form.setFieldsValue({ isActive: true, sort: 0 });
    }
  };

  // 关闭模态框
  const closeModal = () => {
    setModalVisible(false);
    setEditingDictionary(null);
    form.resetFields();
  };

  // 提交表单
  const handleSubmit = async (values: DictionaryFormData) => {
    try {
      if (editingDictionary) {
        // 更新
        await dictionaryApi.updateDictionary(editingDictionary._id, values);
        message.success('字典项更新成功');
      } else {
        // 创建
        await dictionaryApi.createDictionary(values);
        message.success('字典项创建成功');
      }
      closeModal();
      fetchDictionaries(pagination.current, pagination.pageSize, searchType, searchText);
      fetchTypes(); // 刷新类型列表
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  // 删除字典项
  const handleDelete = async (id: string) => {
    try {
      await dictionaryApi.deleteDictionary(id);
      message.success('字典项删除成功');
      fetchDictionaries(pagination.current, pagination.pageSize, searchType, searchText);
      fetchTypes(); // 刷新类型列表
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  // 表格列定义
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 180,
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    {
      title: '标签',
      dataIndex: 'label',
      key: 'label',
      width: 150
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
      width: 150
    },
    {
      title: '排序',
      dataIndex: 'sort',
      key: 'sort',
      width: 80,
      sorter: (a: Dictionary, b: Dictionary) => a.sort - b.sort
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 80,
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? '启用' : '禁用'}
        </Tag>
      )
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (date: string) => new Date(date).toLocaleString()
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Dictionary) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个字典项吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Card title="字典管理" style={{ marginBottom: '16px' }}>
        <Space style={{ marginBottom: '16px' }}>
          <Select
            placeholder="选择类型"
            style={{ width: 200 }}
            value={searchType}
            onChange={setSearchType}
            allowClear
          >
            {types.map(type => (
              <Select.Option key={type} value={type}>{type}</Select.Option>
            ))}
          </Select>
          <Input
            placeholder="搜索标签、值或类型"
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
          />
          <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>
            搜索
          </Button>
          <Button onClick={handleReset}>
            重置
          </Button>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => openModal()}>
            添加字典项
          </Button>
        </Space>

        <Table
          columns={columns}
          dataSource={dictionaries}
          rowKey="_id"
          loading={loading}
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
            onChange: (page, pageSize) => {
              fetchDictionaries(page, pageSize, searchType, searchText);
            }
          }}
        />
      </Card>

      <Modal
        title={editingDictionary ? '编辑字典项' : '添加字典项'}
        open={modalVisible}
        onCancel={closeModal}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ isActive: true, sort: 0 }}
        >
          <Form.Item
            name="type"
            label="类型"
            rules={[{ required: true, message: '请输入类型' }]}
          >
            <Input placeholder="请输入类型，如：brand_category" />
          </Form.Item>

          <Form.Item
            name="label"
            label="标签"
            rules={[{ required: true, message: '请输入标签' }]}
          >
            <Input placeholder="请输入显示标签" />
          </Form.Item>

          <Form.Item
            name="value"
            label="值"
            rules={[{ required: true, message: '请输入值' }]}
          >
            <Input placeholder="请输入实际值" />
          </Form.Item>

          <Form.Item
            name="sort"
            label="排序"
            rules={[{ required: true, message: '请输入排序号' }]}
          >
            <InputNumber
              placeholder="请输入排序号"
              style={{ width: '100%' }}
              min={0}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea
              placeholder="请输入描述信息（可选）"
              rows={3}
            />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="状态"
            valuePropName="checked"
          >
            <Select>
              <Select.Option value={true}>启用</Select.Option>
              <Select.Option value={false}>禁用</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={closeModal}>
                取消
              </Button>
              <Button type="primary" htmlType="submit">
                {editingDictionary ? '更新' : '创建'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DictionaryManagement;