import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserRole } from '@/types/crm';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user for demo
const mockUser: User = {
  id: '1',
  name: 'María García',
  email: 'maria@autoescuelalaroca.com',
  role: 'admin',
  avatar: undefined,
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(mockUser);

  const login = useCallback(async (email: string, password: string) => {
    // Mock login - in production this would call an API
    setUser(mockUser);
    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        login,
        logout,
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
