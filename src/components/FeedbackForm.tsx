import React, { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Select,
  Button,
  Upload,
  message,
  Rate,
  Row,
  Col,
} from 'antd';
import { PlusOutlined, InboxOutlined } from '@ant-design/icons';
import { feedbackApi } from '../services/api';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

interface FeedbackFormProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // 获取浏览器信息
      const browserInfo = {
        userAgent: navigator.userAgent,
        language: navigator.language,
        platform: navigator.platform,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine,
        screen: {
          width: screen.width,
          height: screen.height,
          colorDepth: screen.colorDepth,
        },
        viewport: {
          width: window.innerWidth,
          height: window.innerHeight,
        },
        url: window.location.href,
        timestamp: new Date().toISOString(),
      };

      const feedbackData = {
        ...values,
        attachments: fileList.map(file => file.response?.url || file.url).filter(Boolean),
        relatedPage: window.location.href,
        browserInfo: JSON.stringify(browserInfo),
      };

      await feedbackApi.createFeedback(feedbackData);
      message.success('反馈提交成功，感谢您的建议！');
      form.resetFields();
      setFileList([]);
      onCancel();
      onSuccess?.();
    } catch (error) {
      message.error('反馈提交失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    name: 'file',
    multiple: true,
    action: '/api/upload', // 需要配置文件上传接口
    fileList,
    onChange: (info: any) => {
      setFileList(info.fileList);
      
      if (info.file.status === 'done') {
        message.success(`${info.file.name} 文件上传成功`);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} 文件上传失败`);
      }
    },
    beforeUpload: (file: any) => {
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        message.error('文件大小不能超过 10MB!');
        return false;
      }
      return true;
    },
  };

  return (
    <Modal
      title="用户反馈"
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          type: 'improvement',
          priority: 'medium',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="type"
              label="反馈类型"
              rules={[{ required: true, message: '请选择反馈类型' }]}
            >
              <Select placeholder="请选择反馈类型">
                <Option value="bug">错误报告</Option>
                <Option value="feature">功能建议</Option>
                <Option value="improvement">改进建议</Option>
                <Option value="question">问题咨询</Option>
                <Option value="complaint">投诉建议</Option>
                <Option value="other">其他</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="priority"
              label="优先级"
              rules={[{ required: true, message: '请选择优先级' }]}
            >
              <Select placeholder="请选择优先级">
                <Option value="low">低</Option>
                <Option value="medium">中</Option>
                <Option value="high">高</Option>
                <Option value="urgent">紧急</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="title"
          label="反馈标题"
          rules={[
            { required: true, message: '请输入反馈标题' },
            { max: 100, message: '标题不能超过100个字符' }
          ]}
        >
          <Input placeholder="请简要描述您的问题或建议" />
        </Form.Item>

        <Form.Item
          name="content"
          label="详细描述"
          rules={[
            { required: true, message: '请输入详细描述' },
            { min: 10, message: '描述至少需要10个字符' },
            { max: 2000, message: '描述不能超过2000个字符' }
          ]}
        >
          <TextArea
            rows={6}
            placeholder="请详细描述您遇到的问题或建议，包括操作步骤、期望结果等"
            showCount
            maxLength={2000}
          />
        </Form.Item>

        <Form.Item
          name="contact"
          label="联系方式（可选）"
          rules={[
            { max: 100, message: '联系方式不能超过100个字符' }
          ]}
        >
          <Input placeholder="如需回复，请留下您的联系方式（邮箱、电话等）" />
        </Form.Item>

        <Form.Item
          name="attachments"
          label="附件（可选）"
        >
          <Dragger {...uploadProps} style={{ marginBottom: 16 }}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽文件到此区域上传</p>
            <p className="ant-upload-hint">
              支持单个或批量上传，文件大小不超过10MB
            </p>
          </Dragger>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            取消
          </Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            提交反馈
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default FeedbackForm;