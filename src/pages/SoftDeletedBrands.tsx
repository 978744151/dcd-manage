import React, { useEffect, useState } from 'react';
import { Card, Table, Space, Button, Input, Popconfirm, message, Tag } from 'antd';
import { SearchOutlined, RollbackOutlined, DeleteOutlined } from '@ant-design/icons';
import { adminSoftDeletedApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

interface RegionRef {
  _id: string;
  name: string;
}

interface BrandItem {
  _id: string;
  name: string;
  code: string;
  category?: string;
  province?: RegionRef;
  city?: RegionRef;
  district?: RegionRef;
  updatedAt?: string;
  isActive: boolean;
}

interface PaginationState {
  current: number;
  pageSize: number;
  total: number;
}

const SoftDeletedBrands: React.FC = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<BrandItem[]>([]);
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState<PaginationState>({ current: 1, pageSize: 20, total: 0 });
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const fetchData = async (page = 1, limit = pagination.pageSize, keyword = search) => {
    try {
      setLoading(true);
      const { data } = await adminSoftDeletedApi.getSoftDeletedBrands({ page, limit, search: keyword });
      const list: BrandItem[] = data.data.brands || [];
      const total: number = data.data.pagination?.total || 0;
      setBrands(list);
      setPagination({ current: page, pageSize: limit, total });
    } catch (err: any) {
      // 错误提示由拦截器统一处理
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1, pagination.pageSize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchData(1, pagination.pageSize, search);
  };

  const handleTableChange = (pag: any) => {
    fetchData(pag.current, pag.pageSize);
  };

  const restoreSingle = async (id: string) => {
    try {
      await adminSoftDeletedApi.restoreBrand(id);
      message.success('恢复成功');
      fetchData(pagination.current, pagination.pageSize, search);
    } catch (err) {}
  };

  const deleteSingle = async (id: string) => {
    try {
      await adminSoftDeletedApi.permanentDeleteBrand(id);
      message.success('永久删除成功');
      fetchData(pagination.current, pagination.pageSize, search);
    } catch (err) {}
  };

  const restoreBatch = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择需要恢复的品牌');
      return;
    }
    try {
      await adminSoftDeletedApi.restoreBrandsBatch(selectedRowKeys as string[]);
      message.success('批量恢复成功');
      setSelectedRowKeys([]);
      fetchData(pagination.current, pagination.pageSize, search);
    } catch (err) {}
  };

  if (user?.role !== 'admin') {
    return (
      <Card title="软删除品牌列表">
        <Tag color="red">当前账户非管理员，无法访问此页面</Tag>
      </Card>
    );
  }

  const columns = [
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '编码', dataIndex: 'code', key: 'code' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '省份', key: 'province', render: (_: any, r: BrandItem) => r.province?.name || '-' },
    { title: '城市', key: 'city', render: (_: any, r: BrandItem) => r.city?.name || '-' },
    { title: '区县', key: 'district', render: (_: any, r: BrandItem) => r.district?.name || '-' },
    {
      title: '操作',
      key: 'actions',
      render: (_: any, record: BrandItem) => (
        <Space>
          <Button type="primary" icon={<RollbackOutlined />} onClick={() => restoreSingle(record._id)}>恢复</Button>
          <Popconfirm title="确认永久删除该品牌？" onConfirm={() => deleteSingle(record._id)}>
            <Button danger icon={<DeleteOutlined />}>永久删除</Button>
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <Card
      title="软删除品牌列表"
      extra={
        <Space>
          <Input
            placeholder="名称/编码/分类"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 240 }}
            prefix={<SearchOutlined />}
          />
          <Button onClick={handleSearch}>搜索</Button>
          <Button type="primary" onClick={restoreBatch} disabled={selectedRowKeys.length === 0}>批量恢复</Button>
        </Space>
      }
    >
      <Table
        rowKey="_id"
        loading={loading}
        columns={columns as any}
        dataSource={brands}
        pagination={{ current: pagination.current, pageSize: pagination.pageSize, total: pagination.total }}
        onChange={handleTableChange}
        rowSelection={{ selectedRowKeys, onChange: setSelectedRowKeys }}
      />
    </Card>
  );
};

export default SoftDeletedBrands;