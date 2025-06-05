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
}

export default ChatService
