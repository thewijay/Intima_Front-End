import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity,ImageBackground, Alert, Dimensions, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';

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

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const router = useRouter();
  const { width, height } = useWindowDimensions();

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
      <Text style={[styles.title, { fontSize: scale(28), marginBottom: verticalScale(42) }]}>Forgot Password</Text>
      <TextInput
        style={[styles.input, {
          borderRadius: scale(8),
          padding: scale(14),
          marginBottom: verticalScale(24),
          fontSize: scale(16),
        }]}
        placeholder="Enter your email"
        placeholderTextColor="#ccc"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      
      <TouchableOpacity style={[styles.button, {
        paddingVertical: verticalScale(14),
        borderRadius: scale(30),
        minWidth: scale(150),
      }]} onPress={handleSubmit}>
        <Text style={[styles.buttonText, { fontSize: scale(14) }]}>Send Reset Link</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()}>
        <Text style={[styles.backLink, { marginTop: verticalScale(10) }]}>← Back to Login</Text>
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
        paddingHorizontal: scale(32),
    },
    title: {
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white',
    },
    input: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        color: '#fff',
    },
    button: {
        backgroundColor: '#00ACC1',
        alignItems: 'center',
        marginBottom: 4,
        alignSelf: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
    },
    backLink: {
        color: '#00ACC1',
        textAlign: 'center',
    },
});
