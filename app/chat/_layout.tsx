import React, { useState, useEffect, createContext, useContext } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Drawer } from 'expo-router/drawer'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native'
import { Feather } from '@expo/vector-icons'
import { useAuth } from '../../context/AuthContext'
import ChatService from '../../services/chatService'
import type { Conversation } from '../../services/chatService.d'

const { width, height } = Dimensions.get('window')

// Context for conversation management
interface ConversationContextType {
  conversations: Conversation[]
  currentConversationId: string | null
  loading: boolean
  loadConversations: () => Promise<void>
  switchConversation: (conversationId: string) => void
  createNewConversation: () => void
  setCurrentConversationId: (id: string | null) => void
  markConversationAsJustCreated: () => void // Add this method
}

const ConversationContext = createContext<ConversationContextType | null>(null)

export const useConversation = () => {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversation must be used within ConversationProvider')
  }
  return context
}

function CustomDrawerContent(props: any) {
  const { logout } = useAuth()
  const {
    conversations,
    currentConversationId,
    loading,
    loadConversations,
    createNewConversation,
    switchConversation,
  } = useConversation()

  const handleLogout = async () => {
    await logout()
  }

  const handleConversationSelect = (conversationId: string) => {
    switchConversation(conversationId)
    // Automatically close the drawer using props.navigation
    props.navigation?.closeDrawer?.()
  }

  const handleNewConversation = () => {
    createNewConversation()
    // Automatically close the drawer using props.navigation
    props.navigation?.closeDrawer?.()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) return 'Today'
    if (diffDays === 2) return 'Yesterday'
    if (diffDays <= 7) return `${diffDays - 1} days ago`
    return date.toLocaleDateString()
  }

  const truncateTitle = (title: string, maxLength: number = 30) => {
    return title.length > maxLength
      ? title.substring(0, maxLength) + '...'
      : title
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* NAVIGATION BAR WITH LOGO */}
      <View style={styles.navbar}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      {/* NEW CONVERSATION BUTTON - TOP */}
      <TouchableOpacity
        style={styles.newConversationButton}
        onPress={handleNewConversation}
      >
        <Feather
          name="plus"
          size={Math.max(20, width * 0.055)}
          color="#00E1FF"
          style={{ marginRight: 10 }}
        />
        <Text style={styles.newConversationText}>New Conversation</Text>
      </TouchableOpacity>
      {/* CONVERSATION LIST - MIDDLE (SCROLLABLE) */}
      <View style={styles.conversationSection}>
        <Text style={styles.sectionTitle}>Recent Conversations</Text>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#00E1FF" />
            <Text style={styles.loadingText}>Loading conversations...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.conversationList}
            showsVerticalScrollIndicator={false}
          >
            {conversations.length === 0 ? (
              <Text style={styles.emptyText}>No conversations yet</Text>
            ) : (
              conversations.map((conversation) => (
                <TouchableOpacity
                  key={conversation.id}
                  style={[
                    styles.conversationItem,
                    currentConversationId === conversation.conversation_id &&
                      styles.activeConversation,
                  ]}
                  onPress={() => {
                    const convId =
                      conversation.conversation_id || conversation.id
                    if (convId) {
                      handleConversationSelect(convId)
                    }
                  }}
                >
                  <View style={styles.conversationContent}>
                    <Text
                      style={[
                        styles.conversationTitle,
                        currentConversationId ===
                          conversation.conversation_id &&
                          styles.activeConversationText,
                      ]}
                    >
                      {truncateTitle(conversation.title)}
                    </Text>
                    <Text style={styles.conversationDate}>
                      {formatDate(conversation.last_updated)}
                    </Text>
                    {conversation.last_message && (
                      <Text style={styles.lastMessage}>
                        {truncateTitle(conversation.last_message.text, 40)}
                      </Text>
                    )}
                  </View>
                  {currentConversationId === conversation.conversation_id && (
                    <Feather name="message-circle" size={Math.max(16, width * 0.045)} color="#00E1FF" />
                  )}
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        )}
      </View>
      {/* SETTINGS & LOGOUT - BOTTOM */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton}>
          <Feather
            name="settings"
            size={Math.max(20, width * 0.055)}
            color="#fff"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
          <Feather
            name="log-out"
            size={Math.max(20, width * 0.055)}
            color="red"
            style={{ marginRight: 10 }}
          />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

// ConversationProvider component
function ConversationProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null)
  const [loading, setLoading] = useState(false)
  const [justCreatedConversation, setJustCreatedConversation] = useState(false) // Track if we just created a conversation

  // Persist conversation ID to survive login/logout
  const persistConversationId = async (id: string | null) => {
    try {
      if (id) {
        await AsyncStorage.setItem('currentConversationId', id)
      } else {
        await AsyncStorage.removeItem('currentConversationId')
      }
    } catch (error) {
      console.error('Error persisting conversation ID:', error)
    }
  }

  // Restore conversation ID on app start
  const restoreConversationId = async () => {
    try {
      const savedId = await AsyncStorage.getItem('currentConversationId')
      if (savedId) {
        setCurrentConversationId(savedId)
        setJustCreatedConversation(true) // Treat restored conversations as "just created" to prevent clearing
      }
    } catch (error) {
      console.error('Error restoring conversation ID:', error)
    }
  }

  // Override setCurrentConversationId to include persistence
  const setCurrentConversationIdWithPersistence = (id: string | null) => {
    setCurrentConversationId(id)
    persistConversationId(id)
  }

  // Restore conversation ID on component mount
  useEffect(() => {
    restoreConversationId()
  }, [])

  const loadConversations = async () => {
    setLoading(true)
    try {
      const response = await ChatService.getConversationList()

      if (response.success && response.conversations) {
        setConversations(response.conversations)

        // Check if current conversation still exists in the list
        const currentConversationExists =
          currentConversationId &&
          response.conversations.some(
            (conv) => conv.conversation_id === currentConversationId
          )

        // Auto-load most recent conversation if none selected
        if (!currentConversationId && response.conversations.length > 0) {
          setCurrentConversationId(
            response.conversations[0].conversation_id ||
              response.conversations[0].id
          )
        } else if (
          currentConversationId &&
          !currentConversationExists &&
          response.conversations.length > 0
        ) {
          // Current conversation doesn't exist anymore, switch to most recent
          setCurrentConversationId(
            response.conversations[0].conversation_id ||
              response.conversations[0].id
          )
        } else if (
          response.conversations.length === 0 &&
          !currentConversationId
        ) {
          console.log(
            'No conversations found and no current conversation, clearing current conversation ID'
          )
          setCurrentConversationId(null)
        } else if (
          response.conversations.length === 0 &&
          currentConversationId
        ) {
          if (justCreatedConversation) {
            // Reset the flag after a delay to allow backend processing
            setTimeout(() => {
              setJustCreatedConversation(false)
            }, 5000) // Keep the flag for 5 seconds
          } else {
            setCurrentConversationId(null)
          }
        }
      } else {
        // Check if it's a token expiration error
        if (
          response.error?.includes('Token expired') ||
          response.error?.includes('please log in again')
        ) {
          console.error('Token expired - user needs to log in again')
          // TODO: Show user-friendly message and redirect to login
          // For now, clear conversations
          setConversations([])
          setCurrentConversationId(null)
        } else {
          // If no conversations and no current conversation, start with a clean slate
          setConversations([])
          if (!currentConversationId) {
            setCurrentConversationId(null)
          }
        }
      }
    } catch (error) {
      console.error('Error loading conversations:', error)
      // On error, start with a clean slate
      setConversations([])
      setCurrentConversationId(null)
    } finally {
      setLoading(false)
    }
  }

  const switchConversation = (conversationId: string) => {
    setCurrentConversationIdWithPersistence(conversationId)
  }

  const createNewConversation = () => {
    setCurrentConversationIdWithPersistence(null) // Set to null for new conversation
  }

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Test connection first
        console.log('Testing backend connection...')
        const connectionTest = await ChatService.testConnection()
        console.log('Connection test result:', connectionTest)

        if (connectionTest.success) {
          // If connection is good, load conversations
          loadConversations()
        } else {
          console.error('Backend connection failed:', connectionTest.error)
          // Still try to load conversations in case of intermittent network issues
          loadConversations()
        }
      } catch (error) {
        console.error('Error during app initialization:', error)
        // Still try to load conversations
        loadConversations()
      }
    }

    initializeApp()
  }, [])

  const markConversationAsJustCreated = () => {
    setJustCreatedConversation(true)
  }

  const value: ConversationContextType = {
    conversations,
    currentConversationId,
    loading,
    loadConversations,
    switchConversation,
    createNewConversation,
    setCurrentConversationId: setCurrentConversationIdWithPersistence,
    markConversationAsJustCreated,
  }

  return (
    <ConversationContext.Provider value={value}>
      {children}
    </ConversationContext.Provider>
  )
}

