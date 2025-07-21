import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native'
import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import 'react-native-reanimated'
import { AuthProvider } from '../context/AuthContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { Stack } from 'expo-router'

SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const colorScheme = useColorScheme()

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) {
    return null
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            animationDuration: 800,
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen 
            name="index" 
            options={{
              animation: 'fade',
              animationDuration: 600,
            }}
          />
          <Stack.Screen 
            name="login" 
            options={{
              animation: 'slide_from_right',
              animationDuration: 1200,
            }}
          />
          <Stack.Screen 
            name="signup" 
            options={{
              animation: 'slide_from_right',
              animationDuration: 800,
            }}
          />
          <Stack.Screen 
            name="forgot-password" 
            options={{
              animation: 'slide_from_right',
              animationDuration: 800,
            }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AuthProvider>
  )
}
