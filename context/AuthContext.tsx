import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

type AuthContextType = {
  token: string | null
  loading: boolean
  login: (token: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const saveToken = async (token: string) => {
    if (Platform.OS === 'web') {
      await AsyncStorage.setItem('authToken', token)
    } else {
      await SecureStore.setItemAsync('authToken', token)
    }
  }

  const removeToken = async () => {
    if (Platform.OS === 'web') {
      await AsyncStorage.removeItem('authToken')
    } else {
      await SecureStore.deleteItemAsync('authToken')
    }
  }

  const loadToken = async () => {
    try {
      let storedToken = null
      if (Platform.OS === 'web') {
        storedToken = await AsyncStorage.getItem('authToken')
      } else {
        storedToken = await SecureStore.getItemAsync('authToken')
      }
      if (storedToken) {
        setToken(storedToken)
      }
    } catch (error) {
      console.error('Error loading token:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadToken()
  }, [])

  const login = async (newToken: string) => {
    try {
      await saveToken(newToken)
      setToken(newToken)
    } catch (error) {
      console.error('Login error:', error)
    }
  }

  const logout = async () => {
    try {
      await removeToken()
      setToken(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <AuthContext.Provider value={{ token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
