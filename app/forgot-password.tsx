import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ImageBackground, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleSubmit = () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    // Placeholder for API call
    Alert.alert('Success', `Password reset link sent to ${email}`);
    router.back(); // Return to login screen
  };

  return (

        <ImageBackground
          source={require('../assets/images/background1.png')}
          style={styles.background}
          resizeMode="cover"
        >
    
    <View style={styles.container}>
      <Text style={styles.title}>Forgot Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={styles.backLink}>← Back to Login</Text>
      </TouchableOpacity>
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
    background: {
       flex: 1,
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 42,
        textAlign: 'center',
        color: 'white',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 14,
        marginBottom: 24,
        color: '#fff',
    },
    button: {
        backgroundColor: '#00ACC1',
        paddingVertical: 14,
        borderRadius: 30,
        alignItems: 'center',
        marginBottom: 4,
        alignSelf: 'center',
        minWidth: 150,
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    backLink: {
        color: '#00ACC1',
        textAlign: 'center',
        marginTop: 10,
    },
});
