import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  message,
  Popconfirm,
  Typography,
  Row,
  Col,
  InputNumber,
  Tag,
  Drawer,
  Radio,
  Image
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ShopOutlined, SearchOutlined } from '@ant-design/icons'; import { brandApi, provinceApi, cityApi, districtApi, brandStoreApi, mallApi } from '../services/api';
import { Tree } from 'antd';
import RegionSelector from '../components/RegionSelector';
import ImageUpload from '../components/ImageUpload'; // 添加导入
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface Brand {
  _id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  website: string;
  logo?: string; // 添加logo字段
  province: {
    _id: string;
    name: string;
  };
  city: {
    _id: string;
    name: string;
  };
  district?: {
    _id: string;
    name: string;
  };
  address: string;
  contactPhone: string;
  contactEmail: string;
  isActive: boolean;
}

interface Mall {
  _id: string;
  name: string;
  province: {
    _id: string;
    name: string;
  };
  city: {
    _id: string;
    name: string;
  };
  district?: {
    _id: string;
    name: string;
  };
}

interface BrandStore {
  _id: string;
  brand: {
    _id: string;
    name: string;
  };
  mall: {
    _id: string;
    name: string;
  };
  province: {
    _id: string;
    name: string;
  };
  city: {
    _id: string;
    name: string;
  };
  district?: {
    _id: string;
    name: string;
  };
  storeName?: string;
  floor?: string;
  unitNumber?: string;
  openingHours?: string;
  isActive: boolean;
  storeAddress?: string;
  isOla: boolean;
}

