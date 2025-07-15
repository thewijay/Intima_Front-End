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

  // ===== NEW CHAT HISTORY METHODS =====

  /**
   * Get list of all conversations for the current user
   * @returns {Promise} List of conversations with metadata
   */
  async getConversationList() {
    try {
      const token = await this.getAuthToken()

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${API_BASE_URL}/chat/conversations/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch conversations')
      }

      return data
    } catch (error) {
      console.error('Get conversation list error:', error)
      return {
        success: false,
        error: error.message || 'Unknown error',
        conversations: [],
      }
    }
  }

  /**
   * Get message history for a specific conversation
   * @param {string} conversationId - The conversation ID to fetch history for
   * @returns {Promise} Message history for the conversation
   */
  async getConversationHistory(conversationId) {
    try {
      const token = await this.getAuthToken()

      if (!token) {
        throw new Error('Authentication required')
      }

      if (!conversationId) {
        throw new Error('Conversation ID is required')
      }

      const response = await fetch(
        `${API_BASE_URL}/chat/history/?conversation_id=${conversationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch conversation history')
      }

      return data
    } catch (error) {
      console.error('Get conversation history error:', error)
      return {
        success: false,
        error: error.message || 'Unknown error',
        messages: [],
      }
    }
  }

  /**
   * Generate a new conversation ID
   * @returns {string} New UUID for conversation
   */
  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  }

  /**
   * Generate a new message ID
   * @returns {string} New UUID for message
   */
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  }

  /**
   * Format message data from backend to frontend format
   * @param {Object} backendMessage - Message object from backend
   * @returns {Object} Formatted message for frontend
   */
  formatMessageForFrontend(backendMessage) {
    return {
      id: backendMessage.message_id || backendMessage.id,
      text: backendMessage.question,
      sender: 'user',
      time: new Date(backendMessage.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      timestamp: backendMessage.timestamp,
    }
  }

  /**
   * Format AI response for frontend
   * @param {Object} backendMessage - Message object from backend  
   * @returns {Object} Formatted AI message for frontend
   */
  formatAiMessageForFrontend(backendMessage) {
    return {
      id: `ai_${backendMessage.message_id || backendMessage.id}`,
      text: backendMessage.answer,
      sender: 'bot',
      time: new Date(backendMessage.timestamp).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      sources: backendMessage.sources || [],
      timestamp: backendMessage.timestamp,
    }
  }

  /**
   * Convert backend conversation history to frontend message format
   * @param {Array} backendMessages - Array of messages from backend
   * @returns {Array} Formatted messages for frontend display
   */
  formatConversationHistory(backendMessages) {
    const formattedMessages = []

    backendMessages.forEach((msg) => {
      // Add user message
      formattedMessages.push(this.formatMessageForFrontend(msg))
      
      // Add AI response
      formattedMessages.push(this.formatAiMessageForFrontend(msg))
    })

    return formattedMessages
  }
}

export default new ChatService()
