export interface ChatResponse {
  success: boolean
  answer: string
  message_id?: string
  timestamp: string
  sources?: string[]
  context_used?: any
  message?: string
  error?: string
}

export interface ConversationListResponse {
  success: boolean
  conversations: Conversation[]
  error?: string
}

export interface ConversationHistoryResponse {
  success: boolean
  conversation_id: string
  conversation_title: string
  messages: BackendMessage[]
  error?: string
}

export interface ConnectionTestResponse {
  success: boolean
  message?: string
  error?: string
  health?: any
  details?: string
}

export interface Conversation {
  id: string
  conversation_id?: string // Frontend conversation ID from backend
  title: string
  created_at: string
  last_updated: string
  last_message?: {
    id: string
    text: string
    timestamp: string
  }
}

export interface BackendMessage {
  id: number
  message_id: string
  question: string
  answer: string
  model_used: string
  sources: string[]
  timestamp: string
}

export interface FrontendMessage {
  id: string
  text: string
  sender: 'user' | 'bot'
  time: string
  sources?: string[]
  timestamp?: string
}

declare const ChatService: {
  getAuthToken(): Promise<string | null>
  sendMessage(
    question: string,
    options?: {
      conversationId?: string
      messageId?: string
      model?: string
      limit?: number
    }
  ): Promise<ChatResponse>
  healthCheck(): Promise<any>
  testConnection(): Promise<ConnectionTestResponse>

  // New history methods
  getConversationList(): Promise<ConversationListResponse>
  getConversationHistory(
    conversationId: string
  ): Promise<ConversationHistoryResponse>
  generateConversationId(): string
  generateMessageId(): string
  formatMessageForFrontend(backendMessage: BackendMessage): FrontendMessage
  formatAiMessageForFrontend(backendMessage: BackendMessage): FrontendMessage
  formatConversationHistory(
    backendMessages: BackendMessage[]
  ): FrontendMessage[]
}

export default ChatService
