import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types/crm';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  changePassword: (current: string, newPass: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ... mockUser redundant now, removed or ignored

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Initialize state from localStorage or default
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('auth_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [currentPassword, setCurrentPassword] = useState(() => {
    return localStorage.getItem('auth_password') || 'laroca1234';
  });

  const login = useCallback(async (email: string, password: string) => {
    if (email === 'autoescuela_laroca' && password === currentPassword) {
      const newUser: User = {
        id: '1',
        name: 'Directora',
        email: 'directora@autoescuelalaroca.com',
        role: 'admin',
      };
      setUser(newUser);
      localStorage.setItem('auth_user', JSON.stringify(newUser));
      return true;
    }
    return false;
  }, [currentPassword]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('auth_user');
    // We optionally keep the password or reset it. Usually logout doesn't reset password config.
  }, []);

  const updateUser = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      localStorage.setItem('auth_user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const changePassword = useCallback((current: string, newPass: string) => {
    if (current === currentPassword) {
      setCurrentPassword(newPass);
      localStorage.setItem('auth_password', newPass);
      return true;
    }
    return false;
  }, [currentPassword]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
