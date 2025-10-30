import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  Tag,
  Select,
  Input,
  Modal,
  Form,
  Rate,
  Badge,
  Tooltip,
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  MessageOutlined,
  CheckOutlined,
  ClockCircleOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { feedbackApi } from '../services/api';
import moment from 'moment';

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Feedback {
  _id: string;
  user: {
    _id: string;
    username: string;
    email: string;
  };
  type: string;
  title: string;
  content: string;
  contact?: string;
  priority: string;
  status: string;
  adminReply?: string;
  attachments: string[];
  relatedPage?: string;
  browserInfo?: string;
  isRead: boolean;
  rating?: number;
  createdAt: string;
  updatedAt: string;
}

const FeedbackManagement: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    type: '',
    priority: '',
    isRead: '',
  });
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [replyModalVisible, setReplyModalVisible] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [replyForm] = Form.useForm();

  useEffect(() => {
    fetchFeedbacks();
  }, [filters]);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getAllFeedback(filters);
      setFeedbacks(response.data.data.feedbacks);
    } catch (error) {
      message.error('获取反馈列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await feedbackApi.updateFeedbackStatus(id, status);
      message.success('状态更新成功');
      fetchFeedbacks();
    } catch (error) {
      message.error('状态更新失败');
    }
  };

  const handleReply = async (values: { reply: string }) => {
    if (!selectedFeedback) return;

    try {
      await feedbackApi.replyFeedback(selectedFeedback._id, values.reply);
      message.success('回复成功');
      setReplyModalVisible(false);
      replyForm.resetFields();
      fetchFeedbacks();
    } catch (error) {
      message.error('回复失败');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await feedbackApi.deleteFeedback(id);
      message.success('删除成功');
      fetchFeedbacks();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleBatchMarkAsRead = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请选择要标记的反馈');
      return;
    }

    try {
      await feedbackApi.markAsRead(selectedRowKeys);
      message.success('批量标记已读成功');
      setSelectedRowKeys([]);
      fetchFeedbacks();
    } catch (error) {
      message.error('批量标记已读失败');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'processing': return 'blue';
      case 'resolved': return 'green';
      case 'closed': return 'gray';
      default: return 'default';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'green';
      case 'medium': return 'orange';
      case 'high': return 'red';
      case 'urgent': return 'purple';
      default: return 'default';
    }
  };

  const getTypeText = (type: string) => {
    const typeMap: { [key: string]: string } = {
      bug: '错误报告',
      feature: '功能建议',
      improvement: '改进建议',
      question: '问题咨询',
      complaint: '投诉建议',
      other: '其他'
    };
    return typeMap[type] || type;
  };

  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      render: (text: string, record: Feedback) => (
        <div>
          <div style={{ fontWeight: 500 }}>{text}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.user?.username || '-'} ({record.user?.email || '-'})
          </div>
        </div>
      ),
    },
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (type: string) => (
        <Tag color="blue">{getTypeText(type)}</Tag>
      ),
    },
    {
      title: '优先级',
      dataIndex: 'priority',
      key: 'priority',
      width: 80,
      render: (priority: string) => (
        <Tag color={getPriorityColor(priority)}>
          {priority.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: Feedback) => (
        <Select
          value={status}
          style={{ width: 100 }}
          size="small"
          onChange={(value) => handleStatusChange(record._id, value)}
        >
          <Option value="pending">待处理</Option>
          <Option value="processing">处理中</Option>
          <Option value="resolved">已解决</Option>
          <Option value="closed">已关闭</Option>
        </Select>
      ),
    },
    {
      title: '阅读状态',
      dataIndex: 'isRead',
      key: 'isRead',
      width: 80,
      render: (isRead: boolean) => (
        <Badge
          status={isRead ? 'success' : 'error'}
          text={isRead ? '已读' : '未读'}
        />
      ),
    },
    {
      title: '评分',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      render: (rating: number) => (
        rating ? <Rate disabled value={rating} style={{ fontSize: 14 }} /> : '-'
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: string) => moment(date).format('YYYY-MM-DD HH:mm'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: Feedback) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedFeedback(record);
                setDetailModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="回复">
            <Button
              type="text"
              icon={<MessageOutlined />}
              onClick={() => {
                setSelectedFeedback(record);
                setReplyModalVisible(true);
              }}
            />
          </Tooltip>
          <Popconfirm
            title="确定要删除这个反馈吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Tooltip title="删除">
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
              />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => {
      setSelectedRowKeys(keys as string[]);
    },
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
              <Col>
                <Title level={4} style={{ margin: 0 }}>用户反馈管理</Title>
              </Col>
              <Col>
                <Space>
                  <Button
                    type="primary"
                    onClick={handleBatchMarkAsRead}
                    disabled={selectedRowKeys.length === 0}
                  >
                    批量标记已读
                  </Button>
                </Space>
              </Col>
            </Row>

            <Row gutter={16} style={{ marginBottom: 16 }}>
              <Col span={6}>
                <Select
                  placeholder="筛选状态"
                  allowClear
                  style={{ width: '100%' }}
                  value={filters.status || undefined}
                  onChange={(value) => setFilters({ ...filters, status: value || '' })}
                >
                  <Option value="pending">待处理</Option>
                  <Option value="processing">处理中</Option>
                  <Option value="resolved">已解决</Option>
                  <Option value="closed">已关闭</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  placeholder="筛选类型"
                  allowClear
                  style={{ width: '100%' }}
                  value={filters.type || undefined}
                  onChange={(value) => setFilters({ ...filters, type: value || '' })}
                >
                  <Option value="bug">错误报告</Option>
                  <Option value="feature">功能建议</Option>
                  <Option value="improvement">改进建议</Option>
                  <Option value="question">问题咨询</Option>
                  <Option value="complaint">投诉建议</Option>
                  <Option value="other">其他</Option>
                </Select>
              </Col>
              <Col span={6}>
                <Select
                  placeholder="筛选优先级"
                  allowClear
                  style={{ width: '100%' }}
                  value={filters.priority || undefined}
                  onChange={(value) => setFilters({ ...filters, priority: value || '' })}
                >
                  <Option value="low">低</Option>
                  <Option value="medium">中</Option>
                  <Option value="high">高</Option>
                  <Option value="urgent">紧急</Option>
                </Select>
              </Col>
              <Col span={4}>
                <Select
                  placeholder="筛选阅读状态"
                  allowClear
                  style={{ width: '100%' }}
                  value={filters.isRead || undefined}
                  onChange={(value) => setFilters({ ...filters, isRead: value || '' })}
                >
                  <Option value="true">已读</Option>
                  <Option value="false">未读</Option>
                </Select>
              </Col>
              <Col span={2}>
                <Button onClick={() => setFilters({ ...filters })}>搜索</Button>
              </Col>
            </Row>

            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={feedbacks}
              rowKey="_id"
              loading={loading}
              pagination={{
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total) => `共 ${total} 条记录`,
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 详情模态框 */}
      <Modal
        title="反馈详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedFeedback && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>标题：</strong>{selectedFeedback.title}</p>
                <p><strong>类型：</strong><Tag color="blue">{getTypeText(selectedFeedback.type)}</Tag></p>
                <p><strong>优先级：</strong><Tag color={getPriorityColor(selectedFeedback.priority)}>{selectedFeedback.priority.toUpperCase()}</Tag></p>
                <p><strong>状态：</strong><Tag color={getStatusColor(selectedFeedback.status)}>{selectedFeedback.status}</Tag></p>
              </Col>
              <Col span={12}>
                <p><strong>用户：</strong>{selectedFeedback.user?.username || '-'} ({selectedFeedback.user?.email || '-'})</p>
                <p><strong>联系方式：</strong>{selectedFeedback.contact || '-'}</p>
                <p><strong>相关页面：</strong>{selectedFeedback.relatedPage || '-'}</p>
                <p><strong>创建时间：</strong>{moment(selectedFeedback.createdAt).format('YYYY-MM-DD HH:mm:ss')}</p>
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <p><strong>反馈内容：</strong></p>
              <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                {selectedFeedback.content}
              </div>
            </div>
            {selectedFeedback.adminReply && (
              <div style={{ marginTop: 16 }}>
                <p><strong>管理员回复：</strong></p>
                <div style={{ background: '#e6f7ff', padding: 12, borderRadius: 4 }}>
                  {selectedFeedback.adminReply}
                </div>
              </div>
            )}
            {selectedFeedback.rating && (
              <div style={{ marginTop: 16 }}>
                <p><strong>用户评分：</strong></p>
                <Rate disabled value={selectedFeedback.rating} />
              </div>
            )}
            {selectedFeedback.browserInfo && (
              <div style={{ marginTop: 16 }}>
                <p><strong>浏览器信息：</strong></p>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {selectedFeedback.browserInfo}
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 回复模态框 */}
      <Modal
        title="回复反馈"
        open={replyModalVisible}
        onCancel={() => {
          setReplyModalVisible(false);
          replyForm.resetFields();
        }}
        onOk={() => replyForm.submit()}
        okText="发送回复"
        cancelText="取消"
      >
        <Form
          form={replyForm}
          onFinish={handleReply}
          layout="vertical"
        >
          <Form.Item
            name="reply"
            label="回复内容"
            rules={[{ required: true, message: '请输入回复内容' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入回复内容..."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FeedbackManagement;