import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://192.168.8.165:8000/api'; // include http!


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

// Create one axios instance
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to each request
axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  console.log('Interceptor token:', token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Use axiosInstance for API calls
export const registerUser = async (email: string, password: string, confirm_password: string) => {
  try {
    const response = await axiosInstance.post('/register/', {
      email,
      password,
      confirm_password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export const loginUser = async (email: string, password: string) => {
  try {
    const response = await axiosInstance.post('/login/', {
      email,
      password,
    });
    return response.data;
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

// Fetch user profile info
export const fetchUserProfile = async (accessToken: string) => {
  try {
    const response = await axiosInstance.get('/profile/', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data; // should include profile_completed
  } catch (error: any) {
    throw error.response?.data || error.message;
  }
};

export default axiosInstance;



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
    throw error.response?.data || error.message
  }
}



