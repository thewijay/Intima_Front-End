import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Dimensions,
  useWindowDimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';

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

export default function WelcomeScreen() {
    const router = useRouter();
    const { token, loading } = useAuth();
    const { width, height } = useWindowDimensions();

    useEffect(() => {
      if (!loading) {
        if (token) {
          router.replace('/chat');
        }
      }
    }, [loading, token]);
  
    if (loading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00ACC1" />
        </View>
      );
    }

  return (
    <ImageBackground
      source={require('../assets/images/background1.png')}
      style={styles.background}
      resizeMode="cover"
    >

    <View style={[styles.container, { paddingVertical: verticalScale(60) }]}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")} 
          style={[styles.logo, { 
            marginTop: verticalScale(30),
            width: scale(300),
            height: scale(300)
          }]} 
        />
        <View style={[styles.overlay, { top: height * 0.46 }]}>
            <Text style={[styles.subtitle, { fontSize: scale(11) }]}>
              AI-Based Sexual and Wellness Healthcare Assistant
            </Text>
        </View>
      </View>

      <TouchableOpacity
          style={[styles.button, {
            paddingVertical: verticalScale(12),
            paddingHorizontal: scale(40),
            borderRadius: scale(30),
          }]}
          onPress={() => router.push('/login')}
        >
        <Text style={[styles.buttonText, { fontSize: scale(16) }]}>Get Started</Text>
      </TouchableOpacity>
      
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },  
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    paddingHorizontal: scale(20),
    lineHeight: scale(16),
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    paddingHorizontal: scale(20),
  },
  button: {
    backgroundColor: '#00ACC1', // Cyan shade
    marginBottom: verticalScale(40),
    minWidth: scale(200),
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
});
