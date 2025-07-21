import React, { useEffect, useState } from 'react'
import { loginUser } from '../hooks/api/auth'
import { useAuth } from '../context/AuthContext'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  useWindowDimensions,
} from 'react-native'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { fetchUserProfile } from '../hooks/api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

// Get screen dimensions for responsive scaling
const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Responsive scaling functions
const scale = (size: number) => {
  const baseWidth = 375; // iPhone X width as base
  return (screenWidth / baseWidth) * size;
};

const verticalScale = (size: number) => {
  const baseHeight = 812; // iPhone X height as base
  return (screenHeight / baseHeight) * size;
};

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const { width, height } = useWindowDimensions();

  const handleLogin = async () => {
    const trimmedEmail = email.trim()
    const trimmedPassword = password.trim()

    if (!trimmedEmail || !trimmedPassword) {
      alert('Please enter both email and password.')
      return
    }
    
    setLoading(true)
    try {
      const response = await loginUser(email, password)
      console.log('Login successful:', response)

      const accessToken = response.access

      // Save the access token securely
      if (Platform.OS === 'web') {
        await AsyncStorage.setItem('authToken', accessToken)
      } else {
        await SecureStore.setItemAsync('authToken', accessToken)
      }

      // Update Auth Context
      await login(accessToken)

      // Fetch user profile
      const profile = await fetchUserProfile(accessToken)

      // Set the next route (DO THIS INSTEAD OF IMMEDIATE router.replace)
      router.replace(profile.profile_completed ? '/chat' : '/screen1')
    } catch (error: any) {
      console.error('Login error:', error)
      alert(error?.detail || 'Invalid credentials or server error.')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = () => {
    router.push('/forgot-password')
  }

  return (
    <ImageBackground
      source={require('../assets/images/background1.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={[styles.container, { paddingHorizontal: scale(30) }]}
      >
        <Text style={[styles.title, { 
          fontSize: scale(32), 
          marginBottom: verticalScale(40) 
        }]}>Welcome</Text>

        <TextInput
          style={[styles.input, {
            borderRadius: scale(8),
            padding: scale(14),
            marginBottom: verticalScale(20),
            fontSize: scale(16),
          }]}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={[styles.input, {
            borderRadius: scale(8),
            padding: scale(14),
            marginBottom: verticalScale(20),
            fontSize: scale(16),
          }]}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={[styles.button, {
            padding: verticalScale(15),
            borderRadius: scale(30),
            marginBottom: verticalScale(10),
            paddingHorizontal: scale(50),
            minWidth: scale(200),
          }]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={[styles.buttonText, { fontSize: scale(16) }]}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={[styles.linkTextForgot, { 
            fontSize: scale(14), 
            marginBottom: verticalScale(15) 
          }]}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            try {
              console.log('Navigating to signup screen')
              router.push('/signup')
            } catch (error) {
              console.error('Navigation error:', error)
            }
          }}
        >
          <Text style={[styles.linkTextSignup, { fontSize: scale(14) }]}>
            Don't have an account? Sign up
          </Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
  },
  button: {
    backgroundColor: '#00ACC1',
    alignItems: 'center',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  linkTextSignup: {
    color: '#ddd',
    textAlign: 'center',
  },
  linkTextForgot: {
    color: '#178CA4',
    textAlign: 'center',
  },
  successText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
})
