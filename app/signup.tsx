import React, { useState } from 'react'
import { registerUser } from '../hooks/api/auth'

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

export default function SignupScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const { width, height } = useWindowDimensions();

  const handleSignup = async () => {
    if (!email || !password || !confirmPassword) {
      alert('Please fill in all fields.')
      return
    }

    if (password !== confirmPassword) {
      alert('Passwords do not match.')
      return
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long')
      return
    }

    try {
      await registerUser(email, password, confirmPassword)
      alert('Registration successful! Please log in.')
      router.push('/login')
    } catch (error: any) {
      console.error(error)
      alert(error?.detail || 'Something went wrong during registration.')
    }
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
        <Text style={[styles.title, { fontSize: scale(32), marginBottom: verticalScale(40) }]}>Create Account</Text>

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

        {passwordError ? (
          <Text style={[styles.errorText, { fontSize: scale(12), marginBottom: verticalScale(10) }]}>{passwordError}</Text>
        ) : null}

        <TextInput
          style={[styles.input, {
            borderRadius: scale(8),
            padding: scale(14),
            marginBottom: verticalScale(20),
            fontSize: scale(16),
          }]}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={[styles.button, {
            padding: verticalScale(15),
            borderRadius: scale(30),
            marginBottom: verticalScale(10),
            paddingHorizontal: scale(40),
            minWidth: scale(200),
          }]}
          onPress={handleSignup}
        >
          <Text style={[styles.buttonText, { fontSize: scale(16) }]}>Sign Up</Text>
        </TouchableOpacity>

        {/* Add back navigation to login */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={[styles.linkText, { fontSize: scale(14), marginTop: verticalScale(15) }]}>Already have an account? Login</Text>
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
  linkText: {
    color: '#ddd',
    textAlign: 'center',
  },
  errorText: {
    color: '#ff0000',
    textAlign: 'center',
  },
})
