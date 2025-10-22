import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Switch,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Tag,
  Input,
} from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { userApi } from '../services/api';
import UserFormModal from '../components/UserFormModal';
import moment from 'moment';

const { Title } = Typography;
const { Search } = Input;

interface User {
  _id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
  lastLogin: string;
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (search?: string) => {
    try {
      setLoading(true);
      const params = search ? { search } : {};
      const response = await userApi.getUsers(params);
      setUsers(response.data.data.users);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    fetchUsers(value);
  };

  const handleStatusChange = async (userId: string, isActive: boolean) => {
    try {
      await userApi.updateUserStatus(userId, isActive);
      message.success('状态更新成功');
      fetchUsers(searchText);
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleAdd = () => {
    setEditingUser(null);
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setModalVisible(true);
  };

  const handleDelete = async (userId: string) => {
    try {
      await userApi.deleteUser(userId);
      message.success('用户删除成功');
      fetchUsers(searchText);
    } catch (error) {
      message.error('删除用户失败');
    }
  };

  const handleModalSuccess = () => {
    fetchUsers(searchText);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setEditingUser(null);
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
      sorter: (a: User, b: User) => a.username.localeCompare(b.username),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: User, b: User) => a.email.localeCompare(b.email),
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? '管理员' : '用户'}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean, record: User) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleStatusChange(record._id, checked)}
        />
      ),
    },
    {
      title: '最后登录',
      dataIndex: 'lastLogin',
      key: 'lastLogin',
      render: (lastLogin: string) =>
        lastLogin ? moment(lastLogin).format('YYYY-MM-DD HH:mm:ss') : '从未登录',
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (createdAt: string) =>
        moment(createdAt).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_, record: User) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个用户吗？"
            description="删除后将无法恢复，请谨慎操作。"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              size="small"
              danger
              icon={<DeleteOutlined />}
            >
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
          <Title level={2}>用户管理</Title>
        </Col>
        <Col>
          <Space>
            <Search
              placeholder="搜索用户名或邮箱"
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              onSearch={handleSearch}
              style={{ width: 250 }}
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleAdd}
            >
              新增用户
            </Button>
          </Space>
        </Col>
      </Row>

      <Card>
        <Table
          columns={columns}
          dataSource={users}
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

      <UserFormModal
        visible={modalVisible}
        onCancel={handleModalCancel}
        onSuccess={handleModalSuccess}
        editingUser={editingUser}
      />
    </div>
  );
};

export default UserManagement;