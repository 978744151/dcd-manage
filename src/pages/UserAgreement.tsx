import React, { useEffect, useState } from 'react';
import { Button, Typography, Card, Space, Alert, Divider } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './UserAgreement.css';

const { Title, Paragraph, Text } = Typography;

const UserAgreement: React.FC = () => {
  const navigate = useNavigate();
  const [updateDate, setUpdateDate] = useState<string>('');

  useEffect(() => {
    // 设置当前日期
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    setUpdateDate(`${year}年${month}月${day}日`);

    // 检查是否已经同意过协议
    const isAgreed = localStorage.getItem('userAgreementAccepted');
    if (isAgreed === 'true') {
      console.log('用户已同意协议');
    }
  }, []);

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAgree = () => {
    // 保存用户同意状态到本地存储
    localStorage.setItem('userAgreementAccepted', 'true');
    localStorage.setItem('agreementAcceptDate', new Date().toISOString());

    console.log('用户同意协议');

    // 返回上一页
    navigate(-1);
  };

  return (
    <div className="user-agreement">
      {/* Header */}
      {/* <div className="agreement-header">
        <Button 
          type="text" 
          icon={<ArrowLeftOutlined />} 
          onClick={handleGoBack}
          className="back-button"
        />
        <Title level={4} className="header-title">用户协议与免责声明</Title>
      </div> */}

      {/* Content */}
      <div className="agreement-content">
        <Card className="agreement-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 标题和更新日期 */}
            <div>
              <Title level={2} className="agreement-title">用户协议与免责声明</Title>
              <Text type="secondary" className="update-date">
                最后更新日期：{updateDate}
              </Text>
            </div>

            {/* 重要提示 */}
            <Alert
              message="重要提示"
              description="请仔细阅读以下协议。使用本应用即表示您同意接受本协议的所有条款。"
              type="warning"
              icon={<ExclamationCircleOutlined />}
              showIcon
            />

            {/* 知识产权声明 */}
            <div>
              <Title level={4} className="section-title">知识产权声明</Title>
              <Paragraph>
                <Text>1. 本应用中提及的所有品牌名称、商标、Logo均归各自品牌权利人所有。</Text><br />
                <Text>2. 本应用对品牌信息的使用属于描述性、事实性使用，旨在为用户提供商场品牌信息查询和对比服务。</Text><br />
                <Text>3. 本应用与任何品牌方不存在官方授权、赞助或许可关系。</Text><br />
                <Text>4. 本应用不声称对任何第三方品牌拥有所有权或控制权。</Text>
              </Paragraph>
            </div>

            <Divider />

            {/* 免责声明 */}
            <div>
              <Title level={4} className="section-title">免责声明</Title>
              <Paragraph>
                <Text>1. 本应用提供的品牌信息仅供参考，不保证信息的准确性、完整性或及时性。</Text><br />
                <Text>2. 用户应知悉品牌信息可能随时变更，建议在使用前通过官方渠道核实相关信息。</Text><br />
                <Text>3. 本应用不对因使用品牌信息而导致的任何直接、间接损失承担责任。</Text><br />
                <Text>4. 品牌对比结果基于用户提供的数据生成，不代表本应用的官方推荐或评价。</Text>
              </Paragraph>
            </div>

            <Divider />

            {/* 用户责任 */}
            <div>
              <Title level={4} className="section-title">用户责任</Title>
              <Paragraph>
                <Text>1. 用户应遵守相关法律法规，不得利用本应用从事任何侵权或违法行为。</Text><br />
                <Text>2. 用户不得将本应用信息用于商业用途或误导性宣传。</Text><br />
                <Text>3. 如用户发现侵权信息，应及时通过应用内反馈渠道通知我们。</Text><br />
                <Text>4. 用户应对其使用本应用的行为承担全部责任。</Text>
              </Paragraph>
            </div>

            <Divider />

            {/* 服务条款 */}
            <div>
              <Title level={4} className="section-title">服务条款</Title>
              <Paragraph>
                <Text>1. 本应用保留随时修改或终止服务的权利，恕不另行通知。</Text><br />
                <Text>2. 我们致力于保护用户隐私，具体政策请参阅《隐私政策》。</Text><br />
                <Text>3. 如有任何问题或建议，请通过应用内反馈功能联系我们。</Text><br />
                <Text>4. 本协议的最终解释权归应用开发者所有。</Text>
              </Paragraph>
            </div>

            {/* 同意按钮 */}
            {/* <div className="agreement-actions">
              <Space size="middle">
                <Button size="large" onClick={handleGoBack}>
                  返回
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={handleAgree}
                  className="agree-button"
                >
                  同意并继续
                </Button>
              </Space>
            </div> */}
          </Space>
        </Card>
      </div>
    </div>
  );
};

export default UserAgreement;