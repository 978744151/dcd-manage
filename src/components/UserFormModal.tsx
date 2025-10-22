import React, { useEffect } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Row,
  Col,
} from 'antd';
import { userApi } from '../services/api';

const { Option } = Select;

interface User {
  _id?: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  isActive: boolean;
}

interface UserFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  editingUser?: User | null;
}

const UserFormModal: React.FC<UserFormModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  editingUser,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = React.useState(false);

  const isEditing = !!editingUser;

  useEffect(() => {
    if (visible) {
      if (isEditing && editingUser) {
        // 编辑模式：填充表单数据
        form.setFieldsValue({
          username: editingUser.username,
          email: editingUser.email,
          role: editingUser.role,
          isActive: editingUser.isActive,
        });
      } else {
        // 新增模式：重置表单
        form.resetFields();
        form.setFieldsValue({
          role: 'user',
          isActive: true,
        });
      }
    }
  }, [visible, isEditing, editingUser, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (isEditing && editingUser) {
        // 编辑用户
        await userApi.updateUser(editingUser._id!, values);
        message.success('用户信息更新成功');
      } else {
        // 创建用户
        await userApi.createUser(values);
        message.success('用户创建成功');
      }

      onSuccess();
      onCancel();
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error(isEditing ? '更新用户失败' : '创建用户失败');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onCancel();
  };

  return (
    <Modal
      title={isEditing ? '编辑用户' : '新增用户'}
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          role: 'user',
          isActive: true,
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="username"
              label="用户名"
              rules={[
                { required: true, message: '请输入用户名' },
                { min: 1, max: 15, message: '用户名长度为1-15个字符' },
              ]}
            >
              <Input placeholder="请输入用户名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '请输入邮箱' },
                { type: 'email', message: '请输入有效的邮箱地址' },
              ]}
            >
              <Input placeholder="请输入邮箱" disabled={true} />
            </Form.Item>
          </Col>
        </Row>

        {!isEditing && (
          <Form.Item
            name="password"
            label="密码"
            rules={[
              { required: true, message: '请输入密码' },
              { min: 6, message: '密码长度至少6个字符' },
            ]}
          >
            <Input.Password placeholder="请输入密码" />
          </Form.Item>
        )}

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="role"
              label="角色"
              rules={[{ required: true, message: '请选择角色' }]}
            >
              <Select placeholder="请选择角色">
                <Option value="user">普通用户</Option>
                <Option value="admin">管理员</Option>
              </Select>
            </Form.Item>
          </Col>
          {/* <Col span={12}>
            <Form.Item
              name="isActive"
              label="状态"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="启用"
                unCheckedChildren="禁用"
              />
            </Form.Item>
          </Col> */}
        </Row>

        {isEditing && (
          <div style={{
            padding: '12px',
            backgroundColor: '#f6f6f6',
            borderRadius: '6px',
            marginTop: '16px'
          }}>
            <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
              💡 提示：编辑模式下不能修改密码，如需修改密码请联系用户自行修改。
            </p>
          </div>
        )}
      </Form>
    </Modal>
  );
};

export default UserFormModal;