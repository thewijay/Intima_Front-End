// services/chatService.js
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'

const API_BASE_URL = 'http://192.168.8.100:8000/ai' // Change to your server IP for device testing

class ChatService {
  async getAuthToken() {
    try {
      if (Platform.OS === 'web') {
        const token = await AsyncStorage.getItem('authToken')
        return token
      } else {
        const token = await SecureStore.getItemAsync('authToken')
        return token
      }
    } catch (error) {
      console.error('Error getting auth token:', error)
      return null
    }
  }

  async sendMessage(question, options = {}) {
    try {
      const token = await this.getAuthToken()

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_BASE_URL}/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`, // Bearer token style
        },
        body: JSON.stringify({
          question,
          model: options.model || 'gpt-4o-mini',
          limit: options.limit || 3,
          conversation_id: options.conversationId || null,
          message_id: options.messageId || null,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Server error')
      }

      return data // 👈 Important: return the parsed response
    } catch (error) {
      console.error('Chat API error:', error)
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }

  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health/`)
      return await response.json()
    } catch (error) {
      console.error('Health check error:', error)
      throw error
    }
  }
}

export default new ChatService()
