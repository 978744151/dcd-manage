import axios from 'axios';
import { message } from 'antd';


const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || '/api';

// 创建axios实例
const api = axios.create({
  baseURL:  API_BASE_URL,
  timeout: 30000,
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      (config.headers as any).Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log(error);
    
    // 处理不同类型的错误
    let errorMessage = '请求失败，请稍后重试';
    
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          errorMessage = data?.message || '请求参数错误';
          break;
        case 401:
          errorMessage = '登录已过期，请重新登录';
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          errorMessage = '权限不足，无法访问';
          break;
        case 404:
          errorMessage = '请求的资源不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误，请稍后重试';
          break;
        default:
          errorMessage = data?.message || `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 网络错误
      errorMessage = '网络连接失败，请检查网络设置';
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误';
    }
    
    message.error(errorMessage);
    return Promise.reject(error);
  }
);

// 登录
export const login = (email: string, password: string) => {
  return api.post('/auth/login', { email, password });
};

// 注册
export const register = (username: string, email: string, password: string, role: string = 'user') => {
  return api.post('/auth/register', { username, email, password, role });
};

// 获取当前用户信息
export const getCurrentUser = () => {
  return api.get('/auth/me').then(response => response.data.data.user);
};

export default api;