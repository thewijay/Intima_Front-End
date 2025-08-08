// services/chatService.js
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'
import * as SecureStore from 'expo-secure-store'
import { config } from '../config'

class ChatService {
  async getAuthToken() {
    try {
      let token = null
      if (Platform.OS === 'web') {
        token = await AsyncStorage.getItem('authToken')
      } else {
        token = await SecureStore.getItemAsync('authToken')
      }

      return token
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

      const response = await fetch(config.CHAT_URL, {
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

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse chat JSON response:', parseError)
        throw new Error(
          `Invalid response format from server (${response.status})`
        )
      }

      if (!response.ok) {
        throw new Error(data.message || 'Server error')
      }

      // The AI service can return success:false with valid responses like "No relevant information found"
      return data // Return even if success is false
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
      const response = await fetch(config.HEALTH_URL)
      const data = await response.json()
      return data
    } catch (error) {
      console.error('Health check error:', error)
      throw error
    }
  }

  /**
   * Check if an error response indicates token expiration
   * @param {Object} errorData - Error response from backend
   * @returns {boolean} True if token is expired
   */
  isTokenExpired(errorData) {
    return (
      errorData.code === 'token_not_valid' ||
      (errorData.messages &&
        errorData.messages.some((msg) => msg.message === 'Token is expired'))
    )
  }

  /**
   * Handle token expiration by clearing stored token
   */
  async handleTokenExpiration() {
    try {
      if (Platform.OS === 'web') {
        await AsyncStorage.removeItem('authToken')
      } else {
        await SecureStore.deleteItemAsync('authToken')
      }
    } catch (error) {
      console.error('Error clearing expired token:', error)
    }
  }
  /**
   * Test connectivity to the backend server
   * @returns {Promise} Connection test result
   */
  async testConnection() {
    try {
      const healthResult = await this.healthCheck()
      return {
        success: true,
        message: 'Connection successful',
        health: healthResult,
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      return {
        success: false,
        error: error.message || 'Connection failed',
        details: `Failed to connect to ${config.BASE_URL}`,
      }
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
        console.error('No auth token found for conversation list')
        throw new Error('Authentication required')
      }

      const response = await fetch(config.CONVERSATIONS_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError)
        throw new Error(
          `Invalid response format from server (${response.status})`
        )
      }

      if (!response.ok) {
        // Check if token is expired
        if (this.isTokenExpired(data)) {
          await this.handleTokenExpiration()
          throw new Error('Token expired - please log in again')
        }
        throw new Error(
          data.message ||
            `HTTP ${response.status}: Failed to fetch conversations`
        )
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
        console.error('No auth token found')
        throw new Error('Authentication required')
      }

      if (!conversationId) {
        console.error('No conversation ID provided')
        throw new Error('Conversation ID is required')
      }

      const response = await fetch(
        `${config.CHAT_HISTORY_URL}?conversation_id=${conversationId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )

      let data
      try {
        const responseText = await response.text()
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('Failed to parse history JSON response:', parseError)
        throw new Error(
          `Invalid response format from server (${response.status})`
        )
      }

      if (!response.ok) {
        // Handle 404 specifically - conversation not found yet
        if (response.status === 404) {
          return {
            success: true,
            conversation_id: conversationId,
            conversation_title: '',
            messages: [],
          }
        }

        throw new Error(
          data.message ||
            `HTTP ${response.status}: Failed to fetch conversation history`
        )
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
      // Only add user message if there's actually a question (not empty for automatic messages like welcome)
      if (msg.question && msg.question.trim() !== '') {
        formattedMessages.push(this.formatMessageForFrontend(msg))
      }

      // Add AI response (this should always exist)
      formattedMessages.push(this.formatAiMessageForFrontend(msg))
    })

    return formattedMessages
  }

  /**
   * Get conversation history with retry logic for newly created conversations
   * @param {string} conversationId - The conversation ID to fetch history for
   * @param {number} retries - Number of retries remaining
   * @returns {Promise} Message history for the conversation
   */
  async getConversationHistoryWithRetry(conversationId, retries = 3) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const result = await this.getConversationHistory(conversationId)

        // If we get a successful response or it's not a 404, return it
        if (result.success || !result.error?.includes('404')) {
          return result
        }

        // If it's a 404 and we have retries left, wait and try again
        if (attempt < retries) {
          console.log(
            `Conversation not found, retrying in ${(attempt + 1) * 500}ms... (${
              attempt + 1
            }/${retries})`
          )
          await new Promise((resolve) =>
            setTimeout(resolve, (attempt + 1) * 500)
          )
          continue
        }

        // Last attempt failed, return the result
        return result
      } catch (error) {
        console.error(
          `Conversation history attempt ${attempt + 1} failed:`,
          error
        )
        if (attempt === retries) {
          return {
            success: false,
            error: error.message,
            messages: [],
          }
        }
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, (attempt + 1) * 500))
      }
    }
  }

  /**
   * Get welcome message from the server
   * @returns {Object} Welcome message data
   */
  async getWelcomeMessage() {
    try {
      const token = await this.getAuthToken()

      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(config.WELCOME_URL, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Token expired, please log in again')
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      if (!response.headers.get('content-type')?.includes('application/json')) {
        throw new Error(
          `Server returned non-JSON response. Status: ${response.status}`
        )
      }

      const data = await response.json()

      return data
    } catch (error) {
      console.error('Get welcome message error:', error)
      return {
        success: false,
        error: error.message || 'Unknown error',
      }
    }
  }
}

export default new ChatService()
