import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack, useSegments } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'
import 'react-native-reanimated'
import { AuthProvider } from '../context/AuthContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import ChatDrawer from './ChatDrawer'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const segments = useSegments()
  const [isChatRoute, setIsChatRoute] = useState(false)

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  useEffect(() => {
    setIsChatRoute(segments.includes('chatscreen'))
  }, [segments])

  if (!fontsLoaded) {
    return null
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        {isChatRoute ? (
          <>
            <ChatDrawer />
            <StatusBar style="auto" />
          </>
        ) : (
          <>
            <Stack
              initialRouteName="index"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="index" />
              <Stack.Screen name="login" />
              <Stack.Screen name="signup" />
              <Stack.Screen name="success" />
              <Stack.Screen name="forgot-password" />
              <Stack.Screen name="+not-found" />
              <Stack.Screen name="screen1" />
              <Stack.Screen name="screen2" />
              <Stack.Screen name="chatscreen" />
            </Stack>
            <StatusBar style="auto" />
          </>
        )}
      </ThemeProvider>
    </AuthProvider>
  )
}