const BrandManagement: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [provinces, setProvinces] = useState<any[]>([]);
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [treeData, setTreeData] = useState<any[]>([]);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  // 门店管理相关状态
  const [storeDrawerVisible, setStoreDrawerVisible] = useState(false);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [brandStores, setBrandStores] = useState<BrandStore[]>([]);
  const [storeModalVisible, setStoreModalVisible] = useState(false);
  const [editingStore, setEditingStore] = useState<BrandStore | null>(null); // 新增编辑状态
  const [malls, setMalls] = useState<Mall[]>([]);
  const [storeForm] = Form.useForm();
  const [storeLoading, setStoreLoading] = useState(false);
  const [storeCities, setStoreCities] = useState<any[]>([]);
  const [storeDistricts, setStoreDistricts] = useState<any[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  // 添加门店查询相关状态
  const [storeFilters, setStoreFilters] = useState({
    provinceId: undefined,
    cityId: undefined,
    districtId: undefined,
    search: ''
  });
  const [filteredBrandStores, setFilteredBrandStores] = useState<BrandStore[]>([]);

  useEffect(() => {
    fetchBrands();
    fetchProvinces();
  }, []);

  // 添加门店过滤逻辑
  useEffect(() => {
    filterStores();
  }, [brandStores, storeFilters]);

  const filterStores = () => {
    let filtered = [...brandStores];

    // 省份过滤
    if (storeFilters.provinceId) {
      filtered = filtered.filter(store => store.province._id === storeFilters.provinceId);
    }

    // 城市过滤
    if (storeFilters.cityId) {
      filtered = filtered.filter(store => store.city._id === storeFilters.cityId);
    }

    // 区县过滤
    if (storeFilters.districtId) {
      filtered = filtered.filter(store => store.district?._id === storeFilters.districtId);
    }

    // 搜索过滤
    if (storeFilters.search) {
      const searchLower = storeFilters.search.toLowerCase();
      filtered = filtered.filter(store =>
        store.mall.name.toLowerCase().includes(searchLower) ||
        store.storeName?.toLowerCase().includes(searchLower) ||
        store.storeAddress?.toLowerCase().includes(searchLower)
      );
    }

    setFilteredBrandStores(filtered);
  };


  const handleRegionChange = (value: any) => {
    const newFilters = {
      ...storeFilters,
      ...value
    };

    setStoreFilters(newFilters);

    // 使用新的筛选参数立即调用API
    fetchBrandStores(currentBrand?._id, newFilters);
  };
  // 或者创建一个新的函数

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStoreFilters(prev => ({
      ...prev,
      search: e.target.value
    }));

  };

  const resetFilters = () => {
    setStoreFilters({
      provinceId: undefined,
      cityId: undefined,
      districtId: undefined,
      search: ''
    });
  };
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await brandApi.getBrands();
      setBrands(response.data.data.brands);
      // 加载树形
      const treeResp = await brandApi.getBrandTree({ level: 2, brandId: '68a2c8e783192a4c2131ed23', provinceId: '68a282e76e1688af0d5ca7cf' });
      const provinces = treeResp.data.data.provinces || [];
      const nodes = provinces.map((p: any) => ({
        key: p._id,
        title: `${p.name}`,
        children: (p.cities || []).map((c: any) => ({
          key: c._id,
          title: c.name,
          children: [
            ...(c.districts || []).map((d: any) => ({
              key: d._id || `${c._id}-nodistrict`,
              title: d.name || '（无区县）',
              children: (d.malls || []).map((m: any) => ({
                key: m._id,
                title: `${m.name}`,
                children: (m.brands || []).map((b: any) => ({
                  key: `${m._id}-${b._id}`,
                  title: b.name
                }))
              }))
            })),
            ...(c.malls || []).map((m: any) => ({
              key: m._id,
              title: `${m.name}`,
              children: (m.brands || []).map((b: any) => ({
                key: `${m._id}-${b._id}`,
                title: b.name
              }))
            }))
          ]
        }))
      }));
      setTreeData(nodes);
    } catch (error) {
      message.error('获取品牌列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const response = await provinceApi.getProvinces();
      setProvinces(response.data.data.provinces);
    } catch (error) {
      message.error('获取省份列表失败');
    }
  };

  const fetchCities = async (provinceId: string) => {
    try {
      const response = await cityApi.getCities({ provinceId });
      setCities(response.data.data.cities);
    } catch (error) {
      message.error('获取城市列表失败');
    }
  };

  const fetchDistricts = async (cityId: string) => {
    try {
      const response = await districtApi.getDistricts({ cityId });
      setDistricts(response.data.data.districts);
    } catch (error) {
      message.error('获取区县列表失败');
    }
  };

  const handleProvinceChange = (provinceId: string) => {
    form.setFieldsValue({ city: undefined, district: undefined });
    if (provinceId) {
      fetchCities(provinceId);
    } else {
      setCities([]);
      setDistricts([]);
    }
  };

  const handleCityChange = (cityId: string) => {
    form.setFieldsValue({ district: undefined });
    if (cityId) {
      fetchDistricts(cityId);
    } else {
      setDistricts([]);
    }
  };

  const handleAdd = () => {
    setEditingBrand(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Brand) => {
    setEditingBrand(record);
    form.resetFields(); // 先重置表单
    form.setFieldsValue({
      ...record,
      province: record.province?._id,
      city: record.city?._id,
      district: record.district?._id,
    });
    fetchCities(record.province?._id);
    if (record.city?._id) {
      fetchDistricts(record.city?._id);
    }
    setModalVisible(true);
  };


  const handleDelete = async (id: string) => {
    try {
      await brandApi.deleteBrand(id);
      message.success('删除成功');
      fetchBrands();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingBrand) {
        await brandApi.updateBrand(editingBrand._id, values);
        message.success('更新成功');
      } else {
        await brandApi.createBrand(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchBrands();
    } catch (error) {
      message.error(editingBrand ? '更新失败' : '创建失败');
    }
  };

  // 门店管理相关函数
  const handleStoreManagement = async (brand: Brand) => {
    setCurrentBrand(brand);
    setStoreDrawerVisible(true);
    await fetchBrandStores(brand._id);
  };

  // 修改fetchBrandStores函数，支持传入筛选参数
  const fetchBrandStores = async (brandId: string, filters = storeFilters) => {
    try {
      setStoreLoading(true);
      const response = await brandStoreApi.getBrandStores({
        brand: brandId,
        ...filters
      });
      setBrandStores(response.data.data.stores || []);
    } catch (error) {
      message.error('获取门店列表失败');
    } finally {
      setStoreLoading(false);
    }
  };

  const fetchMalls = async () => {
    try {
      const response = await mallApi.getMalls();
      setMalls(response.data.data.malls || []);
    } catch (error) {
      message.error('获取商场列表失败');
    }
  };

  const handleStoreProvinceChange = (provinceId: string) => {
    storeForm.setFieldsValue({ city: undefined, district: undefined });
    if (provinceId) {
      fetchStoreCities(provinceId);
    } else {
      setStoreCities([]);
      setStoreDistricts([]);
    }
  };

  const fetchStoreCities = async (provinceId: string) => {
    try {
      const response = await cityApi.getCities({ provinceId });
      setStoreCities(response.data.data.cities);
    } catch (error) {
      message.error('获取城市列表失败');
    }
  };

  const handleStoreCityChange = (cityId: string) => {
    storeForm.setFieldsValue({ district: undefined, mall: undefined });
    if (cityId) {
      fetchStoreDistricts(cityId);
    } else {
      setStoreDistricts([]);
    }
  };

  const fetchStoreDistricts = async (cityId: string) => {
    try {
      const response = await districtApi.getDistricts({ cityId });
      setStoreDistricts(response.data.data.districts);
    } catch (error) {
      message.error('获取区县列表失败');
    }
  };

  const handleMallChange = async (mallId: string) => {
    const selectedMall: any = malls.find(mall => mall._id === mallId);
    if (selectedMall) {
      // 先更新城市列表
      await fetchStoreCities(selectedMall.province._id);
      // 如果有区县，更新区县列表
      if (selectedMall.city._id) {
        await fetchStoreDistricts(selectedMall.city._id);
      }
      // 最后设置表单值
      storeForm.setFieldsValue({
        province: selectedMall.province._id,
        city: selectedMall.city._id,
        district: selectedMall.district?._id,
        storeAddress: selectedMall.address || '',
      });
    }
  };

  const handleAddStore = () => {
    setEditingStore(null); // 清空编辑状态
    storeForm.resetFields();
    setStoreModalVisible(true);
    fetchMalls();
  };

  // 新增编辑门店函数
  const handleEditStore = async (record: BrandStore) => {
    setEditingStore(record);
    await fetchMalls();

    // 设置表单值
    storeForm.setFieldsValue({
      mall: record.mall._id,
      province: record.province._id,
      city: record.city._id,
      district: record.district?._id,
      storeName: record.storeName,
      floor: record.floor,
      unitNumber: record.unitNumber,
      openingHours: record.openingHours,
      storeAddress: record.storeAddress,

      isActive: record.isActive,
      isOla: record.isOla
    });

    // 加载对应的城市和区县数据
    if (record.province._id) {
      await fetchStoreCities(record.province._id);
    }
    if (record.city._id) {
      await fetchStoreDistricts(record.city._id);
    }

    setStoreModalVisible(true);
  };

  // 新增门店取消函数
  const handleStoreCancel = () => {
    storeForm.resetFields();
    setEditingStore(null);
    setStoreModalVisible(false);
    setStoreCities([]);
    setStoreDistricts([]);
  };

  const handleStoreSubmit = async (values: any) => {
    try {
      console.log(values.mall)
      const selectedMall = malls.find(mall => mall._id === values.mall);
      const submitData = {
        ...values,
        brand: currentBrand?._id,
        province: selectedMall?.province._id,
        city: selectedMall?.city._id,
        district: selectedMall?.district?._id,
        mall: Array.isArray(values.mall) ? values.mall.join(',') : values.mall,
      };

      if (editingStore) {
        // 更新门店
        await brandStoreApi.updateBrandStore(editingStore._id, submitData);
        message.success('门店更新成功');
      } else {
        // 创建门店
        await brandStoreApi.createBrandStore(submitData);
        message.success('门店添加成功');
      }

      setStoreModalVisible(false);
      setEditingStore(null);
      if (currentBrand) {
        await fetchBrandStores(currentBrand._id);
      }
    } catch (error) {
      message.error(editingStore ? '门店更新失败' : '门店添加失败');
    }
  };

  const handleDeleteStore = async (storeId: string) => {
    try {
      await brandStoreApi.deleteBrandStore(storeId);
      message.success('门店删除成功');
      if (currentBrand) {
        await fetchBrandStores(currentBrand._id);
      }
    } catch (error) {
      message.error('门店删除失败');
    }
  };

  const columns = [
    {
      title: 'Logo',
      dataIndex: 'logo',
      key: 'logo',
      width: 80,
      render: (logo: string) => (
        logo ? (
          <Image
            src={logo}
            alt="品牌Logo"
            width={40}
            height={40}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        ) : (
          <div style={{
            width: 40,
            height: 40,
            backgroundColor: '#f5f5f5',
            borderRadius: 4,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
            color: '#999'
          }}>
            无
          </div>
        )
      ),
    },
    {
      title: '品牌名称',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Brand, b: Brand) => a.name.localeCompare(b.name),
    },
    {
      title: '品牌代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '分类',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: '门店数量',
      dataIndex: 'storeCount',
      key: 'storeCount',
    },
    {
      title: '省份',
      dataIndex: ['province', 'name'],
      key: 'province',
    },
    {
      title: '城市',
      dataIndex: ['city', 'name'],
      key: 'city',
    },
    {
      title: '区县',
      dataIndex: ['district', 'name'],
      key: 'district',
    },
    {
      title: '联系电话',
      dataIndex: 'contactPhone',
      key: 'contactPhone',
    },
    {
      title: '状态',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (isActive: boolean) => (
        <Switch checked={isActive} disabled />
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Brand) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Button
            type="link"
            icon={<ShopOutlined />}
            onClick={() => handleStoreManagement(record)}
          >
            门店管理
          </Button>
          <Popconfirm
            title="确定要删除这个品牌吗？"
            onConfirm={() => handleDelete(record._id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
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
          <Title level={2}>品牌管理</Title>
        </Col>
        <Col>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            添加品牌
          </Button>
        </Col>
      </Row>

      <Card>
        <Title level={4}>品牌分布（省-市-区-商场-品牌）</Title>
        <div style={{ maxHeight: 400, overflow: 'auto', border: '1px solid #f0f0f0', padding: 12, marginBottom: 16 }}>
          <Tree treeData={treeData} defaultExpandAll />
        </div>
        <Table
          columns={columns}
          dataSource={brands}
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

      <Modal
        title={editingBrand ? '编辑品牌' : '添加品牌'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="品牌名称"
                rules={[{ required: true, message: '请输入品牌名称' }]}
              >
                <Input placeholder="请输入品牌名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="code"
                label="品牌代码"
              // rules={[{ required: true, message: '请输入品牌代码' }]}
              >
                <Input placeholder="请输入品牌代码" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="品牌分类"
              >
                <Input placeholder="请输入品牌分类" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="website"
                label="官方网站"
              >
                <Input placeholder="请输入官方网站" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="province"
                label="所属省份"
              // rules={[{ required: true, message: '请选择所属省份' }]}
              >
                <Select
                  optionFilterProp="label"
                  showSearch
                  placeholder="请选择所属省份"
                  onChange={handleProvinceChange}
                >
                  {provinces.map(province => (
                    <Option key={province._id} value={province._id}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="city"
                label="所属城市"
              // rules={[{ required: true, message: '请选择所属城市' }]}
              >
                <Select
                  placeholder="请选择所属城市"
                  onChange={handleCityChange}
                >
                  {cities.map(city => (
                    <Option key={city._id} value={city._id}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="district"
                label="所属区县"
              >
                <Select placeholder="请选择所属区县">
                  {districts.map(district => (
                    <Option key={district._id} value={district._id}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="contactPhone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="contactEmail"
                label="联系邮箱"
              >
                <Input placeholder="请输入联系邮箱" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            name="address"
            label="详细地址"
          >
            <Input placeholder="请输入详细地址" />

          </Form.Item>

          <Form.Item
            name="logo"
            label="品牌Logo"
          >
            <ImageUpload placeholder="上传品牌Logo" />
          </Form.Item>

          <Form.Item
            name="description"
            label="品牌描述"
          >
            <TextArea rows={3} placeholder="请输入品牌描述" />
          </Form.Item>

          {editingBrand && (
            <Form.Item
              name="isActive"
              label="状态"
              valuePropName="checked"
              initialValue={true}
            >
              <Switch />
            </Form.Item>
          )}

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingBrand ? '更新' : '创建'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* 门店管理抽屉 */}
      <Drawer
        title={`${currentBrand?.name} - 门店管理`}
        placement="right"
        width={1200}
        open={storeDrawerVisible}
        onClose={() => setStoreDrawerVisible(false)}
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAddStore}
          >
            添加门店
          </Button>
        }
      >
        {/* 添加查询区域 */}
        <Card size="small" style={{ marginBottom: 16 }}>
          <Row gutter={16} align="middle">
            <Col span={12}>
              <RegionSelector
                value={{
                  provinceId: storeFilters.provinceId,
                  cityId: storeFilters.cityId,
                  districtId: storeFilters.districtId
                }}
                onChange={handleRegionChange}
              />
            </Col>
            <Col span={8}>
              <Input
                placeholder="搜索商场名称、门店名称或地址"
                value={storeFilters.search}
                onChange={handleSearchChange}
                prefix={<SearchOutlined />}
                allowClear
                size="small"
              />
            </Col>
            <Col span={4}>
              <Space>
                <Button size="small" onClick={resetFilters}>
                  重置
                </Button>
              </Space>
            </Col>
          </Row>
        </Card>
        <Table
          columns={[
            {
              title: '商场名称',
              dataIndex: ['mall', 'name'],
              key: 'mallName',
            },
            {
              title: '省份',
              dataIndex: ['province', 'name'],
              key: 'province',
            },
            {
              title: '城市',
              dataIndex: ['city', 'name'],
              key: 'city',
            },
            {
              title: '区县',
              dataIndex: ['district', 'name'],
              key: 'district',
            },
            {
              title: '门店地址',
              dataIndex: 'storeAddress',
              key: 'storeAddress',
            },
            {
              title: '门店名称',
              dataIndex: 'storeName',
              key: 'storeName',
            },
            {
              title: '楼层',
              dataIndex: 'floor',
              key: 'floor',
            },
            {
              title: '铺位号',
              dataIndex: 'unitNumber',
              key: 'unitNumber',
            },
            {
              title: '营业时间',
              dataIndex: 'openingHours',
              key: 'openingHours',
            },
            {
              title: '联系电话',
              dataIndex: 'phone',
              key: 'phone',
            },
            {
              title: '奥莱店',
              dataIndex: 'isOla',
              key: 'isOla',
              render: (isOla: boolean) => (
                <Switch checked={isOla} disabled />
              ),
            },
            {
              title: '状态',
              dataIndex: 'isActive',
              key: 'isActive',
              render: (isActive: boolean) => (
                <Switch checked={isActive} disabled />
              ),
            },
            {
              title: '操作',
              key: 'action',
              render: (_: any, record: BrandStore) => (
                <Space>
                  <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEditStore(record)}
                  >
                    编辑
                  </Button>
                  <Popconfirm
                    title="确定要删除这个门店吗？"
                    onConfirm={() => handleDeleteStore(record._id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Button type="link" danger icon={<DeleteOutlined />}>
                      删除
                    </Button>
                  </Popconfirm>
                </Space>
              ),
            },
          ]}
          dataSource={brandStores}
          rowKey="_id"
          loading={storeLoading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `第 ${range[0]}-${range[1]} 条/共 ${total} 条`,
          }}
        />
      </Drawer>

      {/* 添加门店Modal */}
      <Modal
        title={editingStore ? '编辑门店' : '添加门店'}
        open={storeModalVisible}
        onCancel={handleStoreCancel}
        footer={null}
        width={800}
      >
        <Form
          form={storeForm}
          layout="vertical"
          onFinish={handleStoreSubmit}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="mall"
                label="商场"

                rules={[{ required: true, message: '请选择商场' }]}
              >
                <Select
                  placeholder="请选择商场"
                  showSearch
                  mode="multiple"
                  optionFilterProp="label"
                  onChange={handleMallChange}
                  options={malls.map(mall => ({
                    label: `${mall.name} (${mall.province.name}-${mall.city.name}${mall.district ? '-' + mall.district.name : ''})`,
                    value: mall._id,
                  }))}
                >
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="province"
                label="省份"
              // rules={[{ required: true, message: '请选择省份' }]}
              >
                <Select
                  showSearch
                  placeholder="请选择省份"
                  optionFilterProp="label"
                  filterOption={(input, option) =>
                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                  onChange={handleStoreProvinceChange}
                >
                  {provinces.map(province => (
                    <Option key={province._id} value={province._id} label={province.name}>
                      {province.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="city"
                label="城市"
              // rules={[{ required: true, message: '请选择城市' }]}
              >
                <Select
                  placeholder="请选择城市"
                  onChange={handleStoreCityChange}
                >
                  {storeCities.map(city => (
                    <Option key={city._id} value={city._id}>
                      {city.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="district"
                label="区县"
              >
                <Select placeholder="请选择区县">
                  {storeDistricts.map(district => (
                    <Option key={district._id} value={district._id}>
                      {district.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="storeName"
                label="门店名称"
              >
                <Input placeholder="请输入门店名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="floor"
                label="楼层"
              >
                <Input placeholder="请输入楼层" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="unitNumber"
                label="铺位号"
              >
                <Input placeholder="请输入铺位号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="openingHours"
                label="营业时间"
              >
                <Input placeholder="请输入营业时间" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="storeAddress"
                label="地址"
              >
                <Input placeholder="请输入地址" />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="isOla"
                label="是否是奥莱店"
              >
                <Radio.Group>
                  <Radio value={true}>是</Radio>
                  <Radio value={false}>否</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="phone"
                label="联系电话"
              >
                <Input placeholder="请输入联系电话" />
              </Form.Item>
            </Col>

          </Row>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingStore ? '修改门店' : '添加门店'}
              </Button>
              <Button onClick={() => setStoreModalVisible(false)}>
                取消
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BrandManagement;