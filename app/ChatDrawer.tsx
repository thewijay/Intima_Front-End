import React from 'react'
import { createDrawerNavigator } from '@react-navigation/drawer'
import ChatScreen from './chatscreen'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '../context/AuthContext'

export type ChatDrawerParamList = {
  chatscreen: undefined
}

const Drawer = createDrawerNavigator<ChatDrawerParamList>()



function CustomDrawerContent() {
    const { logout } = useAuth();
  
    const handleLogout = async () => {
      await logout() // that's all — no manual router.replace
    }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'flex-end' }}>
      {/* Settings Button */}
      <TouchableOpacity
        // onPress={() => router.push('')}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <Feather
          name="settings"
          size={20}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 16, color: '#fff' }}>Settings</Text>
      </TouchableOpacity>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
        }}
      >
        <Feather
          name="log-out"
          size={20}
          color="red"
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 20, color: 'red' }}>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function ChatDrawer() {
  return (
    <Drawer.Navigator
      drawerContent={() => <CustomDrawerContent />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Drawer.Screen name="chatscreen" component={ChatScreen} />
    </Drawer.Navigator>
  )
}
