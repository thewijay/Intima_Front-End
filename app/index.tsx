import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';


export default function WelcomeScreen() {
    const router = useRouter();
    const { token, loading } = useAuth();

    useEffect(() => {
      if (!loading) {
        if (token) {
          router.replace('/chatscreen');
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

    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/images/logo.png")} style={styles.logo} />
        <View style={styles.overlay}>
            <Text style={styles.subtitle}>
              AI-Based Sexual and Wellness Healthcare Assistant
            </Text>
        </View>
      </View>

      <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/login')}
        >
        <Text style={styles.buttonText}>Get Started</Text>
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
    paddingVertical: 60,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    position: 'relative',
  },
  logo: {
    marginTop: 30,
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  subtitle: {
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: '46%',
  },
  button: {
    backgroundColor: '#00ACC1', // Cyan shade
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
