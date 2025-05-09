import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

type AuthContextType = {
    token: string | null;
    loading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => Promise<void>;
  };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
        const loadToken = async () => {
          if (Platform.OS !== 'web') {
            const storedToken = await SecureStore.getItemAsync('accessToken')
            if (storedToken) {
              setToken(storedToken);
            }
          }
        setLoading(false);
        };
      
        loadToken();
      }, []);
  
      const login = async (newToken: string) => {
        console.log('About to save token:', typeof newToken, newToken)
        if (Platform.OS !== 'web') {
          await SecureStore.setItemAsync('authToken', newToken);
        }
        setToken(newToken);
      };
      
  
    const logout = async () => {
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync('authToken');
      }
      setToken(null);
    };

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };
