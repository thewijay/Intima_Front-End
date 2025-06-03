import { Drawer } from 'expo-router/drawer'
import { View, Text, TouchableOpacity } from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'

function CustomDrawerContent() {
  const { logout } = useAuth()

  const handleLogout = async () => {
    await logout()
  }

  return (
    <View style={{ flex: 1, padding: 24, justifyContent: 'flex-end' }}>
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
        }}
        // Future Settings Nav: add router.push('/chat/settings')
      >
        <Feather
          name="settings"
          size={20}
          color="#fff"
          style={{ marginRight: 10 }}
        />
        <Text style={{ fontSize: 16, color: '#fff' }}>Settings</Text>
      </TouchableOpacity>

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

export default function ChatLayout() {
  return (
    <Drawer
      screenOptions={{ headerShown: false }}
      drawerContent={() => <CustomDrawerContent />}
    />
  )
}
