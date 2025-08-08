import React, { useState, useRef, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  SafeAreaView,
  Dimensions,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import Markdown from 'react-native-markdown-display'
import ChatService from '../../services/chatService'
import { ChatResponse } from '@/services/chatService'
import { useRouter } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import { ChatDrawerParamList } from '@/types/navigation'
import { useConversation } from './_layout'

const { width, height } = Dimensions.get('window')

// Markdown styles for bot messages
const markdownStyles = {
  body: {
    color: '#fff',
    fontSize: Math.max(14, width * 0.038),
  },
  heading1: {
    color: '#fff',
    fontSize: Math.max(18, width * 0.045),
    fontWeight: 'bold' as const,
  },
  heading2: {
    color: '#fff',
    fontSize: Math.max(16, width * 0.042),
    fontWeight: 'bold' as const,
  },
  strong: {
    color: '#fff',
    fontWeight: 'bold' as const,
  },
  em: {
    color: '#fff',
    fontStyle: 'italic' as const,
  },
  list_item: {
    color: '#fff',
    fontSize: Math.max(14, width * 0.038),
  },
  bullet_list: {
    color: '#fff',
  },
  ordered_list: {
    color: '#fff',
  },
  code_inline: {
    color: '#ff6b6b',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 3,
  },
  code_block: {
    color: '#ff6b6b',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    borderRadius: 5,
    marginVertical: 5,
  },
  link: {
    color: '#4dabf7',
    textDecorationLine: 'underline' as const,
  },
}

interface Message {
  id: string
  text: string
  sender: string
  time: string
  sources?: string[]
}

export default function ChatScreen() {
  const { token } = useAuth()
  const router = useRouter()
  const navigation = useNavigation<DrawerNavigationProp<ChatDrawerParamList>>()
  const {
    currentConversationId,
    setCurrentConversationId,
    loadConversations,
    markConversationAsJustCreated,
  } = useConversation()

  // Fixed responsive values with controlled logo size
  const NAVBAR_HEIGHT = Math.max(60, height * 0.11)
  const LOGO_SIZE = 64 // Fixed size for better consistency
  const ICON_SIZE = Math.max(24, width * 0.08)
  const INPUT_HEIGHT = Math.max(48, height * 0.07)

  useEffect(() => {
    if (!token) {
      router.replace('/')
    }
  }, [token])

  // Check for welcome message when component mounts
  useEffect(() => {
    if (token) {
      checkForWelcomeMessage()
    }
  }, [token])

  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState<boolean>(false)

  const flatListRef = useRef<FlatList>(null)

  // Handle token expiration
  const handleTokenExpiration = () => {
    Alert.alert(
      'Session Expired',
      'Your login session has expired. Please log in again to continue.',
      [
        {
          text: 'Log In',
          onPress: () => {
            router.replace('/')
          },
        },
      ],
      { cancelable: false }
    )
  }

  // Check for and display welcome message if needed
  const checkForWelcomeMessage = async () => {
    try {
      // Check if the method exists first
      if (typeof (ChatService as any).getWelcomeMessage !== 'function') {
        return
      }

      const response = await (ChatService as any).getWelcomeMessage()

      if (
        response.success &&
        response.needs_welcome &&
        response.welcome_message
      ) {
        // Create welcome message object
        const welcomeMessage: Message = {
          id: response.message_id || `welcome_${Date.now()}`,
          text: response.welcome_message,
          sender: 'bot',
          time: new Date(response.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sources: [],
        }

        // Set the welcome message in chat
        setMessages([welcomeMessage])

        // Set the conversation ID from the response
        if (
          response.conversation_id &&
          typeof response.conversation_id === 'string'
        ) {
          setCurrentConversationId(response.conversation_id)
          markConversationAsJustCreated()
        }

        // Refresh conversations list to show the new welcome conversation
        loadConversations()
      }
    } catch (error) {
      console.error('Error checking for welcome message:', error)
      // Don't show error to user - just continue without welcome message
    }
  }

  // Load conversation history when conversation changes
  useEffect(() => {
    if (currentConversationId) {
      loadConversationHistory(currentConversationId)
    } else {
      setMessages([]) // Clear messages for new conversation
    }
  }, [currentConversationId])

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const loadConversationHistory = async (conversationId: string) => {
    setIsLoadingHistory(true)
    try {
      const response = await ChatService.getConversationHistory(conversationId)

      if (response.success && response.messages) {
        const formattedMessages = ChatService.formatConversationHistory(
          response.messages
        )
        setMessages(formattedMessages)
      } else {
        // Check if it's a token expiration error
        if (
          response.error?.includes('Token expired') ||
          response.error?.includes('please log in again')
        ) {
          handleTokenExpiration()
          return
        }

        // If conversation doesn't exist or has no messages, only clear if we don't already have messages
        // This prevents clearing welcome messages that were just added
        setMessages((currentMessages) => {
          // If we already have messages (like a welcome message), keep them
          if (currentMessages.length > 0) {
            return currentMessages
          }
          // Otherwise, start fresh
          return []
        })
      }
    } catch (error) {
      console.error('Error loading conversation history:', error)
      // On error, only clear messages if we don't already have any
      setMessages((currentMessages) => {
        if (currentMessages.length > 0) {
          return currentMessages
        }
        return []
      })
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

    // Generate conversation ID if needed, but don't set it in state yet
    let activeConversationId = currentConversationId
    if (!activeConversationId) {
      activeConversationId = ChatService.generateConversationId()
    }

    const userMessage: Message = {
      id: `user_${Date.now()}`,
      text: inputText.trim(),
      sender: 'user',
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentQuestion = inputText.trim()
    setInputText('')
    setIsLoading(true)

    try {
      const response: ChatResponse = await ChatService.sendMessage(
        currentQuestion,
        {
          conversationId: activeConversationId,
          messageId: ChatService.generateMessageId(),
          model: 'gpt-4o-mini',
          limit: 3,
        }
      )

      // Handle both successful responses and "No relevant information found" cases
      if (response.answer) {
        // Check if this is a new conversation
        const wasNewConversation = !currentConversationId

        // Set the conversation ID from the backend response (only if we don't have one)
        if (
          !currentConversationId &&
          response.conversation_id &&
          typeof response.conversation_id === 'string'
        ) {
          setCurrentConversationId(response.conversation_id)
          markConversationAsJustCreated() // Mark as just created to prevent clearing
        }

        const aiMessage: Message = {
          id: response.message_id || `ai_${Date.now()}`,
          text: response.answer,
          sender: 'bot',
          time: new Date(response.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          sources: response.sources || [],
        }

        setMessages((prev) => [...prev, aiMessage])

        // For new conversations, refresh the list after a short delay to allow backend processing
        // For existing conversations, refresh immediately
        if (wasNewConversation) {
          // Give the backend time to process and save the conversation
          setTimeout(() => {
            loadConversations()
          }, 1000)
        } else {
          loadConversations()
        }
      } else {
        // If no answer provided, treat as error
        throw new Error(
          response.message || response.error || 'Failed to get AI response'
        )
      }
    } catch (error) {
      console.error('Error sending message:', error)

      const errorMessage: Message = {
        id: `error_${Date.now()}`,
        text: 'Sorry, I encountered an error. Please try again.',
        sender: 'bot',
        time: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const renderItem = ({ item }: { item: Message }) => {
    return item.sender === 'bot' ? (
      <View style={styles.botRow}>
        <Image
          source={require('../../assets/images/logo_only.png')}
          style={styles.logoSmall}
        />
        <View>
          <View style={[styles.messageBubble, styles.botBubble]}>
            <Markdown style={markdownStyles}>{item.text}</Markdown>
          </View>
          {/* {item.sources && item.sources.length > 0 && (
            <Text style={styles.sourcesText}>
              Sources: {item.sources.join(', ')}
            </Text>
          )} */}
          <Text style={[styles.timeText, { alignSelf: 'flex-end' }]}>
            {item.time}
          </Text>
        </View>
      </View>
    ) : (
      <View style={styles.userRow}>
        <View style={[styles.messageBubble, styles.userBubble]}>
          <Text style={styles.messageText}>{item.text}</Text>
        </View>
        <Text style={[styles.timeText, { alignSelf: 'flex-end' }]}>
          {item.time}
        </Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ImageBackground
        source={require('../../assets/images/background1.png')}
        style={styles.background}
      >
        {/* Navigation Bar */}
        <View style={[styles.navbar, { height: NAVBAR_HEIGHT }]}>
          <View style={styles.navbarContent}>
            <Image
              source={require('../../assets/images/LOGONEW.png')}
              style={{
                width: LOGO_SIZE,
                height: LOGO_SIZE,
                resizeMode: 'contain',
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.openDrawer()}
              style={styles.iconTopRight}
            >
              <Ionicons name="menu" size={ICON_SIZE} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Chat Messages */}
        <View style={[styles.chatContainer, { marginTop: NAVBAR_HEIGHT }]}>
          {isLoadingHistory ? (
            <View style={styles.loadingHistoryContainer}>
              <ActivityIndicator size="large" color="#00E1FF" />
              <Text style={styles.loadingHistoryText}>
                Loading conversation...
              </Text>
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.chat}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Input Area */}
        <View style={[styles.inputContainer, { height: INPUT_HEIGHT }]}>
          <Ionicons name="happy-outline" size={ICON_SIZE * 0.9} color="#fff" />
          <TextInput
            placeholder="Type message here..."
            placeholderTextColor="#ccc"
            style={[styles.input, { fontSize: Math.max(15, width * 0.04) }]}
            value={inputText}
            onChangeText={setInputText}
            editable={!isLoading}
          />
          <TouchableOpacity
            onPress={sendMessage}
            disabled={!inputText.trim() || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#00E1FF" />
            ) : (
              <Ionicons
                name="send"
                size={ICON_SIZE * 0.9}
                color={!inputText.trim() ? '#666' : '#00E1FF'}
              />
            )}
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#141F39',
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
    width: '100%',
    height: '100%',
  },
  navbar: {
    width: '100%',
    backgroundColor: 'rgba(20, 31, 57, 0.98)',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: '#222',
  },
  navbarContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: width * 0.06,
    paddingTop: 24,
    width: '100%',
    height: '100%',
  },
  iconTopRight: {
    padding: 4,
  },
  chatContainer: {
    flex: 1,
    width: '100%',
    paddingBottom: height * 0.11,
  },
  chat: {
    paddingHorizontal: width * 0.04,
    paddingBottom: height * 0.02,
    paddingTop: 2,
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: height * 0.01,
    maxWidth: '90%',
  },
  userRow: {
    alignSelf: 'flex-end',
    marginVertical: height * 0.01,
    maxWidth: '80%',
  },
  logoSmall: {
    width: width * 0.11,
    height: width * 0.11,
    marginRight: width * 0.02,
    marginTop: width * 0.02,
  },
  messageBubble: {
    borderRadius: 20,
    padding: width * 0.03,
    marginBottom: 4,
    maxWidth: width * 0.75,
  },
  botBubble: {
    backgroundColor: '#1BD6F2',
    borderTopLeftRadius: 0,
  },
  userBubble: {
    backgroundColor: '#B486F4',
    borderTopRightRadius: 0,
    alignSelf: 'flex-end',
  },
  messageText: {
    color: '#fff',
    fontSize: Math.max(14, width * 0.038),
  },
  sourcesText: {
    fontSize: Math.max(9, width * 0.025),
    color: '#ccc',
    marginLeft: width * 0.08,
    fontStyle: 'italic',
    marginTop: 2,
  },
  timeText: {
    fontSize: Math.max(9, width * 0.025),
    color: '#ccc',
    marginLeft: width * 0.08,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.03,
    backgroundColor: '#141F39',
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: '#222',
  },
  input: {
    flex: 1,
    marginHorizontal: width * 0.025,
    color: '#fff',
    paddingVertical: height * 0.01,
  },
  loadingHistoryContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: height * 0.07,
  },
  loadingHistoryText: {
    color: '#fff',
    marginTop: 10,
    fontSize: Math.max(15, width * 0.04),
  },
})
