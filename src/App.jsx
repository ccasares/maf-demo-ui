import { useState, useEffect, useRef } from 'react'
import Sidebar from './components/Sidebar'
import ConversationView from './components/ConversationView'
import Settings from './components/Settings'
import Information from './components/Information'
import ErrorModal from './components/ErrorModal'
import { getCookie, setCookie, deleteCookie } from './utils/cookies'
import { createBrokerMessage, extractBrokerResponseText, generateUUID } from './utils/helpers'
import { generateColorScheme, applyColorScheme, resetColorScheme } from './utils/colorUtils'
import './App.css'

const BROKER_URL_COOKIE_NAME = 'mulesoft_broker_url'
const BROKER_URL_HISTORY_COOKIE_NAME = 'mulesoft_broker_url_history'
const PROMPT_DECORATOR_COOKIE_NAME = 'mulesoft_prompt_decorator'
const CUSTOMIZATION_COOKIE_NAME = 'mulesoft_customization'
const WEBSOCKET_CONFIG_COOKIE_NAME = 'mulesoft_websocket_config'

function App() {
  // Generate session ID once on app initialization (persists only in memory)
  const [sessionId] = useState(() => {
    const id = generateUUID()
    console.log('🔐 Session ID generated:', id)
    return id
  })
  const [currentView, setCurrentView] = useState('conversations')
  const [messages, setMessages] = useState([])
  const [brokerConfig, setBrokerConfig] = useState({ url: '', name: '' })
  const [brokerUrlHistory, setBrokerUrlHistory] = useState([])
  const [promptDecorator, setPromptDecorator] = useState({ enabled: false, text: '' })
  const [customization, setCustomization] = useState({ logo: null, title: 'Conversation', colorScheme: null })
  const [wsConfig, setWsConfig] = useState({ 
    enabled: false, 
    uri: '', 
    connectOnStart: false, 
    enableSessionIdDecorator: false 
  })
  const [isWsConnected, setIsWsConnected] = useState(false)
  const [isWsReconnecting, setIsWsReconnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [loadingText, setLoadingText] = useState('Waiting for response...')
  const [error, setError] = useState(null)
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false)
  const [conversationContextId, setConversationContextId] = useState(null)
  const conversationViewRef = useRef(null)
  const wsRef = useRef(null)
  const wsReconnectAttempts = useRef(0)
  const wsReconnectTimer = useRef(null)
  const wsIntentionalDisconnect = useRef(false)
  const isLoadingRef = useRef(false)

  // Cargar la URL del broker desde la cookie al iniciar la aplicación
  useEffect(() => {
    const savedBroker = getCookie(BROKER_URL_COOKIE_NAME)
    if (savedBroker) {
      try {
        // Try to parse as JSON object (new format)
        const parsed = JSON.parse(savedBroker)
        if (parsed.url) {
          setBrokerConfig(parsed)
        }
      } catch (e) {
        // Fallback to old string format
        setBrokerConfig({ url: savedBroker, name: '' })
      }
    }

    // Load URL history
    const savedHistory = getCookie(BROKER_URL_HISTORY_COOKIE_NAME)
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory)
        setBrokerUrlHistory(parsed)
      } catch (e) {
        console.error('Error parsing broker URL history cookie:', e)
      }
    }
  }, [])

  // Load prompt decorator from cookie on app start
  useEffect(() => {
    const savedDecorator = getCookie(PROMPT_DECORATOR_COOKIE_NAME)
    if (savedDecorator) {
      try {
        const parsed = JSON.parse(savedDecorator)
        setPromptDecorator(parsed)
      } catch (e) {
        console.error('Error parsing prompt decorator cookie:', e)
      }
    }
  }, [])

  // Load customization from cookie on app start
  useEffect(() => {
    const savedCustomization = getCookie(CUSTOMIZATION_COOKIE_NAME)
    if (savedCustomization) {
      try {
        const parsed = JSON.parse(savedCustomization)
        setCustomization(parsed)
      } catch (e) {
        console.error('Error parsing customization cookie:', e)
        console.warn('Clearing corrupted customization cookie')
        // Clear the corrupted cookie
        deleteCookie(CUSTOMIZATION_COOKIE_NAME)
        // Reset to default customization
        setCustomization({
          logo: null,
          title: 'Conversation',
          colorScheme: null
        })
      }
    }
  }, [])

  // Load WebSocket config from cookie on app start
  useEffect(() => {
    const savedWsConfig = getCookie(WEBSOCKET_CONFIG_COOKIE_NAME)
    if (savedWsConfig) {
      try {
        const parsed = JSON.parse(savedWsConfig)
        // Ensure all properties exist with defaults
        const config = {
          enabled: parsed.enabled || false,
          uri: parsed.uri || '',
          connectOnStart: parsed.connectOnStart || false,
          enableSessionIdDecorator: parsed.enableSessionIdDecorator || false
        }
        setWsConfig(config)
        
        // Auto-connect if enabled, connectOnStart is enabled, and URI is set
        if (config.enabled && config.connectOnStart && config.uri) {
          // Delay connection to ensure everything is loaded
          setTimeout(() => {
            wsIntentionalDisconnect.current = false
            handleWsConnect(config.uri, false, config)
          }, 500)
        }
      } catch (e) {
        console.error('Error parsing WebSocket config cookie:', e)
      }
    }
  }, [])

  // Clean up WebSocket connection and reconnection timer on unmount
  useEffect(() => {
    return () => {
      // Clear reconnection timer
      if (wsReconnectTimer.current) {
        clearTimeout(wsReconnectTimer.current)
      }
      
      // Close WebSocket connection
      if (wsRef.current) {
        wsIntentionalDisconnect.current = true
        wsRef.current.close()
      }
    }
  }, [])

  // Apply color scheme when customization changes
  useEffect(() => {
    if (customization.colorScheme) {
      const scheme = generateColorScheme(customization.colorScheme)
      if (scheme) {
        applyColorScheme(scheme)
      }
    } else {
      resetColorScheme()
    }
  }, [customization.colorScheme])

  const handleSendMessage = async (text) => {
    // Check if broker URL is configured
    if (!brokerConfig.url) {
      setError({
        message: 'Broker URL not configured',
        details: 'Please configure the MuleSoft Agent Broker URL in Settings before sending messages.'
      })
      setIsErrorModalOpen(true)
      return
    }

    // Apply prompt decorator if enabled
    let messageText = text
    if (promptDecorator.enabled && promptDecorator.text.trim()) {
      messageText = `${text}. ${promptDecorator.text.trim()}`
    }

    // Apply session ID decorator if enabled
    if (wsConfig.enabled && wsConfig.enableSessionIdDecorator) {
      messageText = `${messageText}. sessionId=${sessionId}`
    }

    // Create JSON-RPC payload with decorated text, conversation context, and session ID
    const payload = createBrokerMessage(messageText, conversationContextId, sessionId)

    // Add user message to canvas (right side) - showing original text without decorator
    const userMessage = {
      id: Date.now(),
      text,
      timestamp: new Date(),
      isOwn: true,
      hasError: false,
      debugJson: {
        type: 'REQUEST',
        url: brokerConfig.url,
        payload: payload
      }
    }
    setMessages(prev => [...prev, userMessage])

    // Start loading
    setIsLoading(true)
    isLoadingRef.current = true
    setLoadingText('Waiting for response...')

    try {
      // Make POST request to broker
      const response = await fetch(brokerConfig.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      // Check if response is 200 OK
      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        throw {
          status: response.status,
          statusText: response.statusText,
          message: `Server error: ${response.status} ${response.statusText}`,
          responseData: errorData
        }
      }

      // Process response
      const responseData = await response.json()
      
      // Extract text from response
      const responseText = extractBrokerResponseText(responseData)
      
      // Check conversation state
      const conversationState = responseData?.result?.status?.state
      
      // Handle conversation context based on state
      if (conversationState === 'input-required' && responseData?.result?.contextId) {
        // Save contextId for next message
        setConversationContextId(responseData.result.contextId)
      } else if (conversationState === 'completed') {
        // Clear contextId for next message
        setConversationContextId(null)
      }
      
      // Check if response is empty
      if (responseText === '') {
        // Show generic message for empty response instead of error modal
        const emptyMessage = {
          id: Date.now() + 1,
          text: 'Empty response received. Please, try again',
          timestamp: new Date(),
          isOwn: false,
          conversationState: conversationState,
          retryMessage: text,
          debugJson: {
            type: 'RESPONSE',
            status: response.status,
            statusText: response.statusText,
            payload: responseData
          }
        }
        setMessages(prev => [...prev, emptyMessage])
      } else if (!responseText) {
        // Only throw error if responseText is null/undefined (invalid format)
        throw {
          message: 'Invalid broker response',
          details: 'The broker response does not contain the expected format.',
          responseData
        }
      } else {
        // Add bot message to canvas (left side)
        const botMessage = {
          id: Date.now() + 1,
          text: responseText,
          timestamp: new Date(),
          isOwn: false,
          conversationState: conversationState,
          retryMessage: text,
          debugJson: {
            type: 'RESPONSE',
            status: response.status,
            statusText: response.statusText,
            payload: responseData
          }
        }
        setMessages(prev => [...prev, botMessage])
      }

    } catch (err) {
      console.error('Error sending message to broker:', err)
      
      // Mark the last user message as failed (change background to red)
      setMessages(prev => {
        const lastMessage = prev[prev.length - 1]
        if (lastMessage && lastMessage.isOwn) {
          return [
            ...prev.slice(0, -1),
            { ...lastMessage, hasError: true }
          ]
        }
        return prev
      })
      
      // Check if it's a CORS error
      const isCorsError = err instanceof TypeError && 
                         (err.message.includes('Failed to fetch') || 
                          err.message.includes('NetworkError') ||
                          err.message.includes('CORS'))
      
      // Prepare error to show in modal
      const errorToShow = isCorsError ? {
        message: 'Unable to invoke the Broker URL due to a CORS error. Please fix it and try again.',
        details: 'Tip: Add the CORS APIM policy to the Broker inbound endpoint',
        isCorsError: true
      } : {
        message: err.message || 'Error communicating with broker',
        status: err.status,
        statusText: err.statusText,
        responseData: err.responseData
      }
      
      setError(errorToShow)
      setIsErrorModalOpen(true)
      
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
      
      // Focus input after receiving response (success or error)
      setTimeout(() => {
        conversationViewRef.current?.focusInput()
      }, 100)
    }
  }

  const handleSaveBrokerUrl = (config) => {
    setBrokerConfig(config)
    setCookie(BROKER_URL_COOKIE_NAME, JSON.stringify(config), 365) // Save for 1 year
    
    // Update history - add new config if not already in history (check by URL)
    const updatedHistory = [
      config, 
      ...brokerUrlHistory.filter(item => item.url !== config.url)
    ].slice(0, 10) // Keep max 10 URLs
    setBrokerUrlHistory(updatedHistory)
    setCookie(BROKER_URL_HISTORY_COOKIE_NAME, JSON.stringify(updatedHistory), 365)
  }

  const handleSavePromptDecorator = (decorator) => {
    setPromptDecorator(decorator)
    
    // If decorator is disabled and text is empty, delete the cookie
    if (!decorator.enabled && !decorator.text.trim()) {
      deleteCookie(PROMPT_DECORATOR_COOKIE_NAME)
    } else {
      setCookie(PROMPT_DECORATOR_COOKIE_NAME, JSON.stringify(decorator), 365) // Save for 1 year
    }
  }

  const handleClearBrokerUrlHistory = () => {
    setBrokerUrlHistory([])
    deleteCookie(BROKER_URL_HISTORY_COOKIE_NAME)
  }

  const handleDeleteUrlFromHistory = (urlToDelete) => {
    const updatedHistory = brokerUrlHistory.filter(item => item.url !== urlToDelete)
    setBrokerUrlHistory(updatedHistory)
    
    if (updatedHistory.length > 0) {
      setCookie(BROKER_URL_HISTORY_COOKIE_NAME, JSON.stringify(updatedHistory), 365)
    } else {
      deleteCookie(BROKER_URL_HISTORY_COOKIE_NAME)
    }
  }

  const handleSaveCustomization = (customizationData) => {
    try {
      const jsonString = JSON.stringify(customizationData)
      
      // Check cookie size (browsers typically limit cookies to 4KB)
      // Note: cookies can actually store more than 4KB in modern browsers, but let's warn if it's very large
      const sizeInKB = new Blob([jsonString]).size / 1024
      
      if (sizeInKB > 100) {
        console.warn(`Customization data is large (${sizeInKB.toFixed(2)} KB). Consider using a smaller image.`)
      }
      
      setCustomization(customizationData)
      setCookie(CUSTOMIZATION_COOKIE_NAME, jsonString, 365)
      
      console.log(`✅ Customization saved successfully (${sizeInKB.toFixed(2)} KB)`)
    } catch (e) {
      console.error('Error saving customization:', e)
      setError({
        type: 'CUSTOMIZATION_SAVE_ERROR',
        message: 'Failed to save customization settings',
        details: e.message
      })
      setIsErrorModalOpen(true)
    }
  }

  const handleSaveWsConfig = (config) => {
    setWsConfig(config)
    setCookie(WEBSOCKET_CONFIG_COOKIE_NAME, JSON.stringify(config), 365)
  }

  const handleWsConnect = (uri = wsConfig.uri, isReconnect = false, configOverride = null) => {
    if (isWsConnected && wsRef.current && !isReconnect) {
      // Already connected, do nothing
      return
    }

    // Use configOverride if provided (for auto-connect on start), otherwise use wsConfig state
    const activeConfig = configOverride || wsConfig
    
    // Only check if enabled when NOT reconnecting
    // (if we're reconnecting, it means it was enabled before)
    if (!isReconnect && !activeConfig.enabled) {
      console.warn('WebSocket is disabled in configuration')
      return
    }

    if (!uri) {
      console.error('No WebSocket URI configured')
      return
    }

    // Clear any pending reconnection timer
    if (wsReconnectTimer.current) {
      clearTimeout(wsReconnectTimer.current)
      wsReconnectTimer.current = null
    }

    // Reset intentional disconnect flag when manually connecting
    if (!isReconnect) {
      wsIntentionalDisconnect.current = false
    }

    try {
      // Add sessionId as query parameter to WebSocket URI
      const separator = uri.includes('?') ? '&' : '?'
      const wsUriWithSession = `${uri}${separator}sessionId=${sessionId}`
      
      if (isReconnect) {
        console.log(`🔄 Reconnecting to WebSocket (attempt ${wsReconnectAttempts.current + 1})...`)
        setIsWsReconnecting(true)
      } else {
        console.log('🔌 Connecting to WebSocket with sessionId:', sessionId)
        setIsWsReconnecting(false)
      }
      
      const ws = new WebSocket(wsUriWithSession)
      
      ws.onopen = () => {
        console.log('✅ WebSocket connected to:', wsUriWithSession)
        setIsWsConnected(true)
        setIsWsReconnecting(false)
        // Reset reconnection attempts on successful connection
        wsReconnectAttempts.current = 0
        wsIntentionalDisconnect.current = false
      }
      
      ws.onmessage = (event) => {
        console.log('WebSocket message received:', event.data)
        // Convert to string to ensure proper display
        const messageText = typeof event.data === 'string' 
          ? event.data 
          : JSON.stringify(event.data)
        
        // If we're waiting for a response, update the loading text with the WebSocket message
        if (isLoadingRef.current) {
          console.log('✅ Updating loading text with WebSocket message:', messageText)
          // Update the loading indicator text instead of adding a new message
          setLoadingText(messageText)
        } else {
          // If not loading, just log it (or could show a notification)
          console.log('ℹ️ WebSocket message received but not waiting for response:', messageText)
        }
      }
      
      ws.onerror = (error) => {
        console.error('❌ WebSocket error:', error)
        setIsWsConnected(false)
        // Keep reconnecting state if it's a reconnect attempt
      }
      
      ws.onclose = (event) => {
        console.log('WebSocket disconnected - Code:', event.code, 'Reason:', event.reason)
        setIsWsConnected(false)
        
        // Only attempt reconnection if:
        // 1. Disconnection was not intentional
        // 2. We have a valid URI
        // 3. Connection was previously established or this is a reconnect attempt
        if (!wsIntentionalDisconnect.current && uri) {
          wsReconnectAttempts.current++
          setIsWsReconnecting(true)
          
          // Exponential backoff: 1s, 2s, 4s, 8s, 16s, max 30s
          const delay = Math.min(1000 * Math.pow(2, wsReconnectAttempts.current - 1), 30000)
          
          console.log(`⏳ Reconnecting in ${delay / 1000}s... (attempt ${wsReconnectAttempts.current})`)
          
          wsReconnectTimer.current = setTimeout(() => {
            handleWsConnect(uri, true)
          }, delay)
        } else if (wsIntentionalDisconnect.current) {
          console.log('🛑 WebSocket closed intentionally - no reconnection')
          setIsWsReconnecting(false)
        }
      }
      
      wsRef.current = ws
    } catch (error) {
      console.error('Failed to create WebSocket connection:', error)
      setIsWsConnected(false)
      
      // Attempt reconnection on connection failure
      if (!wsIntentionalDisconnect.current && uri) {
        wsReconnectAttempts.current++
        setIsWsReconnecting(true)
        const delay = Math.min(1000 * Math.pow(2, wsReconnectAttempts.current - 1), 30000)
        
        console.log(`⏳ Retrying connection in ${delay / 1000}s... (attempt ${wsReconnectAttempts.current})`)
        
        wsReconnectTimer.current = setTimeout(() => {
          handleWsConnect(uri, true)
        }, delay)
      } else {
        setIsWsReconnecting(false)
      }
    }
  }

  const handleWsDisconnect = () => {
    // Mark as intentional disconnect to prevent auto-reconnection
    wsIntentionalDisconnect.current = true
    
    // Clear any pending reconnection timer
    if (wsReconnectTimer.current) {
      clearTimeout(wsReconnectTimer.current)
      wsReconnectTimer.current = null
    }
    
    // Reset reconnection attempts
    wsReconnectAttempts.current = 0
    
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setIsWsConnected(false)
    setIsWsReconnecting(false)
    
    console.log('🛑 WebSocket manually disconnected')
  }

  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false)
    setError(null)
  }

  const handleClearMessages = () => {
    setMessages([])
  }

  return (
    <div className="app">
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        customLogo={customization.logo}
      />
      <div className="main-content">
        {currentView === 'conversations' ? (
          <ConversationView 
            ref={conversationViewRef}
            messages={messages} 
            onSendMessage={handleSendMessage}
            onClearMessages={handleClearMessages}
            isLoading={isLoading}
            isDisabled={isLoading}
            brokerConfig={brokerConfig}
            conversationTitle={customization.title}
            loadingText={loadingText}
            isWsConnected={isWsConnected}
            isWsReconnecting={isWsReconnecting}
          />
        ) : currentView === 'information' ? (
          <Information />
        ) : (
          <Settings 
            brokerConfig={brokerConfig}
            brokerUrlHistory={brokerUrlHistory}
            onSaveBrokerUrl={handleSaveBrokerUrl}
            onClearBrokerUrlHistory={handleClearBrokerUrlHistory}
            onDeleteUrlFromHistory={handleDeleteUrlFromHistory}
            promptDecorator={promptDecorator}
            onSavePromptDecorator={handleSavePromptDecorator}
            customization={customization}
            onSaveCustomization={handleSaveCustomization}
            wsConfig={wsConfig}
            onSaveWsConfig={handleSaveWsConfig}
            isWsConnected={isWsConnected}
            isWsReconnecting={isWsReconnecting}
            onWsConnect={handleWsConnect}
            onWsDisconnect={handleWsDisconnect}
            sessionId={sessionId}
          />
        )}
      </div>
      <ErrorModal 
        isOpen={isErrorModalOpen}
        onClose={handleCloseErrorModal}
        error={error}
      />
    </div>
  )
}

export default App

