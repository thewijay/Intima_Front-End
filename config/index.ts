/**
 * Configuration file for API endpoints and environment variables
 * This centralizes all environment-based configuration
 */

// Expo exposes environment variables that start with EXPO_PUBLIC_
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || 'http://localhost:8000'

export const config = {
  // Base URL
  BASE_URL,

  // API endpoints
  API_BASE_URL: `${BASE_URL}/api`,
  AI_BASE_URL: `${BASE_URL}/ai`,

  // Derived URLs for common endpoints
  TOKEN_URL: `${BASE_URL}/api/token/`,
  REGISTER_URL: `${BASE_URL}/api/register/`,
  PROFILE_URL: `${BASE_URL}/api/profile/`,
  PROFILE_UPDATE_URL: `${BASE_URL}/api/profile/update/`,

  // AI endpoints
  CHAT_URL: `${BASE_URL}/ai/chat/`,
  HEALTH_URL: `${BASE_URL}/ai/health/`,
  CONVERSATIONS_URL: `${BASE_URL}/ai/chat/conversations/`,
  CHAT_HISTORY_URL: `${BASE_URL}/ai/chat/history/`,
  WELCOME_URL: `${BASE_URL}/ai/welcome/`,
}

// Validation function to ensure required environment variables are set
export const validateConfig = () => {
  const requiredEnvVars = ['EXPO_PUBLIC_BASE_URL']

  const missingVars = requiredEnvVars.filter((varName) => !process.env[varName])

  if (missingVars.length > 0) {
    console.warn(
      `Missing environment variables: ${missingVars.join(', ')}\n` +
        'Using default localhost URL. Update .env file for production.'
    )
  }
}

// Call validation on import
validateConfig()

export default config
