import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import ProvinceManagement from './pages/ProvinceManagement';
import CityManagement from './pages/CityManagement';
import DistrictManagement from './pages/DistrictManagement';
import BrandManagement from './pages/BrandManagement';
import MallManagement from './pages/MallManagement';
import MallBrandManagement from './pages/MallBrandManagement';
import UserManagement from './pages/UserManagement';
import MapData from './pages/MapData';
import DictionaryManagement from './pages/DictionaryManagement';
import ComparisonPage from './pages/ComparisonPage';
import CommentList from './pages/CommentList';
import BlogManagement from './pages/BlogManagement';
import ReportList from './pages/ReportList';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

// 受保护的路由组件
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  console.log(useAuth())
  const { isAuthenticated } = useAuth();
  console.log(isAuthenticated)
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="map-data" element={<MapData />} />
        <Route path="provinces" element={<ProvinceManagement />} />
        <Route path="cities" element={<CityManagement />} />
        <Route path="districts" element={<DistrictManagement />} />
        <Route path="brands" element={<BrandManagement />} />
        <Route path="malls" element={<MallManagement />} />
        <Route path="mall-brands" element={<MallBrandManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="dictionaries" element={<DictionaryManagement />} />
        <Route path="comparison" element={<ComparisonPage />} />
        <Route path="comments" element={<CommentList />} />
        <Route path="blogs" element={<BlogManagement />} />
        <Route path="reports" element={<ReportList />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
