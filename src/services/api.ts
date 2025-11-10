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
  // 更新品牌状态
  updateBrandStatus: (id: string, status: string) => api.post('/admin/brands-status', { id, status }),
  // 删除品牌
  deleteBrand: (id: string) => api.delete(`/admin/brands/${id}`),
};

// 商场相关API
export const mallApi = {
  // 获取商场列表
  getMalls: (params?: any) => api.get('/map/malls', { params }),
  // 创建商场
  createMall: (data: any) => api.post('/mall', data),
  // 更新商场
  updateMall: (id: string, data: any) => api.put(`/mall/${id}`, data),
  // 删除商场
  deleteMall: (id: string) => api.delete(`/mall/${id}`),
  // 获取商场品牌列表
  getMallBrands: (mallId: string, params?: any) => api.get(`/mall/${mallId}/brands`, { params }),
};

// 用户相关API
export const userApi = {
  // 获取用户列表
  getUsers: (params?: any) => api.get('/user/list', { params }),
  // 获取单个用户信息
  getUser: (id: string) => api.get(`/user/users/${id}`),
  // 创建用户
  createUser: (data: { username: string; email: string; password: string; role?: 'admin' | 'user' }) => 
    api.post('/user', data),
  // 更新用户信息
  updateUser: (id: string, data: { username?: string; email?: string; role?: 'admin' | 'user'; isActive?: boolean }) => 
    api.put(`/user/${id}`, data),
  // 更新用户状态
  updateUserStatus: (id: string, isActive: boolean) => 
    api.put(`/user/${id}/status`, { isActive }),
  // 删除用户
  deleteUser: (id: string) => api.delete(`/user/${id}`),
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

// 用户反馈相关API
export const feedbackApi = {
  // 创建反馈
  createFeedback: (data: any) => api.post('/feedback', data),
  // 获取用户反馈列表
  getUserFeedback: (params?: any) => api.get('/feedback/user', { params }),
  // 获取所有反馈列表（管理员）
  getAllFeedback: (params?: any) => api.get('/feedback', { params }),
  // 获取反馈详情
  getFeedback: (id: string) => api.get(`/feedback/${id}`),
  // 更新反馈状态（管理员）
  updateFeedbackStatus: (id: string, status: string) => api.put(`/feedback/${id}/status`, { status }),
  // 管理员回复反馈
  replyFeedback: (id: string, reply: string) => api.put(`/feedback/${id}/reply`, { reply }),
  // 用户评分
  rateFeedback: (id: string, rating: number) => api.put(`/feedback/${id}/rating`, { rating }),
  // 删除反馈（管理员）
  deleteFeedback: (id: string) => api.delete(`/feedback/${id}`),
  // 批量标记为已读（管理员）
  markAsRead: (ids: string[]) => api.put('/feedback/mark-read', { ids }),
};

// 字典相关API
export const dictionaryApi = {
  // 获取字典列表
  getDictionaries: (params?: any) => api.get('/admin/dictionaries', { params }),
  // 获取字典类型
  getDictionaryTypes: () => api.get('/admin/dictionaries/types'),
  // 创建字典
  createDictionary: (data: any) => api.post('/admin/dictionaries', data),
  // 更新字典
  updateDictionary: (id: string, data: any) => api.put(`/admin/dictionaries/${id}`, data),
  // 删除字典
  deleteDictionary: (id: string) => api.delete(`/admin/dictionaries/${id}`),
  // 字典排序
  sortDictionaries: (data: any) => api.put('/admin/dictionaries/sort', data),
  // 查询字典
  queryDictionaries: (params?: any) => api.get('/map/dictionaries', { params }),
};

// 对比相关API
export const comparisonApi = {
  // 商场/城市对比
  compare: (data: { type: 'mall' | 'city'; ids: string[]; brandIds?: string[] }) => 
    api.post('/map/comparison', data),
};

// 举报相关API
export const reportApi = {
  // 获取举报列表（分页与筛选）
  getReports: (params?: {
    page?: number;
    limit?: number;
    status?: 'pending' | 'in_review' | 'resolved' | 'rejected';
    targetType?: 'blog' | 'comment' | 'user' | 'mall' | 'brand' | 'brandStore';
    reporterIp?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
  }) => api.get('/report', { params }),
  // 更新举报状态（pending 未处理 / resolved 已处理）
  updateStatus: (id: string, status: 'pending' | 'resolved') => 
    api.put(`/report/${id}/status`, { status }),
};

// ...

// 管理端软删除数据API
export const adminSoftDeletedApi = {
  // 获取软删除品牌列表
  getSoftDeletedBrands: (params?: { page?: number; limit?: number; search?: string }) => 
    api.get('/admin/soft-deleted/brands', { params }),
  // 恢复单个品牌
  restoreBrand: (id: string) => api.post(`/admin/restore/brand/${id}`),
  // 永久删除单个品牌
  permanentDeleteBrand: (id: string) => api.delete(`/admin/permanent/brand/${id}`),
  // 批量恢复品牌
  restoreBrandsBatch: (ids: string[]) => api.post('/admin/restore-batch/brand', { ids }),
};