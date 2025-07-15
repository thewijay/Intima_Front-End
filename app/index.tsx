import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
  ActivityIndicator,
  Animated,
  Easing,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';


export default function WelcomeScreen() {
    const router = useRouter();
    const { token, loading } = useAuth();
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      if (!loading) {
        if (token) {
          router.replace('/chat');
        }
      }
      // Start fade-in
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }).start();
      // Start pulse and glow loop
      Animated.loop(
        Animated.parallel([
          Animated.sequence([
            Animated.timing(pulseAnim, {
              toValue: 1.08,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(pulseAnim, {
              toValue: 1,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ]),
          Animated.sequence([
            Animated.timing(glowAnim, {
              toValue: 1,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
            Animated.timing(glowAnim, {
              toValue: 0,
              duration: 900,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: false,
            }),
          ]),
        ])
      ).start();
    }, [loading, token]);

    // Interpolate shadow for glow effect
    const shadowGlow = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 18],
    });
    const shadowOpacity = glowAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0.2, 0.7],
    });

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
      <View style={styles.logoRow}>
        <Animated.View
          style={[
            {
              opacity: fadeAnim,
              transform: [{ scale: pulseAnim }],
              shadowColor: '#00E1FF',
              shadowOffset: { width: 0, height: 0 },
              shadowRadius: shadowGlow,
              shadowOpacity: shadowOpacity,
              elevation: shadowGlow, // Android shadow
            },
          ]}
        >
          <Image
            source={require("../assets/images/logo_only.png")}
            style={styles.logoIcon}
          />
        </Animated.View>
        <Text style={styles.logoText}>Intima</Text>
      </View>
      <Text style={styles.subtitle}>
        AI-Based Sexual and Wellness Healthcare Assistant
      </Text>
      <View style={{ flex: 1 }} />
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
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    marginBottom: 24,
  },
  logoIcon: {
    width: 90,
    height: 90,
    marginRight: 1,
    resizeMode: 'contain',
  },
  logoText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 11,
    color: 'white',
    textAlign: 'center',
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
