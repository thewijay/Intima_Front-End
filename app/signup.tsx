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
} from 'react-native'
import { useRouter } from 'expo-router'

export default function SignupScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')

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
        style={styles.container}
      >
        <Text style={styles.title}>Create Account</Text>

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

        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}

        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#ccc"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Add back navigation to login */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.linkText}>Already have an account? Login</Text>
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
    paddingHorizontal: 40,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  linkText: {
    color: '#ddd',
    textAlign: 'center',
    fontSize: 14,
    marginTop: 15,
  },
  errorText: {
    color: '#ff0000',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center',
  },
})
