import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TODO: add real auth logic
    console.log('Logging in:', email, password);
    // router.push('/chat'); // Navigate to chat screen after login
  };

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

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleForgotPassword}>
          <Text style={styles.linkTextForgot}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
        onPress={() => {
            try {
              console.log("Navigating to signup screen");
              router.push('/signup');
            } catch (error) {
              console.error("Navigation error:", error);
            }
          }}>
          <Text style={styles.linkTextSignup}>Don't have an account? Sign up</Text>
        </TouchableOpacity>

      </KeyboardAvoidingView>

    </ImageBackground>
  );
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
});
