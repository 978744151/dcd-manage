import React from 'react';
import { Button, Typography, Card, Space, Alert, Divider } from 'antd';
import { ArrowLeftOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './PrivacyPolicy.css';

const { Title, Paragraph, Text } = Typography;

const PrivacyPolicy: React.FC = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  const handleAgree = () => {
    // 可以在这里添加同意隐私协议的逻辑
    console.log('用户同意隐私协议');
    navigate(-1);
  };

  return (
    <div className="privacy-policy">
      {/* Header */}
      <div className="privacy-header">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={handleGoBack}
          className="back-button"
        />
        <Title level={4} className="header-title">隐私政策</Title>
      </div>

      {/* Content */}
      <div className="privacy-content">
        <Card className="privacy-card">
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* 标题和更新日期 */}
            <div>
              <Title level={2} className="policy-title">关于懂商帝与隐私的声明</Title>
              <Text type="secondary" className="update-date">
                更新日期：2025.10.30
              </Text>
            </div>

            {/* 重要提示 */}
            <Alert
              message="重要提示"
              description={'懂商帝 是由 陈滔 （以下简称"我们"）为您提供的，用于懂商帝的应用。本隐私声明由我们为处理您的个人信息而制定。我们非常重视您的个人信息和隐私保护，将会按照法律要求和业界成熟的安全标准，为您的个人信息提供相应的安全保护措施。'}
              type="info"
              icon={<ExclamationCircleOutlined />}
              showIcon
            />

            {/* 1. 我们如何收集和使用您的个人信息 */}
            <div>
              <Title level={4} className="section-title">1. 我们如何收集和使用您的个人信息</Title>
              <Paragraph>
                <Text>我们仅在有合法性基础的情形下才会使用您的个人信息。根据适用的法律，我们可能会基于您的同意、为履行/订立您与我们的合同所必需、履行法定义务所必需等合法性基础，使用您的个人信息。</Text>
              </Paragraph>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>1.1</Text>
                <Paragraph style={{ marginLeft: '16px', marginTop: '8px' }}>
                  <Text>我们为您提供了基本功能服务和全量功能服务，您可以前往懂商帝进行选择，不同设备或版本其路径可能存在差异，具体以您当前使用的设备为准。在基本功能服务下仅收集必要的个人信息，仅提供对品牌信息的使用属于描述性、事实性使用，旨在为用户提供商场品牌信息查询和对比服务等基本功能，不提供官方授权、赞助或许可关系等其他附加功能，这可能会影响您的使用体验。</Text>
                </Paragraph>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>1.2 基于履行法定义务或其他法律法规规定的情形，我们可能会处理您的以下个人信息：</Text>
                <Paragraph style={{ marginLeft: '16px', marginTop: '8px' }}>
                  <Text>为了实现应用功能，在获取您的同意后我们需要在后台运行时收集您的GPS 位置、 图片或视频 。</Text>
                </Paragraph>
              </div>
            </div>

            <Divider />

            {/* 2. 设备权限调用 */}
            <div>
              <Title level={4} className="section-title">2. 设备权限调用</Title>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>位置（获取设备位置信息）</Text>
                <Paragraph style={{ marginLeft: '16px', marginTop: '8px' }}>
                  <Text>获取设备位置信息</Text>
                </Paragraph>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>图片和视频（允许应用保存图片、视频到用户公共目录、读取用户公共目录的图片或视频文件）</Text>
                <Paragraph style={{ marginLeft: '16px', marginTop: '8px' }}>
                  <Text>允许应用保存图片、视频到用户公共目录、读取用户公共目录的图片或视频文件</Text>
                </Paragraph>
              </div>
            </div>

            <Divider />

            {/* 3. 管理您的个人信息 */}
            <div>
              <Title level={4} className="section-title">3. 管理您的个人信息</Title>
              <Paragraph>
                <Text>关于您的个人信息，您可以通过以下方式，行使查阅、复制、更正、删除等法定权利。</Text>
              </Paragraph>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>3.1 信息访问</Text>
                <Paragraph style={{ marginLeft: '16px', marginTop: '8px' }}>
                  <Text>您可以前往个人信息，访问您的信息。</Text>
                </Paragraph>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>3.2 信息更正</Text>
                <Paragraph style={{ marginLeft: '16px', marginTop: '8px' }}>
                  <Text>当您需要更新您的个人信息，或发现我们处理您的个人信息有误时，您有权作出更正或更新。</Text><br />
                  <Text>您可以前往个人信息，访问并修改您的信息。</Text>
                </Paragraph>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <Text strong>3.3 信息删除</Text>
                <Paragraph style={{ marginLeft: '16px', marginTop: '8px' }}>
                  <Text>您可以前往个人信息，以删除您的信息。</Text>
                </Paragraph>
              </div>

              <Paragraph>
                <Text>如您对您的数据主体权利有进一步要求或存在任何疑问、意见或建议，可通过本声明中"如何联系我们"章节中所述方式与我们取得联系，并行使您的相关权利。</Text>
              </Paragraph>
            </div>

            <Divider />

            {/* 4. 信息存储地点及期限 */}
            <div>
              <Title level={4} className="section-title">4. 信息存储地点及期限</Title>
              <Paragraph>
                <Text strong>4.1</Text> 我们承诺，除法律法规另有规定外，我们对您的信息的保存期限应当为实现处理目的所必要的最短时间。
              </Paragraph>
              <Paragraph>
                <Text strong>4.2</Text> 上述信息将会传输并保存至中国境内的服务器。
              </Paragraph>
            </div>

            <Divider />

            {/* 5. 如何联系我们 */}
            <div>
              <Title level={4} className="section-title">5. 如何联系我们</Title>
              <Paragraph>
                <Text>您可通过以下方式联系我们，并行使您的相关权利，我们会尽快回复。</Text>
              </Paragraph>
              <Paragraph>
                <Text>• <Text strong>邮箱：</Text>978744151@qq.com</Text><br />
                <Text>• <Text strong>应用内反馈：</Text>使用app内反馈按钮联系我们</Text>
              </Paragraph>
              <Paragraph>
                <Text>如果您对我们的回复不满意, 特别是当个人信息处理行为损害了您的合法权益时您还可以通过向有管辖权的人民法院提起诉讼、向行业自律协会或政府相关管理机构投诉等外部途径进行解决。 您也可以向我们了解可能适用的相关投诉途径的信息。</Text>
              </Paragraph>
            </div>

            {/* 生效日期 */}
            <div style={{ textAlign: 'center', marginTop: '32px' }}>
              <Text type="secondary">生效日期：2025.10.22</Text>
            </div>
          </Space>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="privacy-footer">
        <Space>
          <Button onClick={handleGoBack}>返回</Button>
          <Button type="primary" onClick={handleAgree}>同意并继续</Button>
        </Space>
      </div>
    </div>
  );
};

export default PrivacyPolicy;