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
} from 'react-native'
import { useRouter } from 'expo-router'
import * as SecureStore from 'expo-secure-store'
import { fetchUserProfile } from '../hooks/api/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)

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
        style={styles.container}
      >
        <Text style={styles.title}>Welcome</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#ccc"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkTextForgot}>Forgot Password?</Text>
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
          <Text style={styles.linkTextSignup}>
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
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 40,
    textAlign: 'center',
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 14,
    marginBottom: 20,
    color: '#fff',
  },
  button: {
    backgroundColor: '#00ACC1',
    padding: 15,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 50,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkTextSignup: {
    color: '#ddd',
    textAlign: 'center',
    fontSize: 14,
  },
  linkTextForgot: {
    color: '#178CA4',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 15,
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 10,
    fontWeight: '600',
  },
})
