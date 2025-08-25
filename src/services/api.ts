import api from './auth';

// 省份相关API
export const provinceApi = {
  // 获取省份列表
  getProvinces: (params?: any) => api.get('/map/provinces', { params }),
  // 获取省份详情
  getProvince: (id: string) => api.get(`/map/provinces/${id}`),
  // 创建省份
  createProvince: (data: any) => api.post('/admin/provinces', data),
  // 更新省份
  updateProvince: (id: string, data: any) => api.put(`/admin/provinces/${id}`, data),
  // 删除省份
  deleteProvince: (id: string) => api.delete(`/admin/provinces/${id}`),
};

// 城市相关API
export const cityApi = {
  // 获取城市列表
  getCities: (params?: any) => api.get('/map/cities', { params }),
  // 获取城市详情
  getCity: (id: string) => api.get(`/map/cities/${id}`),
  // 创建城市
  createCity: (data: any) => api.post('/admin/cities', data),
  // 更新城市
  updateCity: (id: string, data: any) => api.put(`/admin/cities/${id}`, data),
  // 删除城市
  deleteCity: (id: string) => api.delete(`/admin/cities/${id}`),
};

// 区县相关API
export const districtApi = {
  // 获取区县列表
  getDistricts: (params?: any) => api.get('/map/districts', { params }),
  // 创建区县
  createDistrict: (data: any) => api.post('/admin/districts', data),
  // 更新区县
  updateDistrict: (id: string, data: any) => api.put(`/admin/districts/${id}`, data),
  // 删除区县
  deleteDistrict: (id: string) => api.delete(`/admin/districts/${id}`),
};

// 品牌相关API
export const brandApi = {
  // 获取品牌列表
  getBrands: (params?: any) => api.get('/map/brands', { params }),
  // 获取品牌分布树
  getBrandTree: (params?: any) => api.get('/map/tree', { params: { ...params, tree: 1 } }),
  // 创建品牌
  createBrand: (data: any) => api.post('/admin/brands', data),
  // 更新品牌
  updateBrand: (id: string, data: any) => api.put(`/admin/brands/${id}`, data),
  // 删除品牌
  deleteBrand: (id: string) => api.delete(`/admin/brands/${id}`),
};

// 商场相关API
export const mallApi = {
  // 获取商场列表
  getMalls: (params?: any) => api.get('/map/malls', { params }),
  // 创建商场
  createMall: (data: any) => api.post('/admin/malls', data),
  // 更新商场
  updateMall: (id: string, data: any) => api.put(`/admin/malls/${id}`, data),
  // 删除商场
  deleteMall: (id: string) => api.delete(`/admin/malls/${id}`),
};

// 用户相关API
export const userApi = {
  // 获取用户列表
  getUsers: (params?: any) => api.get('/admin/users', { params }),
  // 更新用户状态
  updateUserStatus: (id: string, isActive: boolean) => 
    api.put(`/admin/users/${id}/status`, { isActive }),
};

// 品牌门店相关API
export const brandStoreApi = {
  // 获取品牌门店列表
  getBrandStores: (params?: any) => api.get('/admin/brand-stores', { params }),
  // 创建品牌门店
  createBrandStore: (data: any) => api.post('/admin/brand-stores', data),
    // 更新门店
  updateBrandStore: (id: string, data: any) => api.put(`/admin/brand-stores/${id}`, data),
  // 删除品牌门店
  deleteBrandStore: (id: string) => api.delete(`/admin/brand-stores/${id}`),
};

// 统计数据API
export const statisticsApi = {
  // 获取全国统计数据
  getNationalData: () => api.get('/map/national'),
  // 获取统计数据
  getStatistics: (params?: any) => api.get('/map/statistics', { params }),
}; 