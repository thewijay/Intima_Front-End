import React, { useEffect, useRef } from 'react';
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
  Animated as RNAnimated,
} from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, Easing } from 'react-native-reanimated';
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

// AnimatedLogo: Heartbeat (scale) + Wave (rotation) animation for logo_only.png
function AnimatedLogo({ size }: { size: number }) {
  const scale = useSharedValue(1);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Heartbeat: scale up and down (slower)
    scale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 700, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 700, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    // Wave: rotate left and right (slower)
    rotate.value = withRepeat(
      withSequence(
        withTiming(-10, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(10, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
        withTiming(0, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <Image
        source={require('../assets/images/logo_only.png')}
        style={{ width: size, height: size, resizeMode: 'contain' }}
      />
    </Animated.View>
  );
}

export default function WelcomeScreen() {
    const router = useRouter();
    const { token, loading } = useAuth();
    const { width, height } = useWindowDimensions();

    // Animation values
    const buttonScale = useRef(new RNAnimated.Value(1)).current;

    useEffect(() => {
      if (!loading) {
        if (token) {
          router.replace('/chat');
        }
      }
    }, [loading, token]);

    // Handle button press with smooth transition
    const handleGetStarted = () => {
      // Animate button press
      RNAnimated.sequence([
        RNAnimated.timing(buttonScale, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        RNAnimated.timing(buttonScale, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Navigate to login after animation completes
        router.push('/login');
      });
    };
  
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
        {/* Logo and App Name on one line */}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: verticalScale(30), marginBottom: verticalScale(20) }}>
          <AnimatedLogo size={scale(50)} />
          <Text style={[styles.appName, { fontSize: scale(32), marginBottom: 0 }]}>Intima</Text>
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.subtitle, { fontSize: scale(11) }]}>AI-Based Sexual and Wellness Healthcare Assistant</Text>
        </View>
        <RNAnimated.View style={{ transform: [{ scale: buttonScale }] }}>
          <TouchableOpacity
            style={[styles.button, {
              paddingVertical: verticalScale(12),
              paddingHorizontal: scale(40),
              borderRadius: scale(30),
            }]}
            onPress={handleGetStarted}
            activeOpacity={0.8}
          >
            <Text style={[styles.buttonText, { fontSize: scale(16) }]}>Get Started</Text>
          </TouchableOpacity>
        </RNAnimated.View>
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
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: scale(20),
    marginTop: verticalScale(20),
  },
  logo: {
    resizeMode: 'contain',
  },
  appName: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    textAlign: 'center',
    lineHeight: scale(16),
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
