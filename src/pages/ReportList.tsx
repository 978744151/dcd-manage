import React, { useEffect, useState } from 'react';
import { Card, Table, Tag, Space, Input, Select, DatePicker, message, Pagination, Button } from 'antd';
import { reportApi } from '../services/api';
import dayjs, { Dayjs } from 'dayjs';
import { useNavigate } from 'react-router-dom';
import CommentService from '../services/comment.service';

const { RangePicker } = DatePicker;
const { Option } = Select;

interface ReportItem {
  _id: string;
  targetType: 'blog' | 'comment' | 'user' | 'mall' | 'brand' | 'brandStore';
  targetId: string;
  reasonType: string;
  description?: string;
  contact?: string;
  evidenceImages?: string[];
  status: 'pending' | 'reviewing' | 'resolved' | 'rejected';
  reporterIp?: string;
  createdAt: string;
}

const statusColorMap: Record<ReportItem['status'], string> = {
  pending: 'default',
  reviewing: 'processing',
  resolved: 'success',
  rejected: 'error',
};

const ReportList: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [list, setList] = useState<ReportItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);

  const [status, setStatus] = useState<ReportItem['status'] | undefined>();
  const [targetType, setTargetType] = useState<ReportItem['targetType'] | undefined>();
  const [search, setSearch] = useState<string>('');
  const [dateRange, setDateRange] = useState<[Dayjs | null, Dayjs | null]>();

  const navigate = useNavigate();

  const fetchReports = async (p = page, l = limit) => {
    setLoading(true);
    try {
      const params: any = { page: p, limit: l };
      if (status) params.status = status;
      if (targetType) params.targetType = targetType;
      if (search) params.search = search;
      if (dateRange && dateRange[0] && dateRange[1]) {
        params.startDate = dateRange[0].toISOString();
        params.endDate = dateRange[1].toISOString();
      }
      const res = await reportApi.getReports(params);
      const data = res.data?.data;
      setList(data?.list || []);
      setTotal(data?.total || 0);
      setPage(data?.page || p);
      setLimit(data?.limit || l);
    } catch (err: any) {
      message.error(err?.response?.data?.message || '获取举报列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports(1, limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 跳转到博客管理页（若为评论类型，先定位其所属博客）
  const handleGoToBlog = async (item: ReportItem) => {
    try {
      if (item.targetType === 'blog') {
        navigate('/blogs');
        return;
      }
      if (item.targetType === 'comment') {
        const res = await CommentService.getCommentDetail(item.targetId);
        const blogId = res?.data?.blog?._id || res?.data?.blog;
        if (blogId) {
          navigate('/blogs');
          return;
        }
        message.error('未找到评论关联的博客');
        return;
      }
      message.warning('仅支持博客或评论类型的跳转');
    } catch (error: any) {
      message.error(error?.response?.data?.message || '跳转失败');
    }
  };

  // 跳转到评论列表（支持博客与评论类型）
  const handleGoToComments = async (item: any) => {
    try {
      if (item.targetType === 'blog') {
        navigate(`/comments?blogId=${item.targetId}`);
        return;
      }
      if (item.targetType === 'comment') {
        navigate(`/comments?blogId=${item.blogId}&commentId=${item.targetId}`);
      }
    } catch (error: any) {
      message.error(error?.response?.data?.message || '跳转失败');
    }
  };

  const handleUpdateStatus = async (record: ReportItem, next: 'pending' | 'resolved') => {
    try {
      await reportApi.updateStatus(record._id, next);
      message.success('状态已更新');
      // 局部更新避免重新加载全部
      setList(prev => prev.map(item => item._id === record._id ? { ...item, status: next } : item));
    } catch (error: any) {
      message.error(error?.response?.data?.message || '更新状态失败');
    }
  };

  const columns = [
    { title: '目标类型', dataIndex: 'targetType', key: 'targetType', width: 120 },
    { title: 'ID', dataIndex: 'targetId', key: 'targetId', width: 220 },
    { title: '博客Id', dataIndex: 'blogId', key: 'blogId', width: 120 },
    { title: '原因类型', dataIndex: 'reasonType', key: 'reasonType', width: 120 },
    { title: '描述', dataIndex: 'description', key: 'description', ellipsis: true },
    { title: '联系方式', dataIndex: 'contact', key: 'contact', width: 180 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 160,
      render: (s: ReportItem['status'], record: ReportItem) => (
        <Space>
          {/* <Tag color={statusColorMap[s]}>{s}</Tag> */}
          {/* 简化权限：若已登录则显示编辑下拉 */}
          <Select size="small" value={s} style={{ width: 120 }} onChange={(v) => {
            if (v === 'pending' || v === 'resolved') {
              handleUpdateStatus(record, v);
            } else {
              message.warning('仅支持设置为 已处理/未处理');
            }
          }}>
            <Option value="pending">未处理</Option>
            <Option value="resolved">已处理</Option>
          </Select>
        </Space>
      ),
    },
    {
      title: '时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (d: string) => dayjs(d).format('YYYY-MM-DD HH:mm'),
      sorter: (a: ReportItem, b: ReportItem) => dayjs(a.createdAt).unix() - dayjs(b.createdAt).unix(),
    },
    {
      title: '操作',
      key: 'actions',
      width: 200,
      render: (_: any, record: ReportItem) => (
        <Space>
          <Button type="link" size="small" onClick={() => handleGoToComments(record)}>
            查看
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="page-header">
        <h2>举报列表</h2>
      </div>
      <Card className="card-container">
        <Space direction="vertical" style={{ width: '100%' }}>
          <Space wrap>
            <Select
              placeholder="状态筛选"
              allowClear
              style={{ width: 160 }}
              value={status}
              onChange={value => setStatus(value)}
            >
              <Option value="pending">待处理</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="resolved">已处理</Option>
              <Option value="rejected">已驳回</Option>
            </Select>

            <Select
              placeholder="目标类型"
              allowClear
              style={{ width: 160 }}
              value={targetType}
              onChange={value => setTargetType(value)}
            >
              <Option value="blog">博客</Option>
              <Option value="comment">评论</Option>
              <Option value="user">用户</Option>
              <Option value="mall">商场</Option>
              <Option value="brand">品牌</Option>
              <Option value="brandStore">品牌门店</Option>
            </Select>

            <RangePicker
              allowEmpty={[true, true]}
              onChange={(range) => setDateRange(range as any)}
            />

            <Input.Search
              placeholder="搜索描述或联系方式"
              allowClear
              style={{ width: 300 }}
              value={search}
              onChange={e => setSearch(e.target.value)}
              onSearch={() => fetchReports(1, limit)}
            />

            <Space>
              <a onClick={() => fetchReports(1, limit)}>刷新</a>
            </Space>
          </Space>

          <Table
            rowKey="_id"
            columns={columns as any}
            dataSource={list}
            loading={loading}
            pagination={false}
            bordered
            size="middle"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Pagination
              current={page}
              pageSize={limit}
              total={total}
              showSizeChanger
              onChange={(p, l) => fetchReports(p, l)}
            />
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default ReportList;