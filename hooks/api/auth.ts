import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

const API_BASE_URL = 'http://192.168.8.100:8000/api' // include http!

function handleError(error: any) {
  return error.response?.data || { detail: error.message }
}

export interface UserProfile {
  weight_kg: number
  marital_status: string
  sexually_active: string
  menstrual_cycle?: string
  medical_conditions?: string
  first_name: string
  last_name: string
  date_of_birth: string // ISO string (e.g., "1990-01-01")
  gender: string
  height_cm: number
}

const axiosInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

let cachedToken: string | null = null

axiosInstance.interceptors.request.use(async (config) => {
  if (!cachedToken) {
    cachedToken = await AsyncStorage.getItem('token')
    console.log('Loaded token from storage:', cachedToken)
  }
  if (cachedToken) {
    config.headers.Authorization = `Bearer ${cachedToken}`
  }
  return config
})

// ✅ API Calls

export const registerUser = async (
  email: string,
  password: string,
  confirm_password: string
) => {
  try {
    const response = await axiosInstance.post('/register/', {
      email,
      password,
      confirm_password,
    })
    return response.data
  } catch (error: any) {
    throw handleError(error)
  }
}

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axios.post(config.TOKEN_URL, {
      email,
      password,
    })
    return response.data
  } catch (error: any) {
    throw handleError(error)
  }
}

export const fetchUserProfile = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get('/profile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error: any) {
    throw handleError(error)
  }
}

export const updateUserProfile = async (
  accessToken: string,
  profileData: UserProfile
) => {
  try {
    const response = await axiosInstance.put('/profile/update/', profileData, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    return response.data
  } catch (error: any) {
    throw handleError(error)
  }
}

export default axiosInstance
