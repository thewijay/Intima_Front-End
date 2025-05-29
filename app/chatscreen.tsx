import React, { useState, useRef, useEffect } from 'react'
import Markdown from 'react-native-markdown-display'
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
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import ChatService from '../services/chatService'
import { ChatResponse } from '@/services/chatService'

const { width } = Dimensions.get('window')

interface Message {
  id: string
  text: string
  sender: string
  time: string
  sources?: string[]
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputText, setInputText] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const conversationId = useRef<string>(
    `conv_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`
  )

  const flatListRef = useRef<FlatList>(null)

  useEffect(() => {
    flatListRef.current?.scrollToEnd({ animated: true })
  }, [messages])

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return

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
          conversationId: conversationId.current,
          messageId: `msg_${Date.now()}`,
          model: 'gpt-4o-mini',
          limit: 3,
        }
      )

      if (response.success) {
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
      } else {
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
          source={require('../assets/images/logo_only.png')}
          style={styles.logoSmall}
        />
        <View>
          <View style={[styles.messageBubble, styles.botBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
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
    <ImageBackground
      source={require('../assets/images/background1.png')}
      style={styles.background}
    >
      <SafeAreaView style={styles.container}>
        {/* Top Left Logo */}
        <View style={styles.logoTopLeftContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoTopLeft}
            resizeMode="contain"
          />
        </View>

        {/* Chat Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.chat}
        />

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <Ionicons name="happy-outline" size={24} color="#fff" />
          <TextInput
            placeholder="Type message here..."
            placeholderTextColor="#ccc"
            style={styles.input}
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
                size={24}
                color={!inputText.trim() ? '#666' : '#00E1FF'}
              />
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  logoTopLeftContainer: {
    alignItems: 'flex-start',
  },
  logoTopLeft: {
    width: width * 0.35,
    height: width * 0.35,
  },
  chat: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  botRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  userRow: {
    alignSelf: 'flex-end',
    marginVertical: 8,
    maxWidth: '80%',
  },
  logoSmall: {
    width: 40,
    height: 40,
    marginRight: 8,
    marginTop: 8,
  },
  messageBubble: {
    borderRadius: 20,
    padding: 12,
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
    fontSize: 15,
  },
  sourcesText: {
    fontSize: 10,
    color: '#ccc',
    marginLeft: 32,
    fontStyle: 'italic',
    marginTop: 2,
  },
  timeText: {
    fontSize: 10,
    color: '#ccc',
    marginLeft: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#141F39',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 8,
  },
})