export default function ChatLayout() {
  return (
    <ConversationProvider>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={(props) => <CustomDrawerContent {...props} />}
      />
    </ConversationProvider>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: width * 0.04,
    paddingTop: 0,
  },
  navbar: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: height * 0.025,
    marginBottom: height * 0.01,
  },
  logo: {
    width: width * 0.32,
    height: width * 0.13,
  },
  newConversationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingVertical: height * 0.018,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    marginBottom: height * 0.025,
    borderWidth: 1,
    borderColor: '#00E1FF',
  },
  newConversationText: {
    color: '#00E1FF',
    fontSize: Math.max(16, width * 0.045),
    fontWeight: '600',
  },
  conversationSection: {
    flex: 1,
    marginBottom: height * 0.025,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: Math.max(18, width * 0.05),
    fontWeight: 'bold',
    marginBottom: height * 0.015,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: height * 0.025,
  },
  loadingText: {
    color: '#ccc',
    marginLeft: 10,
    fontSize: Math.max(14, width * 0.04),
  },
  conversationList: {
    flex: 1,
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    marginTop: height * 0.025,
    fontStyle: 'italic',
    fontSize: Math.max(13, width * 0.038),
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    paddingVertical: height * 0.016,
    paddingHorizontal: width * 0.03,
    borderRadius: 8,
    marginBottom: height * 0.012,
    borderWidth: 1,
    borderColor: '#3a3a3a',
  },
  activeConversation: {
    borderColor: '#00E1FF',
    backgroundColor: '#1a3a4a',
  },
  conversationContent: {
    flex: 1,
  },
  conversationTitle: {
    color: '#fff',
    fontSize: Math.max(14, width * 0.04),
    fontWeight: '600',
    marginBottom: 4,
  },
  activeConversationText: {
    color: '#00E1FF',
  },
  conversationDate: {
    color: '#888',
    fontSize: Math.max(12, width * 0.035),
    marginBottom: 2,
  },
  lastMessage: {
    color: '#aaa',
    fontSize: Math.max(12, width * 0.035),
    fontStyle: 'italic',
  },
  bottomActions: {
    borderTopWidth: 1,
    borderTopColor: '#3a3a3a',
    paddingTop: height * 0.018,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: height * 0.018,
  },
  actionText: {
    fontSize: Math.max(16, width * 0.045),
    color: '#fff',
  },
  logoutText: {
    fontSize: Math.max(16, width * 0.045),
    color: 'red',
  },
})
