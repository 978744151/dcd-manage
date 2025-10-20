import React, { useState } from 'react';
import { Button, FloatButton } from 'antd';
import { MessageOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import FeedbackForm from './FeedbackForm';

interface FeedbackButtonProps {
  type?: 'button' | 'float';
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

const FeedbackButton: React.FC<FeedbackButtonProps> = ({
  type = 'button',
  size = 'middle',
  style,
}) => {
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const handleFeedbackSuccess = () => {
    // 可以在这里添加成功后的处理逻辑，比如刷新数据等
  };

  if (type === 'float') {
    return (
      <>
        <FloatButton
          icon={<MessageOutlined />}
          tooltip="用户反馈"
          onClick={() => setFeedbackVisible(true)}
          style={style}
        />
        <FeedbackForm
          visible={feedbackVisible}
          onCancel={() => setFeedbackVisible(false)}
          onSuccess={handleFeedbackSuccess}
        />
      </>
    );
  }

  return (
    <>
      <Button
        type="default"
        icon={<QuestionCircleOutlined />}
        size={size}
        onClick={() => setFeedbackVisible(true)}
        style={style}
      >
        意见反馈
      </Button>
      <FeedbackForm
        visible={feedbackVisible}
        onCancel={() => setFeedbackVisible(false)}
        onSuccess={handleFeedbackSuccess}
      />
    </>
  );
};

export default FeedbackButton;