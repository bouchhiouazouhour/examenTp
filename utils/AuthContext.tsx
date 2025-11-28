import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { storage } from './storage';
import { api, isApiAvailable } from './api';

interface User {
  email: string;
  name?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  isOnline: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    const online = await isApiAvailable();
    setIsOnline(online);
  };

  const checkAuthStatus = async () => {
    try {
      const token = await storage.get<string>('token');
      const userData = await storage.get<User>('user');
      
      if (token && userData) {
        setUser(userData);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Essayer d'abord avec l'API
      const response = await api.post('/login', { email, password });
      
      if (response.data.token) {
        const userData = { 
          email: email,
          name: email === "admin@familydo.tn" ? "Administrateur" : email.split('@')[0]
        };
        
        await storage.save('token', response.data.token);
        await storage.save('user', userData);
        setUser(userData);
        setIsOnline(true);
        
        return true;
      }
      return false;

    } catch (error: any) {
      console.error('Login API error, trying local auth:', error);
      
      // Fallback: vérification locale
      if (email === "admin@familydo.tn" && password === "admin") {
        const userData = { 
          email: "admin@familydo.tn", 
          name: "Administrateur" 
        };
        
        await storage.save('token', 'familydo-admin-token-123');
        await storage.save('user', userData);
        setUser(userData);
        setIsOnline(false);
        
        return true;
      }
      return false;
    }
  };

  const logout = async () => {
    try {
      await storage.remove('token');
      await storage.remove('user');
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, isOnline }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};