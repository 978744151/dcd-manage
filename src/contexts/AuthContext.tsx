import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { message } from 'antd';
import { login as loginApi, register as registerApi, getCurrentUser } from '../services/auth';

interface User {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string, role?: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getCurrentUser()
        .then((userData) => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await loginApi(email, password);

      const { token, user: user } = data.data;

      localStorage.setItem('token', token);
      setUser(user);
      message.success('登录成功');
      return true;
    } catch (error: any) {
      message.error(error.response?.data?.message || '登录失败');
      return false;
    }
  };

  const register = async (username: string, email: string, password: string, role: string = 'user'): Promise<boolean> => {
    try {
      const response = await registerApi(username, email, password, role);
      if (response.data.success) {
        message.success('注册成功');
        return true;
      }
      return false;
    } catch (error: any) {
      message.error(error.response?.data?.message || '注册失败');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    message.success('已退出登录');
  };
  console.log(user)
  const value: AuthContextType = {
    user,
    isAuthenticated: !!localStorage.getItem('token'),
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};