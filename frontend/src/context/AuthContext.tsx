'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import api from '../services/api';

interface User {
  _id: string;
  name: string;
  email: string;
  inviteCode?: string;
  partner?: { _id: string; name: string; email: string; } | string;
  coupleId?: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (data: any) => {
    const res = await api.post('/auth/login', data);
    setUser(res.data);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    if (res.data.coupleId) {
      router.push('/dashboard');
    } else {
      router.push('/pair');
    }
  };

  const register = async (data: any) => {
    const res = await api.post('/auth/register', data);
    setUser(res.data);
    localStorage.setItem('userInfo', JSON.stringify(res.data));
    router.push('/pair');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    router.push('/login');
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...updates } as User;
      setUser(updated);
      localStorage.setItem('userInfo', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, updateUser, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
